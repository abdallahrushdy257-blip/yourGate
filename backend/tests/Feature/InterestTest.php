<?php

namespace Tests\Feature;

use App\Models\Interest;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InterestTest extends TestCase
{
    use RefreshDatabase;

    protected Store $store;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->store = Store::create([
            'name'   => 'متجر الاختبار',
            'slug'   => 'test-store',
            'status' => 'active',
        ]);

        $this->user = User::factory()->create([
            'store_id' => $this->store->id,
            'status'   => 'active',
        ]);
    }

    public function test_user_can_list_interests_filtered_by_store(): void
    {
        // Interest belonging to this store
        Interest::create([
            'store_id'    => $this->store->id,
            'name'        => 'التعليم',
            'description' => 'دعم المشاريع التعليمية',
        ]);

        // Another store and its interest
        $otherStore = Store::create([
            'name'   => 'متجر آخر',
            'slug'   => 'other-store',
            'status' => 'active',
        ]);

        Interest::withoutGlobalScopes()->create([
            'store_id'    => $otherStore->id,
            'name'        => 'اهتمام خارجي',
            'description' => 'لا يجب أن يظهر',
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/donorinterest', []);

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'التعليم'])
            ->assertJsonMissing(['name' => 'اهتمام خارجي']);
    }

    public function test_user_can_create_interest_successfully(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/donorinterest/store', [
                'name'        => 'الصحة',
                'description' => 'دعم المشافي والمراكز الصحية',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'الصحة');

        $this->assertDatabaseHas('interests', [
            'store_id' => $this->store->id,
            'name'     => 'الصحة',
        ]);
    }

    public function test_create_interest_validation_fails_without_name(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/donorinterest/store', [
                'name' => '',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure(['errors' => ['name']]);
    }

    public function test_user_can_update_interest(): void
    {
        $interest = Interest::create([
            'store_id'    => $this->store->id,
            'name'        => 'القديم',
            'description' => 'وصف قديم',
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/donorinterest/update', [
                'id'          => $interest->id,
                'name'        => 'المحدث',
                'description' => 'وصف محدث',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'المحدث');

        $this->assertDatabaseHas('interests', [
            'id'   => $interest->id,
            'name' => 'المحدث',
        ]);
    }

    public function test_user_can_delete_interest(): void
    {
        $interest = Interest::create([
            'store_id' => $this->store->id,
            'name'     => 'للحذف',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/donorinterest/{$interest->id}/delete");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertSoftDeleted('interests', [
            'id' => $interest->id,
        ]);
    }
}
