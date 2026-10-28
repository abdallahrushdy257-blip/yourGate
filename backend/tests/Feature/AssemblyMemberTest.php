<?php

namespace Tests\Feature;

use App\Models\AssemblyMember;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class AssemblyMemberTest extends TestCase
{
    use RefreshDatabase;

    protected Store $store;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->store = Store::create([
            'name'   => 'جمعية البر',
            'slug'   => 'albir-assoc',
            'status' => 'active',
        ]);

        $this->user = User::factory()->create([
            'store_id' => $this->store->id,
            'status'   => 'active',
        ]);
    }

    public function test_user_can_list_assembly_members_filtered_by_store(): void
    {
        AssemblyMember::create([
            'store_id'                => $this->store->id,
            'name'                    => 'سعد الخالدي',
            'status'                  => 1,
            'start_subscription_date' => '2026-01-01',
            'subscription_fees'       => 500,
        ]);

        $otherStore = Store::create([
            'name'   => 'متجر آخر',
            'slug'   => 'other-store',
            'status' => 'active',
        ]);

        AssemblyMember::withoutGlobalScopes()->create([
            'store_id' => $otherStore->id,
            'name'     => 'عضو متجر غريب',
            'status'   => 2,
        ]);

        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->postJson('/api/assemblymembers');

        $response->assertStatus(200);
        $data = $response->json();
        $this->assertCount(1, $data);
        $this->assertEquals('سعد الخالدي', $data[0]['name']);
        $this->assertEquals('عضو مجلس ادارة', $data[0]['status_string']);
    }

    public function test_user_can_create_member_successfully(): void
    {
        $payload = [
            'name'        => 'فهد الأحمد',
            'dob'         => '1990-05-12',
            'nationalid'  => '1029384756',
            'startjoin'   => '2026-01-01',
            'endjoin'     => '2027-01-01',
            'status'      => '1',
            'membertype'  => '4',
            'fees'        => '600',
            'job'         => 'مهندس برمجيات',
            'jobAddress'  => 'الرياض',
            'notes'       => 'عضو مجلس جديد',
        ];

        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->postJson('/api/assemblymembers/store', $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('assembly_members', [
            'name'              => 'فهد الأحمد',
            'store_id'          => $this->store->id,
            'status'            => 1,
            'subscription_fees' => 600,
        ]);
    }

    public function test_create_member_validation_fails_without_name(): void
    {
        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->postJson('/api/assemblymembers/store', [
                'status' => 2,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_user_can_show_member(): void
    {
        $member = AssemblyMember::create([
            'store_id' => $this->store->id,
            'name'     => 'محمد المنصور',
            'status'   => 2,
        ]);

        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->getJson("/api/assemblymembers/{$member->id}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id'   => $member->id,
                'name' => 'محمد المنصور',
            ]);
    }

    public function test_user_can_update_member(): void
    {
        $member = AssemblyMember::create([
            'store_id' => $this->store->id,
            'name'     => 'صالح الدوسري',
            'status'   => 2,
        ]);

        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->postJson('/api/assemblymembers/update', [
                'id'     => $member->id,
                'name'   => 'صالح الدوسري المحدث',
                'status' => 1,
                'fees'   => 1200,
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('assembly_members', [
            'id'                => $member->id,
            'name'              => 'صالح الدوسري المحدث',
            'status'            => 1,
            'subscription_fees' => 1200,
        ]);
    }

    public function test_user_can_delete_member(): void
    {
        $member = AssemblyMember::create([
            'store_id' => $this->store->id,
            'name'     => 'عضو للحذف',
            'status'   => 2,
        ]);

        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->deleteJson("/api/assemblymembers/{$member->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('assembly_members', [
            'id' => $member->id,
        ]);
    }

    public function test_user_can_get_stats_and_dropdown(): void
    {
        AssemblyMember::create([
            'store_id'          => $this->store->id,
            'name'              => 'عضو 1',
            'status'            => 1,
            'subscription_fees' => 500,
        ]);

        AssemblyMember::create([
            'store_id'          => $this->store->id,
            'name'              => 'عضو 2',
            'status'            => 2,
            'subscription_fees' => 300,
        ]);

        $statsRes = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->getJson('/api/assemblymembers/stats');

        $statsRes->assertStatus(200)
            ->assertJsonPath('data.total_members', 2)
            ->assertJsonPath('data.board_members', 1)
            ->assertJsonPath('data.general_members', 1)
            ->assertJsonPath('data.total_fees', 800);

        $dropdownRes = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->getJson('/api/associationcommittee/components/assemblymembers');

        $dropdownRes->assertStatus(200);
        $this->assertCount(2, $dropdownRes->json());
    }
}
