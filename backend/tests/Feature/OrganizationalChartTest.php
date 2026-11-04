<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\Section;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrganizationalChartTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Store $store;
    protected Employee $manager;
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

        $this->manager = Employee::create([
            'store_id'     => $this->store->id,
            'name'         => 'م. أحمد محمود',
            'email'        => 'ahmed.it@example.com',
            'phone'        => '0501111111',
            'basic_salary' => 15000,
            'is_active'    => true,
        ]);

        $this->employee = Employee::create([
            'store_id'     => $this->store->id,
            'name'         => 'سارة علي',
            'email'        => 'sara.it@example.com',
            'phone'        => '0502222222',
            'basic_salary' => 9000,
            'is_active'    => true,
        ]);

        Sanctum::actingAs($this->user);
    }

    public function test_user_can_get_organizational_chart_and_defaults_are_seeded(): void
    {
        $response = $this->getJson('/api/organizational-chart');

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $data = $response->json('data');
        $this->assertIsArray($data);
        $this->assertNotEmpty($data);

        // First department should have valid structure
        $firstDept = $data[0];
        $this->assertArrayHasKey('name', $firstDept);
        $this->assertArrayHasKey('manager', $firstDept);
        $this->assertArrayHasKey('employees', $firstDept);
    }

    public function test_chart_is_isolated_by_store(): void
    {
        $otherStore = Store::create([
            'name'   => 'متجر آخر منفصل',
            'slug'   => 'other-store',
            'status' => 'active',
        ]);

        $otherSection = Section::create([
            'store_id'    => $otherStore->id,
            'name'        => 'قسم خاص بالمتجر الآخر فقط',
            'description' => 'قسم سري',
        ]);

        $response = $this->getJson('/api/organizational-chart');
        $response->assertStatus(200);

        $names = collect($response->json('data'))->pluck('name');
        $this->assertNotContains('قسم خاص بالمتجر الآخر فقط', $names);
    }
}
