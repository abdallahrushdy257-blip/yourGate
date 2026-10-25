<?php

namespace App\Services;

use App\Models\HumanCase;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class HumanCaseService
{
    /**
     * Get list of beneficiaries with optional search, date filtering, and pagination.
     */
    public function list(array $filters = []): Collection
    {
        $query = HumanCase::query()->latest();

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('idnumber', 'like', "%{$search}%")
                  ->orWhere('phonenum', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('accnumber', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['searchfrom'])) {
            $query->whereDate('created_at', '>=', $filters['searchfrom']);
        }

        if (! empty($filters['searchto'])) {
            $query->whereDate('created_at', '<=', $filters['searchto']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $page = max(1, (int) ($filters['page'] ?? 1));
        $perPage = (int) ($filters['perpage'] ?? $filters['per_page'] ?? 10);

        if ($perPage > 0) {
            $query->skip(($page - 1) * $perPage)->take($perPage);
        }

        return $query->get();
    }

    /**
     * Get rejected beneficiaries.
     */
    public function rejected(array $filters = []): Collection
    {
        $filters['status'] = '3';

        return $this->list($filters);
    }

    /**
     * Get all beneficiaries without pagination.
     */
    public function all(): Collection
    {
        return HumanCase::query()->latest()->get();
    }

    /**
     * Find a beneficiary by ID.
     */
    public function find(int $id): HumanCase
    {
        return HumanCase::findOrFail($id);
    }

    /**
     * Create a new beneficiary.
     */
    public function create(array $data): HumanCase
    {
        return DB::transaction(function () use ($data) {
            return HumanCase::create([
                'name'          => $data['name'],
                'gender'        => $data['gender'] ?? null,
                'dob'           => $data['dob'] ?? null,
                'humancasetype' => $data['humancasetype'] ?? null,
                'status'        => $data['status'] ?? '1',
                'nationality'   => $data['nationality'] ?? null,
                'familycount'   => ! empty($data['familycount']) ? (int) $data['familycount'] : null,
                'phonenum'      => $data['phonenum'] ?? null,
                'email'         => $data['email'] ?? null,
                'accnumber'     => $data['accnumber'] ?? null,
                'idnumber'      => $data['idnumber'] ?? null,
                'idsource'      => $data['idsource'] ?? null,
                'iddate'        => $data['iddate'] ?? null,
                'note'          => $data['note'] ?? null,
            ]);
        });
    }

    /**
     * Update an existing beneficiary.
     */
    public function update(int $id, array $data): HumanCase
    {
        return DB::transaction(function () use ($id, $data) {
            $humanCase = HumanCase::findOrFail($id);

            $humanCase->update([
                'name'          => $data['name'],
                'gender'        => $data['gender'] ?? $humanCase->gender,
                'dob'           => $data['dob'] ?? $humanCase->dob,
                'humancasetype' => $data['humancasetype'] ?? $humanCase->humancasetype,
                'status'        => $data['status'] ?? $humanCase->status,
                'nationality'   => $data['nationality'] ?? $humanCase->nationality,
                'familycount'   => isset($data['familycount']) ? (int) $data['familycount'] : $humanCase->familycount,
                'phonenum'      => $data['phonenum'] ?? $humanCase->phonenum,
                'email'         => $data['email'] ?? $humanCase->email,
                'accnumber'     => $data['accnumber'] ?? $humanCase->accnumber,
                'idnumber'      => $data['idnumber'] ?? $humanCase->idnumber,
                'idsource'      => $data['idsource'] ?? $humanCase->idsource,
                'iddate'        => $data['iddate'] ?? $humanCase->iddate,
                'note'          => $data['note'] ?? $humanCase->note,
            ]);

            return $humanCase;
        });
    }

    /**
     * Delete a beneficiary.
     */
    public function delete(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $humanCase = HumanCase::findOrFail($id);

            return (bool) $humanCase->delete();
        });
    }
}
