<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\SalaryAction;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SalaryActionTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Store $store;
    protected Employee $employee;

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

        $this->employee = Employee::create([
            'store_id' => $this->store->id,
            'name'     => 'أحمد محمد علي',
            'email'    => 'ahmed.ali@example.com',
            'phone'    => '0551122334',
        ]);

        Sanctum::actingAs($this->user);
    }

    public function test_user_can_list_salary_actions_and_defaults_are_seeded(): void
    {
        $response = $this->getJson('/api/salaryactions');

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('salary_actions', [
            'store_id'    => $this->store->id,
            'employee_id' => $this->employee->id,
        ]);
    }

    public function test_user_can_create_salary_action(): void
    {
        $payload = [
            'employee_id' => $this->employee->id,
            'type'        => 0, // مكافأة
            'reason'      => 'مكافآت وحوافز سنوية',
            'amounttype'  => 1, // مال
            'amount'      => 2000,
            'date'        => '2026-10-29',
            'description' => 'مكافأة أداء',
            'component'   => '41102006',
        ];

        $response = $this->postJson('/api/salaryactions/store', $payload);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('salary_actions', [
            'store_id'    => $this->store->id,
            'employee_id' => $this->employee->id,
            'type'        => 0,
            'amount'      => 2000,
        ]);
    }

    public function test_user_can_show_salary_action(): void
    {
        $action = SalaryAction::create([
            'store_id'    => $this->store->id,
            'employee_id' => $this->employee->id,
            'type'        => 1,
            'amounttype'  => 0,
            'amount'      => 2,
            'date'        => '2026-10-29',
        ]);

        $response = $this->getJson("/api/salaryactions/{$action->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.id', $action->id);
    }

    public function test_user_can_delete_salary_action(): void
    {
        $action = SalaryAction::create([
            'store_id'    => $this->store->id,
            'employee_id' => $this->employee->id,
            'type'        => 1,
            'amounttype'  => 1,
            'amount'      => 300,
            'date'        => '2026-10-29',
        ]);

        $response = $this->deleteJson("/api/salaryactions/{$action->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertSoftDeleted('salary_actions', [
            'id' => $action->id,
        ]);
    }

    public function test_salary_actions_are_isolated_by_store(): void
    {
        $otherStore = Store::create([
            'name'   => 'جمعية أخرى',
            'slug'   => 'other-store',
            'status' => 'active',
        ]);

        $otherEmp = Employee::create([
            'store_id' => $otherStore->id,
            'name'     => 'موظف بمتجر آخر',
        ]);

        $otherAction = SalaryAction::create([
            'store_id'    => $otherStore->id,
            'employee_id' => $otherEmp->id,
            'type'        => 0,
            'amounttype'  => 1,
            'amount'      => 5000,
            'date'        => '2026-10-29',
        ]);

        $response = $this->getJson('/api/salaryactions');

        $response->assertStatus(200);
        $ids = collect($response->json('data'))->pluck('id')->toArray();

        $this->assertNotContains($otherAction->id, $ids);
    }
}
