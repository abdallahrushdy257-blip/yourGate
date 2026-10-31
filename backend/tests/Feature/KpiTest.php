<?php

namespace Tests\Feature;

use App\Models\Kpi;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class KpiTest extends TestCase
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
            'email'    => 'admin@albir-main.com',
        ]);

        Sanctum::actingAs($this->user);
    }

    public function test_user_can_list_kpis_and_defaults_are_seeded(): void
    {
        $response = $this->getJson('/api/kpi');

        $response->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseCount('kpis', 4);
        $this->assertDatabaseHas('kpis', [
            'store_id' => $this->store->id,
            'quiz'     => 'نسبة الالتزام بالجدول الزمني للمشروع',
            'target'   => 100,
        ]);
    }

    public function test_user_can_create_new_kpi(): void
    {
        $payload = [
            'quiz'   => 'معدل رضا المستفيدين',
            'target' => 95.5,
        ];

        $response = $this->postJson('/api/kpi/store', $payload);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.quiz', 'معدل رضا المستفيدين')
            ->assertJsonPath('data.target', 95.5);

        $this->assertDatabaseHas('kpis', [
            'store_id' => $this->store->id,
            'quiz'     => 'معدل رضا المستفيدين',
            'target'   => 95.5,
        ]);
    }

    public function test_user_can_update_kpi(): void
    {
        $kpi = Kpi::create([
            'store_id' => $this->store->id,
            'quiz'     => 'مؤشر أولي',
            'target'   => 50,
        ]);

        $response = $this->postJson("/api/kpi/{$kpi->id}/update", [
            'quiz'   => 'مؤشر محدث',
            'target' => 80,
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.quiz', 'مؤشر محدث');

        $this->assertDatabaseHas('kpis', [
            'id'     => $kpi->id,
            'quiz'   => 'مؤشر محدث',
            'target' => 80,
        ]);
    }

    public function test_user_can_delete_kpi(): void
    {
        $kpi = Kpi::create([
            'store_id' => $this->store->id,
            'quiz'     => 'مؤشر للحذف',
            'target'   => 70,
        ]);

        $response = $this->deleteJson("/api/kpi/{$kpi->id}/delete");

        $response->assertOk()
            ->assertJsonPath('success', true);

        $this->assertSoftDeleted('kpis', [
            'id' => $kpi->id,
        ]);
    }

    public function test_user_can_get_kpi_quizs(): void
    {
        $response = $this->getJson('/api/kpi/quizs');

        $response->assertOk()
            ->assertJsonPath('success', true);

        $data = $response->json('data');
        $this->assertIsArray($data);
        $quizs = collect($data)->pluck('quiz')->all();
        $this->assertContains('نسبة الالتزام بالجدول الزمني للمشروع', $quizs);
    }

    public function test_kpis_are_isolated_by_store(): void
    {
        $otherStore = Store::create([
            'name'   => 'متجر آخر',
            'slug'   => 'other-store',
            'status' => 'active',
        ]);

        Kpi::create([
            'store_id' => $otherStore->id,
            'quiz'     => 'مؤشر متجر آخر حصري',
            'target'   => 99,
        ]);

        $response = $this->getJson('/api/kpi');

        $response->assertOk();
        $quizs = collect($response->json('data'))->pluck('quiz')->all();
        $this->assertNotContains('مؤشر متجر آخر حصري', $quizs);
    }
}
