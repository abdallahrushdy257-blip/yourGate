<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\JobTitle;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EmployeeTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Store $store;
    protected JobTitle $jobTitle;

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

        $this->jobTitle = JobTitle::create([
            'store_id' => $this->store->id,
            'title'    => 'مدير عام',
        ]);

        Sanctum::actingAs($this->user);
    }

    public function test_user_can_list_employees_and_defaults_are_seeded(): void
    {
        $response = $this->postJson('/api/employees');

        $response->assertStatus(200);
        $this->assertDatabaseHas('employees', [
            'store_id' => $this->store->id,
            'name'     => 'أحمد محمد علي',
        ]);
    }

    public function test_user_can_create_employee_with_full_payload(): void
    {
        $payload = [
            'name'                    => 'فيصل عبدالله',
            'email'                   => 'faisal@example.com',
            'phone'                   => '0551234567',
            'nationalid'              => '1099887766',
            'idtype'                  => 0,
            'dob'                     => '1990-05-15',
            'gender'                  => '0',
            'status'                  => 1,
            'address'                 => 'الرياض، المملكة العربية السعودية',
            'nationality'             => 'سعودي',
            'qualification'           => 'بكالوريوس هندسة حاسب',
            'worktype'                => 0,
            'dateofhire'              => '2024-01-01',
            'contractexpiration'      => '2028-01-01',
            'job_title_id'            => $this->jobTitle->id,
            'iban'                    => 'SA0380000000608010167999',
            'basic_salary'            => 10000,
            'social_insurance'        => 1000,
            'housing_allowance'       => 2500,
            'transport_allowance'     => 1000,
            'communication_allowance' => 400,
            'life_allowance'          => 600,
            'work_allowance'          => 500,
            'salary_account'          => '41101001,41101002',
        ];

        $response = $this->postJson('/api/employees/store', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('employees', [
            'store_id'     => $this->store->id,
            'name'         => 'فيصل عبدالله',
            'basic_salary' => 10000,
            'total_salary' => 14000, // 10000 - 1000 + 2500 + 1000 + 400 + 600 + 500
        ]);
    }

    public function test_user_can_update_employee(): void
    {
        $employee = Employee::create([
            'store_id'     => $this->store->id,
            'name'         => 'موظف قديم',
            'email'        => 'old@test.com',
            'phone'        => '0500000000',
            'basic_salary' => 6000,
        ]);

        $response = $this->postJson('/api/employees/update', [
            'id'           => $employee->id,
            'name'         => 'موظف محدث',
            'email'        => 'updated@test.com',
            'basic_salary' => 7500,
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('employees', [
            'id'           => $employee->id,
            'name'         => 'موظف محدث',
            'basic_salary' => 7500,
        ]);
    }

    public function test_user_can_store_salary_directly(): void
    {
        $employee = Employee::create([
            'store_id'     => $this->store->id,
            'name'         => 'موظف الراتب',
            'basic_salary' => 5000,
        ]);

        $response = $this->postJson('/api/salary/store', [
            'emp_id'       => $employee->id,
            'mainBudget'   => 8000,
            'socialWelfare'=> 800,
            'house'        => 2000,
            'transport'    => 1000,
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('employees', [
            'id'                => $employee->id,
            'basic_salary'      => 8000,
            'housing_allowance' => 2000,
        ]);
    }

    public function test_user_can_show_and_delete_employee(): void
    {
        $employee = Employee::create([
            'store_id' => $this->store->id,
            'name'     => 'موظف للحذف',
        ]);

        $showRes = $this->getJson("/api/employees/{$employee->id}");
        $showRes->assertStatus(200)
                ->assertJsonPath('data.name', 'موظف للحذف');

        $delRes = $this->deleteJson("/api/employees/{$employee->id}");
        $delRes->assertStatus(200);

        $this->assertSoftDeleted('employees', [
            'id' => $employee->id,
        ]);
    }
}
