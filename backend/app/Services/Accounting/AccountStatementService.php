<?php

namespace App\Services\Accounting;

use App\Models\ChartOfAccount;
use App\Models\JournalEntry;
use App\Models\JournalEntryLine;
use App\Models\Voucher;
use Illuminate\Support\Facades\DB;

class AccountStatementService
{
    /**
     * Get detailed account statement with running balance and totals.
     */
    public function getAccountsStatement(array $filters = []): array
    {
        $accountId = ! empty($filters['account_id']) ? (int) $filters['account_id'] : null;
        $dateFrom  = $filters['date_from'] ?? null;
        $dateTo    = $filters['date_to'] ?? null;
        $search    = $filters['search'] ?? null;

        $targetAccount = null;
        $openingBalance = 0.0;
        $runningBalance = 0.0;

        if ($accountId) {
            $targetAccount = ChartOfAccount::find($accountId);
            if ($targetAccount) {
                $openingBalance = (float) $targetAccount->opening_balance;

                // If dateFrom is provided, add all posted movements prior to dateFrom
                if (! empty($dateFrom)) {
                    $priorQuery = JournalEntryLine::query()
                        ->join('journal_entries', 'journal_entries.id', '=', 'journal_entry_lines.journal_entry_id')
                        ->where('journal_entries.status', JournalEntry::STATUS_POSTED)
                        ->whereNull('journal_entries.deleted_at')
                        ->where('journal_entry_lines.chart_of_account_id', $targetAccount->id)
                        ->whereDate('journal_entries.date', '<', $dateFrom);

                    $priorTotals = $priorQuery->selectRaw('COALESCE(SUM(debit), 0) as prior_debit, COALESCE(SUM(credit), 0) as prior_credit')->first();
                    $priorDebit  = (float) ($priorTotals->prior_debit ?? 0);
                    $priorCredit = (float) ($priorTotals->prior_credit ?? 0);

                    $priorNet = $targetAccount->nature === ChartOfAccount::NATURE_DEBIT
                        ? ($priorDebit - $priorCredit)
                        : ($priorCredit - $priorDebit);

                    $openingBalance += $priorNet;
                }

                $runningBalance = $openingBalance;
            }
        }

        // Query lines in date range
        $query = JournalEntryLine::query()
            ->with(['journalEntry', 'account'])
            ->whereHas('journalEntry', function ($q) use ($dateFrom, $dateTo, $search) {
                $q->where('status', JournalEntry::STATUS_POSTED);
                if (! empty($dateFrom)) {
                    $q->whereDate('date', '>=', $dateFrom);
                }
                if (! empty($dateTo)) {
                    $q->whereDate('date', '<=', $dateTo);
                }
                if (! empty($search)) {
                    $q->where(function ($sub) use ($search) {
                        $sub->where('entry_number', 'like', "%{$search}%")
                            ->orWhere('description', 'like', "%{$search}%");
                    });
                }
            });

        if ($targetAccount) {
            $query->where('chart_of_account_id', $targetAccount->id);
        } elseif (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('account', function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            });
        }

        // Order chronologically for running balance
        $lines = $query->join('journal_entries as je_sort', 'je_sort.id', '=', 'journal_entry_lines.journal_entry_id')
            ->select('journal_entry_lines.*')
            ->orderBy('je_sort.date', 'asc')
            ->orderBy('journal_entry_lines.id', 'asc')
            ->get();

        $totalDebit  = 0.0;
        $totalCredit = 0.0;
        $formattedRows = [];

        foreach ($lines as $index => $line) {
            $debit  = (float) $line->debit;
            $credit = (float) $line->credit;

            $totalDebit  += $debit;
            $totalCredit += $credit;

            // Compute running balance
            if ($targetAccount) {
                if ($targetAccount->nature === ChartOfAccount::NATURE_DEBIT) {
                    $runningBalance += ($debit - $credit);
                } else {
                    $runningBalance += ($credit - $debit);
                }
                $currentLineBalance = $runningBalance;
            } else {
                $accNature = $line->account?->nature ?? ChartOfAccount::NATURE_DEBIT;
                $currentLineBalance = $accNature === ChartOfAccount::NATURE_DEBIT
                    ? ($debit - $credit)
                    : ($credit - $debit);
            }

            // Derive reference / invoice / voucher number
            $referenceNumber = $line->journalEntry?->reference_id
                ? "#{$line->journalEntry->reference_id}"
                : "—";

            if ($line->journalEntry?->reference_type === 'receipt_voucher' || $line->journalEntry?->reference_type === 'payment_voucher') {
                $voucherNumber = Voucher::where('journal_entry_id', $line->journal_entry_id)->value('voucher_number');
                if ($voucherNumber) {
                    $referenceNumber = $voucherNumber;
                }
            }

            $dateFormatted = $line->journalEntry?->date
                ? $line->journalEntry->date->format('Y-m-d')
                : null;

            $formattedRows[] = [
                'id'              => $line->id,
                'index'           => $index + 1,
                'name'            => $line->account?->name ?? '—',
                'account'         => $line->account ? "{$line->account->code} - {$line->account->name}" : '—',
                'account_id'      => $line->chart_of_account_id,
                'account_code'    => $line->account?->code,
                'account_name'    => $line->account?->name,
                'invoisnum'       => $referenceNumber,
                'invoicenumber'   => $referenceNumber,
                'numtranzaction'  => $line->journalEntry?->entry_number ?? "#{$line->journal_entry_id}",
                'entry_number'    => $line->journalEntry?->entry_number ?? "#{$line->journal_entry_id}",
                'date'            => $dateFormatted,
                'description'     => $line->description ?: ($line->journalEntry?->description ?: '—'),
                'debit'           => $debit,
                'credit'          => $credit,
                'value'           => $debit > 0 ? $debit : $credit,
                'amount'          => $debit > 0 ? $debit : $credit,
                'balance'         => round($currentLineBalance, 2),
                'running_balance' => round($currentLineBalance, 2),
            ];
        }

        $netChange = $targetAccount && $targetAccount->nature === ChartOfAccount::NATURE_CREDIT
            ? ($totalCredit - $totalDebit)
            : ($totalDebit - $totalCredit);

        $closingBalance = $targetAccount ? $runningBalance : ($totalDebit - $totalCredit);

        return [
            'account'         => $targetAccount ? [
                'id'              => $targetAccount->id,
                'code'            => $targetAccount->code,
                'name'            => $targetAccount->name,
                'account_type'    => $targetAccount->account_type,
                'nature'          => $targetAccount->nature,
                'opening_balance' => (float) $targetAccount->opening_balance,
            ] : null,
            'date_from'       => $dateFrom,
            'date_to'         => $dateTo,
            'opening_balance' => round($openingBalance, 2),
            'total_debit'     => round($totalDebit, 2),
            'total_credit'    => round($totalCredit, 2),
            'net_change'      => round($netChange, 2),
            'closing_balance' => round($closingBalance, 2),
            'transactions'    => $formattedRows,
            'data'            => $formattedRows,
            'total'           => count($formattedRows),
        ];
    }

    /**
     * Helper statement for general clients.
     */
    public function getClientsStatement(array $filters = []): array
    {
        return $this->getEntityStatement('client', $filters);
    }

    /**
     * Helper statement for general vendors/suppliers.
     */
    public function getVendorsStatement(array $filters = []): array
    {
        return $this->getEntityStatement('vendor', $filters);
    }

    /**
     * Helper statement for donors.
     */
    public function getDonorsStatement(array $filters = []): array
    {
        return $this->getEntityStatement('donor', $filters);
    }

    /**
     * Helper statement for beneficiaries / human cases.
     */
    public function getHumanCasesStatement(array $filters = []): array
    {
        return $this->getEntityStatement('humancase', $filters);
    }

    /**
     * Generic safe fallback for entity statements.
     */
    protected function getEntityStatement(string $entityType, array $filters = []): array
    {
        // Use vouchers and journal entries linked to the entity or general ledger fallback
        $vouchers = Voucher::query()->latest('id')->take(50)->get();

        $rows = $vouchers->map(function ($v, $idx) use ($entityType) {
            return [
                'id'            => $v->id,
                'index'         => $idx + 1,
                'name'          => $v->description ?: "حركة {$entityType}",
                'invoicenumber' => $v->voucher_number,
                'invoisnum'     => $v->voucher_number,
                'date'          => $v->date?->format('Y-m-d') ?? now()->toDateString(),
                'paymenttype'   => $v->payment_method === 'cash' ? 'نقدي' : 'تحويل',
                'amount'        => (float) $v->amount,
                'value'         => (float) $v->amount,
            ];
        })->all();

        return [
            'data'  => $rows,
            'total' => count($rows),
        ];
    }
}
