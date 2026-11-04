<?php

namespace Tests\Feature;

use App\Models\ChartOfAccount;
use App\Models\JournalEntry;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BalanceSheetTest extends TestCase
{
    use RefreshDatabase;

    protected Store $storeA;
    protected Store $storeB;
    protected User $userA;
    protected User $userB;
    protected ChartOfAccount $cashAccountA;
    protected ChartOfAccount $equityAccountA;

    protected function setUp(): void
    {
        parent::setUp();

        $this->storeA = Store::create([
            'name'   => 'جمعية البر والإحسان',
            'slug'   => 'al-birr-store',
            'status' => 'active',
        ]);
        $this->storeB = Store::create([
            'name'   => 'جمعية العطاء',
            'slug'   => 'al-ataa-store',
            'status' => 'active',
        ]);

        $this->userA = User::factory()->create([
            'store_id' => $this->storeA->id,
            'email'    => 'admin@albirr.org',
        ]);
        $this->userB = User::factory()->create([
            'store_id' => $this->storeB->id,
            'email'    => 'admin@alataa.org',
        ]);

        $this->cashAccountA = ChartOfAccount::create([
            'store_id'        => $this->storeA->id,
            'code'            => '11101',
            'name'            => 'الصندوق العام',
            'level'           => 3,
            'is_payable'      => true,
            'account_type'    => 'asset',
            'nature'          => 'debit',
            'opening_balance' => 5000.00,
        ]);

        $this->equityAccountA = ChartOfAccount::create([
            'store_id'        => $this->storeA->id,
            'code'            => '23101',
            'name'            => 'رأس المال / صافي أصول غير مقيدة',
            'level'           => 3,
            'is_payable'      => true,
            'account_type'    => 'net_assets',
            'nature'          => 'credit',
            'opening_balance' => 5000.00,
        ]);
    }

    public function test_user_can_fetch_balance_sheet_structure(): void
    {
        Sanctum::actingAs($this->userA);

        $response = $this->getJson('/api/generalbudget');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'status',
                'success',
                'as_of_date',
                'organization_name',
                'debt' => [
                    'cash',
                    'other_debt_account',
                    'endowments',
                ],
                'credit' => [
                    'cash',
                    'shortterm_loans',
                    'net_unrestricted_assets',
                ],
                'totals' => [
                    'current_assets',
                    'total_assets',
                    'total_liabilities',
                    'total_net_assets',
                    'total_liabilities_and_net_assets',
                    'is_balanced',
                ],
            ]);

        $this->assertEquals(5000, $response->json('totals.total_assets'));
        $this->assertEquals(5000, $response->json('totals.total_liabilities_and_net_assets'));
        $this->assertTrue($response->json('totals.is_balanced'));
    }

    public function test_balance_sheet_reflects_posted_journal_entry(): void
    {
        Sanctum::actingAs($this->userA);

        $revenueAccount = ChartOfAccount::create([
            'store_id'        => $this->storeA->id,
            'code'            => '31101',
            'name'            => 'إيرادات عامة',
            'level'           => 3,
            'is_payable'      => true,
            'account_type'    => 'revenue',
            'nature'          => 'credit',
            'opening_balance' => 0,
        ]);

        // Post an entry: Debit Cash 2000, Credit Revenue 2000
        $entry = JournalEntry::create([
            'store_id'     => $this->storeA->id,
            'entry_number' => 'JE-2026-0099',
            'date'         => '2026-11-02',
            'description'  => 'تحصيل إيراد نقدي',
            'total_debit'  => 2000,
            'total_credit' => 2000,
            'status'       => 'posted',
            'created_by'   => $this->userA->id,
        ]);

        $entry->lines()->create([
            'store_id'            => $this->storeA->id,
            'chart_of_account_id' => $this->cashAccountA->id,
            'debit'               => 2000,
            'credit'              => 0,
            'line_order'          => 1,
        ]);

        $entry->lines()->create([
            'store_id'            => $this->storeA->id,
            'chart_of_account_id' => $revenueAccount->id,
            'debit'               => 0,
            'credit'              => 2000,
            'line_order'          => 2,
        ]);

        $response = $this->getJson('/api/balancesheet');

        $response->assertOk();
        // Total assets = 5000 opening + 2000 = 7000
        $this->assertEquals(7000, $response->json('totals.total_assets'));
        // Total liabilities & net assets = 5000 opening + 2000 surplus = 7000
        $this->assertEquals(7000, $response->json('totals.total_liabilities_and_net_assets'));
        $this->assertTrue($response->json('totals.is_balanced'));
    }

    public function test_balance_sheet_is_isolated_by_store(): void
    {
        Sanctum::actingAs($this->userB);

        $response = $this->getJson('/api/generalbudget');

        $response->assertOk();
        // Store B has no accounts/entries
        $this->assertEquals(0, $response->json('totals.total_assets'));
    }
}
