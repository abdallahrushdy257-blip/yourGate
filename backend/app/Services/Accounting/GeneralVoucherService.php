<?php

namespace App\Services\Accounting;

use App\Models\ChartOfAccount;
use App\Models\Voucher;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class GeneralVoucherService
{
    public function __construct(
        protected JournalEntryService $journalEntryService
    ) {}

    /**
     * List all vouchers with filters.
     */
    public function list(array $filters = []): Collection
    {
        $query = Voucher::with(['debitAccount', 'creditAccount', 'journalEntry'])
            ->latest('id');

        if (! empty($filters['type'])) {
            $query->where('voucher_type', $filters['type']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('voucher_number', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return $query->get();
    }

    /**
     * Get cash and bank payable accounts for vouchers.
     */
    public function getCashAndBankAccounts(): Collection
    {
        // Look for leaf accounts under Cash & Bank (code 111 or starting with 111 or 11)
        $cashAccounts = ChartOfAccount::query()
            ->where('is_payable', true)
            ->where(function ($q) {
                $q->where('code', 'like', '111%')
                  ->orWhere('code', 'like', '11%')
                  ->orWhere('code', 'like', '1%');
            })
            ->orderBy('code')
            ->get();

        if ($cashAccounts->isEmpty()) {
            $cashAccounts = ChartOfAccount::query()
                ->where('is_payable', true)
                ->orderBy('code')
                ->get();
        }

        return $cashAccounts;
    }

    /**
     * Get donation and revenue accounts.
     */
    public function getRevenueAccounts(): Collection
    {
        // Accounts under Revenues (code starting with 3 or 4) or all payable
        $revAccounts = ChartOfAccount::query()
            ->where('is_payable', true)
            ->where('code', 'like', '3%')
            ->orderBy('code')
            ->get();

        if ($revAccounts->isEmpty()) {
            $revAccounts = ChartOfAccount::query()
                ->where('is_payable', true)
                ->orderBy('code')
                ->get();
        }

        return $revAccounts;
    }

    /**
     * Generate the next sequential voucher number (RV-YYYY-0001 or PV-YYYY-0001).
     */
    public function generateVoucherNumber(string $type = 'receipt', ?string $date = null): string
    {
        $year = $date ? substr($date, 0, 4) : date('Y');
        $prefix = ($type === 'payment') ? "PV-{$year}-" : "RV-{$year}-";

        $lastNumber = Voucher::query()
            ->where('voucher_type', $type)
            ->where('voucher_number', 'like', "{$prefix}%")
            ->orderByDesc('id')
            ->value('voucher_number');

        if ($lastNumber && preg_match('/(\d+)$/', $lastNumber, $m)) {
            $seq = (int) $m[1] + 1;
        } else {
            $seq = 1;
        }

        return $prefix . str_pad((string) $seq, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Store and post a general voucher with linked double-entry journal entry.
     */
    public function store(array $data): Voucher
    {
        $voucherType = $data['voucher_type'] ?? 'receipt';
        $amount = (float) ($data['amount'] ?? 0);

        if ($amount <= 0) {
            throw new InvalidArgumentException('مبلغ السند يجب أن يكون أكبر من الصفر.');
        }

        $debitAccountId = (int) ($data['debit_account_id'] ?? 0);
        $creditAccountId = (int) ($data['credit_account_id'] ?? 0);

        if (! $debitAccountId || ! $creditAccountId) {
            throw new InvalidArgumentException('يجب تحديد الحساب المدين والحساب الدائن.');
        }

        if ($debitAccountId === $creditAccountId) {
            throw new InvalidArgumentException('لا يمكن أن يكون الحساب المدين والدائن نفس الحساب.');
        }

        return DB::transaction(function () use ($data, $voucherType, $amount, $debitAccountId, $creditAccountId) {
            $voucherNumber = $this->generateVoucherNumber($voucherType, $data['date'] ?? null);

            $voucher = Voucher::create([
                'voucher_number'    => $voucherNumber,
                'voucher_type'      => $voucherType,
                'payment_method'    => $data['payment_method'] ?? 'cash',
                'date'              => $data['date'] ?? now()->toDateString(),
                'amount'            => $amount,
                'debit_account_id'  => $debitAccountId,
                'credit_account_id' => $creditAccountId,
                'description'       => $data['description'] ?? null,
                'category'          => $data['category'] ?? 'unrestricted',
                'status'            => 'posted',
                'created_by'        => Auth::id(),
            ]);

            // Create corresponding double-entry Journal Entry
            $typeLabel = $voucherType === 'receipt' ? 'سند قبض' : 'سند صرف';
            $entryDescription = "{$typeLabel} رقم {$voucherNumber}" . ($voucher->description ? " - {$voucher->description}" : '');

            $journalEntry = $this->journalEntryService->store([
                'date'           => $voucher->date->format('Y-m-d'),
                'description'    => $entryDescription,
                'reference_type' => $voucherType === 'receipt' ? 'receipt_voucher' : 'payment_voucher',
                'lines'          => [
                    [
                        'account_id'  => $debitAccountId,
                        'debit'       => $amount,
                        'credit'      => 0,
                        'description' => "طرف مدين - {$typeLabel} {$voucherNumber}",
                    ],
                    [
                        'account_id'  => $creditAccountId,
                        'debit'       => 0,
                        'credit'      => $amount,
                        'description' => "طرف دائن - {$typeLabel} {$voucherNumber}",
                    ],
                ],
            ]);

            $voucher->update(['journal_entry_id' => $journalEntry->id]);

            return $voucher->fresh(['debitAccount', 'creditAccount', 'journalEntry']);
        });
    }

    /**
     * Find voucher by ID.
     */
    public function find(int $id): Voucher
    {
        return Voucher::with(['debitAccount', 'creditAccount', 'journalEntry'])
            ->findOrFail($id);
    }
}
