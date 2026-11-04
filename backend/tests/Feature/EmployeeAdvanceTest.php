<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\EmployeeAdvance;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EmployeeAdvanceTest extends TestCase
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
            'name'     => 'أحمد علي',
            'email'    => 'ahmed.ali@example.com',
            'phone'    => '0551122334',
        ]);

        Sanctum::actingAs($this->user);
    }

    public function test_user_can_list_advances_and_defaults_are_seeded(): void
    {
        $response = $this->getJson('/api/employee-advances');

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('employee_advances', [
            'store_id'    => $this->store->id,
            'employee_id' => $this->employee->id,
        ]);
    }

    public function test_user_can_create_advance_with_installments(): void
    {
        $payload = [
            'employee_id'        => $this->employee->id,
            'amount'             => 6000,
            'months'             => 3,
            'start_date'         => '2026-05-01',
            'notes'              => 'سلفة تجريبية',
        ];

        $response = $this->postJson('/api/employee-advances/store', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('employee_advances', [
            'store_id'       => $this->store->id,
            'employee_id'    => $this->employee->id,
            'amount'         => 6000,
            'months'         => 3,
            'monthly_amount' => 2000,
        ]);

        $this->assertDatabaseCount('employee_advance_installments', 3);
    }

    public function test_user_can_show_advance_with_installments(): void
    {
        $advance = EmployeeAdvance::create([
            'store_id'       => $this->store->id,
            'employee_id'    => $this->employee->id,
            'amount'         => 4000,
            'months'         => 2,
            'monthly_amount' => 2000,
            'start_date'     => '2026-01-01',
            'end_date'       => '2026-02-01',
        ]);

        $response = $this->getJson("/api/employee-advances/{$advance->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.id', $advance->id);
    }

    public function test_user_can_delete_advance(): void
    {
        $advance = EmployeeAdvance::create([
            'store_id'       => $this->store->id,
            'employee_id'    => $this->employee->id,
            'amount'         => 2000,
            'months'         => 2,
            'monthly_amount' => 1000,
            'start_date'     => '2026-01-01',
        ]);

        $response = $this->deleteJson("/api/employee-advances/{$advance->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertSoftDeleted('employee_advances', [
            'id' => $advance->id,
        ]);
    }

    public function test_advances_are_isolated_by_store(): void
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

        $otherAdvance = EmployeeAdvance::create([
            'store_id'       => $otherStore->id,
            'employee_id'    => $otherEmp->id,
            'amount'         => 10000,
            'months'         => 5,
            'monthly_amount' => 2000,
            'start_date'     => '2026-01-01',
        ]);

        $response = $this->getJson('/api/employee-advances');

        $response->assertStatus(200);
        $ids = collect($response->json('data'))->pluck('id')->toArray();

        $this->assertNotContains($otherAdvance->id, $ids);
    }
}
