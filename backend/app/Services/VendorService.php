<?php

namespace App\Services;

use App\Models\Vendor;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class VendorService
{
    /**
     * Get list of vendors with optional search, date filtering, and pagination.
     */
    public function list(array $filters = []): Collection
    {
        $query = Vendor::query()->latest();

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('region', 'like', "%{$search}%")
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
     * Get all vendors without pagination.
     */
    public function all(): Collection
    {
        return Vendor::query()->latest()->get();
    }

    /**
     * Find a vendor by ID.
     */
    public function find(int $id): Vendor
    {
        return Vendor::findOrFail($id);
    }

    /**
     * Create a new vendor.
     */
    public function create(array $data): Vendor
    {
        return DB::transaction(function () use ($data) {
            return Vendor::create([
                'name'                       => $data['name'],
                'email'                      => $data['email'] ?? null,
                'phone'                      => $data['phone'] ?? null,
                'address'                    => $data['address'] ?? null,
                'region'                     => $data['region'] ?? null,
                'description'                => $data['description'] ?? null,
                'identification_number'      => $data['identification_number'] ?? null,
                'identification_description' => $data['identification_description'] ?? null,
                'type'                       => $data['type'] ?? null,
            ]);
        });
    }

    /**
     * Update an existing vendor.
     */
    public function update(int $id, array $data): Vendor
    {
        return DB::transaction(function () use ($id, $data) {
            $vendor = Vendor::findOrFail($id);

            $vendor->update([
                'name'                       => $data['name'],
                'email'                      => $data['email'] ?? null,
                'phone'                      => $data['phone'] ?? null,
                'address'                    => $data['address'] ?? null,
                'region'                     => $data['region'] ?? null,
                'description'                => $data['description'] ?? null,
                'identification_number'      => $data['identification_number'] ?? null,
                'identification_description' => $data['identification_description'] ?? null,
                'type'                       => $data['type'] ?? null,
            ]);

            return $vendor;
        });
    }

    /**
     * Delete a vendor.
     */
    public function delete(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $vendor = Vendor::findOrFail($id);

            return (bool) $vendor->delete();
        });
    }
}
