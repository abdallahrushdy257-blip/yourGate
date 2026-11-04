<?php

namespace App\Services;

use App\Models\LatePolicy;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class LatePolicyService
{
    /**
     * Default policies seeded on first access.
     */
    public function defaultPolicies(): array
    {
        return [
            [
                'category'    => 'late',
                'from_minute' => 1,
                'to_minute'   => 15,
                'hour'        => 0,
                'type'        => 'day_fraction',
                'value'       => 0.25,
                'active'      => true,
            ],
            [
                'category'    => 'late',
                'from_minute' => 16,
                'to_minute'   => 30,
                'hour'        => 0,
                'type'        => 'day_fraction',
                'value'       => 0.50,
                'active'      => true,
            ],
            [
                'category'    => 'overtime',
                'from_minute' => 0,
                'to_minute'   => 0,
                'hour'        => 1,
                'type'        => 'fixed_amount',
                'value'       => 100,
                'active'      => true,
            ],
            [
                'category'    => 'absence_without_permission',
                'from_minute' => 0,
                'to_minute'   => 0,
                'hour'        => 0,
                'type'        => 'day_fraction',
                'value'       => 1,
                'active'      => true,
            ],
        ];
    }

    /**
     * Ensure default policies exist for store.
     */
    public function ensureDefaults(): void
    {
        if (LatePolicy::count() === 0) {
            foreach ($this->defaultPolicies() as $item) {
                LatePolicy::create($item);
            }
        }
    }

    /**
     * List policies with optional filtering and pagination.
     */
    public function list(array $filters = [], ?int $perPage = null)
    {
        $this->ensureDefaults();

        $query = LatePolicy::query();

        if (!empty($filters['category']) && $filters['category'] !== 'all') {
            $query->where('category', $filters['category']);
        }

        $query->orderBy('id', 'asc');

        if ($perPage !== null && $perPage > 0) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Store a new policy.
     */
    public function store(array $data): LatePolicy
    {
        return LatePolicy::create([
            'category'    => $data['category'],
            'from_minute' => $data['from_minute'] ?? 0,
            'to_minute'   => $data['to_minute'] ?? 0,
            'hour'        => $data['hour'] ?? 0,
            'type'        => $data['type'],
            'value'       => $data['value'],
            'active'      => isset($data['active']) ? (bool) $data['active'] : true,
            'note'        => $data['note'] ?? null,
        ]);
    }

    /**
     * Find a policy by ID.
     */
    public function find(int $id): LatePolicy
    {
        return LatePolicy::findOrFail($id);
    }

    /**
     * Update an existing policy.
     */
    public function update(int $id, array $data): LatePolicy
    {
        $policy = $this->find($id);

        $payload = [];
        if (isset($data['category']))    $payload['category'] = $data['category'];
        if (isset($data['from_minute'])) $payload['from_minute'] = (int) $data['from_minute'];
        if (isset($data['to_minute']))   $payload['to_minute'] = (int) $data['to_minute'];
        if (isset($data['hour']))        $payload['hour'] = (float) $data['hour'];
        if (isset($data['type']))        $payload['type'] = $data['type'];
        if (isset($data['value']))       $payload['value'] = (float) $data['value'];
        if (isset($data['active']))      $payload['active'] = (bool) $data['active'];
        if (array_key_exists('note', $data)) $payload['note'] = $data['note'];

        $policy->update($payload);

        return $policy->fresh();
    }

    /**
     * Delete a policy by ID.
     */
    public function delete(int $id): bool
    {
        $policy = $this->find($id);
        return (bool) $policy->delete();
    }
}
