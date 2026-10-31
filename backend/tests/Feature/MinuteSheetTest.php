<?php

namespace Tests\Feature;

use App\Models\AssemblyMember;
use App\Models\Committee;
use App\Models\MinuteSheet;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MinuteSheetTest extends TestCase
{
    use RefreshDatabase;

    protected Store $store;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');

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

    public function test_user_can_list_minute_sheets_filtered_by_store(): void
    {
        MinuteSheet::create([
            'store_id' => $this->store->id,
            'title'    => 'محضر اجتماع الجمعية العمومية الأول',
            'date'     => '2026-10-01',
            'type'     => 1,
            'reason'   => 1,
        ]);

        $otherStore = Store::create([
            'name'   => 'جمعية أخرى',
            'slug'   => 'other-assoc',
            'status' => 'active',
        ]);

        MinuteSheet::withoutGlobalScopes()->create([
            'store_id' => $otherStore->id,
            'title'    => 'محضر متجر غريب',
            'date'     => '2026-10-02',
            'type'     => 2,
        ]);

        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->postJson('/api/minutesheets');

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['title' => 'محضر اجتماع الجمعية العمومية الأول'])
            ->assertJsonMissing(['title' => 'محضر متجر غريب']);
    }

    public function test_user_can_create_minute_sheet_with_attendees_and_file(): void
    {
        $member = AssemblyMember::create([
            'store_id' => $this->store->id,
            'name'     => 'د. أحمد السالم',
            'status'   => 1,
        ]);

        $committee = Committee::create([
            'store_id' => $this->store->id,
            'name'     => 'اللجنة التنفيذية',
        ]);

        $file = UploadedFile::fake()->create('minutes.pdf', 500, 'application/pdf');

        $payload = [
            'title'     => 'محضر اجتماع مجلس الإدارة رقم 3',
            'date'      => '2026-10-15',
            'type'      => 2,
            'reason'    => 3,
            'note'      => 'مناقشة الميزانية الختامية والمشاريع القادمة',
            'attendees' => json_encode([['value' => $member->id]]),
            'committee' => json_encode([['value' => $committee->id]]),
            'file'      => $file,
        ];

        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->post('/api/minutesheets/store', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'محضر اجتماع مجلس الإدارة رقم 3');

        $this->assertDatabaseHas('minute_sheets', [
            'store_id' => $this->store->id,
            'title'    => 'محضر اجتماع مجلس الإدارة رقم 3',
            'type'     => 2,
        ]);

        $this->assertDatabaseHas('minute_sheet_attendees', [
            'store_id'           => $this->store->id,
            'assembly_member_id' => $member->id,
            'committee_id'       => $committee->id,
        ]);
    }

    public function test_create_minute_sheet_validation_fails_without_title(): void
    {
        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->postJson('/api/minutesheets/store', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['title']);
    }

    public function test_user_can_show_minute_sheet(): void
    {
        $minute = MinuteSheet::create([
            'store_id' => $this->store->id,
            'title'    => 'محضر تفصيلي',
            'date'     => '2026-10-10',
            'type'     => 1,
        ]);

        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->getJson("/api/minutesheets/{$minute->id}");

        $response->assertOk()
            ->assertJsonPath('id', $minute->id)
            ->assertJsonPath('title', 'محضر تفصيلي');
    }

    public function test_user_can_update_minute_sheet_and_attendees(): void
    {
        $minute = MinuteSheet::create([
            'store_id' => $this->store->id,
            'title'    => 'محضر قديم',
            'date'     => '2026-10-01',
        ]);

        $payload = [
            'title' => 'محضر معدل وجديد',
            'note'  => 'ملاحظات تم تحديثها',
        ];

        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->postJson("/api/minutesheets/update/{$minute->id}", $payload);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'محضر معدل وجديد');

        $this->assertDatabaseHas('minute_sheets', [
            'id'    => $minute->id,
            'title' => 'محضر معدل وجديد',
            'note'  => 'ملاحظات تم تحديثها',
        ]);
    }

    public function test_user_can_delete_minute_sheet(): void
    {
        $minute = MinuteSheet::create([
            'store_id' => $this->store->id,
            'title'    => 'محضر للحذف',
        ]);

        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->deleteJson("/api/minutesheets/{$minute->id}");

        $response->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('minute_sheets', ['id' => $minute->id]);
    }

    public function test_user_can_get_minute_sheet_stats(): void
    {
        MinuteSheet::create([
            'store_id' => $this->store->id,
            'title'    => 'محضر جمعية',
            'type'     => 1,
        ]);

        MinuteSheet::create([
            'store_id' => $this->store->id,
            'title'    => 'محضر مجلس',
            'type'     => 2,
        ]);

        $response = $this->actingAs($this->user)
            ->withHeader('X-Store-ID', (string) $this->store->id)
            ->getJson('/api/minutesheets/stats');

        $response->assertOk()
            ->assertJsonPath('data.total_minutes', 2)
            ->assertJsonPath('data.assembly_minutes', 1)
            ->assertJsonPath('data.board_minutes', 1);
    }
}
