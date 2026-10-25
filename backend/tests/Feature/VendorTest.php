<?php

namespace Tests\Feature;

use App\Models\Store;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VendorTest extends TestCase
{
    use RefreshDatabase;

    protected Store $store;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->store = Store::create([
            'name'   => 'متجر الموردين',
            'slug'   => 'vendors-store',
            'status' => 'active',
        ]);

        $this->user = User::factory()->create([
            'store_id' => $this->store->id,
            'status'   => 'active',
        ]);
    }

    public function test_user_can_list_vendors_filtered_by_store(): void
    {
        Vendor::create([
            'store_id' => $this->store->id,
            'name'     => 'مؤسسة التوريدات السريعة',
            'phone'    => '0501112233',
            'type'     => '1',
        ]);

        $otherStore = Store::create([
            'name'   => 'متجر آخر',
            'slug'   => 'other-store',
            'status' => 'active',
        ]);

        Vendor::withoutGlobalScopes()->create([
            'store_id' => $otherStore->id,
            'name'     => 'مورد خارجي',
            'phone'    => '0599999999',
            'type'     => '2',
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/humancasevendor', []);

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'مؤسسة التوريدات السريعة'])
            ->assertJsonMissing(['name' => 'مورد خارجي']);
    }

    public function test_user_can_create_vendor_successfully(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/humancasevendor/store', [
                'name'                       => 'شركة الأجهزة الطبية',
                'phone'                      => '0555555555',
                'email'                      => 'medical@example.com',
                'address'                    => 'الرياض - الملز',
                'region'                     => 'الرياض',
                'description'                => 'توريد مستلزمات',
                'type'                       => '1',
                'identification_number'      => '1010101010',
                'identification_description' => 'سجل تجاري',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'شركة الأجهزة الطبية')
            ->assertJsonPath('data.type_string', 'داخلي');

        $this->assertDatabaseHas('vendors', [
            'store_id' => $this->store->id,
            'name'     => 'شركة الأجهزة الطبية',
            'phone'    => '0555555555',
        ]);
    }

    public function test_create_vendor_validation_fails_without_required_fields(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/humancasevendor/store', [
                'name'  => '',
                'phone' => '',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure(['errors' => ['name', 'phone']]);
    }

    public function test_user_can_show_vendor(): void
    {
        $vendor = Vendor::create([
            'store_id' => $this->store->id,
            'name'     => 'مورد المعاينات',
            'phone'    => '0544444444',
            'type'     => '2',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/humancasevendor/{$vendor->id}");

        $response->assertStatus(200)
            ->assertJsonPath('id', $vendor->id)
            ->assertJsonPath('name', 'مورد المعاينات')
            ->assertJsonPath('type_string', 'خارجي');
    }

    public function test_user_can_update_vendor(): void
    {
        $vendor = Vendor::create([
            'store_id' => $this->store->id,
            'name'     => 'الاسم القديم للمورد',
            'phone'    => '0511111111',
            'type'     => '1',
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/humancasevendor/update', [
                'id'    => $vendor->id,
                'name'  => 'الاسم الجديد للمورد',
                'phone' => '0522222222',
                'type'  => '2',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'الاسم الجديد للمورد')
            ->assertJsonPath('data.type_string', 'خارجي');

        $this->assertDatabaseHas('vendors', [
            'id'    => $vendor->id,
            'name'  => 'الاسم الجديد للمورد',
            'phone' => '0522222222',
        ]);
    }

    public function test_user_can_delete_vendor(): void
    {
        $vendor = Vendor::create([
            'store_id' => $this->store->id,
            'name'     => 'مورد للحذف',
            'phone'    => '0500000000',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/humancasevendor/{$vendor->id}/delete");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertSoftDeleted('vendors', [
            'id' => $vendor->id,
        ]);
    }

    public function test_user_can_get_component_dropdown_vendors(): void
    {
        Vendor::create([
            'store_id' => $this->store->id,
            'name'     => 'مورد دروب داون',
            'phone'    => '0533333333',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/humancasevendor/component');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'مورد دروب داون']);
    }
}
