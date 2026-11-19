<?php

namespace Tests\Feature;

use App\Models\AssemblyMember;
use App\Models\Donor;
use App\Models\Employee;
use App\Models\HumanCase;
use App\Models\JournalEntry;
use App\Models\Project;
use App\Models\Shop;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FullSystemIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected Store $store;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->store = Store::create([
            'name'   => 'جمعية التكامل الخيرية',
            'slug'   => 'integration-store',
            'status' => 'active',
        ]);

        $this->user = User::factory()->create([
            'store_id' => $this->store->id,
        ]);

        Sanctum::actingAs($this->user);
    }

    public function test_cross_module_financial_sync_updates_chart_of_accounts_and_statements(): void
    {
        $donor = Donor::create([
            'store_id' => $this->store->id,
            'name'     => 'متبرع الخير',
            'phone'    => '0501112222',
        ]);

        $beneficiary = HumanCase::create([
            'store_id' => $this->store->id,
            'name'     => 'مستفيد الحالة',
            'status'   => '1',
        ]);

        $shop = Shop::create([
            'store_id'       => $this->store->id,
            'human_cases_id' => $beneficiary->id,
            'title'          => 'حالة علاجية طارئة',
            'total'          => 20000,
            'amount'         => 0,
            'status'         => 0,
        ]);

        $project = Project::create([
            'store_id'         => $this->store->id,
            'name'             => 'مشروع سقيا الماء',
            'total_budget'     => 50000,
            'collected_amount' => 0,
            'status'           => 1,
        ]);

        // 1. Shop Case Donation Receipt (5,000 SAR)
        $this->postJson('/api/shoptransaction/storerec', [
            'shop_id'  => $shop->id,
            'donor_id' => $donor->id,
            'amount'   => 5000,
            'type'     => '1',
            'date'     => now()->toDateString(),
            'account'  => '1',
        ])->assertCreated();

        // 2. Shop Case Payment (1,500 SAR)
        $this->postJson('/api/shoptransaction/storepay', [
            'shop_id' => $shop->id,
            'amount'  => 1500,
            'type'    => '1',
            'date'    => now()->toDateString(),
            'account' => '1',
        ])->assertCreated();

        // 3. Project Donation Receipt (8,000 SAR)
        $this->postJson('/api/shoptransaction/storerecprojects', [
            'project_id' => $project->id,
            'donor_id'   => $donor->id,
            'amount'     => 8000,
            'type'       => '2',
            'date'       => now()->toDateString(),
            'account'    => '1',
        ])->assertCreated();

        // 4. Direct Donor Receipt (2,000 SAR)
        $this->postJson('/api/donor/receipt', [
            'id'          => $donor->id,
            'amount'      => 2000,
            'date'        => now()->toDateString(),
            'account'     => '1',
            'code'        => '31101',
            'description' => 'تبرع زكاة مال',
        ])->assertOk();

        // Verify balanced Journal Entries were created automatically
        $entries = JournalEntry::where('store_id', $this->store->id)->get();
        $this->assertGreaterThanOrEqual(4, $entries->count());
        foreach ($entries as $entry) {
            $this->assertEquals((float) $entry->total_debit, (float) $entry->total_credit);
        }

        // Verify Income Statement reflects revenues (5000 + 8000 + 2000 = 15000) and expenses (1500)
        $incomeRes = $this->getJson('/api/reports/incomestatement');
        $incomeRes->assertOk()
            ->assertJsonPath('summary.total_revenues', 15000)
            ->assertJsonPath('summary.total_expenses', 1500)
            ->assertJsonPath('summary.net_income', 13500);

        // Verify Donor Account Statement includes the donations
        $donorStatement = $this->postJson('/api/accountstatement/donor', ['id' => $donor->id]);
        $donorStatement->assertOk();
        $this->assertNotEmpty($donorStatement->json());
    }

    public function test_beneficiary_dependents_and_health_and_voucher_endpoints(): void
    {
        $case = HumanCase::create([
            'store_id' => $this->store->id,
            'name'     => 'أسرة مستفيدة',
            'status'   => '1',
        ]);

        // Store multiple dependents via JSON array format (used by ShowDependData modal)
        $this->postJson('/api/humancasedetails/dependants/store', [
            'id'   => $case->id,
            'data' => json_encode([
                ['name' => 'الابن الأول', 'gender' => '0', 'relation' => 'ابن', 'dob' => '2015-05-01'],
            ]),
        ])->assertOk();

        $depRes = $this->getJson("/api/humancasedetails/show/1/dependants");
        $depRes->assertOk()->assertJsonPath('name', 'الابن الأول');

        $this->postJson("/api/humancasedetails/update/dependsdata/1", [
            'name'     => 'الابن الأول المعدل',
            'relation' => 'ابن أكبر',
        ])->assertOk();

        // Store health record via JSON array format (used by ShowhelthData modal)
        $this->postJson('/api/humancasedetails/health/store', [
            'id'      => $case->id,
            'illness' => json_encode([
                ['name' => 'سكري', 'type' => 'مزمن', 'degree' => 'متوسط', 'trtype' => 'أدوية', 'trcost' => '500'],
            ]),
        ])->assertOk();

        $healthRes = $this->getJson("/api/humancasedetails/show/1/health");
        $healthRes->assertOk()->assertJsonPath('disease_name', 'سكري');

        $this->postJson("/api/humancasedetails/update/healthdata/1", [
            'name'   => 'ضغط وسكري',
            'trcost' => '750',
        ])->assertOk();

        // Beneficiary payment voucher
        $this->postJson("/api/humancases/{$case->id}/voucher", [
            'amount'      => 1000,
            'date'        => now()->toDateString(),
            'description' => 'مساعدة نقدية عاجلة',
        ])->assertOk();
    }

    public function test_hr_extended_endpoints_work_end_to_end(): void
    {
        Employee::create([
            'store_id'     => $this->store->id,
            'name'         => 'موظف تجريبي',
            'basic_salary' => 6000,
        ]);

        // Volunteers
        $this->getJson('/api/volunteers')->assertOk();
        $this->postJson('/api/volunteers/store', [
            'name'           => 'متطوع جديد',
            'phone'          => '0551234567',
            'idnumber'       => '1098765432',
            'totalworkhours' => 60,
        ])->assertOk();
        $this->postJson('/api/volunteers/voucher/payment', [
            'volunteer_id' => 1,
            'amount'       => 500,
            'date'         => now()->toDateString(),
        ])->assertOk();

        // Evaluations & Quizs
        $this->getJson('/api/evaluation/kpireport')->assertOk();
        $evRes = $this->postJson('/api/evaluation/store', [
            'date'   => now()->toDateString(),
            'period' => '2026-Q1',
            'reason' => '1',
        ]);
        $evRes->assertOk();
        $this->getJson('/api/quizs/all')->assertOk();
        $this->postJson('/api/evaluation/storequizs', [
            'id'   => $evRes->json('id'),
            'quiz' => json_encode([['question_id' => 1, 'grade' => 95, 'note' => 'ممتاز']]),
        ])->assertOk();

        // Training & KSA
        $this->getJson('/api/training-records')->assertOk()->assertJsonStructure(['data', 'stats']);
        $this->postJson('/api/training-records', [
            'title'         => 'دورة قيادة',
            'hours'         => 15,
            'training_date' => now()->toDateString(),
        ])->assertCreated();

        $this->getJson('/api/ksa-assessments')->assertOk()->assertJsonStructure(['data', 'stats']);
        $this->postJson('/api/ksa-assessments', [
            'knowledge_score' => 90,
            'skills_score'    => 85,
            'attitude_score'  => 95,
        ])->assertCreated();

        // Employee Papers & Reports
        $this->getJson('/api/employeepapers')->assertOk();
        $this->getJson('/api/salary')->assertOk();
        $this->getJson('/api/vacationrequests/approved')->assertOk();
    }

    public function test_loans_warrantors_feasibility_endowments_archives_and_dashboard_work(): void
    {
        // Warrantors & Loans
        $this->getJson('/api/warrantor')->assertOk();
        $this->postJson('/api/warrantor/store', ['name' => 'كفيل تجريبي', 'phone' => '0500001111'])->assertOk();
        $this->getJson('/api/loans')->assertOk();
        $loanRes = $this->postJson('/api/loans/store', [
            'requesttype' => 'قرض مشروع',
            'amount'      => 10000,
            'loancount'   => 10,
        ]);
        $loanRes->assertOk();
        $loanId = $loanRes->json('id');
        $this->getJson("/api/loans/{$loanId}")->assertOk();
        $this->postJson('/api/loans/payment/voucher', ['id' => $loanId, 'amount' => 10000])->assertOk();
        $this->postJson('/api/loans/receipt/voucher', ['id' => $loanId, 'amount' => 1000])->assertOk();
        $this->getJson('/api/feasibilitystudies')->assertOk();

        // Endowments & Archives
        $this->getJson('/api/endowments')->assertOk();
        $this->postJson('/api/endowments/store', [
            'name'       => 'وقف النور',
            'type'       => 'عقار',
            'annualfees' => 12000,
            'netprofit'  => 90000,
        ])->assertOk();
        $this->postJson('/api/endowments/recieptvoucher', ['id' => 1, 'amount' => 15000])->assertOk();
        $this->postJson('/api/endowments/paymentvoucher', ['id' => 1, 'amount' => 2000])->assertOk();
        $this->getJson('/api/archives')->assertOk();

        // Roles, Users, Print Settings, Dashboard (/home) & BSC
        $this->getJson('/api/permissions')->assertOk();
        $this->getJson('/api/orgusers')->assertOk();
        $this->getJson('/api/orgusers/representative')->assertOk();
        $this->getJson('/api/print')->assertOk()->assertJsonStructure(['settings']);
        $this->getJson('/api/home')->assertOk()->assertJsonStructure([
            'total_humancases',
            'total_projects',
            'totalstorecash',
            'donationchart',
            'cash_accounts',
        ]);
        $this->getJson("/api/bsc/{$this->store->id}")->assertOk()->assertJsonPath('success', true);
    }
}
