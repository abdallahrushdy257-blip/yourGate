<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\EmployeeAdvance;
use App\Models\EmployeeAdvanceInstallment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class EmployeeAdvanceService
{
    public function ensureDefaults(): void
    {
        if (EmployeeAdvance::count() === 0) {
            $employees = Employee::take(2)->get();
            if ($employees->count() >= 1) {
                $firstEmp = $employees[0];
                $this->store([
                    'employee_id' => $firstEmp->id,
                    'amount'      => 12000,
                    'months'      => 6,
                    'start_date'  => '2026-01-01',
                    'notes'       => 'سلفة طارئة لشراء مستلزمات',
                ]);

                if ($employees->count() >= 2) {
                    $secondEmp = $employees[1];
                    $this->store([
                        'employee_id' => $secondEmp->id,
                        'amount'      => 5000,
                        'months'      => 5,
                        'start_date'  => '2026-03-01',
                        'notes'       => 'سلفة علاجية',
                    ]);
                }
            }
        }
    }

    public function list(array $filters = [], ?int $perPage = null)
    {
        $this->ensureDefaults();

        $query = EmployeeAdvance::with(['employee', 'installments'])->latest('id');

        if (!empty($filters['employee_id'])) {
            $query->where('employee_id', (int) $filters['employee_id']);
        }

        if (!empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('notes', 'like', "%{$search}%")
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

    public function store(array $data): EmployeeAdvance
    {
        return DB::transaction(function () use ($data) {
            $amount = (float) $data['amount'];
            $months = max(1, (int) $data['months']);
            $monthlyAmount = round($amount / $months, 2);
            $startDate = Carbon::parse($data['start_date']);
            $endDate = (clone $startDate)->addMonths($months - 1)->format('Y-m-d');

            $advance = EmployeeAdvance::create([
                'employee_id'        => (int) $data['employee_id'],
                'payment_account_id' => !empty($data['payment_account_id']) ? (int) $data['payment_account_id'] : null,
                'amount'             => $amount,
                'months'             => $months,
                'monthly_amount'     => $monthlyAmount,
                'start_date'         => $startDate->format('Y-m-d'),
                'end_date'           => $endDate,
                'notes'              => $data['notes'] ?? null,
                'status'             => 'active',
            ]);

            for ($i = 0; $i < $months; $i++) {
                $dueDate = (clone $startDate)->addMonths($i)->format('Y-m-d');
                EmployeeAdvanceInstallment::create([
                    'employee_advance_id' => $advance->id,
                    'installment_number'  => $i + 1,
                    'amount'              => $monthlyAmount,
                    'due_date'            => $dueDate,
                    'status'              => 'unpaid',
                ]);
            }

            return $advance->load(['employee', 'installments']);
        });
    }

    public function find(int $id): EmployeeAdvance
    {
        return EmployeeAdvance::with(['employee', 'installments'])->findOrFail($id);
    }

    public function update(int $id, array $data): EmployeeAdvance
    {
        $advance = $this->find($id);

        $payload = [];
        if (isset($data['notes']))  $payload['notes'] = $data['notes'];
        if (isset($data['status'])) $payload['status'] = $data['status'];

        $advance->update($payload);

        return $advance->fresh(['employee', 'installments']);
    }

    public function delete(int $id): bool
    {
        $advance = $this->find($id);
        $advance->installments()->delete();
        return (bool) $advance->delete();
    }
}
