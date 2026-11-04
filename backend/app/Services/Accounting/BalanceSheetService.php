<?php

namespace App\Services\Accounting;

use App\Models\ChartOfAccount;
use App\Models\JournalEntry;
use App\Models\Store;
use Illuminate\Support\Facades\DB;

class BalanceSheetService
{
    /**
     * Compute comprehensive Balance Sheet (قائمة المركز المالي) as of a given date.
     */
    public function getBalanceSheet(?string $asOfDate = null): array
    {
        $asOfDate = $asOfDate ?: now()->toDateString();
        $storeId = $this->currentStoreId();

        // Fetch all accounts in store
        $accounts = ChartOfAccount::query()->orderBy('code')->get();

        // Fetch posted movements up to asOfDate
        $movements = DB::table('journal_entry_lines')
            ->join('journal_entries', 'journal_entries.id', '=', 'journal_entry_lines.journal_entry_id')
            ->where('journal_entries.status', JournalEntry::STATUS_POSTED)
            ->whereNull('journal_entries.deleted_at')
            ->whereDate('journal_entries.date', '<=', $asOfDate)
            ->when($storeId, fn ($q) => $q->where('journal_entries.store_id', $storeId))
            ->selectRaw('chart_of_account_id, SUM(debit) as total_debit, SUM(credit) as total_credit')
            ->groupBy('chart_of_account_id')
            ->get()
            ->keyBy('chart_of_account_id');

        // Helper to calculate leaf account balance
        $getAccountBalance = function (ChartOfAccount $acc) use ($movements) {
            $mov = $movements->get($acc->id);
            $debit = (float) ($mov->total_debit ?? 0);
            $credit = (float) ($mov->total_credit ?? 0);
            $opening = (float) $acc->opening_balance;

            return $acc->nature === ChartOfAccount::NATURE_DEBIT
                ? ($opening + $debit - $credit)
                : ($opening + $credit - $debit);
        };

        // Categorize leaf postable accounts
        $leafAccounts = $accounts->where('is_payable', true);

        // Calculate Surplus / Deficit of current period (Revenue 3 - Expense 4)
        $revenueTotal = 0.0;
        $expenseTotal = 0.0;
        foreach ($leafAccounts as $acc) {
            if (str_starts_with($acc->code, '3')) {
                $revenueTotal += $getAccountBalance($acc);
            } elseif (str_starts_with($acc->code, '4')) {
                $expenseTotal += $getAccountBalance($acc);
            }
        }
        $periodSurplus = $revenueTotal - $expenseTotal;

        // Bucket definitions for legacy { debt: {}, credit: {} } mapping
        $buckets = [
            'cash'                                               => ['111', '1110'],
            'other_debt_account'                                 => ['112', '113', '114', '115'],
            'endowments'                                         => ['13', '131'],
            'projects_under_progress'                            => ['122'],
            'investments'                                        => ['123'],
            'intangible_assets'                                  => ['124'],
            'shortterm_loans'                                    => ['211'],
            'payment_papers'                                     => ['212'],
            'accounts_payable'                                   => ['213'],
            'due_expenses'                                       => ['214'],
            'revenue_and_donations_provided'                     => ['215'],
            'other_current_obligations'                          => ['216'],
            'longterm_loans'                                     => ['221'],
            'longterm_payment_notes'                             => ['222'],
            'allocations'                                        => ['223'],
            'depreciation_and_exhaustion_accumulations'          => ['224'],
            'allocations_for_endowment_assets'                   => ['225'],
            'depreciation_and_exhaustion_pools_for_endowment_assets' => ['226'],
            'net_unrestricted_assets'                            => ['231'],
            'net_restricted_assets'                              => ['232'],
            'net_assets_of_endowments'                           => ['233'],
        ];

        $debtObj   = [];
        $creditObj = [];
        $categoryBalances = [];

        foreach ($buckets as $key => $prefixes) {
            $matchingAccs = $leafAccounts->filter(function ($a) use ($prefixes) {
                foreach ($prefixes as $p) {
                    if (str_starts_with($a->code, $p)) return true;
                }
                return false;
            });

            $sumDebit = 0.0;
            $sumCredit = 0.0;
            $sumBalance = 0.0;

            foreach ($matchingAccs as $acc) {
                $mov = $movements->get($acc->id);
                $d = (float) ($mov->total_debit ?? 0);
                $c = (float) ($mov->total_credit ?? 0);
                $sumDebit += $d + ($acc->nature === ChartOfAccount::NATURE_DEBIT ? (float) $acc->opening_balance : 0);
                $sumCredit += $c + ($acc->nature === ChartOfAccount::NATURE_CREDIT ? (float) $acc->opening_balance : 0);
                $sumBalance += $getAccountBalance($acc);
            }

            // Include current period surplus in unrestricted net assets if applicable
            if ($key === 'net_unrestricted_assets') {
                $sumBalance += $periodSurplus;
                if ($periodSurplus >= 0) {
                    $sumCredit += $periodSurplus;
                } else {
                    $sumDebit += abs($periodSurplus);
                }
            }

            $debtObj[$key]   = round($sumDebit, 2);
            $creditObj[$key] = round($sumCredit, 2);
            $categoryBalances[$key] = round($sumBalance, 2);
        }

        // Aggregate Totals
        // 1. Current Assets (الأصول المتداولة)
        $currentAssets = ($debtObj['cash'] - $creditObj['cash']) +
                         ($debtObj['other_debt_account'] - $creditObj['other_debt_account']);

        // 2. Endowment Assets (أصول الأوقاف)
        $endowmentAssets = $debtObj['endowments'] - $creditObj['endowments'];

        // 3. Non-Current Assets (الأصول غير المتداولة)
        $nonCurrentAssets = ($debtObj['projects_under_progress'] - $creditObj['projects_under_progress']) +
                            ($debtObj['investments'] - $creditObj['investments']) +
                            ($debtObj['intangible_assets'] - $creditObj['intangible_assets']);

        $totalAssets = $currentAssets + $endowmentAssets + $nonCurrentAssets;

        // 4. Current Liabilities (الالتزامات المتداولة)
        $currentLiabilities = ($creditObj['shortterm_loans'] - $debtObj['shortterm_loans']) +
                              ($creditObj['payment_papers'] - $debtObj['payment_papers']) +
                              ($creditObj['accounts_payable'] - $debtObj['accounts_payable']) +
                              ($creditObj['due_expenses'] - $debtObj['due_expenses']) +
                              ($creditObj['revenue_and_donations_provided'] - $debtObj['revenue_and_donations_provided']) +
                              ($creditObj['other_current_obligations'] - $debtObj['other_current_obligations']);

        // 5. Non-Current Liabilities (الالتزامات غير المتداولة)
        $nonCurrentLiabilities = ($creditObj['longterm_loans'] - $debtObj['longterm_loans']) +
                                 ($creditObj['longterm_payment_notes'] - $debtObj['longterm_payment_notes']) +
                                 ($creditObj['allocations'] - $debtObj['allocations']) +
                                 ($creditObj['depreciation_and_exhaustion_accumulations'] - $debtObj['depreciation_and_exhaustion_accumulations']) +
                                 ($creditObj['allocations_for_endowment_assets'] - $debtObj['allocations_for_endowment_assets']) +
                                 ($creditObj['depreciation_and_exhaustion_pools_for_endowment_assets'] - $debtObj['depreciation_and_exhaustion_pools_for_endowment_assets']);

        $totalLiabilities = $currentLiabilities + $nonCurrentLiabilities;

        // 6. Net Assets (صافي الأصول)
        $netAssetsTotal = ($creditObj['net_unrestricted_assets'] - $debtObj['net_unrestricted_assets']) +
                          ($creditObj['net_restricted_assets'] - $debtObj['net_restricted_assets']) +
                          ($creditObj['net_assets_of_endowments'] - $debtObj['net_assets_of_endowments']);

        $totalLiabilitiesAndNetAssets = $totalLiabilities + $netAssetsTotal;

        // Store info
        $store = Store::find($storeId);

        return [
            'as_of_date'                     => $asOfDate,
            'organization_name'              => $store?->name ?? 'جمعية خيرية',
            'store'                          => $store ? ['id' => $store->id, 'name' => $store->name] : null,
            'period_surplus'                 => round($periodSurplus, 2),
            // Legacy format matching BalanceSheet.js (rows.debt & rows.credit)
            'debt'                           => $debtObj,
            'credit'                         => $creditObj,
            // Modern structured totals
            'totals'                         => [
                'current_assets'                 => round($currentAssets, 2),
                'endowment_assets'               => round($endowmentAssets, 2),
                'non_current_assets'             => round($nonCurrentAssets, 2),
                'total_assets'                   => round($totalAssets, 2),
                'current_liabilities'            => round($currentLiabilities, 2),
                'non_current_liabilities'        => round($nonCurrentLiabilities, 2),
                'total_liabilities'              => round($totalLiabilities, 2),
                'total_net_assets'               => round($netAssetsTotal, 2),
                'total_liabilities_and_net_assets' => round($totalLiabilitiesAndNetAssets, 2),
                'is_balanced'                    => abs($totalAssets - $totalLiabilitiesAndNetAssets) < 0.05,
            ],
        ];
    }

    protected function currentStoreId(): ?int
    {
        if (app()->has('current_store_id')) {
            return (int) app('current_store_id');
        }

        return auth('sanctum')->user()?->store_id ?? auth()->user()?->store_id;
    }
}
