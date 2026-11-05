<?php

namespace Tests\Feature;

use App\Models\ChartOfAccount;
use App\Models\Store;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GeneralVoucherTest extends TestCase
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
            'name'   => 'Store Alpha',
            'slug'   => 'store-alpha-vouchers',
            'status' => 'active',
        ]);
        $this->storeB = Store::create([
            'name'   => 'Store Beta',
            'slug'   => 'store-beta-vouchers',
            'status' => 'active',
        ]);

        $this->userA = User::factory()->create([
            'store_id' => $this->storeA->id,
            'email'    => 'alpha@example.com',
        ]);
        $this->userB = User::factory()->create([
            'store_id' => $this->storeB->id,
            'email'    => 'beta@example.com',
        ]);

        // Create leaf payable accounts for Store A
        $this->cashAccountA = ChartOfAccount::create([
            'store_id'        => $this->storeA->id,
            'code'            => '11101',
            'name'            => 'الصندوق العام',
            'level'           => 3,
            'is_payable'      => true,
            'account_type'    => 'asset',
            'nature'          => 'debit',
            'opening_balance' => 0,
        ]);

        $this->revenueAccountA = ChartOfAccount::create([
            'store_id'        => $this->storeA->id,
            'code'            => '31101',
            'name'            => 'تبرعات عامة نقدية',
            'level'           => 3,
            'is_payable'      => true,
            'account_type'    => 'revenue',
            'nature'          => 'credit',
            'opening_balance' => 0,
        ]);
    }

    public function test_user_can_fetch_from_accounts_list(): void
    {
        $response = $this->actingAs($this->userA, 'sanctum')
            ->getJson('/api/generalvoucher/fromaccount');

        $response->assertOk();
        $this->assertIsArray($response->json());
        $this->assertNotEmpty($response->json());
        $this->assertEquals('11101', $response->json()[0]['code']);
    }

    public function test_user_can_create_receipt_voucher_and_it_posts_journal_entry(): void
    {
        $payload = [
            'amount'       => 2500.50,
            'date'         => '2026-11-02',
            'description'  => 'استلام تبرع نقدي لصالح كفالة الأيتام',
            'type'         => '5', // نقدي
            'fromaccount'  => $this->cashAccountA->id,
            'toaccount'    => $this->revenueAccountA->id,
            'typevoucher'  => '2', // غير مقيدة
            'voucher_type' => 'receipt',
        ];

        $response = $this->actingAs($this->userA, 'sanctum')
            ->postJson('/api/generalvoucher/storecashvoucher', $payload);

        $response->assertCreated();
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('data.amount', 2500.50);

        // Verify voucher record
        $voucher = Voucher::withoutGlobalScopes()->where('store_id', $this->storeA->id)->first();
        $this->assertNotNull($voucher);
        $this->assertEquals('receipt', $voucher->voucher_type);
        $this->assertEquals(2500.50, (float) $voucher->amount);
        $this->assertEquals('posted', $voucher->status);
        $this->assertStringStartsWith('RV-2026-', $voucher->voucher_number);
        $this->assertNotNull($voucher->journal_entry_id);

        // Verify corresponding double-entry journal entry
        $entry = $voucher->journalEntry;
        $this->assertNotNull($entry);
        $this->assertEquals(2500.50, (float) $entry->total_debit);
        $this->assertEquals(2500.50, (float) $entry->total_credit);
        $this->assertEquals('posted', $entry->status);
        $this->assertCount(2, $entry->lines);

        // Line 1: Debit Cash Account
        $debitLine = $entry->lines->firstWhere('chart_of_account_id', $this->cashAccountA->id);
        $this->assertNotNull($debitLine);
        $this->assertEquals(2500.50, (float) $debitLine->debit);
        $this->assertEquals(0, (float) $debitLine->credit);

        // Line 2: Credit Revenue Account
        $creditLine = $entry->lines->firstWhere('chart_of_account_id', $this->revenueAccountA->id);
        $this->assertNotNull($creditLine);
        $this->assertEquals(0, (float) $creditLine->debit);
        $this->assertEquals(2500.50, (float) $creditLine->credit);
    }

    public function test_voucher_creation_validation_fails_on_zero_amount(): void
    {
        $payload = [
            'amount'      => 0,
            'date'        => '2026-11-02',
            'fromaccount' => $this->cashAccountA->id,
            'toaccount'   => $this->revenueAccountA->id,
        ];

        $response = $this->actingAs($this->userA, 'sanctum')
            ->postJson('/api/generalvoucher/storecashvoucher', $payload);

        $response->assertStatus(422);
    }

    public function test_vouchers_are_isolated_by_store(): void
    {
        Voucher::create([
            'store_id'          => $this->storeA->id,
            'voucher_number'    => 'RV-2026-0001',
            'voucher_type'      => 'receipt',
            'payment_method'    => 'cash',
            'date'              => '2026-11-02',
            'amount'            => 1000,
            'debit_account_id'  => $this->cashAccountA->id,
            'credit_account_id' => $this->revenueAccountA->id,
            'status'            => 'posted',
        ]);

        // User B from store B should not see store A's voucher
        $response = $this->actingAs($this->userB, 'sanctum')
            ->getJson('/api/generalvouchers');

        $response->assertOk();
        $this->assertCount(0, $response->json('data'));
    }

    public function test_user_can_create_payment_voucher_and_it_posts_journal_entry(): void
    {
        $expenseAccount = ChartOfAccount::create([
            'store_id'        => $this->storeA->id,
            'code'            => '41101',
            'name'            => 'مصروفات صيانة دورية',
            'level'           => 3,
            'is_payable'      => true,
            'account_type'    => 'expense',
            'nature'          => 'debit',
            'opening_balance' => 0,
        ]);

        $payload = [
            'amount'       => 1800.00,
            'date'         => '2026-11-02',
            'description'  => 'سداد مصروفات صيانة المقر نقداً',
            'type'         => '5', // نقدي
            'fromaccount'  => $this->cashAccountA->id,
            'toaccount'    => $expenseAccount->id,
            'typevoucher'  => '2',
            'voucher_type' => 'payment',
        ];

        $response = $this->actingAs($this->userA, 'sanctum')
            ->postJson('/api/generalvoucher/storepaymentvoucher', $payload);

        $response->assertCreated();
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('data.amount', 1800);

        $voucher = Voucher::withoutGlobalScopes()->where('store_id', $this->storeA->id)
            ->where('voucher_type', 'payment')
            ->first();

        $this->assertNotNull($voucher);
        $this->assertEquals('payment', $voucher->voucher_type);
        $this->assertStringStartsWith('PV-2026-', $voucher->voucher_number);

        $entry = $voucher->journalEntry;
        $this->assertNotNull($entry);
        $this->assertEquals(1800, (float) $entry->total_debit);
        $this->assertEquals(1800, (float) $entry->total_credit);

        // In payment voucher: Expense is debited, Cash is credited
        $debitExpense = $entry->lines->firstWhere('chart_of_account_id', $expenseAccount->id);
        $this->assertNotNull($debitExpense);
        $this->assertEquals(1800, (float) $debitExpense->debit);

        $creditCash = $entry->lines->firstWhere('chart_of_account_id', $this->cashAccountA->id);
        $this->assertNotNull($creditCash);
        $this->assertEquals(1800, (float) $creditCash->credit);
    }
}
