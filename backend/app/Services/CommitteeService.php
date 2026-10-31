<?php

namespace App\Services;

use App\Models\Committee;
use App\Models\CommitteeMember;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class CommitteeService
{
    /**
     * Get list of committees with search and date filters.
     */
    public function list(array $filters = []): Collection
    {
        $query = Committee::query()
            ->with('members')
            ->withCount('members')
            ->latest();

        if (! empty($filters['search'])) {
            $search = trim($filters['search']);
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
     * Summary stats for committees.
     */
    public function stats(): array
    {
        return [
            'total_committees' => Committee::count(),
            'total_members'    => CommitteeMember::count(),
        ];
    }

    /**
     * Find a committee by ID with its members.
     */
    public function find(int $id): Committee
    {
        return Committee::with('members')->findOrFail($id);
    }

    /**
     * Create a new committee with members.
     */
    public function create(array $data): Committee
    {
        return DB::transaction(function () use ($data) {
            $committee = Committee::create([
                'name'        => $data['name'],
                'description' => $data['description'] ?? null,
            ]);

            if (! empty($data['members']) && is_array($data['members'])) {
                foreach ($data['members'] as $memberData) {
                    $committee->members()->create([
                        'assembly_member_id' => $memberData['id'] ?? null,
                        'name'               => $memberData['name'] ?? '',
                        'role'               => $memberData['role'] ?? 'عضو',
                    ]);
                }
            }

            return $committee->fresh(['members']);
        });
    }

    /**
     * Update an existing committee.
     */
    public function update(int $id, array $data): Committee
    {
        return DB::transaction(function () use ($id, $data) {
            $committee = $this->find($id);

            $updatePayload = [];
            if (isset($data['name'])) {
                $updatePayload['name'] = $data['name'];
            }
            if (array_key_exists('description', $data)) {
                $updatePayload['description'] = $data['description'];
            }

            if (! empty($updatePayload)) {
                $committee->update($updatePayload);
            }

            if (isset($data['members']) && is_array($data['members'])) {
                $committee->members()->delete();
                foreach ($data['members'] as $memberData) {
                    $committee->members()->create([
                        'assembly_member_id' => $memberData['id'] ?? null,
                        'name'               => $memberData['name'] ?? '',
                        'role'               => $memberData['role'] ?? 'عضو',
                    ]);
                }
            }

            return $committee->fresh(['members']);
        });
    }

    /**
     * Delete a committee.
     */
    public function delete(int $id): bool
    {
        $committee = $this->find($id);

        return (bool) $committee->delete();
    }

    /**
     * List members of a specific committee (for TableComponent).
     */
    public function listMembers(int $committeeId, array $filters = []): Collection
    {
        $committee = $this->find($committeeId);
        $query = $committee->members()->latest();

        if (! empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('role', 'like', "%{$search}%");
            });
        }

        $page = max(1, (int) ($filters['page'] ?? 1));
        $perPage = (int) ($filters['perpage'] ?? $filters['per_page'] ?? 10);

        if ($perPage > 0) {
            $query->skip(($page - 1) * $perPage)->take($perPage);
        }

        return $query->get();
    }
}
