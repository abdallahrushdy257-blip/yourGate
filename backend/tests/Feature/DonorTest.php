<?php

namespace Tests\Feature;

use App\Models\Donor;
use App\Models\Interest;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DonorTest extends TestCase
{
    use RefreshDatabase;

    protected Store $store;
    protected User $user;
    protected Interest $interest;

    protected function setUp(): void
    {
        parent::setUp();

        $this->store = Store::create([
            'name'   => 'متجر المانحين',
            'slug'   => 'donors-store',
            'status' => 'active',
        ]);

        $this->user = User::factory()->create([
            'store_id' => $this->store->id,
            'status'   => 'active',
        ]);

        $this->interest = Interest::create([
            'store_id' => $this->store->id,
            'name'     => 'الرعاية الصحية',
        ]);
    }

    public function test_user_can_list_donors_filtered_by_store(): void
    {
        Donor::create([
            'store_id'    => $this->store->id,
            'interest_id' => $this->interest->id,
            'name'        => 'عبدالله محمد',
            'phone'       => '0501234567',
            'type'        => '1',
        ]);

        $otherStore = Store::create([
            'name'   => 'متجر آخر',
            'slug'   => 'other-store',
            'status' => 'active',
        ]);

        Donor::withoutGlobalScopes()->create([
            'store_id' => $otherStore->id,
            'name'     => 'مانح خارجي',
            'phone'    => '0599999999',
            'type'     => '1',
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/donor', []);

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'عبدالله محمد'])
            ->assertJsonMissing(['name' => 'مانح خارجي']);
    }

    public function test_user_can_create_donor_successfully(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/donor/store', [
                'name'                       => 'سعد الخالدي',
                'phone'                      => '0555555555',
                'email'                      => 'saad@example.com',
                'address'                    => 'الرياض',
                'type'                       => '1',
                'donorInterests'             => $this->interest->id,
                'identification_number'      => '1020304050',
                'identification_description' => 'هوية وطنية',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'سعد الخالدي')
            ->assertJsonPath('data.interest', 'الرعاية الصحية')
            ->assertJsonPath('data.type_string', 'أفراد');

        $this->assertDatabaseHas('donors', [
            'store_id'    => $this->store->id,
            'name'        => 'سعد الخالدي',
            'phone'       => '0555555555',
            'interest_id' => $this->interest->id,
        ]);
    }

    public function test_create_donor_validation_fails_without_required_fields(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/donor/store', [
                'name'  => '',
                'phone' => '',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure(['errors' => ['name', 'phone']]);
    }

    public function test_user_can_show_donor(): void
    {
        $donor = Donor::create([
            'store_id'    => $this->store->id,
            'interest_id' => $this->interest->id,
            'name'        => 'فهد العتيبي',
            'phone'       => '0544444444',
            'type'        => '2',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/donor/{$donor->id}");

        $response->assertStatus(200)
            ->assertJsonPath('id', $donor->id)
            ->assertJsonPath('name', 'فهد العتيبي')
            ->assertJsonPath('type_string', 'مؤسسة أهلية');
    }

    public function test_user_can_update_donor(): void
    {
        $donor = Donor::create([
            'store_id' => $this->store->id,
            'name'     => 'الاسم القديم',
            'phone'    => '0511111111',
            'type'     => '1',
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/donor/update', [
                'id'             => $donor->id,
                'name'           => 'الاسم المحدث',
                'phone'          => '0522222222',
                'type'           => '3',
                'donorInterests' => $this->interest->id,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'الاسم المحدث')
            ->assertJsonPath('data.type_string', 'مؤسسة تجارية');

        $this->assertDatabaseHas('donors', [
            'id'          => $donor->id,
            'name'        => 'الاسم المحدث',
            'phone'       => '0522222222',
            'interest_id' => $this->interest->id,
        ]);
    }

    public function test_user_can_delete_donor(): void
    {
        $donor = Donor::create([
            'store_id' => $this->store->id,
            'name'     => 'مانح للحذف',
            'phone'    => '0500000000',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/donor/{$donor->id}/delete");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertSoftDeleted('donors', [
            'id' => $donor->id,
        ]);
    }

    public function test_user_can_get_all_donor_interests_dropdown(): void
    {
        $response = $this->actingAs($this->user)
            ->getJson('/api/donorinterest/all');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'الرعاية الصحية']);
    }
}
