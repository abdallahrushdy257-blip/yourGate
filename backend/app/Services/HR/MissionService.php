<?php

namespace App\Services\HR;

use App\Models\Employee;
use App\Models\Mission;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MissionService
{
    /**
     * List missions with search and date filters.
     */
    public function list(array $filters = [])
    {
        $query = Mission::query()->latest('id');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['searchfrom'])) {
            $query->whereDate('start_date', '>=', $filters['searchfrom']);
        }

        if (!empty($filters['searchto'])) {
            $query->whereDate('start_date', '<=', $filters['searchto']);
        }

        $perPage = isset($filters['perpage']) ? (int) $filters['perpage'] : null;

        if ($perPage && $perPage > 0) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Get active employees/users for assignment options.
     */
    public function getEmployees(): array
    {
        $employees = Employee::query()
            ->where(function ($q) {
                $q->where('is_active', true)->orWhereNull('is_active');
            })
            ->select('id', 'name')
            ->get();

        if ($employees->isEmpty()) {
            $employees = User::query()->select('id', 'name')->get();
        }

        return $employees->map(function ($emp) {
            return [
                'id'   => (string) $emp->id,
                'name' => $emp->name,
                'type' => 'employee',
            ];
        })->values()->all();
    }

    /**
     * Create a new mission.
     */
    public function create(array $data): Mission
    {
        return DB::transaction(function () use ($data) {
            if (isset($data['upload']) && $data['upload'] instanceof UploadedFile) {
                $path = $data['upload']->store('missions', 'public');
                $data['upload'] = $path;
            } elseif (!is_string($data['upload'] ?? null)) {
                unset($data['upload']);
            }

            if (isset($data['incharge']) && is_string($data['incharge'])) {
                $decoded = json_decode($data['incharge'], true);
                $data['incharge'] = $decoded !== null ? $decoded : $data['incharge'];
            }

            if (!isset($data['status'])) {
                $data['status'] = 1;
            }

            return Mission::create($data);
        });
    }

    /**
     * Find mission by ID.
     */
    public function find(int $id): Mission
    {
        return Mission::findOrFail($id);
    }

    /**
     * Update an existing mission.
     */
    public function update(int $id, array $data): Mission
    {
        return DB::transaction(function () use ($id, $data) {
            $mission = $this->find($id);

            if (isset($data['upload']) && $data['upload'] instanceof UploadedFile) {
                if ($mission->upload && Storage::disk('public')->exists($mission->upload)) {
                    Storage::disk('public')->delete($mission->upload);
                }
                $path = $data['upload']->store('missions', 'public');
                $data['upload'] = $path;
            } elseif (!is_string($data['upload'] ?? null)) {
                unset($data['upload']);
            }

            if (isset($data['incharge']) && is_string($data['incharge'])) {
                $decoded = json_decode($data['incharge'], true);
                $data['incharge'] = $decoded !== null ? $decoded : $data['incharge'];
            }

            $mission->update($data);

            return $mission->fresh();
        });
    }

    /**
     * Delete a mission.
     */
    public function delete(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $mission = $this->find($id);

            if ($mission->upload && Storage::disk('public')->exists($mission->upload)) {
                Storage::disk('public')->delete($mission->upload);
            }

            return $mission->delete();
        });
    }
}
