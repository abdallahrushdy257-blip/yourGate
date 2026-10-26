<?php

namespace Tests\Feature;

use App\Models\HumanCase;
use App\Models\Store;
use App\Models\Survey;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SurveyTest extends TestCase
{
    use RefreshDatabase;

    protected Store $store;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->store = Store::create([
            'name'   => 'Surveys Branch',
            'slug'   => 'surveys-branch',
            'status' => 'active',
        ]);

        $this->user = User::factory()->create([
            'store_id' => $this->store->id,
            'status'   => 'active',
        ]);
    }

    public function test_user_can_list_empty_surveys_with_initial_stats(): void
    {
        $response = $this->actingAs($this->user)
            ->getJson('/api/surveys?period=2026-Q4');

        $response->assertOk()
            ->assertJsonPath('status', 200)
            ->assertJsonPath('stats.total', 0)
            ->assertJsonPath('stats.avg_satisfaction', null)
            ->assertJsonPath('stats.nps', null)
            ->assertJsonCount(0, 'data');
    }

    public function test_user_can_store_survey_and_calculate_stats_accurately(): void
    {
        $beneficiary = HumanCase::create([
            'store_id'      => $this->store->id,
            'name'          => 'سالم الدوسري',
            'gender'        => '0',
            'status'        => '2',
            'case_status'   => 'موافقة',
            'dob'           => '1995-01-01',
            'phonenum'      => '0501112233',
        ]);

        // Promoter: satisfaction=5, nps=10
        $this->actingAs($this->user)
            ->postJson('/api/surveys', [
                'humancase_id'       => $beneficiary->id,
                'period'             => '2026-Q4',
                'satisfaction_score' => 5,
                'nps_score'          => 10,
                'notes'              => 'خدمة متميزة وسريعة',
            ])
            ->assertOk()
            ->assertJsonPath('data.nps_category', 'promoter');

        // Detractor: satisfaction=2, nps=5
        $this->actingAs($this->user)
            ->postJson('/api/surveys', [
                'period'             => '2026-Q4',
                'satisfaction_score' => 2,
                'nps_score'          => 5,
                'notes'              => 'تأخر في الرد',
            ])
            ->assertOk()
            ->assertJsonPath('data.nps_category', 'detractor');

        // Passive: satisfaction=4, nps=8
        $this->actingAs($this->user)
            ->postJson('/api/surveys', [
                'period'             => '2026-Q4',
                'satisfaction_score' => 4,
                'nps_score'          => 8,
            ])
            ->assertOk()
            ->assertJsonPath('data.nps_category', 'passive');

        // Now fetch list
        $response = $this->actingAs($this->user)
            ->getJson('/api/surveys?period=2026-Q4');

        $response->assertOk()
            ->assertJsonPath('stats.total', 3)
            // Avg satisfaction: (5 + 2 + 4) / 3 = 11 / 3 = 3.7
            ->assertJsonPath('stats.avg_satisfaction', 3.7)
            // NPS: ((1 promoter - 1 detractor) / 3) * 100 = 0%
            ->assertJsonPath('stats.nps', 0)
            ->assertJsonPath('stats.promoters', 1)
            ->assertJsonPath('stats.detractors', 1)
            ->assertJsonPath('stats.passives', 1)
            ->assertJsonCount(3, 'data');
    }

    public function test_user_can_delete_survey(): void
    {
        $survey = Survey::create([
            'store_id'           => $this->store->id,
            'period'             => '2026-Q4',
            'satisfaction_score' => 4,
            'nps_score'          => 9,
        ]);

        $this->actingAs($this->user)
            ->deleteJson("/api/surveys/{$survey->id}")
            ->assertOk();

        $this->assertSoftDeleted('surveys', ['id' => $survey->id]);
    }
}
