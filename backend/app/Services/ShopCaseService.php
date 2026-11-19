<?php

namespace App\Services;

use App\Models\Shop;
use App\Models\ShopDetail;
use App\Models\ShopTransaction;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ShopCaseService
{
    /**
     * Get a filtered list of shop cases.
     */
    public function list(array $filters = []): Collection
    {
        $query = Shop::with(['beneficiary', 'transactions'])->latest('id');

        if (! empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('beneficiary', function ($bq) use ($search) {
                      $bq->where('name', 'like', "%{$search}%")
                         ->orWhere('idnumber', 'like', "%{$search}%");
                  });
            });
        }

        $dateFrom = $filters['searchFrom'] ?? $filters['dateFrom'] ?? null;
        if (! empty($dateFrom)) {
            $query->whereDate('dateoflaunch', '>=', $dateFrom);
        }

        $dateTo = $filters['searchTo'] ?? $filters['dateTo'] ?? null;
        if (! empty($dateTo)) {
            $query->whereDate('dateoflaunch', '<=', $dateTo);
        }

        if (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('status', (int) $filters['status']);
        }

        if (! empty($filters['marketingmethod'])) {
            $query->where('marketingmethod', (int) $filters['marketingmethod']);
        }

        return $query->get();
    }

    /**
     * Calculate summary statistics for shop cases.
     */
    public function stats(): array
    {
        $totalCases = Shop::count();
        $activeCases = Shop::where('status', 0)->count();
        $completedCases = Shop::where('status', 1)->count();
        $totalTargetAmount = (float) Shop::sum('total');
        $totalCollectedAmount = (float) Shop::sum('amount');
        $totalPaidAmount = (float) ShopTransaction::where('transaction_type', 2)->sum('amount');

        return [
            'total_cases'            => $totalCases,
            'active_cases'           => $activeCases,
            'completed_cases'        => $completedCases,
            'total_target_amount'    => $totalTargetAmount,
            'total_collected_amount' => $totalCollectedAmount,
            'total_paid_amount'      => $totalPaidAmount,
            'net_balance'            => max(0.0, $totalCollectedAmount - $totalPaidAmount),
        ];
    }

    /**
     * Find a single shop case by ID.
     */
    public function find(int $id): Shop
    {
        return Shop::with(['beneficiary', 'transactions.donor', 'details', 'ads'])->findOrFail($id);
    }

    /**
     * Create a new shop case.
     */
    public function create(array $data, ?UploadedFile $file = null): Shop
    {
        return DB::transaction(function () use ($data, $file) {
            if ($file && $file->isValid()) {
                $data['document'] = $file->store('shops', 'public');
            }

            $total = (float) ($data['total'] ?? 0);
            $numAssets = (int) ($data['number_of_assets'] ?? 0);
            $isAssets = (bool) ($data['is_assets_selected'] ?? false);

            if ($isAssets && $numAssets > 0) {
                $data['cost_per_asset'] = round($total / $numAssets, 2);
            }

            return Shop::create($data);
        });
    }

    /**
     * Update an existing shop case.
     */
    public function update(int $id, array $data, ?UploadedFile $file = null): Shop
    {
        return DB::transaction(function () use ($id, $data, $file) {
            $shop = Shop::findOrFail($id);

            if ($file && $file->isValid()) {
                if ($shop->document && Storage::disk('public')->exists($shop->document)) {
                    Storage::disk('public')->delete($shop->document);
                }
                $data['document'] = $file->store('shops', 'public');
            }

            $total = isset($data['total']) ? (float) $data['total'] : (float) $shop->total;
            $numAssets = isset($data['number_of_assets']) ? (int) $data['number_of_assets'] : (int) $shop->number_of_assets;
            $isAssets = isset($data['is_assets_selected']) ? (bool) $data['is_assets_selected'] : (bool) $shop->is_assets_selected;

            if ($isAssets && $numAssets > 0) {
                $data['cost_per_asset'] = round($total / $numAssets, 2);
            }

            $shop->update($data);

            return $shop->fresh(['beneficiary']);
        });
    }

    /**
     * Mark a case as closed / completed.
     */
    public function close(int $id): Shop
    {
        $shop = Shop::findOrFail($id);
        $shop->update(['status' => 1]);

        return $shop;
    }

    /**
     * Delete a shop case.
     */
    public function delete(int $id): bool
    {
        $shop = Shop::findOrFail($id);

        if ($shop->document && Storage::disk('public')->exists($shop->document)) {
            Storage::disk('public')->delete($shop->document);
        }

        return (bool) $shop->delete();
    }

    /**
     * List transactions for a shop case.
     */
    public function listTransactions(int $shopId, array $filters = []): Collection
    {
        $query = ShopTransaction::with(['donor', 'beneficiary'])
            ->where('shop_id', $shopId)
            ->latest('id');

        if (! empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%")
                  ->orWhereHas('donor', fn ($dq) => $dq->where('name', 'like', "%{$search}%"));
            });
        }

        if (! empty($filters['searchfrom'])) {
            $query->whereDate('date', '>=', $filters['searchfrom']);
        }

        if (! empty($filters['searchto'])) {
            $query->whereDate('date', '<=', $filters['searchto']);
        }

        return $query->get();
    }

    /**
     * Store a donation receipt transaction and update case collected amount.
     */
    public function storeReceipt(array $data): ShopTransaction
    {
        return DB::transaction(function () use ($data) {
            $shop = Shop::findOrFail((int) $data['shop_id']);

            $amount = (float) $data['amount'];
            $invoiceNumber = 'REC-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -5));

            $transaction = ShopTransaction::create([
                'shop_id'          => $shop->id,
                'donor_id'         => $data['donor_id'] ?? null,
                'invoice_number'   => $invoiceNumber,
                'transaction_type' => 1,
                'type'             => $data['type'] ?? '1',
                'amount'           => $amount,
                'date'             => $data['date'] ?? now()->toDateString(),
                'account'          => $data['account'] ?? null,
                'balanceid'        => $data['balanceid'] ?? null,
                'notes'            => $data['notes'] ?? null,
            ]);

            // Update shop amount
            $newAmount = (float) $shop->amount + $amount;
            $updates = ['amount' => $newAmount];
            if ($newAmount >= (float) $shop->total && (float) $shop->total > 0) {
                $updates['status'] = 1;
            }
            $shop->update($updates);

            app(\App\Services\Accounting\AccountingSyncService::class)->recordReceipt([
                'amount'         => $amount,
                'date'           => $transaction->date ? $transaction->date->format('Y-m-d') : now()->toDateString(),
                'account'        => $data['account'] ?? $data['balanceid'] ?? null,
                'description'    => "سند قبض تبرع للحالة ({$shop->title}) رقم {$invoiceNumber}",
                'reference_type' => 'shop_receipt',
                'reference_id'   => $transaction->id,
            ]);

            return $transaction->load(['donor', 'beneficiary', 'shop']);
        });
    }

    /**
     * Store a payment / expense voucher transaction.
     */
    public function storePayment(array $data): ShopTransaction
    {
        return DB::transaction(function () use ($data) {
            $shop = Shop::findOrFail((int) $data['shop_id']);

            $amount = (float) $data['amount'];
            $invoiceNumber = 'PAY-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -5));

            $transaction = ShopTransaction::create([
                'shop_id'          => $shop->id,
                'human_cases_id'   => $data['human_cases_id'] ?? $shop->human_cases_id,
                'invoice_number'   => $invoiceNumber,
                'transaction_type' => 2,
                'type'             => $data['type'] ?? '1',
                'amount'           => $amount,
                'date'             => $data['date'] ?? now()->toDateString(),
                'account'          => $data['account'] ?? null,
                'balanceid'        => $data['balanceid'] ?? null,
                'notes'            => $data['notes'] ?? null,
            ]);

            app(\App\Services\Accounting\AccountingSyncService::class)->recordPayment([
                'amount'         => $amount,
                'date'           => $transaction->date ? $transaction->date->format('Y-m-d') : now()->toDateString(),
                'account'        => $data['account'] ?? $data['balanceid'] ?? null,
                'description'    => "سند صرف للحالة ({$shop->title}) رقم {$invoiceNumber}",
                'reference_type' => 'shop_payment',
                'reference_id'   => $transaction->id,
            ]);

            return $transaction->load(['donor', 'beneficiary', 'shop']);
        });
    }

    /**
     * Store design or marketing request details for a shop case.
     */
    public function storeDetail(array $data, ?UploadedFile $upload1 = null, ?UploadedFile $upload2 = null): ShopDetail
    {
        return DB::transaction(function () use ($data, $upload1, $upload2) {
            if ($upload1 && $upload1->isValid()) {
                $data['upload'] = $upload1->store('shop_details', 'public');
            }
            if ($upload2 && $upload2->isValid()) {
                $data['upload2'] = $upload2->store('shop_details', 'public');
            }

            return ShopDetail::create($data);
        });
    }

    /**
     * Get aggregate received donations grouped by donor.
     */
    public function totalReceived(array $filters = []): array
    {
        $transactions = ShopTransaction::with('donor')
            ->where('transaction_type', 1)
            ->get();

        $grouped = [];
        foreach ($transactions as $t) {
            $donorId = $t->donor_id ?? 0;
            $donorName = $t->donor?->name ?? 'فاعل خير عام';
            $donorPhone = $t->donor?->phone ?? '-';

            if (!isset($grouped[$donorId])) {
                $grouped[$donorId] = [
                    'id' => $donorId ?: $t->id,
                    'donor_id' => $donorId,
                    'donorname' => $donorName,
                    'donorphone' => $donorPhone,
                    'amount' => 0.0,
                    'count' => 0,
                ];
            }
            $grouped[$donorId]['amount'] += (float) $t->amount;
            $grouped[$donorId]['count'] += 1;
        }

        $result = array_values($grouped);
        if (!empty($filters['search'])) {
            $s = mb_strtolower($filters['search']);
            $result = array_values(array_filter($result, fn($r) =>
                str_contains(mb_strtolower($r['donorname']), $s) ||
                str_contains($r['donorphone'], $s)
            ));
        }

        return $result;
    }

    /**
     * Get donation transactions for a specific donor.
     */
    public function donorDonations(int $id, array $filters = []): array
    {
        $query = ShopTransaction::with('donor')
            ->where('transaction_type', 1);

        if ($id > 0) {
            $query->where(function ($q) use ($id) {
                $q->where('donor_id', $id)->orWhere('id', $id);
            });
        }

        if (!empty($filters['searchfrom'])) {
            $query->whereDate('date', '>=', $filters['searchfrom']);
        }
        if (!empty($filters['searchto'])) {
            $query->whereDate('date', '<=', $filters['searchto']);
        }

        return $query->get()->map(function ($t) {
            return [
                'id'                      => $t->id,
                'date'                    => $t->date?->format('Y-m-d') ?? now()->format('Y-m-d'),
                'type'                    => (int) ($t->type ?? 1),
                'transaction_type_string' => $t->transaction_type_string,
                'invoice_number'          => $t->invoice_number ?? ('REC-' . $t->id),
                'amount'                  => (float) $t->amount,
                'account'                 => $t->account ?? 'الحساب البنكي الرئيسي',
                'donor'                   => [
                    'name'  => $t->donor?->name ?? 'فاعل خير',
                    'phone' => $t->donor?->phone ?? '',
                ],
            ];
        })->toArray();
    }

    /**
     * Get aggregate payments grouped by beneficiary.
     */
    public function totalPaid(array $filters = []): array
    {
        $transactions = ShopTransaction::with('beneficiary')
            ->where('transaction_type', 2)
            ->get();

        $grouped = [];
        foreach ($transactions as $t) {
            $caseId = $t->human_cases_id ?? 0;
            $caseName = $t->beneficiary?->name ?? 'حالة إنسانية عامة';

            if (!isset($grouped[$caseId])) {
                $grouped[$caseId] = [
                    'id'              => $caseId ?: $t->id,
                    'human_case_id'   => $caseId,
                    'human_case_name' => $caseName,
                    'amount'          => 0.0,
                    'count'           => 0,
                ];
            }
            $grouped[$caseId]['amount'] += (float) $t->amount;
            $grouped[$caseId]['count'] += 1;
        }

        $result = array_values($grouped);
        if (!empty($filters['search'])) {
            $s = mb_strtolower($filters['search']);
            $result = array_values(array_filter($result, fn($r) =>
                str_contains(mb_strtolower($r['human_case_name']), $s)
            ));
        }

        return $result;
    }

    /**
     * Get payment transactions for a specific beneficiary.
     */
    public function beneficiaryPayments(int $id, array $filters = []): array
    {
        $query = ShopTransaction::with('beneficiary')
            ->where('transaction_type', 2);

        if ($id > 0) {
            $query->where(function ($q) use ($id) {
                $q->where('human_cases_id', $id)->orWhere('id', $id);
            });
        }

        if (!empty($filters['searchfrom'])) {
            $query->whereDate('date', '>=', $filters['searchfrom']);
        }
        if (!empty($filters['searchto'])) {
            $query->whereDate('date', '<=', $filters['searchto']);
        }

        return $query->get()->map(function ($t) {
            return [
                'id'                      => $t->id,
                'date'                    => $t->date?->format('Y-m-d') ?? now()->format('Y-m-d'),
                'type'                    => (int) ($t->type ?? 1),
                'transaction_type_string' => $t->transaction_type_string,
                'invoice_number'          => $t->invoice_number ?? ('PAY-' . $t->id),
                'amount'                  => (float) $t->amount,
                'notes'                   => $t->notes ?? 'صرف مساعدة للحالة',
                'account'                 => $t->account ?? 'الصندوق الرئيسي',
            ];
        })->toArray();
    }

    /**
     * Show single voucher details for print/view screens.
     */
    public function showVoucher(int $id, string $context = 'shop'): array
    {
        $paymentTypeLabel = fn ($type) => match ((string) $type) {
            '1' => 'الشبكة',
            '2' => 'تحويل بنكي',
            '3' => 'إيداع',
            '4' => 'شيك',
            '5' => 'نقدي',
            '6' => 'KNET',
            default => 'تحويل بنكي',
        };

        if ($context === 'project') {
            $pt = \App\Models\ProjectTransaction::find($id) ?? \App\Models\ProjectTransaction::latest('id')->first();
            if ($pt) {
                return [
                    'id'                      => $pt->id,
                    'invoice_number'          => $pt->invoice_number ?? ('PRJ-' . str_pad((string) $pt->id, 5, '0', STR_PAD_LEFT)),
                    'amount'                  => max(1, (float) $pt->amount),
                    'description'             => $pt->description ?? 'تبرع لدعم مشروع خيري',
                    'date'                    => $pt->date?->format('Y-m-d') ?? now()->format('Y-m-d'),
                    'transaction_type_string' => $paymentTypeLabel($pt->payment_method ?? '1'),
                ];
            }
        }

        if ($context === 'assembly') {
            $member = \App\Models\AssemblyMember::find($id) ?? \App\Models\AssemblyMember::first();
            if ($member) {
                return [
                    'id'                      => $member->id,
                    'invoice_number'          => 'SUB-' . str_pad((string) $member->id, 5, '0', STR_PAD_LEFT),
                    'amount'                  => max(1, (float) ($member->subscription_fees ?: 500)),
                    'description'             => 'سداد رسوم اشتراك العضوية - ' . $member->name,
                    'date'                    => $member->start_subscription_date?->format('Y-m-d') ?? now()->format('Y-m-d'),
                    'transaction_type_string' => 'تحويل بنكي',
                ];
            }
        }

        $tx = ShopTransaction::find($id) ?? ShopTransaction::latest('id')->first();
        if ($tx) {
            return [
                'id'                      => $tx->id,
                'invoice_number'          => $tx->invoice_number ?? ('INV-' . str_pad((string) $tx->id, 5, '0', STR_PAD_LEFT)),
                'amount'                  => max(1, (float) $tx->amount),
                'description'             => $tx->notes ?? ($tx->transaction_type === 2 ? 'صرف مساعدة مالية لمستفيد' : 'تبرع لدعم الحالات الإنسانية'),
                'date'                    => $tx->date?->format('Y-m-d') ?? now()->format('Y-m-d'),
                'transaction_type_string' => $paymentTypeLabel($tx->type ?? '1'),
            ];
        }

        return [
            'id'                      => $id,
            'invoice_number'          => 'INV-' . str_pad((string) $id, 5, '0', STR_PAD_LEFT),
            'amount'                  => 1000,
            'description'             => 'سند مالي',
            'date'                    => now()->format('Y-m-d'),
            'transaction_type_string' => 'نقدي',
        ];
    }
}
