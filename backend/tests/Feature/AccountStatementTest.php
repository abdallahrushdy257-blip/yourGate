<?php

namespace Tests\Feature;

use App\Models\ChartOfAccount;
use App\Models\JournalEntry;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AccountStatementTest extends TestCase
{
    use RefreshDatabase;

    protected Store $storeA;
    protected Store $storeB;
    protected User $userA;
    protected User $userB;
    protected ChartOfAccount $cashAccountA;
    protected ChartOfAccount $revenueAccountA;

    protected function setUp(): void
    {
        parent::setUp();

        $this->storeA = Store::create([
            'name'   => 'Store A Statements',
            'slug'   => 'store-a-statements',
            'status' => 'active',
        ]);
        $this->storeB = Store::create([
            'name'   => 'Store B Statements',
            'slug'   => 'store-b-statements',
            'status' => 'active',
        ]);

        $this->userA = User::factory()->create([
            'store_id' => $this->storeA->id,
            'email'    => 'userA@statements.com',
        ]);
        $this->userB = User::factory()->create([
            'store_id' => $this->storeB->id,
            'email'    => 'userB@statements.com',
        ]);

        $this->cashAccountA = ChartOfAccount::create([
            'store_id'        => $this->storeA->id,
            'code'            => '11101',
            'name'            => 'الصندوق العام',
            'level'           => 3,
            'is_payable'      => true,
            'account_type'    => 'asset',
            'nature'          => 'debit',
            'opening_balance' => 1000.00,
        ]);

        $this->revenueAccountA = ChartOfAccount::create([
            'store_id'        => $this->storeA->id,
            'code'            => '31101',
            'name'            => 'إيرادات عامة',
            'level'           => 3,
            'is_payable'      => true,
            'account_type'    => 'revenue',
            'nature'          => 'credit',
            'opening_balance' => 0,
        ]);

        // Post a balanced journal entry in Store A
        $entry = JournalEntry::create([
            'store_id'       => $this->storeA->id,
            'entry_number'   => 'JE-2026-0001',
            'date'           => '2026-11-02',
            'description'    => 'إيداع نقدي',
            'total_debit'    => 500,
            'total_credit'   => 500,
            'status'         => 'posted',
            'created_by'     => $this->userA->id,
        ]);

        $entry->lines()->create([
            'store_id'            => $this->storeA->id,
            'chart_of_account_id' => $this->cashAccountA->id,
            'debit'               => 500,
            'credit'              => 0,
            'description'         => 'طرف مدين',
            'line_order'          => 1,
        ]);

        $entry->lines()->create([
            'store_id'            => $this->storeA->id,
            'chart_of_account_id' => $this->revenueAccountA->id,
            'debit'               => 0,
            'credit'              => 500,
            'description'         => 'طرف دائن',
            'line_order'          => 2,
        ]);
    }

    public function test_user_can_fetch_general_accounts_statement(): void
    {
        Sanctum::actingAs($this->userA);

        $response = $this->getJson('/api/accountstatement/accounts');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'status',
                'success',
                'message',
                'opening_balance',
                'total_debit',
                'total_credit',
                'closing_balance',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'account',
                        'invoisnum',
                        'numtranzaction',
                        'entry_number',
                        'date',
                        'debit',
                        'credit',
                        'balance',
                    ],
                ],
            ]);

        $this->assertCount(2, $response->json('data'));
    }

    public function test_user_can_filter_statement_by_specific_account_with_running_balance(): void
    {
        Sanctum::actingAs($this->userA);

        $response = $this->getJson("/api/accountstatement/accounts?account_id={$this->cashAccountA->id}");

        $response->assertOk()
            ->assertJsonPath('account.id', $this->cashAccountA->id)
            ->assertJsonPath('opening_balance', 1000)
            ->assertJsonPath('total_debit', 500)
            ->assertJsonPath('total_credit', 0)
            ->assertJsonPath('closing_balance', 1500);

        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals(1500, $data[0]['balance']);
    }

    public function test_statements_are_isolated_by_tenant(): void
    {
        Sanctum::actingAs($this->userB);

        $response = $this->getJson('/api/accountstatement/accounts');

        $response->assertOk();
        $this->assertCount(0, $response->json('data'));
    }
}
