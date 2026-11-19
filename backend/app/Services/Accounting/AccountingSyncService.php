<?php

namespace App\Services\Accounting;

use App\Models\ChartOfAccount;
use App\Models\JournalEntry;
use Illuminate\Support\Facades\DB;

class AccountingSyncService
{
    public function __construct(
        protected JournalEntryService $journalEntryService
    ) {}

    /**
     * Record an automatic balanced double-entry journal entry for a receipt (cash in).
     */
    public function recordReceipt(array $params): ?JournalEntry
    {
        $amount = round((float) ($params['amount'] ?? 0), 2);
        if ($amount <= 0) {
            return null;
        }

        $storeId = $this->currentStoreId();
        if (! $storeId) {
            return null;
        }

        $debitAccount = $this->resolveCashOrBankAccount($params['account_id'] ?? $params['account'] ?? null);
        $creditAccount = $this->resolveRevenueAccount($params['revenue_code'] ?? null, $debitAccount->id);

        if (! $debitAccount || ! $creditAccount || $debitAccount->id === $creditAccount->id) {
            return null;
        }

        return $this->journalEntryService->store([
            'date'           => $params['date'] ?? now()->toDateString(),
            'description'    => $params['description'] ?? 'سند قبض تلقائي',
            'reference_type' => $params['reference_type'] ?? 'receipt_voucher',
            'reference_id'   => $params['reference_id'] ?? null,
            'lines'          => [
                [
                    'account_id'  => $debitAccount->id,
                    'debit'       => $amount,
                    'credit'      => 0,
                    'description' => $params['debit_description'] ?? ($params['description'] ?? 'تحصيل نقدي / بنكي'),
                ],
                [
                    'account_id'  => $creditAccount->id,
                    'debit'       => 0,
                    'credit'      => $amount,
                    'description' => $params['credit_description'] ?? ($params['description'] ?? 'إيرادات تبرعات وأنشطة'),
                ],
            ],
        ]);
    }

    /**
     * Record an automatic balanced double-entry journal entry for a payment (cash out).
     */
    public function recordPayment(array $params): ?JournalEntry
    {
        $amount = round((float) ($params['amount'] ?? 0), 2);
        if ($amount <= 0) {
            return null;
        }

        $storeId = $this->currentStoreId();
        if (! $storeId) {
            return null;
        }

        $creditAccount = $this->resolveCashOrBankAccount($params['account_id'] ?? $params['account'] ?? null);
        $debitAccount = $this->resolveExpenseAccount($params['expense_code'] ?? null, $creditAccount->id);

        if (! $debitAccount || ! $creditAccount || $debitAccount->id === $creditAccount->id) {
            return null;
        }

        return $this->journalEntryService->store([
            'date'           => $params['date'] ?? now()->toDateString(),
            'description'    => $params['description'] ?? 'سند صرف تلقائي',
            'reference_type' => $params['reference_type'] ?? 'payment_voucher',
            'reference_id'   => $params['reference_id'] ?? null,
            'lines'          => [
                [
                    'account_id'  => $debitAccount->id,
                    'debit'       => $amount,
                    'credit'      => 0,
                    'description' => $params['debit_description'] ?? ($params['description'] ?? 'مصروفات أنشطة وبرامج'),
                ],
                [
                    'account_id'  => $creditAccount->id,
                    'debit'       => 0,
                    'credit'      => $amount,
                    'description' => $params['credit_description'] ?? ($params['description'] ?? 'صرف نقدي / بنكي'),
                ],
            ],
        ]);
    }

    protected function resolveCashOrBankAccount($accountIdentifier = null): ChartOfAccount
    {
        if ($accountIdentifier) {
            if (is_numeric($accountIdentifier)) {
                $found = ChartOfAccount::where('is_payable', true)
                    ->where(fn ($q) => $q->where('id', (int) $accountIdentifier)->orWhere('code', (string) $accountIdentifier))
                    ->first();
                if ($found) {
                    return $found;
                }
            } else {
                $found = ChartOfAccount::where('is_payable', true)
                    ->where('name', 'like', '%' . trim((string) $accountIdentifier) . '%')
                    ->first();
                if ($found) {
                    return $found;
                }
            }
        }

        $cash = ChartOfAccount::where('is_payable', true)
            ->where(fn ($q) => $q->where('code', 'like', '111%')->orWhere('code', 'like', '11%'))
            ->orderBy('code')
            ->first();

        if ($cash) {
            return $cash;
        }

        return ChartOfAccount::firstOrCreate(
            ['code' => '11101001'],
            [
                'name'            => 'النقدية بالصندوق والبنوك',
                'name_en'         => 'Cash and Banks',
                'level'           => 5,
                'account_type'    => ChartOfAccount::TYPE_ASSET,
                'nature'          => ChartOfAccount::NATURE_DEBIT,
                'is_payable'      => true,
                'is_active'       => true,
                'is_system'       => true,
                'opening_balance' => 0,
            ]
        );
    }

    protected function resolveRevenueAccount(?string $codePrefix = null, ?int $excludeId = null): ChartOfAccount
    {
        if ($codePrefix) {
            $found = ChartOfAccount::where('is_payable', true)
                ->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))
                ->where('code', 'like', $codePrefix . '%')
                ->orderBy('code')
                ->first();
            if ($found) {
                return $found;
            }
        }

        $rev = ChartOfAccount::where('is_payable', true)
            ->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))
            ->where('code', 'like', '3%')
            ->orderBy('code')
            ->first();

        if ($rev) {
            return $rev;
        }

        return ChartOfAccount::firstOrCreate(
            ['code' => '31101001'],
            [
                'name'            => 'إيرادات التبرعات والأنشطة العامة',
                'name_en'         => 'General Donations & Activities Revenue',
                'level'           => 5,
                'account_type'    => ChartOfAccount::TYPE_REVENUE,
                'nature'          => ChartOfAccount::NATURE_CREDIT,
                'is_payable'      => true,
                'is_active'       => true,
                'is_system'       => true,
                'opening_balance' => 0,
            ]
        );
    }

    protected function resolveExpenseAccount(?string $codePrefix = null, ?int $excludeId = null): ChartOfAccount
    {
        if ($codePrefix) {
            $found = ChartOfAccount::where('is_payable', true)
                ->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))
                ->where('code', 'like', $codePrefix . '%')
                ->orderBy('code')
                ->first();
            if ($found) {
                return $found;
            }
        }

        $exp = ChartOfAccount::where('is_payable', true)
            ->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))
            ->where('code', 'like', '4%')
            ->orderBy('code')
            ->first();

        if ($exp) {
            return $exp;
        }

        return ChartOfAccount::firstOrCreate(
            ['code' => '41101001'],
            [
                'name'            => 'مصروفات البرامج والمساعدات والأنشطة',
                'name_en'         => 'Programs & Assistance Expenses',
                'level'           => 5,
                'account_type'    => ChartOfAccount::TYPE_EXPENSE,
                'nature'          => ChartOfAccount::NATURE_DEBIT,
                'is_payable'      => true,
                'is_active'       => true,
                'is_system'       => true,
                'opening_balance' => 0,
            ]
        );
    }

    protected function currentStoreId(): ?int
    {
        if (app()->has('current_store_id')) {
            return (int) app('current_store_id');
        }

        return auth('sanctum')->user()?->store_id ?? auth()->user()?->store_id;
    }
}
