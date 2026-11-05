<?php

namespace Tests\Feature;

use App\Models\Store;
use App\Models\User;
use App\Models\Vacation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VacationTest extends TestCase
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

    public function test_user_can_list_vacation_types_and_defaults_are_seeded(): void
    {
        $response = $this->postJson('/api/vacations');

        $response->assertStatus(200);
        $this->assertDatabaseHas('vacations', [
            'store_id' => $this->store->id,
            'name'     => 'إجازة سنوية',
        ]);
    }

    public function test_user_can_create_vacation_type(): void
    {
        $payload = [
            'name'        => 'إجازة دراسية',
            'description' => 'إجازة لاستكمال الدراسات العليا',
            'days'        => 30,
        ];

        $response = $this->postJson('/api/vacations/store', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('vacations', [
            'store_id' => $this->store->id,
            'name'     => 'إجازة دراسية',
            'days'     => 30,
        ]);
    }

    public function test_user_can_update_vacation_type(): void
    {
        $vacation = Vacation::create([
            'store_id'    => $this->store->id,
            'name'        => 'إجازة مؤقتة',
            'description' => 'وصف',
            'days'        => 5,
        ]);

        $response = $this->postJson('/api/vacations/update', [
            'id'          => $vacation->id,
            'name'        => 'إجازة معدلة',
            'description' => 'وصف معدل',
            'days'        => 12,
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('vacations', [
            'id'   => $vacation->id,
            'name' => 'إجازة معدلة',
            'days' => 12,
        ]);
    }

    public function test_user_can_delete_vacation_type(): void
    {
        $vacation = Vacation::create([
            'store_id'    => $this->store->id,
            'name'        => 'إجازة للحذف',
            'description' => 'وصف',
            'days'        => 3,
        ]);

        $response = $this->deleteJson("/api/vacations/{$vacation->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('vacations', [
            'id' => $vacation->id,
        ]);
    }

    public function test_vacations_are_isolated_by_store(): void
    {
        $otherStore = Store::create([
            'name'   => 'جمعية الخير',
            'slug'   => 'alkhair',
            'status' => 'active',
        ]);

        Vacation::create([
            'store_id'    => $otherStore->id,
            'name'        => 'إجازة متجر آخر',
            'description' => 'وصف متجر آخر',
            'days'        => 15,
        ]);

        $response = $this->postJson('/api/vacations');

        $response->assertStatus(200);
        $data = $response->json();
        $items = isset($data['data']) ? $data['data'] : $data;

        $names = collect($items)->pluck('name')->all();
        $this->assertNotContains('إجازة متجر آخر', $names);
    }
}
