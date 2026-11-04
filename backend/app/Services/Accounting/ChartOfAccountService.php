<?php

namespace App\Services\Accounting;

use App\Exceptions\Accounting\ChartOfAccountException;
use App\Models\ChartOfAccount;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ChartOfAccountService
{
    /** Suffix length appended to the parent code, by the new account level. */
    protected const SUFFIX_LENGTH_BY_LEVEL = [2 => 1, 3 => 1, 4 => 2, 5 => 3, 6 => 2];
    protected const DEFAULT_SUFFIX_LENGTH  = 3;

    public function __construct(
        protected ChartOfAccountTemplateService $templates
    ) {}

    /**
     * Full tree for the current store with rolled-up balances.
     * Auto-seeds the default template the first time a store opens its tree.
     */
    public function tree(array $filters = []): Collection
    {
        $accounts = $this->allForCurrentStore();

        if ($accounts->isEmpty() && $this->currentStoreId()) {
            $this->templates->seedForStore($this->currentStoreId());
            $accounts = $this->allForCurrentStore();
        }

        $roots = $this->buildTree($accounts);

        if (! empty($filters['type'])) {
            $roots = $roots->filter(fn (ChartOfAccount $a) => $a->account_type === $filters['type']
                || ($filters['type'] === ChartOfAccount::TYPE_LIABILITY && $a->code === '2'))->values();
        }

        return new Collection($roots->all());
    }

    /**
     * Flat list (for dropdowns: payment accounts, journal lines, parents...).
     */
    public function list(array $filters = []): Collection
    {
        $accounts = ChartOfAccount::query()
            ->when(isset($filters['payable']), fn ($q) => $q->where('is_payable', filter_var($filters['payable'], FILTER_VALIDATE_BOOLEAN)))
            ->when(isset($filters['active']), fn ($q) => $q->where('is_active', filter_var($filters['active'], FILTER_VALIDATE_BOOLEAN)))
            ->when(! empty($filters['type']), fn ($q) => $q->where('account_type', $filters['type']))
            ->when(! empty($filters['parent_id']), fn ($q) => $q->where('parent_id', $filters['parent_id']))
            ->when(! empty($filters['code_prefix']), fn ($q) => $q->where('code', 'like', $filters['code_prefix'] . '%'))
            ->when(! empty($filters['search']), function ($q) use ($filters) {
                $term = '%' . $filters['search'] . '%';
                $q->where(fn ($w) => $w->where('name', 'like', $term)->orWhere('code', 'like', $term)->orWhere('name_en', 'like', $term));
            })
            ->orderBy('code')
            ->get();

        if ($accounts->isNotEmpty()) {
            $storeId = $this->currentStoreId();
            $movements = DB::table('journal_entry_lines')
                ->join('journal_entries', 'journal_entries.id', '=', 'journal_entry_lines.journal_entry_id')
                ->where('journal_entries.status', \App\Models\JournalEntry::STATUS_POSTED)
                ->whereNull('journal_entries.deleted_at')
                ->when($storeId, fn ($q) => $q->where('journal_entries.store_id', $storeId))
                ->whereIn('chart_of_account_id', $accounts->pluck('id'))
                ->selectRaw('chart_of_account_id, SUM(debit) as total_debit, SUM(credit) as total_credit')
                ->groupBy('chart_of_account_id')
                ->get()
                ->keyBy('chart_of_account_id');

            foreach ($accounts as $acc) {
                $mov = $movements->get($acc->id);
                $debit = (float) ($mov->total_debit ?? 0);
                $credit = (float) ($mov->total_credit ?? 0);
                $opening = (float) $acc->opening_balance;
                $net = $acc->nature === ChartOfAccount::NATURE_DEBIT
                    ? ($debit - $credit)
                    : ($credit - $debit);
                $acc->final_balance = round($opening + $net, 2);
            }
        }

        return $accounts;
    }

    public function find(int $id): ChartOfAccount
    {
        return ChartOfAccount::with('parent')->withCount('children')->findOrFail($id);
    }

    public function store(array $data): ChartOfAccount
    {
        return DB::transaction(function () use ($data) {
            /** @var ChartOfAccount $parent */
            $parent = ChartOfAccount::lockForUpdate()->findOrFail($data['parent_id']);

            if ($parent->is_payable) {
                if ((float) $parent->opening_balance !== 0.0) {
                    throw ChartOfAccountException::parentHasBalance();
                }
                $parent->update(['is_payable' => false]);
            }

            $code = ! empty($data['code'])
                ? $this->assertValidCode((string) $data['code'], $parent)
                : $this->generateNextCode($parent);

            $type = ChartOfAccount::typeFromCode($code);

            $account = ChartOfAccount::create([
                'parent_id'       => $parent->id,
                'code'            => $code,
                'name'            => $data['name'],
                'name_en'         => $data['name_en'] ?? null,
                'level'           => $parent->level + 1,
                'account_type'    => $type,
                'nature'          => ChartOfAccount::natureFromType($type),
                'is_payable'      => $data['is_payable'] ?? true,
                'is_active'       => $data['is_active'] ?? true,
                'is_system'       => false,
                'opening_balance' => $data['opening_balance'] ?? 0,
                'cash_flow_type'  => $data['cash_flow_type'] ?? $parent->cash_flow_type,
                'scrap_value'     => $data['scrap_value'] ?? null,
                'useful_life'     => $data['useful_life'] ?? null,
                'description'     => $data['description'] ?? null,
            ]);

            return $account->load('parent');
        });
    }

    public function update(int $id, array $data): ChartOfAccount
    {
        $account = ChartOfAccount::withCount('children')->findOrFail($id);

        $payload = array_intersect_key($data, array_flip([
            'name', 'name_en', 'opening_balance', 'cash_flow_type', 'description',
            'is_active', 'scrap_value', 'useful_life',
        ]));

        // Group accounts never hold a balance of their own.
        if ($account->children_count > 0) {
            unset($payload['opening_balance']);
        }

        $account->update($payload);

        return $account->fresh('parent');
    }

    public function delete(int $id): void
    {
        $account = ChartOfAccount::withCount('children')->findOrFail($id);

        if ($account->children_count > 0) {
            throw ChartOfAccountException::hasChildren();
        }

        if ($account->is_system) {
            throw ChartOfAccountException::systemAccount();
        }

        // Hook point: block deletion once journal lines reference this account.

        $account->delete();
    }

    /**
     * Seed missing default-template accounts into the current store.
     */
    public function seedDefaults(): int
    {
        return $this->templates->seedForStore($this->currentStoreId());
    }

    public function generateNextCode(ChartOfAccount $parent): string
    {
        $parentLen = strlen($parent->code);
        $siblings  = ChartOfAccount::where('parent_id', $parent->id)->pluck('code');

        if ($siblings->isNotEmpty()) {
            // Follow the dominant sibling code length.
            $length    = (int) $siblings->map(fn ($c) => strlen($c))->countBy()->sortDesc()->keys()->first();
            $suffixLen = max(1, $length - $parentLen);
            $next      = (int) $siblings->filter(fn ($c) => strlen($c) === $length)
                ->map(fn ($c) => (int) substr($c, $parentLen))
                ->max() + 1;
        } else {
            $suffixLen = self::SUFFIX_LENGTH_BY_LEVEL[$parent->level + 1] ?? self::DEFAULT_SUFFIX_LENGTH;
            $next      = 1;
        }

        $existing = $siblings->flip();
        do {
            if (strlen((string) $next) > $suffixLen) {
                throw ChartOfAccountException::codeOverflow();
            }
            $code = $parent->code . str_pad((string) $next, $suffixLen, '0', STR_PAD_LEFT);
            $next++;
        } while (isset($existing[$code]));

        return $code;
    }

    protected function assertValidCode(string $code, ChartOfAccount $parent): string
    {
        if (! str_starts_with($code, $parent->code) || strlen($code) <= strlen($parent->code)) {
            throw ChartOfAccountException::invalidCode();
        }

        return $code;
    }

    protected function allForCurrentStore(): Collection
    {
        return ChartOfAccount::query()->orderBy('code')->get();
    }

    /**
     * Build an in-memory tree (single query) and roll balances up to parents.
     */
    protected function buildTree(Collection $accounts): \Illuminate\Support\Collection
    {
        $byId     = $accounts->keyBy('id');
        $children = $accounts->groupBy('parent_id');

        foreach ($accounts as $account) {
            $account->setRelation('children', new Collection(($children[$account->id] ?? collect())->values()->all()));
        }

        $storeId = $this->currentStoreId();
        $movements = DB::table('journal_entry_lines')
            ->join('journal_entries', 'journal_entries.id', '=', 'journal_entry_lines.journal_entry_id')
            ->where('journal_entries.status', \App\Models\JournalEntry::STATUS_POSTED)
            ->whereNull('journal_entries.deleted_at')
            ->when($storeId, fn ($q) => $q->where('journal_entries.store_id', $storeId))
            ->selectRaw('chart_of_account_id, SUM(debit) as total_debit, SUM(credit) as total_credit')
            ->groupBy('chart_of_account_id')
            ->get()
            ->keyBy('chart_of_account_id');

        $roots = $accounts->filter(fn ($a) => ! $a->parent_id || ! isset($byId[$a->parent_id]))->values();

        $roots->each(fn ($root) => $this->rollUpBalance($root, $movements));

        return $roots;
    }

    protected function rollUpBalance(ChartOfAccount $account, $movements = null): float
    {
        $opening = (float) $account->opening_balance;
        $mov = $movements ? $movements->get($account->id) : null;
        $debit = (float) ($mov->total_debit ?? 0);
        $credit = (float) ($mov->total_credit ?? 0);

        $netMovement = $account->nature === ChartOfAccount::NATURE_DEBIT
            ? ($debit - $credit)
            : ($credit - $debit);

        $ownBalance = $opening + $netMovement;
        $childrenTotal = 0.0;

        foreach ($account->children as $child) {
            $childrenTotal += $this->rollUpBalance($child, $movements);
        }

        $finalBalance = $account->children->isNotEmpty() ? ($childrenTotal + $ownBalance) : $ownBalance;
        $account->final_balance = round($finalBalance, 2);

        return $finalBalance;
    }

    protected function currentStoreId(): ?int
    {
        if (app()->has('current_store_id')) {
            return (int) app('current_store_id');
        }

        return auth('sanctum')->user()?->store_id ?? auth()->user()?->store_id;
    }
}
