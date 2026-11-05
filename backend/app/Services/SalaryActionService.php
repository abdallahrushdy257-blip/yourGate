<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\SalaryAction;
use Carbon\Carbon;

class SalaryActionService
{
    public function ensureDefaults(): void
    {
        if (SalaryAction::count() === 0) {
            $employees = Employee::take(2)->get();
            if ($employees->count() >= 1) {
                $firstEmp = $employees[0];
                $this->store([
                    'employee_id' => $firstEmp->id,
                    'type'        => 0, // مكافأة
                    'reason'      => 'مكافآت وحوافز سنوية',
                    'amounttype'  => 1, // مال
                    'amount'      => 1500,
                    'date'        => Carbon::today()->format('Y-m-d'),
                    'description' => 'مكافأة تميز وإنجاز المهام الاستثنائية',
                    'component'   => '41102006',
                ]);

                if ($employees->count() >= 2) {
                    $secondEmp = $employees[1];
                    $this->store([
                        'employee_id' => $secondEmp->id,
                        'type'        => 1, // خصم
                        'reason'      => 'خصومات الرواتب',
                        'amounttype'  => 0, // أيام
                        'amount'      => 1,
                        'date'        => Carbon::today()->format('Y-m-d'),
                        'description' => 'خصم يوم غياب بدون إذن مسبق',
                        'component'   => '41101009',
                    ]);
                }
            }
        }
    }

    public function list(array $filters = [], ?int $perPage = null)
    {
        $this->ensureDefaults();

        $query = SalaryAction::with('employee')->latest('id');

        if (isset($filters['type']) && $filters['type'] !== '' && $filters['type'] !== 'all') {
            $query->where('type', (int) $filters['type']);
        }

        if (!empty($filters['employee_id'])) {
            $query->where('employee_id', (int) $filters['employee_id']);
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
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('employee', function ($eq) use ($search) {
                      $eq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($perPage !== null && $perPage > 0) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    public function store(array $data): SalaryAction
    {
        $empId = (int) ($data['employee_id'] ?? $data['id'] ?? 0);
        if (!$empId) {
            $first = Employee::first();
            $empId = $first ? $first->id : 1;
        }

        return SalaryAction::create([
            'employee_id' => $empId,
            'type'        => (int) $data['type'],
            'reason'      => $data['reason'] ?? null,
            'amounttype'  => (int) ($data['amounttype'] ?? 1),
            'amount'      => (float) $data['amount'],
            'date'        => $data['date'] ? substr($data['date'], 0, 10) : Carbon::today()->format('Y-m-d'),
            'description' => $data['description'] ?? null,
            'component'   => $data['component'] ?? null,
        ]);
    }

    public function find(int $id): SalaryAction
    {
        return SalaryAction::with('employee')->findOrFail($id);
    }

    public function update(int $id, array $data): SalaryAction
    {
        $action = $this->find($id);

        $payload = [];
        if (isset($data['type']))        $payload['type'] = (int) $data['type'];
        if (isset($data['amounttype']))  $payload['amounttype'] = (int) $data['amounttype'];
        if (isset($data['amount']))      $payload['amount'] = (float) $data['amount'];
        if (isset($data['date']))        $payload['date'] = substr($data['date'], 0, 10);
        if (array_key_exists('reason', $data))      $payload['reason'] = $data['reason'];
        if (array_key_exists('description', $data)) $payload['description'] = $data['description'];
        if (array_key_exists('component', $data))   $payload['component'] = $data['component'];

        $action->update($payload);

        return $action->fresh('employee');
    }

    public function delete(int $id): bool
    {
        $action = $this->find($id);
        return (bool) $action->delete();
    }
}
