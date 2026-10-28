<?php

namespace Tests\Feature;

use App\Models\Donor;
use App\Models\Project;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Store $store;

    protected function setUp(): void
    {
        parent::setUp();

        $this->store = Store::create([
            'name'   => 'جمعية البر للمشاريع',
            'slug'   => 'projects-charity',
            'status' => 'active',
        ]);

        $this->user = User::factory()->create([
            'store_id' => $this->store->id,
            'email'    => 'admin@projects-charity.com',
        ]);

        Sanctum::actingAs($this->user);
    }

    public function test_user_can_list_projects_filtered_by_store(): void
    {
        Project::create([
            'store_id'        => $this->store->id,
            'name'            => 'مشروع حفر الآبار',
            'total'           => 50000,
            'amount'          => 15000,
            'marketingmethod' => 1,
            'status'          => 1,
        ]);

        $otherStore = Store::create([
            'name'   => 'جمعية أخرى',
            'slug'   => 'other-store',
            'status' => 'active',
        ]);

        Project::create([
            'store_id'        => $otherStore->id,
            'name'            => 'مشروع بناء مسجد لجمعية أخرى',
            'total'           => 100000,
            'amount'          => 0,
            'marketingmethod' => 2,
            'status'          => 1,
        ]);

        $response = $this->getJson('/api/projects');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data')
                 ->assertJsonPath('data.0.name', 'مشروع حفر الآبار')
                 ->assertJsonPath('data.0.budget', 50000);
    }

    public function test_user_can_create_project_successfully(): void
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->create('contract.pdf', 300, 'application/pdf');

        $payload = [
            'name'            => 'مشروع السلة الغذائية',
            'description'     => 'توزيع سلال غذائية للأسر المتعففة',
            'total'           => 25000,
            'dateoflaunch'    => '2026-11-01',
            'deadline'        => '2026-12-31',
            'marketingmethod' => 2,
            'accounttree'     => 'acc-12345',
            'attachment'      => $file,
        ];

        $response = $this->postJson('/api/projects/store', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'مشروع السلة الغذائية')
                 ->assertJsonPath('data.budget', 25000)
                 ->assertJsonPath('data.marketingmethodstring', 'المنصات الحكومية')
                 ->assertJsonPath('data.statusstring', 'قيد التنفيذ');

        $this->assertDatabaseHas('projects', [
            'store_id' => $this->store->id,
            'name'     => 'مشروع السلة الغذائية',
            'total'    => 25000,
        ]);
    }

    public function test_create_project_validation_fails_without_required_fields(): void
    {
        $response = $this->postJson('/api/projects/store', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'total']);
    }

    public function test_user_can_show_project(): void
    {
        $project = Project::create([
            'store_id'        => $this->store->id,
            'name'            => 'مشروع إفطار صائم',
            'total'           => 40000,
            'amount'          => 10000,
            'marketingmethod' => 3,
            'status'          => 1,
        ]);

        $response = $this->getJson("/api/projects/{$project->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $project->id)
                 ->assertJsonPath('data.name', 'مشروع إفطار صائم')
                 ->assertJsonPath('data.marketingmethodstring', 'متاجر الجمعيات');
    }

    public function test_user_can_update_project(): void
    {
        $project = Project::create([
            'store_id'        => $this->store->id,
            'name'            => 'مشروع قديم',
            'total'           => 10000,
            'status'          => 1,
        ]);

        $response = $this->postJson('/api/projects/update', [
            'id'    => $project->id,
            'name'  => 'مشروع محدث',
            'total' => 15000,
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.name', 'مشروع محدث')
                 ->assertJsonPath('data.budget', 15000);

        $this->assertDatabaseHas('projects', [
            'id'    => $project->id,
            'name'  => 'مشروع محدث',
            'total' => 15000,
        ]);
    }

    public function test_user_can_cancel_activate_and_close_project(): void
    {
        $project = Project::create([
            'store_id' => $this->store->id,
            'name'     => 'مشروع للتحكم بحالته',
            'total'    => 10000,
            'status'   => 1,
        ]);

        // Cancel
        $cancelRes = $this->getJson("/api/projects/{$project->id}/cancel");
        $cancelRes->assertStatus(200)
                  ->assertJsonPath('data.status', 3)
                  ->assertJsonPath('data.statusstring', 'ملغي');

        // Activate
        $actRes = $this->getJson("/api/projects/{$project->id}/activate");
        $actRes->assertStatus(200)
               ->assertJsonPath('data.status', 1)
               ->assertJsonPath('data.statusstring', 'قيد التنفيذ');

        // Close
        $closeRes = $this->getJson("/api/projects/{$project->id}/close");
        $closeRes->assertStatus(200)
                 ->assertJsonPath('data.status', 2)
                 ->assertJsonPath('data.statusstring', 'مكتمل');
    }

    public function test_user_can_delete_project(): void
    {
        $project = Project::create([
            'store_id' => $this->store->id,
            'name'     => 'مشروع للحذف',
            'total'    => 5000,
            'status'   => 1,
        ]);

        $response = $this->deleteJson("/api/projects/{$project->id}");
        $response->assertStatus(200);

        $this->assertSoftDeleted('projects', ['id' => $project->id]);
    }

    public function test_user_can_get_progress_percentage(): void
    {
        $project = Project::create([
            'store_id' => $this->store->id,
            'name'     => 'مشروع قيد الإنجاز',
            'total'    => 20000,
            'amount'   => 5000,
            'status'   => 1,
        ]);

        $response = $this->getJson("/api/projectprogress/{$project->id}/percentage");

        $response->assertStatus(200)
                 ->assertJsonPath('percentage', 25);
    }

    public function test_user_can_store_details_and_transactions(): void
    {
        Storage::fake('public');

        $project = Project::create([
            'store_id' => $this->store->id,
            'name'     => 'مشروع كفالة طالب علم',
            'total'    => 30000,
            'amount'   => 0,
            'status'   => 1,
        ]);

        $donor = Donor::create([
            'store_id' => $this->store->id,
            'name'     => 'المحسن فهد',
            'phone'    => '0501234567',
        ]);

        // 1. Receipt voucher
        $recRes = $this->postJson('/api/shoptransaction/storerecprojects', [
            'project_id' => $project->id,
            'amount'     => 10000,
            'seldonor'   => $donor->id,
            'date'       => '2026-10-27',
            'account'    => 'البنك الأهلي',
        ]);

        $recRes->assertStatus(201)
               ->assertJsonPath('data.amount', 10000)
               ->assertJsonPath('data.transaction_type', 1);

        $project->refresh();
        $this->assertEquals(10000, $project->amount);

        // 2. Payment voucher
        $payRes = $this->postJson('/api/shoptransaction/storepayprojects', [
            'project_id' => $project->id,
            'amount'     => 4000,
            'date'       => '2026-10-27',
            'account'    => 'البنك الأهلي',
            'notes'      => 'سداد رسوم جامعية',
        ]);

        $payRes->assertStatus(201)
               ->assertJsonPath('data.amount', 4000)
               ->assertJsonPath('data.transaction_type', 2);

        // 3. List transactions
        $transRes = $this->getJson("/api/shoptransaction/{$project->id}/projects");
        $transRes->assertStatus(200)
                 ->assertJsonCount(2, 'data');

        // 4. Store design detail request
        $file = UploadedFile::fake()->create('design.png', 500, 'image/png');
        $detailRes = $this->postJson('/api/projectsdetails/store', [
            'id'          => $project->id,
            'type'        => 1,
            'description' => 'تصميم بنر للمشروع',
            'upload'      => $file,
        ]);

        $detailRes->assertStatus(201)
                  ->assertJsonPath('data.type', 1)
                  ->assertJsonPath('data.description', 'تصميم بنر للمشروع');
    }

    public function test_user_can_manage_project_phases(): void
    {
        $project = Project::create([
            'store_id' => $this->store->id,
            'name'     => 'مشروع المرحلة التجريبي',
            'total'    => 50000,
        ]);

        // 1. Create phase
        $storeRes = $this->postJson('/api/projectphase/store', [
            'project_id'  => $project->id,
            'name'        => 'المرحلة التأسيسية',
            'startdate'   => '2026-10-27',
            'enddate'     => '2026-11-27',
            'priority'    => '2',
            'budget'      => 15000,
            'status'      => 1,
            'description' => 'وصف المرحلة الأولى',
        ]);

        $storeRes->assertStatus(200)
                 ->assertJsonPath('data.name', 'المرحلة التأسيسية')
                 ->assertJsonPath('data.priority_string', 'متوسط');

        $phaseId = $storeRes->json('data.id');

        // 2. List phases
        $listRes = $this->getJson("/api/projectphase/{$project->id}");
        $listRes->assertStatus(200)
                ->assertJsonCount(1, 'data');

        // 3. Complete phase
        $completeRes = $this->postJson('/api/projectprogress/phase/complete', [
            'phase_id'            => $phaseId,
            'project_id'          => $project->id,
            'performance_summary' => 'تم الإنجاز بنجاح',
            'remaining_work'      => 'لا يوجد',
            'notes'               => 'ملاحظات تسليم المرحلة',
        ]);
        $completeRes->assertStatus(200)
                    ->assertJsonPath('data.status', 2)
                    ->assertJsonPath('data.status_string', 'مكتمل')
                    ->assertJsonPath('data.performance_summary', 'تم الإنجاز بنجاح')
                    ->assertJsonPath('data.remaining_work', 'لا يوجد')
                    ->assertJsonPath('data.notes', 'ملاحظات تسليم المرحلة');

        // 4. Cancel & Activate
        $cancelRes = $this->getJson("/api/projectphase/{$phaseId}/status/cancel");
        $cancelRes->assertStatus(200)
                  ->assertJsonPath('data.status', 3)
                  ->assertJsonPath('data.status_string', 'ملغي');

        $actRes = $this->getJson("/api/projectphase/{$phaseId}/status/activate");
        $actRes->assertStatus(200)
               ->assertJsonPath('data.status', 1);
    }

    public function test_user_can_manage_project_assignments_and_helpers(): void
    {
        $project = Project::create([
            'store_id' => $this->store->id,
            'name'     => 'مشروع الأعضاء',
            'total'    => 20000,
        ]);

        // 1. Employees & Volunteers lists
        $empRes = $this->getJson('/api/employees/all');
        $empRes->assertStatus(200);

        $volRes = $this->getJson('/api/volunteers/all');
        $volRes->assertStatus(200);

        // 2. Store assignment
        $assignRes = $this->postJson('/api/projectassignment/store', [
            'project_id'       => $project->id,
            'responsible_type' => 1,
            'responsible_id'   => $this->user->id,
            'responsible_name' => 'أحمد المهندس',
            'role'             => 'مدير تنفيذي',
            'responsibility'   => 'الإشراف على المشروع',
        ]);

        $assignRes->assertStatus(200)
                  ->assertJsonPath('data.responsible_name', 'أحمد المهندس')
                  ->assertJsonPath('data.role', 'مدير تنفيذي');

        $assignId = $assignRes->json('data.id');

        // 3. List assignments
        $listRes = $this->getJson("/api/projectassignment/{$project->id}");
        $listRes->assertStatus(200)
                ->assertJsonCount(1, 'data');

        // 4. Delete assignment
        $delRes = $this->getJson("/api/projectassignment/{$assignId}/delete");
        $delRes->assertStatus(200);
    }

    public function test_user_can_manage_project_kpis_uploads_and_risks(): void
    {
        Storage::fake('public');

        $project = Project::create([
            'store_id' => $this->store->id,
            'name'     => 'مشروع المؤشرات والمخاطر',
            'total'    => 75000,
        ]);

        // 1. KPIs
        $quizRes = $this->getJson('/api/kpi/quizs');
        $quizRes->assertStatus(200);

        $storeKpiRes = $this->postJson('/api/projectkpi/store', [
            'project_id' => $project->id,
            'kpis'       => [
                ['kpi_id' => 1, 'actual' => 95, 'target' => 100],
            ],
        ]);
        $storeKpiRes->assertStatus(200)
                    ->assertJsonCount(1, 'data');

        $kpisList = $this->getJson("/api/projectkpi/{$project->id}");
        $kpisList->assertStatus(200);

        // 2. Uploads
        $file = UploadedFile::fake()->create('contract.pdf', 300, 'application/pdf');
        $uploadRes = $this->postJson('/api/projectuploads/store', [
            'project_id'  => $project->id,
            'description' => 'عقد تنفيذ المشروع',
            'upload'      => $file,
        ]);
        $uploadRes->assertStatus(200)
                  ->assertJsonPath('data.description', 'عقد تنفيذ المشروع');

        $uploadId = $uploadRes->json('data.id');
        $this->getJson("/api/projectuploads/{$project->id}")->assertStatus(200);
        $this->getJson("/api/projectuploads/{$uploadId}/delete")->assertStatus(200);

        // Upload array of files via singular route
        $file1 = UploadedFile::fake()->create('spec1.pdf', 200, 'application/pdf');
        $file2 = UploadedFile::fake()->create('spec2.pdf', 200, 'application/pdf');
        $multiUploadRes = $this->postJson('/api/projectupload/store', [
            'project_id'  => $project->id,
            'description' => 'مواصفات إضافية',
            'upload'      => [$file1, $file2],
        ]);
        $multiUploadRes->assertStatus(200)
                       ->assertJsonCount(2, 'data');

        // 3. Risks & Risk report
        $riskRes = $this->postJson('/api/projectrisk/risk/store', [
            'project_id'  => $project->id,
            'description' => 'احتمالية تأخر توريد المواد',
            'impactlevel' => 3,
            'probability' => 2,
        ]);
        $riskRes->assertStatus(200)
                ->assertJsonPath('data.impact_level_string', 'مرتفع');

        $reportRes = $this->getJson("/api/projectrisk/{$project->id}/report");
        $reportRes->assertStatus(200)
                  ->assertJsonCount(1, 'data')
                  ->assertJsonPath('data.0.risk_impact_level', 3);

        $riskId = $riskRes->json('data.id');
        $riskShowRes = $this->getJson("/api/projectrisk/mitigation/{$riskId}");
        $riskShowRes->assertStatus(200)
                    ->assertJsonPath('data.description', 'احتمالية تأخر توريد المواد');

        $mitigationStoreRes = $this->postJson('/api/projectrisk/mitigation/store', [
            'risk_id'     => $riskId,
            'description' => 'خطة التعاقد مع موردين بدائل',
            'impactlevel' => 1,
            'probability' => 1,
        ]);
        $mitigationStoreRes->assertStatus(200)
                           ->assertJsonPath('data.mitigation_description', 'خطة التعاقد مع موردين بدائل')
                           ->assertJsonPath('data.status', 'قيد المعالجة');

        // 4. Payments route
        $payListRes = $this->getJson("/api/shoptransaction/{$project->id}/payments");
        $payListRes->assertStatus(200);
    }
}
