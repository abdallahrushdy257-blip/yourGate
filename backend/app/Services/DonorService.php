<?php

namespace App\Services;

use App\Exceptions\DonorException;
use App\Models\Donor;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class DonorService
{
    /**
     * Get list of donors with optional search, date filtering, and pagination.
     */
    public function list(array $filters = []): Collection
    {
        $query = Donor::query()->with('interest')->latest();

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('identification_number', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['searchfrom'])) {
            $query->whereDate('created_at', '>=', $filters['searchfrom']);
        }

        if (! empty($filters['searchto'])) {
            $query->whereDate('created_at', '<=', $filters['searchto']);
        }

        $page = max(1, (int) ($filters['page'] ?? 1));
        $perPage = (int) ($filters['perpage'] ?? $filters['per_page'] ?? 10);

        if ($perPage > 0) {
            $query->skip(($page - 1) * $perPage)->take($perPage);
        }

        return $query->get();
    }

    /**
     * Get all donors without pagination.
     */
    public function all(): Collection
    {
        return Donor::query()->with('interest')->latest()->get();
    }

    /**
     * Find a donor by ID.
     */
    public function find(int $id): Donor
    {
        return Donor::with('interest')->findOrFail($id);
    }

    /**
     * Create a new donor.
     */
    public function create(array $data): Donor
    {
        return DB::transaction(function () use ($data) {
            $interestId = $data['interest_id'] ?? $data['donorInterests'] ?? null;
            if (empty($interestId)) {
                $interestId = null;
            }

            return Donor::create([
                'interest_id'                => $interestId,
                'name'                       => $data['name'],
                'address'                    => $data['address'] ?? null,
                'phone'                      => $data['phone'] ?? null,
                'email'                      => $data['email'] ?? null,
                'type'                       => $data['type'] ?? null,
                'identification_number'      => $data['identification_number'] ?? null,
                'identification_description' => $data['identification_description'] ?? null,
            ]);
        });
    }

    /**
     * Update an existing donor.
     */
    public function update(int $id, array $data): Donor
    {
        return DB::transaction(function () use ($id, $data) {
            $donor = Donor::findOrFail($id);

            $interestId = $data['interest_id'] ?? $data['donorInterests'] ?? null;
            if (empty($interestId)) {
                $interestId = null;
            }

            $donor->update([
                'interest_id'                => $interestId,
                'name'                       => $data['name'],
                'address'                    => $data['address'] ?? null,
                'phone'                      => $data['phone'] ?? null,
                'email'                      => $data['email'] ?? null,
                'type'                       => $data['type'] ?? null,
                'identification_number'      => $data['identification_number'] ?? null,
                'identification_description' => $data['identification_description'] ?? null,
            ]);

            return $donor->load('interest');
        });
    }

    /**
     * Delete a donor.
     */
    public function delete(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $donor = Donor::findOrFail($id);

            if ($donor->hasTransactions()) {
                throw DonorException::hasTransactions();
            }

            return (bool) $donor->delete();
        });
    }

    /**
     * Store a direct receipt voucher from a donor.
     */
    public function storeReceipt(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $donorId = (int) ($data['id'] ?? $data['donor_id'] ?? 0);
            $donor = $donorId > 0 ? Donor::find($donorId) : Donor::first();
            $amount = (float) ($data['amount'] ?? 0);
            $date = $data['date'] ?? now()->toDateString();
            $invoiceNumber = 'DNR-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -5));
            $description = $data['description'] ?? ('سند قبض تبرع من المانح ' . ($donor?->name ?? 'فاعل خير'));

            $shop = \App\Models\Shop::first();
            $txId = null;
            if ($shop && $amount > 0) {
                $tx = \App\Models\ShopTransaction::create([
                    'shop_id'          => $shop->id,
                    'donor_id'         => $donor?->id,
                    'invoice_number'   => $invoiceNumber,
                    'transaction_type' => 1,
                    'type'             => (string) ($data['type'] ?? '1'),
                    'amount'           => $amount,
                    'date'             => $date,
                    'account'          => $data['account'] ?? null,
                    'notes'            => $description,
                ]);
                $txId = $tx->id;
            }

            if ($amount > 0) {
                app(\App\Services\Accounting\AccountingSyncService::class)->recordReceipt([
                    'amount'         => $amount,
                    'date'           => $date,
                    'account'        => $data['account'] ?? null,
                    'revenue_code'   => $data['code'] ?? null,
                    'description'    => $description,
                    'reference_type' => 'donor_receipt',
                    'reference_id'   => $txId ?? $donor?->id,
                ]);
            }

            return [
                'id'             => $txId ?? ($donor?->id ?? 1),
                'donor_id'       => $donor?->id,
                'invoice_number' => $invoiceNumber,
                'amount'         => $amount,
                'date'           => $date,
                'description'    => $description,
            ];
        });
    }
}
