<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Investigation;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class InvestigationService
{
    /**
     * Seed initial demo records if none exist for current tenant.
     */
    public function ensureDefaults(): void
    {
        if (Investigation::count() === 0) {
            $employees = Employee::take(2)->get();
            if ($employees->count() >= 1) {
                $investigator = $employees[0];
                $accused = $employees->count() >= 2 ? $employees[1] : $employees[0];

                Investigation::create([
                    'employee_id'     => $accused->id,
                    'investigator_id' => $investigator->id,
                    'reason'          => 'التحقيق في انصراف مبكر وتأخير غير مبرر',
                    'result'          => 'تم لفت النظر والتعهد بعدم التكرار',
                    'date'            => Carbon::today()->subDays(2)->format('Y-m-d'),
                    'description'     => 'جلسة استماع إدارية بخصوص الالتزام بمواعيد الدوام الرسمي.',
                ]);
            }
        }
    }

    /**
     * List investigations with filters and optional pagination.
     */
    public function list(array $filters = [], ?int $perPage = null)
    {
        $this->ensureDefaults();

        $query = Investigation::with(['employee', 'investigator'])->latest('date')->latest('id');

        if (!empty($filters['employee_id'])) {
            $query->where('employee_id', (int) $filters['employee_id']);
        }

        if (!empty($filters['investigator_id'])) {
            $query->where('investigator_id', (int) $filters['investigator_id']);
        }

        if (!empty($filters['from'])) {
            $query->whereDate('date', '>=', $filters['from']);
        }

        if (!empty($filters['to'])) {
            $query->whereDate('date', '<=', $filters['to']);
        }

        if (!empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('reason', 'like', "%{$search}%")
                  ->orWhere('result', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('employee', function ($eq) use ($search) {
                      $eq->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('investigator', function ($iq) use ($search) {
                      $iq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($perPage !== null && $perPage > 0) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Store a new investigation.
     */
    public function store(array $data): Investigation
    {
        return DB::transaction(function () use ($data) {
            $attachmentPath = null;
            if (isset($data['attach']) && $data['attach'] instanceof UploadedFile) {
                $attachmentPath = $data['attach']->store('investigations', 'public');
            } elseif (isset($data['attachment']) && $data['attachment'] instanceof UploadedFile) {
                $attachmentPath = $data['attachment']->store('investigations', 'public');
            } elseif (isset($data['attachment']) && is_string($data['attachment'])) {
                $attachmentPath = $data['attachment'];
            }

            $date = !empty($data['date'])
                ? substr($data['date'], 0, 10)
                : Carbon::today()->format('Y-m-d');

            return Investigation::create([
                'employee_id'     => (int) ($data['employee_id'] ?? $data['id'] ?? 0),
                'investigator_id' => !empty($data['investigator_id']) ? (int) $data['investigator_id'] : null,
                'reason'          => $data['reason'] ?? null,
                'result'          => $data['result'] ?? null,
                'date'            => $date,
                'description'     => $data['description'] ?? null,
                'attachment'      => $attachmentPath,
            ]);
        });
    }

    /**
     * Find single investigation.
     */
    public function find(int $id): Investigation
    {
        return Investigation::with(['employee', 'investigator'])->findOrFail($id);
    }

    /**
     * Update an investigation.
     */
    public function update(int $id, array $data): Investigation
    {
        return DB::transaction(function () use ($id, $data) {
            $investigation = $this->find($id);

            $updateData = [];

            if (isset($data['employee_id'])) {
                $updateData['employee_id'] = (int) $data['employee_id'];
            }
            if (array_key_exists('investigator_id', $data)) {
                $updateData['investigator_id'] = !empty($data['investigator_id']) ? (int) $data['investigator_id'] : null;
            }
            if (array_key_exists('reason', $data)) {
                $updateData['reason'] = $data['reason'];
            }
            if (array_key_exists('result', $data)) {
                $updateData['result'] = $data['result'];
            }
            if (!empty($data['date'])) {
                $updateData['date'] = substr($data['date'], 0, 10);
            }
            if (array_key_exists('description', $data)) {
                $updateData['description'] = $data['description'];
            }

            if (isset($data['attach']) && $data['attach'] instanceof UploadedFile) {
                if ($investigation->attachment && Storage::disk('public')->exists($investigation->attachment)) {
                    Storage::disk('public')->delete($investigation->attachment);
                }
                $updateData['attachment'] = $data['attach']->store('investigations', 'public');
            } elseif (isset($data['attachment']) && $data['attachment'] instanceof UploadedFile) {
                if ($investigation->attachment && Storage::disk('public')->exists($investigation->attachment)) {
                    Storage::disk('public')->delete($investigation->attachment);
                }
                $updateData['attachment'] = $data['attachment']->store('investigations', 'public');
            }

            $investigation->update($updateData);

            return $investigation->fresh(['employee', 'investigator']);
        });
    }

    /**
     * Delete an investigation.
     */
    public function delete(int $id): bool
    {
        $investigation = $this->find($id);

        if ($investigation->attachment && Storage::disk('public')->exists($investigation->attachment)) {
            Storage::disk('public')->delete($investigation->attachment);
        }

        return (bool) $investigation->delete();
    }
}
