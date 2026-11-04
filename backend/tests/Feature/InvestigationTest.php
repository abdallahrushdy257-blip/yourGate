<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\Investigation;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class InvestigationTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Store $store;
    protected Employee $employee;
    protected Employee $investigator;

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
            'name'     => 'يوسف حنان',
            'email'    => 'yousef@example.com',
            'phone'    => '0505678901',
        ]);

        $this->investigator = Employee::create([
            'store_id' => $this->store->id,
            'name'     => 'خالد المنصور',
            'email'    => 'khaled@example.com',
            'phone'    => '0505678902',
        ]);

        Sanctum::actingAs($this->user);
    }

    public function test_user_can_list_investigations_and_defaults_are_seeded(): void
    {
        $response = $this->getJson('/api/investigations');

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('investigations', [
            'store_id' => $this->store->id,
        ]);
    }

    public function test_user_can_create_investigation_with_attachment(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('report.jpg');

        $payload = [
            'employee_id'     => $this->employee->id,
            'investigator_id' => $this->investigator->id,
            'reason'          => 'غياب متكرر بدون عذر',
            'result'          => 'خصم يومين',
            'date'            => '2026-10-29',
            'description'     => 'تم استجواب الموظف وتطبيق اللائحة',
            'attach'          => $file,
        ];

        $response = $this->postJson('/api/investigations/store', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.name', 'يوسف حنان')
                 ->assertJsonPath('data.investigator', 'خالد المنصور');

        $this->assertDatabaseHas('investigations', [
            'store_id'        => $this->store->id,
            'employee_id'     => $this->employee->id,
            'investigator_id' => $this->investigator->id,
            'reason'          => 'غياب متكرر بدون عذر',
        ]);
    }

    public function test_user_can_show_investigation(): void
    {
        $investigation = Investigation::create([
            'store_id'        => $this->store->id,
            'employee_id'     => $this->employee->id,
            'investigator_id' => $this->investigator->id,
            'reason'          => 'تحقيق إداري عام',
            'result'          => 'حفظ التحقيق',
            'date'            => '2026-10-29',
            'description'     => 'تفاصيل التحقيق',
        ]);

        $response = $this->getJson("/api/investigations/{$investigation->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.id', $investigation->id)
                 ->assertJsonPath('data.reason', 'تحقيق إداري عام');
    }

    public function test_user_can_update_investigation(): void
    {
        $investigation = Investigation::create([
            'store_id'        => $this->store->id,
            'employee_id'     => $this->employee->id,
            'investigator_id' => $this->investigator->id,
            'reason'          => 'السبب المبدئي',
            'result'          => 'قيد المراجعة',
            'date'            => '2026-10-29',
        ]);

        $response = $this->postJson("/api/investigations/update/{$investigation->id}", [
            'reason' => 'السبب المعدل',
            'result' => 'تم الإغلاق بنجاح',
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.reason', 'السبب المعدل')
                 ->assertJsonPath('data.result', 'تم الإغلاق بنجاح');

        $this->assertDatabaseHas('investigations', [
            'id'     => $investigation->id,
            'reason' => 'السبب المعدل',
            'result' => 'تم الإغلاق بنجاح',
        ]);
    }

    public function test_user_can_delete_investigation(): void
    {
        $investigation = Investigation::create([
            'store_id'    => $this->store->id,
            'employee_id' => $this->employee->id,
            'date'        => '2026-10-29',
        ]);

        $response = $this->deleteJson("/api/investigations/{$investigation->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertSoftDeleted('investigations', [
            'id' => $investigation->id,
        ]);
    }
}
