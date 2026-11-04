<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\EmployeeWithdrawal;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EmployeeWithdrawalTest extends TestCase
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
            'name'     => 'أحمد محمود',
            'email'    => 'ahmed@test.com',
            'phone'    => '0501234567',
        ]);

        Sanctum::actingAs($this->user);
    }

    public function test_user_can_list_withdrawals_and_defaults_are_seeded(): void
    {
        $response = $this->postJson('/api/employeewithdrawal');

        $response->assertStatus(200);
        $this->assertDatabaseHas('employee_withdrawals', [
            'store_id'    => $this->store->id,
            'employee_id' => $this->employee->id,
        ]);
    }

    public function test_user_can_create_withdrawal(): void
    {
        $payload = [
            'employee_id'         => $this->employee->id,
            'receiver_account_id' => 101,
            'amount'              => 2500,
            'date'                => '2026-10-29',
            'time'                => '11:00',
            'description'         => 'سلفة دورية',
        ];

        $response = $this->postJson('/api/employeewithdrawal/store', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('employee_withdrawals', [
            'store_id'    => $this->store->id,
            'employee_id' => $this->employee->id,
            'amount'      => 2500,
        ]);
    }

    public function test_user_can_approve_withdrawal(): void
    {
        $withdrawal = EmployeeWithdrawal::create([
            'store_id'     => $this->store->id,
            'employee_id'  => $this->employee->id,
            'amount'       => 1000,
            'account_name' => 'الخزينة الرئيسية',
            'status'       => 0,
        ]);

        $response = $this->postJson('/api/employeewithdrawal/approve', [
            'id'                 => $withdrawal->id,
            'payment_account_id' => 102,
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('employee_withdrawals', [
            'id'     => $withdrawal->id,
            'status' => 1,
        ]);
    }

    public function test_user_can_delete_withdrawal(): void
    {
        $withdrawal = EmployeeWithdrawal::create([
            'store_id'    => $this->store->id,
            'employee_id' => $this->employee->id,
            'amount'      => 500,
            'status'      => 0,
        ]);

        $response = $this->deleteJson("/api/employeewithdrawal/{$withdrawal->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('employee_withdrawals', [
            'id' => $withdrawal->id,
        ]);
    }
}
