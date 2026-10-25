<?php

namespace Tests\Feature;

use App\Models\HumanCase;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HumanCaseTest extends TestCase
{
    use RefreshDatabase;

    protected Store $store;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->store = Store::create([
            'name'   => 'متجر المستفيدين',
            'slug'   => 'beneficiaries-store',
            'status' => 'active',
        ]);

        $this->user = User::factory()->create([
            'store_id' => $this->store->id,
            'status'   => 'active',
        ]);
    }

    public function test_user_can_list_beneficiaries_filtered_by_store(): void
    {
        HumanCase::create([
            'store_id' => $this->store->id,
            'name'     => 'أحمد سعيد الغامدي',
            'phonenum' => '0501110000',
            'gender'   => '0',
            'status'   => '1',
            'dob'      => '1990-05-15',
        ]);

        $otherStore = Store::create([
            'name'   => 'متجر آخر',
            'slug'   => 'other-store',
            'status' => 'active',
        ]);

        HumanCase::withoutGlobalScopes()->create([
            'store_id' => $otherStore->id,
            'name'     => 'مستفيد خارجي',
            'phonenum' => '0599990000',
            'gender'   => '1',
            'status'   => '1',
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/humancases', []);

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'أحمد سعيد الغامدي'])
            ->assertJsonMissing(['name' => 'مستفيد خارجي']);
    }

    public function test_user_can_create_beneficiary_successfully(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/humancases/store', [
                'name'          => 'سارة علي القرني',
                'gender'        => '1',
                'status'        => '1',
                'nationality'   => 'سعودية',
                'familycount'   => 4,
                'phonenum'      => '0551234567',
                'email'         => 'sara@example.com',
                'accnumber'     => 'SA1234567890123456789012',
                'idnumber'      => '1098765432',
                'idsource'      => 'الرياض',
                'iddate'        => '2028-10-10',
                'humancasetype' => '2',
                'dob'           => '1995-03-20',
                'note'          => 'حالة مستحقة',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'سارة علي القرني')
            ->assertJsonPath('data.gender_string', 'أنثى')
            ->assertJsonPath('data.status_string', 'موافقة');

        $this->assertDatabaseHas('human_cases', [
            'store_id' => $this->store->id,
            'name'     => 'سارة علي القرني',
            'idnumber' => '1098765432',
        ]);
    }

    public function test_create_beneficiary_validation_fails_without_name(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/humancases/store', [
                'name' => '',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure(['errors' => ['name']]);
    }

    public function test_user_can_show_beneficiary(): void
    {
        $case = HumanCase::create([
            'store_id' => $this->store->id,
            'name'     => 'خالد الحربي',
            'gender'   => '0',
            'status'   => '1',
            'dob'      => '1985-01-01',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/humancases/{$case->id}");

        $response->assertStatus(200)
            ->assertJsonPath('id', $case->id)
            ->assertJsonPath('name', 'خالد الحربي')
            ->assertJsonPath('gender_string', 'ذكر');
    }

    public function test_user_can_update_beneficiary(): void
    {
        $case = HumanCase::create([
            'store_id' => $this->store->id,
            'name'     => 'الاسم السابق',
            'status'   => '2',
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/humancases/update', [
                'id'     => $case->id,
                'name'   => 'الاسم المعتمد',
                'status' => '1',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'الاسم المعتمد')
            ->assertJsonPath('data.status_string', 'موافقة');

        $this->assertDatabaseHas('human_cases', [
            'id'     => $case->id,
            'name'   => 'الاسم المعتمد',
            'status' => '1',
        ]);
    }

    public function test_user_can_delete_beneficiary(): void
    {
        $case = HumanCase::create([
            'store_id' => $this->store->id,
            'name'     => 'مستفيد للحذف',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/humancases/{$case->id}/delete");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertSoftDeleted('human_cases', [
            'id' => $case->id,
        ]);
    }

    public function test_user_can_get_and_update_beneficiary_details(): void
    {
        $case = HumanCase::create([
            'store_id'  => $this->store->id,
            'name'      => 'مستفيد التفاصيل',
            'accnumber' => 'SA000011112222',
        ]);

        // 1. Get Details
        $getRes = $this->actingAs($this->user)
            ->getJson("/api/humancasedetails/get/{$case->id}");
        $getRes->assertStatus(200)
            ->assertJsonPath('status', 200)
            ->assertJsonPath('id', $case->id);

        // 2. Update Banks
        $bankRes = $this->actingAs($this->user)
            ->postJson('/api/humancasedetails/update/banks', [
                'id'     => $case->id,
                'name'   => 'مصرف الراجحي',
                'branch' => 'فرع العليا',
                'iban'   => 'SA998877665544',
            ]);
        $bankRes->assertStatus(200)
            ->assertJsonPath('status', 200);

        // 3. Store Health
        $healthRes = $this->actingAs($this->user)
            ->postJson('/api/humancasedetails/health/store', [
                'id'           => $case->id,
                'disease_name' => 'ضغط الدم',
            ]);
        $healthRes->assertStatus(200)
            ->assertJsonPath('status', 200);

        // 4. Update Status Decision
        $statusRes = $this->actingAs($this->user)
            ->postJson('/api/humancasedetails/update/status', [
                'id'     => $case->id,
                'status' => '1',
                'note'   => 'موافقة نهائية',
            ]);
        $statusRes->assertStatus(200)
            ->assertJsonPath('status', 200);
    }
}
