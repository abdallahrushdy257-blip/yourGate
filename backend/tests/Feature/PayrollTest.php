<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\Payroll;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PayrollTest extends TestCase
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
            'store_id'     => $this->store->id,
            'name'         => 'أحمد محمود علي',
            'email'        => 'ahmed.mahmoud@example.com',
            'phone'        => '0505123456',
            'basic_salary' => 6000,
            'is_active'    => true,
        ]);

        Sanctum::actingAs($this->user);
    }

    public function test_user_can_list_payrolls_and_defaults_are_seeded(): void
    {
        $response = $this->getJson('/api/payroll?year=2026&month=10');

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('payrolls', [
            'store_id'    => $this->store->id,
            'employee_id' => $this->employee->id,
            'year'        => 2026,
            'month'       => 10,
        ]);
    }

    public function test_user_can_store_or_update_payroll(): void
    {
        $payload = [
            'employee_id'      => $this->employee->id,
            'year'             => 2026,
            'month'            => 10,
            'basic_salary'     => 6000,
            'allowance'        => 1000,
            'additions'        => 500,
            'deductions'       => 200,
            'absence'          => 0,
            'investigations'   => 0,
            'social_insurance' => 400,
            'net_salary'       => 6900,
            'status'           => 'approved',
        ];

        $response = $this->postJson('/api/payroll/store', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.name', 'أحمد محمود علي')
                 ->assertJsonPath('data.net', 6900);

        $this->assertDatabaseHas('payrolls', [
            'store_id'    => $this->store->id,
            'employee_id' => $this->employee->id,
            'net_salary'  => 6900,
        ]);
    }

    public function test_user_can_calculate_payroll_for_period(): void
    {
        $response = $this->postJson('/api/payroll/calculate', [
            'year'  => 2026,
            'month' => 11,
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.year', 2026)
                 ->assertJsonPath('data.month', 11);

        $this->assertDatabaseHas('payrolls', [
            'store_id'    => $this->store->id,
            'employee_id' => $this->employee->id,
            'year'        => 2026,
            'month'       => 11,
        ]);
    }

    public function test_user_can_show_payroll_and_voucher(): void
    {
        $payroll = Payroll::create([
            'store_id'         => $this->store->id,
            'employee_id'      => $this->employee->id,
            'year'             => 2026,
            'month'            => 10,
            'basic_salary'     => 6000,
            'allowance'        => 1000,
            'net_salary'       => 7000,
        ]);

        $response = $this->getJson("/api/payroll/{$payroll->id}");
        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.id', $payroll->id);

        $voucherResponse = $this->getJson("/api/payroll/{$payroll->id}/voucher");
        $voucherResponse->assertStatus(200)
                        ->assertJsonPath('success', true)
                        ->assertJsonPath('data.employee_name', 'أحمد محمود علي')
                        ->assertJsonPath('data.net_salary', 7000);
    }

    public function test_user_can_delete_payroll(): void
    {
        $payroll = Payroll::create([
            'store_id'    => $this->store->id,
            'employee_id' => $this->employee->id,
            'year'        => 2026,
            'month'       => 10,
            'net_salary'  => 6000,
        ]);

        $response = $this->deleteJson("/api/payroll/{$payroll->id}");
        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertSoftDeleted('payrolls', [
            'id' => $payroll->id,
        ]);
    }
}
