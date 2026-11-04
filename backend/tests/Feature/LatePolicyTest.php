<?php

namespace Tests\Feature;

use App\Models\LatePolicy;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LatePolicyTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Store $store;

    protected function setUp(): void
    {
        parent::setUp();

        $this->store = Store::create([
            'name'   => 'جمعية البر الرئيسية',
            'slug'   => 'albir-main',
            'status' => 'active',
        ]);

        $this->user = User::factory()->create([
            'store_id' => $this->store->id,
        ]);

        Sanctum::actingAs($this->user);
    }

    public function test_user_can_list_late_policies_and_defaults_are_seeded(): void
    {
        $response = $this->getJson('/api/late-policies');

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('late_policies', [
            'store_id' => $this->store->id,
            'category' => 'late',
        ]);
        $this->assertDatabaseHas('late_policies', [
            'store_id' => $this->store->id,
            'category' => 'overtime',
        ]);
        $this->assertDatabaseHas('late_policies', [
            'store_id' => $this->store->id,
            'category' => 'absence_without_permission',
        ]);
    }

    public function test_user_can_create_late_policy(): void
    {
        $payload = [
            'category'    => 'late',
            'from_minute' => 31,
            'to_minute'   => 45,
            'type'        => 'day_fraction',
            'value'       => 0.75,
            'active'      => true,
        ];

        $response = $this->postJson('/api/late-policies/store', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('late_policies', [
            'store_id'    => $this->store->id,
            'category'    => 'late',
            'from_minute' => 31,
            'to_minute'   => 45,
            'value'       => 0.75,
        ]);
    }

    public function test_user_can_update_late_policy(): void
    {
        $policy = LatePolicy::create([
            'store_id' => $this->store->id,
            'category' => 'overtime',
            'hour'     => 2,
            'type'     => 'fixed_amount',
            'value'    => 150,
            'active'   => true,
        ]);

        $response = $this->postJson('/api/late-policies/update', [
            'id'    => $policy->id,
            'value' => 200,
            'hour'  => 3,
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('late_policies', [
            'id'    => $policy->id,
            'value' => 200,
            'hour'  => 3,
        ]);
    }

    public function test_user_can_delete_late_policy(): void
    {
        $policy = LatePolicy::create([
            'store_id' => $this->store->id,
            'category' => 'absence_without_permission',
            'type'     => 'day_fraction',
            'value'    => 1,
            'active'   => true,
        ]);

        $response = $this->deleteJson("/api/late-policies/{$policy->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('late_policies', [
            'id' => $policy->id,
        ]);
    }

    public function test_late_policies_are_isolated_by_store(): void
    {
        $otherStore = Store::create([
            'name'   => 'جمعية أخرى',
            'slug'   => 'other-store',
            'status' => 'active',
        ]);

        $otherPolicy = LatePolicy::create([
            'store_id' => $otherStore->id,
            'category' => 'late',
            'from_minute' => 10,
            'to_minute'   => 20,
            'type'        => 'day_fraction',
            'value'       => 0.3,
            'active'      => true,
        ]);

        $response = $this->getJson('/api/late-policies');

        $response->assertStatus(200);
        $ids = collect($response->json('data'))->pluck('id')->toArray();

        $this->assertNotContains($otherPolicy->id, $ids);
    }
}
