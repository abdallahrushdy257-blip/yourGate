<?php

namespace Tests\Feature;

use App\Models\AssemblyMember;
use App\Models\Committee;
use App\Models\CommitteeMember;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommitteeTest extends TestCase
{
    use RefreshDatabase;

    protected Store $store;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->store = Store::create([
            'name'   => 'جمعية التكافل',
            'slug'   => 'takaful-assoc',
            'status' => 'active',
        ]);

        $this->user = User::factory()->create([
            'store_id' => $this->store->id,
            'status'   => 'active',
        ]);
    }

    public function test_user_can_list_committees_filtered_by_store(): void
    {
        Committee::create([
            'store_id'    => $this->store->id,
            'name'        => 'لجنة التدقيق الداخلي',
            'description' => 'متابعة أعمال التدقيق والرقابة',
        ]);

        $otherStore = Store::create([
            'name'   => 'جمعية أخرى',
            'slug'   => 'other-assoc',
            'status' => 'active',
        ]);

        Committee::withoutGlobalScopes()->create([
            'store_id'    => $otherStore->id,
            'name'        => 'لجنة متجر غريب',
            'description' => 'وصف متجر غريب',
        ]);

        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->postJson('/api/associationcommittee');

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'لجنة التدقيق الداخلي'])
            ->assertJsonMissing(['name' => 'لجنة متجر غريب']);
    }

    public function test_user_can_create_committee_with_members(): void
    {
        $assemblyMember = AssemblyMember::create([
            'store_id' => $this->store->id,
            'name'     => 'د. خالد بن سلطان',
            'status'   => 1,
        ]);

        $payload = [
            'name'        => 'لجنة الرقابة والمراجعة',
            'description' => 'وصف تفصيلي للجنة الرقابة',
            'members'     => json_encode([
                [
                    'id'   => $assemblyMember->id,
                    'name' => $assemblyMember->name,
                    'role' => 'رئيس اللجنة',
                ],
            ]),
        ];

        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->postJson('/api/associationcommittee/store', $payload);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'لجنة الرقابة والمراجعة');

        $this->assertDatabaseHas('committees', [
            'store_id' => $this->store->id,
            'name'     => 'لجنة الرقابة والمراجعة',
        ]);

        $this->assertDatabaseHas('committee_members', [
            'store_id'           => $this->store->id,
            'assembly_member_id' => $assemblyMember->id,
            'role'               => 'رئيس اللجنة',
        ]);
    }

    public function test_create_committee_validation_fails_without_name(): void
    {
        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->postJson('/api/associationcommittee/store', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    public function test_user_can_show_committee(): void
    {
        $committee = Committee::create([
            'store_id'    => $this->store->id,
            'name'        => 'لجنة الاستثمار',
            'description' => 'تنمية موارد الجمعية',
        ]);

        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->getJson("/api/associationcommittee/{$committee->id}");

        $response->assertOk()
            ->assertJsonPath('id', $committee->id)
            ->assertJsonPath('name', 'لجنة الاستثمار');
    }

    public function test_user_can_update_committee_and_sync_members(): void
    {
        $committee = Committee::create([
            'store_id'    => $this->store->id,
            'name'        => 'لجنة قديمة',
            'description' => 'وصف قديم',
        ]);

        $committee->members()->create([
            'store_id' => $this->store->id,
            'name'     => 'عضو سابق',
            'role'     => 'عضو',
        ]);

        $payload = [
            'name'        => 'لجنة الاستثمار والتطوير',
            'description' => 'وصف جديد ومحدث',
            'members'     => [
                [
                    'id'   => null,
                    'name' => 'م. عبدالله الأحمد',
                    'role' => 'نائب رئيس',
                ],
            ],
        ];

        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->postJson("/api/associationcommittee/update/{$committee->id}", $payload);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'لجنة الاستثمار والتطوير');

        $this->assertDatabaseHas('committees', [
            'id'   => $committee->id,
            'name' => 'لجنة الاستثمار والتطوير',
        ]);

        $this->assertDatabaseMissing('committee_members', [
            'name' => 'عضو سابق',
        ]);

        $this->assertDatabaseHas('committee_members', [
            'committee_id' => $committee->id,
            'name'         => 'م. عبدالله الأحمد',
            'role'         => 'نائب رئيس',
        ]);
    }

    public function test_user_can_delete_committee(): void
    {
        $committee = Committee::create([
            'store_id'    => $this->store->id,
            'name'        => 'لجنة سيتم حذفها',
            'description' => 'حذف',
        ]);

        $member = $committee->members()->create([
            'store_id' => $this->store->id,
            'name'     => 'عضو تابع',
            'role'     => 'عضو',
        ]);

        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->deleteJson("/api/associationcommittee/{$committee->id}");

        $response->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('committees', ['id' => $committee->id]);
        $this->assertDatabaseMissing('committee_members', ['id' => $member->id]);
    }

    public function test_user_can_list_committee_members(): void
    {
        $committee = Committee::create([
            'store_id'    => $this->store->id,
            'name'        => 'لجنة الترشيحات',
            'description' => 'ترشيحات المجلس',
        ]);

        $committee->members()->create([
            'store_id' => $this->store->id,
            'name'     => 'سارة العتيبي',
            'role'     => 'رئيس اللجنة',
        ]);

        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->postJson("/api/associationcommittee/{$committee->id}/members");

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'سارة العتيبي', 'role' => 'رئيس اللجنة']);
    }

    public function test_user_can_get_committee_stats(): void
    {
        $committee = Committee::create([
            'store_id'    => $this->store->id,
            'name'        => 'اللجنة المالية',
            'description' => 'مالية',
        ]);

        $committee->members()->create([
            'store_id' => $this->store->id,
            'name'     => 'فهد',
            'role'     => 'عضو',
        ]);

        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->getJson('/api/associationcommittee/stats');

        $response->assertOk()
            ->assertJsonPath('data.total_committees', 1)
            ->assertJsonPath('data.total_members', 1);
    }
}
