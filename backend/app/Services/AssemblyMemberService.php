<?php

namespace App\Services;

use App\Models\AssemblyMember;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AssemblyMemberService
{
    /**
     * Get list of assembly members with search and date filters.
     */
    public function list(array $filters = []): Collection
    {
        $query = AssemblyMember::query()->latest();

        if (! empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('membership_serial', 'like', "%{$search}%")
                  ->orWhere('nationalid', 'like', "%{$search}%")
                  ->orWhere('job', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['searchfrom'])) {
            $query->whereDate('created_at', '>=', $filters['searchfrom']);
        }

        if (! empty($filters['searchto'])) {
            $query->whereDate('created_at', '<=', $filters['searchto']);
        }

        if (isset($filters['status']) && $filters['status'] !== '' && $filters['status'] !== null) {
            $query->where('status', (int) $filters['status']);
        }

        if (! empty($filters['membertype']) || ! empty($filters['subscription_type'])) {
            $type = $filters['membertype'] ?? $filters['subscription_type'];
            $query->where('subscription_type', (string) $type);
        }

        $page = max(1, (int) ($filters['page'] ?? 1));
        $perPage = (int) ($filters['perpage'] ?? $filters['per_page'] ?? 10);

        if ($perPage > 0) {
            $query->skip(($page - 1) * $perPage)->take($perPage);
        }

        return $query->get();
    }

    /**
     * Find member by ID.
     */
    public function find(int $id): AssemblyMember
    {
        return AssemblyMember::findOrFail($id);
    }

    /**
     * Store a new assembly member.
     */
    public function create(array $data, $uploadFile = null): AssemblyMember
    {
        return DB::transaction(function () use ($data, $uploadFile) {
            $attributes = $this->normalizeAttributes($data);

            if ($uploadFile instanceof UploadedFile) {
                $path = $uploadFile->store('assembly_members', 'public');
                $attributes['upload'] = asset('storage/' . $path);
            }

            return AssemblyMember::create($attributes);
        });
    }

    /**
     * Update an existing assembly member.
     */
    public function update(int $id, array $data, $uploadFile = null): AssemblyMember
    {
        return DB::transaction(function () use ($id, $data, $uploadFile) {
            $member = $this->find($id);
            $attributes = $this->normalizeAttributes($data);

            if ($uploadFile instanceof UploadedFile) {
                if ($member->upload && ! str_starts_with($member->upload, 'http')) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $member->upload));
                }
                $path = $uploadFile->store('assembly_members', 'public');
                $attributes['upload'] = asset('storage/' . $path);
            }

            $member->update($attributes);

            return $member->fresh();
        });
    }

    /**
     * Delete an assembly member.
     */
    public function delete(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $member = $this->find($id);
            return (bool) $member->delete();
        });
    }

    /**
     * Get aggregate statistics for assembly members.
     */
    public function stats(): array
    {
        $total = AssemblyMember::count();
        $board = AssemblyMember::where('status', 1)->count();
        $general = AssemblyMember::where('status', 2)->count();
        $fees = AssemblyMember::sum('subscription_fees') ?? 0;

        return [
            'total_members'   => $total,
            'board_members'   => $board,
            'general_members' => $general,
            'total_fees'      => (float) $fees,
        ];
    }

    /**
     * Normalize frontend aliases into model columns.
     */
    protected function normalizeAttributes(array $data): array
    {
        $normalized = [];

        if (isset($data['name'])) $normalized['name'] = $data['name'];
        if (isset($data['membership_serial'])) $normalized['membership_serial'] = $data['membership_serial'];

        $normalized['dateofbirth'] = $data['dateofbirth'] ?? $data['dob'] ?? null;
        $normalized['nationalid'] = $data['nationalid'] ?? null;
        $normalized['nationalid_expire'] = $data['nationalid_expire'] ?? $data['idexpire'] ?? null;
        $normalized['start_subscription_date'] = $data['start_subscription_date'] ?? $data['startjoin'] ?? null;
        $normalized['end_subscription_date'] = $data['end_subscription_date'] ?? $data['endjoin'] ?? null;
        $normalized['status'] = isset($data['status']) && $data['status'] !== '' ? (int) $data['status'] : 2;
        $normalized['subscription_type'] = $data['subscription_type'] ?? $data['membertype'] ?? null;
        $normalized['start_membership_date'] = $data['start_membership_date'] ?? $data['startmember'] ?? null;
        $normalized['job'] = $data['job'] ?? null;
        $normalized['jobaddress'] = $data['jobaddress'] ?? $data['jobAddress'] ?? null;
        $normalized['subscription_fees'] = $data['subscription_fees'] ?? $data['fees'] ?? 0;
        $normalized['notes'] = $data['notes'] ?? null;

        return array_filter($normalized, fn ($val) => $val !== null);
    }
}
