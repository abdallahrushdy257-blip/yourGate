<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AttendanceTest extends TestCase
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
            'name'     => 'أحمد السالم',
            'email'    => 'ahmed.salem@test.com',
            'phone'    => '0501234567',
        ]);

        Sanctum::actingAs($this->user);
    }

    public function test_user_can_list_attendances_and_defaults_are_seeded(): void
    {
        $response = $this->postJson('/api/attendances');

        $response->assertStatus(200);
        $this->assertDatabaseHas('attendances', [
            'store_id'    => $this->store->id,
            'employee_id' => $this->employee->id,
        ]);
    }

    public function test_user_can_record_check_in(): void
    {
        $payload = [
            'name' => $this->employee->id,
            'type' => '1',
            'date' => '2026-10-29',
            'time' => '08:15',
        ];

        $response = $this->postJson('/api/attendances/store', $payload);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('attendances', [
            'store_id'    => $this->store->id,
            'employee_id' => $this->employee->id,
            'check_in'    => '08:15',
        ]);
    }

    public function test_user_can_record_check_out(): void
    {
        Attendance::create([
            'store_id'    => $this->store->id,
            'employee_id' => $this->employee->id,
            'date'        => '2026-10-29',
            'check_in'    => '08:00',
        ]);

        $payload = [
            'name' => $this->employee->id,
            'type' => '2',
            'date' => '2026-10-29',
            'time' => '16:00',
        ];

        $response = $this->postJson('/api/attendances/store', $payload);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('attendances', [
            'store_id'    => $this->store->id,
            'employee_id' => $this->employee->id,
            'check_in'    => '08:00',
            'check_out'   => '16:00',
        ]);
    }

    public function test_user_can_delete_attendance(): void
    {
        $attendance = Attendance::create([
            'store_id'    => $this->store->id,
            'employee_id' => $this->employee->id,
            'date'        => '2026-10-28',
            'check_in'    => '08:00',
        ]);

        $response = $this->deleteJson("/api/attendances/{$attendance->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('attendances', [
            'id' => $attendance->id,
        ]);
    }
}
