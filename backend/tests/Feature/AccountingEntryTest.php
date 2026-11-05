<?php

namespace Tests\Feature;

use App\Models\ChartOfAccount;
use App\Models\JournalEntry;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AccountingEntryTest extends TestCase
{
    use RefreshDatabase;

    protected Store $storeA;
    protected Store $storeB;
    protected User $userA;
    protected User $userB;
    protected ChartOfAccount $cashAccountA;
    protected ChartOfAccount $bankAccountA;
    protected ChartOfAccount $salesAccountA;
    protected ChartOfAccount $parentAccountA;

    protected function setUp(): void
    {
        parent::setUp();

        $this->storeA = Store::create([
            'name'   => 'متجر أ للقيود',
            'slug'   => 'store-a-entries',
            'status' => 'active',
        ]);

        $this->storeB = Store::create([
            'name'   => 'متجر ب للقيود',
            'slug'   => 'store-b-entries',
            'status' => 'active',
        ]);

        $this->userA = User::factory()->create([
            'store_id' => $this->storeA->id,
            'email'    => 'admin@store-a-entries.com',
        ]);

        $this->userB = User::factory()->create([
            'store_id' => $this->storeB->id,
            'email'    => 'admin@store-b-entries.com',
        ]);

        // Seed Store A default chart of accounts
        Sanctum::actingAs($this->userA);
        $this->getJson('/api/chartofaccounts');

        $this->parentAccountA = ChartOfAccount::where('store_id', $this->storeA->id)
            ->where('code', '111')
            ->firstOrFail(); // Parent: النقدية وما في حكمها (is_payable = false)

        $this->cashAccountA = ChartOfAccount::where('store_id', $this->storeA->id)
            ->where('code', '11102001')
            ->firstOrFail(); // Leaf payable

        $this->bankAccountA = ChartOfAccount::where('store_id', $this->storeA->id)
            ->where('code', '11103001')
            ->firstOrFail(); // Leaf payable

        $this->salesAccountA = ChartOfAccount::where('store_id', $this->storeA->id)
            ->where('is_payable', true)
            ->where(function ($q) {
                $q->where('code', 'like', '3%')->orWhere('code', 'like', '4%');
            })
            ->firstOrFail();
    }

    public function test_user_can_create_balanced_simple_entry(): void
    {
        Sanctum::actingAs($this->userA);

        $payload = [
            'date'        => '2026-11-02',
            'description' => 'إيداع نقدي بالبنك',
            'lines'       => [
                [
                    'account_id'  => $this->bankAccountA->id,
                    'debit'       => 1500.00,
                    'credit'      => 0,
                    'description' => 'طرف مدين',
                ],
                [
                    'account_id'  => $this->cashAccountA->id,
                    'debit'       => 0,
                    'credit'      => 1500.00,
                    'description' => 'طرف دائن',
                ],
            ],
        ];

        $response = $this->postJson('/api/transactions/generalentry', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('status', 200)
            ->assertJsonPath('data.total_debit', 1500)
            ->assertJsonPath('data.total_credit', 1500);

        $this->assertDatabaseHas('journal_entries', [
            'store_id'     => $this->storeA->id,
            'total_debit'  => 1500.00,
            'total_credit' => 1500.00,
            'status'       => 'posted',
        ]);

        $this->assertDatabaseCount('journal_entry_lines', 2);
    }

    public function test_user_can_create_compound_multi_line_entry(): void
    {
        Sanctum::actingAs($this->userA);

        $payload = [
            'date'        => '2026-11-02',
            'description' => 'قيد مركب مبيعات وتوزيع نقدي وبنكي',
            'lines'       => [
                [
                    'account_id'  => $this->cashAccountA->id,
                    'debit'       => 600.00,
                    'credit'      => 0,
                ],
                [
                    'account_id'  => $this->bankAccountA->id,
                    'debit'       => 400.00,
                    'credit'      => 0,
                ],
                [
                    'account_id'  => $this->salesAccountA->id,
                    'debit'       => 0,
                    'credit'      => 1000.00,
                ],
            ],
        ];

        $response = $this->postJson('/api/transactions/generalentry', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total_debit', 1000)
            ->assertJsonPath('data.total_credit', 1000);

        $this->assertDatabaseCount('journal_entry_lines', 3);
    }

    public function test_unbalanced_entry_is_rejected(): void
    {
        Sanctum::actingAs($this->userA);

        $payload = [
            'date'        => '2026-11-02',
            'description' => 'قيد غير متوازن',
            'lines'       => [
                [
                    'account_id'  => $this->bankAccountA->id,
                    'debit'       => 1000.00,
                    'credit'      => 0,
                ],
                [
                    'account_id'  => $this->cashAccountA->id,
                    'debit'       => 0,
                    'credit'      => 800.00, // Difference 200
                ],
            ],
        ];

        $response = $this->postJson('/api/transactions/generalentry', $payload);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_entry_on_parent_rollup_account_is_rejected(): void
    {
        Sanctum::actingAs($this->userA);

        $payload = [
            'date'        => '2026-11-02',
            'description' => 'محاولة قيد على حساب أب رئيسي',
            'lines'       => [
                [
                    'account_id'  => $this->parentAccountA->id, // is_payable = false
                    'debit'       => 500.00,
                    'credit'      => 0,
                ],
                [
                    'account_id'  => $this->cashAccountA->id,
                    'debit'       => 0,
                    'credit'      => 500.00,
                ],
            ],
        ];

        $response = $this->postJson('/api/transactions/generalentry', $payload);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_legacy_form_keys_payload_supported(): void
    {
        Sanctum::actingAs($this->userA);

        $payload = [
            'date'          => '2026-11-02',
            'description'   => 'قيد بنموذج قديم',
            'accountdebit'  => $this->bankAccountA->id,
            'accountcredit' => $this->cashAccountA->id,
            'debit'         => 350.00,
            'credit'        => 350.00,
        ];

        $response = $this->postJson('/api/transactions/generalentry', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total_debit', 350);
    }

    public function test_entries_are_isolated_between_tenants(): void
    {
        Sanctum::actingAs($this->userA);

        // Store A creates an entry
        $createRes = $this->postJson('/api/transactions/generalentry', [
            'date'        => '2026-11-02',
            'description' => 'قيد خاص بالمتجر أ',
            'lines'       => [
                ['account_id' => $this->bankAccountA->id, 'debit' => 200, 'credit' => 0],
                ['account_id' => $this->cashAccountA->id, 'debit' => 0, 'credit' => 200],
            ],
        ]);
        $entryId = $createRes->json('data.id');

        // Store A sees 1 entry in listing
        $listA = $this->getJson('/api/transactions');
        $this->assertCount(1, $listA->json());

        // Store B logs in
        Sanctum::actingAs($this->userB);

        // Store B sees 0 entries
        $listB = $this->getJson('/api/transactions');
        $this->assertCount(0, $listB->json());

        // Store B cannot access Store A's entry
        $viewRes = $this->getJson("/api/transactions/{$entryId}");
        $viewRes->assertStatus(404);

        // Store B cannot delete Store A's entry
        $deleteRes = $this->deleteJson("/api/transactions/{$entryId}");
        $deleteRes->assertStatus(404);
    }

    public function test_user_can_view_single_entry_with_legacy_and_modern_structures(): void
    {
        Sanctum::actingAs($this->userA);

        $createRes = $this->postJson('/api/transactions/generalentry', [
            'date'        => '2026-11-02',
            'description' => 'قيد للعرض',
            'lines'       => [
                ['account_id' => $this->bankAccountA->id, 'debit' => 750, 'credit' => 0],
                ['account_id' => $this->cashAccountA->id, 'debit' => 0, 'credit' => 750],
            ],
        ]);
        $entryId = $createRes->json('data.id');

        $response = $this->getJson("/api/transactions/{$entryId}");

        $response->assertStatus(200)
            ->assertJsonPath('id', $entryId)
            ->assertJsonPath('registration_number', $createRes->json('data.entry_number'))
            ->assertJsonPath('debt_amount', 750)
            ->assertJsonPath('credit_amount', 750)
            ->assertJsonPath('debitaccount.id', $this->bankAccountA->id)
            ->assertJsonPath('creditaccount.id', $this->cashAccountA->id)
            ->assertJsonStructure([
                'id',
                'entry_number',
                'registration_number',
                'date',
                'lines' => [
                    '*' => ['id', 'account_id', 'account_number', 'account_name', 'debit', 'credit'],
                ],
            ]);
    }

    public function test_user_can_delete_journal_entry(): void
    {
        Sanctum::actingAs($this->userA);

        $createRes = $this->postJson('/api/transactions/generalentry', [
            'date'        => '2026-11-02',
            'description' => 'قيد سيتم حذفه',
            'lines'       => [
                ['account_id' => $this->bankAccountA->id, 'debit' => 500, 'credit' => 0],
                ['account_id' => $this->cashAccountA->id, 'debit' => 0, 'credit' => 500],
            ],
        ]);
        $entryId = $createRes->json('data.id');

        $deleteRes = $this->deleteJson("/api/transactions/{$entryId}");
        $deleteRes->assertStatus(200);

        $this->assertSoftDeleted('journal_entries', ['id' => $entryId]);
    }

    public function test_user_can_update_journal_entry(): void
    {
        Sanctum::actingAs($this->userA);

        $createRes = $this->postJson('/api/transactions/generalentry', [
            'date'        => '2026-11-02',
            'description' => 'قيد قبل التعديل',
            'lines'       => [
                ['account_id' => $this->bankAccountA->id, 'debit' => 300, 'credit' => 0],
                ['account_id' => $this->cashAccountA->id, 'debit' => 0, 'credit' => 300],
            ],
        ]);
        $entryId = $createRes->json('data.id');

        $updateRes = $this->putJson("/api/transactions/{$entryId}", [
            'date'        => '2026-11-03',
            'description' => 'قيد بعد التعديل',
            'lines'       => [
                ['account_id' => $this->bankAccountA->id, 'debit' => 500, 'credit' => 0],
                ['account_id' => $this->cashAccountA->id, 'debit' => 0, 'credit' => 500],
            ],
        ]);

        $updateRes->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total_debit', 500)
            ->assertJsonPath('data.description', 'قيد بعد التعديل');
    }

    public function test_account_balance_reflects_posted_journal_entry(): void
    {
        Sanctum::actingAs($this->userA);

        // Before posting entry, balance is 0
        $treeBefore = $this->getJson('/api/chartofaccounts')->json('data');
        $cashBefore = collect($treeBefore)
            ->firstWhere('code', '1')['children'][0]['children'][0] ?? null;

        // Post an entry: Debit Bank 1200, Credit Cash 1200
        $this->postJson('/api/transactions/generalentry', [
            'date'        => '2026-11-02',
            'description' => 'حركة محاسبية تؤثر على الأرصدة',
            'lines'       => [
                ['account_id' => $this->bankAccountA->id, 'debit' => 1200, 'credit' => 0],
                ['account_id' => $this->cashAccountA->id, 'debit' => 0, 'credit' => 1200],
            ],
        ]);

        // Check account balances via entry listing
        $entryList = $this->getJson('/api/accounttree/entry')->json();
        $bankAcc = collect($entryList)->firstWhere('id', $this->bankAccountA->id);
        $cashAcc = collect($entryList)->firstWhere('id', $this->cashAccountA->id);

        $this->assertEquals(1200, $bankAcc['final_balance']);
        $this->assertEquals(-1200, $cashAcc['final_balance']);
    }
}
