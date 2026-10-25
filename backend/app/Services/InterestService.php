<?php

namespace App\Services;

use App\Models\Interest;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class InterestService
{
    /**
     * Get list of interests with optional search and date filtering.
     */
    public function list(array $filters = []): Collection
    {
        $query = Interest::query()->latest();

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
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
     * Get all interests without pagination.
     */
    public function all(): Collection
    {
        return Interest::query()->latest()->get();
    }

    /**
     * Create a new interest.
     */
    public function create(array $data): Interest
    {
        return DB::transaction(function () use ($data) {
            return Interest::create([
                'name'        => $data['name'],
                'description' => $data['description'] ?? null,
            ]);
        });
    }

    /**
     * Update an existing interest.
     */
    public function update(int $id, array $data): Interest
    {
        return DB::transaction(function () use ($id, $data) {
            $interest = Interest::findOrFail($id);
            $interest->update([
                'name'        => $data['name'],
                'description' => $data['description'] ?? null,
            ]);

            return $interest;
        });
    }

    /**
     * Delete an interest.
     */
    public function delete(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $interest = Interest::findOrFail($id);

            return (bool) $interest->delete();
        });
    }
}
