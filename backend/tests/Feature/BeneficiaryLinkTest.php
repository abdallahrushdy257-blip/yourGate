<?php

namespace Tests\Feature;

use App\Models\BeneficiaryFormToken;
use App\Models\HumanCase;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BeneficiaryLinkTest extends TestCase
{
    use RefreshDatabase;

    protected Store $store;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->store = Store::create([
            'name'   => 'Charity Branch',
            'slug'   => 'charity-branch',
            'status' => 'active',
        ]);

        $this->user = User::factory()->create([
            'store_id' => $this->store->id,
        ]);
    }

    public function test_authenticated_user_can_generate_registration_link(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/hcform/request', [
                'label' => 'رابط تجريبي للمستفيد',
            ]);

        $response->assertOk()
            ->assertJsonPath('status', 200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['code', 'expires_at']);

        $code = $response->json('code');
        $this->assertDatabaseHas('beneficiary_form_tokens', [
            'code'     => $code,
            'store_id' => $this->store->id,
            'is_used'  => false,
        ]);
    }

    public function test_authenticated_user_can_list_tokens(): void
    {
        BeneficiaryFormToken::create([
            'store_id'   => $this->store->id,
            'created_by' => $this->user->id,
            'code'       => 'test-code-12345',
            'expires_at' => now()->addDay(),
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/hcform/tokens');

        $response->assertOk()
            ->assertJsonPath('status', 200)
            ->assertJsonCount(1, 'data');
    }

    public function test_public_user_can_check_valid_token(): void
    {
        $token = BeneficiaryFormToken::create([
            'store_id'   => $this->store->id,
            'code'       => 'valid-token-code',
            'expires_at' => now()->addDay(),
        ]);

        $response = $this->getJson("/api/hcrequest/{$token->code}");

        $response->assertOk()
            ->assertJsonPath('valid', true)
            ->assertJsonPath('status', 200);
    }

    public function test_public_user_cannot_use_expired_token(): void
    {
        $token = BeneficiaryFormToken::create([
            'store_id'   => $this->store->id,
            'code'       => 'expired-token-code',
            'expires_at' => now()->subHour(),
        ]);

        $response = $this->getJson("/api/hcrequest/{$token->code}");

        $response->assertStatus(410)
            ->assertJsonPath('valid', false);
    }

    public function test_full_external_registration_wizard_lifecycle(): void
    {
        Storage::fake('public');

        $token = BeneficiaryFormToken::create([
            'store_id'   => $this->store->id,
            'code'       => 'multi-step-registration-token',
            'expires_at' => now()->addDay(),
        ]);

        // Step 1: Save basic info
        $step1Res = $this->postJson("/api/hcrequest/{$token->code}/case", [
            'name'          => 'أحمد محمود العبدالله',
            'gender'        => '0',
            'status'        => '2', // متزوج
            'nationality'   => 'سعودي',
            'phonenum'      => '0551234567',
            'idnumber'      => '1098765432',
            'dob'           => '1990-05-15',
            'familycount'   => 5,
        ]);

        $step1Res->assertOk()
            ->assertJsonPath('status', 200);

        $caseId = $step1Res->json('id');
        $this->assertNotNull($caseId);

        $case = HumanCase::find($caseId);
        $this->assertEquals('أحمد محمود العبدالله', $case->name);
        $this->assertEquals('معلق', $case->case_status);
        $this->assertEquals('متزوج', $case->social_status_string);

        // Step 2: Banks
        $bankFile = UploadedFile::fake()->create('bank.pdf', 100, 'application/pdf');
        $step2Res = $this->postJson("/api/hcrequest/{$token->code}/banks", [
            'name'   => 'مصرف الراجحي',
            'branch' => 'فرع الرياض الرئيسي',
            'iban'   => 'SA1234567890123456789012',
            'upload' => $bankFile,
        ]);
        $step2Res->assertOk();

        // Step 3: Qualifications
        $step3Res = $this->postJson("/api/hcrequest/{$token->code}/qualifications", [
            'level'   => 'بكالوريوس',
            'job'     => 'مهندس شبكات',
            'canwork' => '1',
            'note'    => 'خبرة 5 سنوات',
        ]);
        $step3Res->assertOk();

        // Step 4: Housing
        $housePic = UploadedFile::fake()->create('house.jpg', 100, 'image/jpeg');
        $step4Res = $this->postJson("/api/hcrequest/{$token->code}/homedetails", [
            'state'         => 'الرياض',
            'village'       => 'حي النرجس',
            'homeType'      => 'شقة',
            'homeOwnership' => 'إيجار',
            'rent'          => '2500',
            'upload1'       => $housePic,
        ]);
        $step4Res->assertOk();

        // Step 5: Health
        $step5Res = $this->postJson("/api/hcrequest/{$token->code}/healthdetails", [
            'illness' => json_encode([
                [
                    'name'   => 'ضغط الدم',
                    'type'   => 'مزمن',
                    'degree' => 'متوسطة',
                    'notes'  => 'يحتاج دواء شهري',
                ]
            ]),
        ]);
        $step5Res->assertOk();

        // Step 6: Dependants
        $step6Res = $this->postJson("/api/hcrequest/{$token->code}/dependantdetails", [
            'data' => json_encode([
                [
                    'name'        => 'سارة أحمد',
                    'relation'    => 'ابنة',
                    'gender'      => 'أنثى',
                    'dateofbirth' => '2018-03-10',
                ]
            ]),
        ]);
        $step6Res->assertOk();

        // Token must now be marked as used!
        $token->refresh();
        $this->assertTrue($token->is_used);
        $this->assertNotNull($token->used_at);

        // Verification of saved details in HumanCase
        $case->refresh();
        $this->assertNotEmpty($case->details['bankdetails']);
        $this->assertEquals('مصرف الراجحي', $case->details['bankdetails']['name']);
        $this->assertEquals('بكالوريوس', $case->details['qualifications']['level']);
        $this->assertEquals('حي النرجس', $case->details['home']['village']);
        $this->assertCount(1, $case->details['health']);
        $this->assertEquals('ضغط الدم', $case->details['health'][0]['disease_name']);
        $this->assertCount(1, $case->details['dependants']);
        $this->assertEquals('سارة أحمد', $case->details['dependants'][0]['name']);

        // Check cannot be re-used
        $recheck = $this->getJson("/api/hcrequest/{$token->code}");
        $recheck->assertStatus(410)
            ->assertJsonPath('valid', false);
    }
}
