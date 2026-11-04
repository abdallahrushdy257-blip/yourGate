<?php

namespace App\Services\Accounting;

use App\Exceptions\Accounting\JournalEntryException;
use App\Models\ChartOfAccount;
use App\Models\JournalEntry;
use App\Models\JournalEntryLine;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class JournalEntryService
{
    /**
     * List journal entries with flexible filtering and pagination.
     */
    public function list(array $filters = []): LengthAwarePaginator|Collection
    {
        $query = JournalEntry::query()
            ->with(['lines.account', 'creator'])
            ->orderBy('date', 'desc')
            ->orderBy('id', 'desc');

        if (! empty($filters['search'])) {
            $search = '%' . trim($filters['search']) . '%';
            $query->where(function ($q) use ($search) {
                $q->where('entry_number', 'like', $search)
                  ->orWhere('description', 'like', $search)
                  ->orWhereHas('lines.account', function ($sub) use ($search) {
                      $sub->where('name', 'like', $search)
                          ->orWhere('code', 'like', $search);
                  });
            });
        }

        $dateFrom = $filters['searchfrom'] ?? $filters['date_from'] ?? null;
        if (! empty($dateFrom)) {
            $query->whereDate('date', '>=', $dateFrom);
        }

        $dateTo = $filters['searchto'] ?? $filters['date_to'] ?? null;
        if (! empty($dateTo)) {
            $query->whereDate('date', '<=', $dateTo);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['perpage']) || isset($filters['per_page'])) {
            $perPage = (int) ($filters['perpage'] ?? $filters['per_page'] ?? 15);
            return $query->paginate($perPage > 0 ? $perPage : 15);
        }

        return $query->get();
    }

    /**
     * Find a single journal entry by ID.
     */
    public function find(int $id): JournalEntry
    {
        return JournalEntry::with(['lines.account', 'creator'])->findOrFail($id);
    }

    /**
     * Store a new journal entry with accounting verification.
     */
    public function store(array $data): JournalEntry
    {
        return DB::transaction(function () use ($data) {
            $lines = $data['lines'] ?? [];

            if (count($lines) < 2) {
                throw JournalEntryException::emptyLines();
            }

            $totalDebit = 0.0;
            $totalCredit = 0.0;
            $preparedLines = [];

            // Fetch and validate accounts
            $accountIds = array_unique(array_column($lines, 'account_id'));
            $accounts = ChartOfAccount::whereIn('id', $accountIds)->get()->keyBy('id');

            foreach ($lines as $index => $line) {
                $accId = (int) $line['account_id'];
                $account = $accounts->get($accId);

                if (! $account) {
                    throw new \Exception("الحساب المحدد برقم معرف {$accId} غير موجود.");
                }

                if (! $account->is_payable) {
                    throw JournalEntryException::accountNotPayable($account->code, $account->name);
                }

                $debit = round((float) ($line['debit'] ?? 0), 2);
                $credit = round((float) ($line['credit'] ?? 0), 2);

                if ($debit > 0 && $credit > 0) {
                    throw new \Exception("لا يمكن أن يحتوي طرف القيد الواحد على مبلغ مدين ودائن في نفس الوقت للحساب: {$account->name}");
                }

                $totalDebit += $debit;
                $totalCredit += $credit;

                $preparedLines[] = [
                    'chart_of_account_id' => $accId,
                    'debit'               => $debit,
                    'credit'              => $credit,
                    'description'         => $line['description'] ?? null,
                    'line_order'          => $index + 1,
                ];
            }

            if ($totalDebit <= 0 || $totalCredit <= 0) {
                throw JournalEntryException::nonPositiveAmount();
            }

            if (abs($totalDebit - $totalCredit) >= 0.01) {
                throw JournalEntryException::unbalanced($totalDebit, $totalCredit);
            }

            $entryNumber = ! empty($data['entry_number'])
                ? $data['entry_number']
                : $this->generateNextEntryNumber();

            $entry = JournalEntry::create([
                'entry_number'   => $entryNumber,
                'date'           => $data['date'] ?? now()->toDateString(),
                'description'    => $data['description'] ?? null,
                'reference_type' => $data['reference_type'] ?? 'manual',
                'reference_id'   => $data['reference_id'] ?? null,
                'total_debit'    => $totalDebit,
                'total_credit'   => $totalCredit,
                'status'         => $data['status'] ?? JournalEntry::STATUS_POSTED,
                'created_by'     => auth('sanctum')->id() ?? auth()->id(),
            ]);

            foreach ($preparedLines as $lineData) {
                $entry->lines()->create($lineData);
            }

            return $entry->load(['lines.account', 'creator']);
        });
    }

    /**
     * Update an existing journal entry.
     */
    public function update(int $id, array $data): JournalEntry
    {
        return DB::transaction(function () use ($id, $data) {
            $entry = JournalEntry::findOrFail($id);

            if (! empty($data['date'])) {
                $entry->date = $data['date'];
            }
            if (isset($data['description'])) {
                $entry->description = $data['description'];
            }

            if (! empty($data['lines'])) {
                $lines = $data['lines'];
                if (count($lines) < 2) {
                    throw JournalEntryException::emptyLines();
                }

                $totalDebit = 0.0;
                $totalCredit = 0.0;
                $preparedLines = [];

                $accountIds = array_unique(array_column($lines, 'account_id'));
                $accounts = ChartOfAccount::whereIn('id', $accountIds)->get()->keyBy('id');

                foreach ($lines as $index => $line) {
                    $accId = (int) $line['account_id'];
                    $account = $accounts->get($accId);

                    if (! $account) {
                        throw new \Exception("الحساب المحدد غير موجود.");
                    }

                    if (! $account->is_payable) {
                        throw JournalEntryException::accountNotPayable($account->code, $account->name);
                    }

                    $debit = round((float) ($line['debit'] ?? 0), 2);
                    $credit = round((float) ($line['credit'] ?? 0), 2);

                    $totalDebit += $debit;
                    $totalCredit += $credit;

                    $preparedLines[] = [
                        'chart_of_account_id' => $accId,
                        'debit'               => $debit,
                        'credit'              => $credit,
                        'description'         => $line['description'] ?? null,
                        'line_order'          => $index + 1,
                    ];
                }

                if (abs($totalDebit - $totalCredit) >= 0.01) {
                    throw JournalEntryException::unbalanced($totalDebit, $totalCredit);
                }

                $entry->total_debit = $totalDebit;
                $entry->total_credit = $totalCredit;

                $entry->lines()->delete();
                foreach ($preparedLines as $lineData) {
                    $entry->lines()->create($lineData);
                }
            }

            $entry->save();

            return $entry->fresh(['lines.account', 'creator']);
        });
    }

    /**
     * Delete an existing journal entry.
     */
    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $entry = JournalEntry::findOrFail($id);
            $entry->lines()->delete();
            $entry->delete();
        });
    }

    /**
     * Generate next sequential entry number for current store (e.g. JE-2026-0001).
     */
    public function generateNextEntryNumber(): string
    {
        $year = date('Y');
        $prefix = "JE-{$year}-";

        $last = JournalEntry::where('entry_number', 'like', "{$prefix}%")
            ->orderBy('id', 'desc')
            ->value('entry_number');

        if ($last) {
            $seq = (int) substr($last, strlen($prefix)) + 1;
        } else {
            $seq = 1;
        }

        return $prefix . str_pad((string) $seq, 4, '0', STR_PAD_LEFT);
    }
}
