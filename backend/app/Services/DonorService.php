<?php

namespace App\Services;

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

            return (bool) $donor->delete();
        });
    }
}
