<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\EmployeeWithdrawal;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class EmployeeWithdrawalService
{
    /**
     * Standard treasury and bank accounts list.
     */
    public function getAccounts(): array
    {
        return [
            ['value' => 101, 'id' => 101, 'label' => 'الخزينة الرئيسية', 'name' => 'الخزينة الرئيسية', 'balance' => 85000],
            ['value' => 102, 'id' => 102, 'label' => 'حساب بنك الراجحي', 'name' => 'حساب بنك الراجحي', 'balance' => 140000],
            ['value' => 103, 'id' => 103, 'label' => 'حساب بنك الأهلي', 'name' => 'حساب بنك الأهلي', 'balance' => 95000],
            ['value' => 104, 'id' => 104, 'label' => 'الخزينة الفرعية', 'name' => 'الخزينة الفرعية', 'balance' => 25000],
        ];
    }

    /**
     * Seed initial demo withdrawals if store has none.
     */
    public function ensureDefaults(): void
    {
        $employee = Employee::first();
        if (!$employee) {
            return;
        }

        if (EmployeeWithdrawal::count() === 0) {
            $accounts = $this->getAccounts();

            EmployeeWithdrawal::create([
                'employee_id'     => $employee->id,
                'account_id'      => $accounts[0]['value'],
                'account_name'    => $accounts[0]['label'],
                'amount'          => 1500,
                'date'            => now()->subDays(5)->format('Y-m-d'),
                'time'            => '10:30',
                'withdrawal_date' => now()->subDays(5)->format('Y-m-d'),
                'status'          => 1,
                'description'     => 'سلفة طارئة للموظف',
            ]);

            EmployeeWithdrawal::create([
                'employee_id'     => $employee->id,
                'account_id'      => $accounts[1]['value'],
                'account_name'    => $accounts[1]['label'],
                'amount'          => 3000,
                'date'            => now()->subDays(2)->format('Y-m-d'),
                'time'            => '13:15',
                'withdrawal_date' => null,
                'status'          => 0,
                'description'     => 'مسحوبات شخصية مقدمة',
            ]);

            EmployeeWithdrawal::create([
                'employee_id'     => $employee->id,
                'account_id'      => $accounts[3]['value'],
                'account_name'    => $accounts[3]['label'],
                'amount'          => 800,
                'date'            => now()->format('Y-m-d'),
                'time'            => '09:00',
                'withdrawal_date' => now()->format('Y-m-d'),
                'status'          => 1,
                'description'     => 'بدل سفر ومهمة عمل',
            ]);
        }
    }

    /**
     * List withdrawals with optional filters and pagination.
     */
    public function list(array $filters = [], ?int $perPage = null)
    {
        $this->ensureDefaults();

        $query = EmployeeWithdrawal::with('employee')->latest('id');

        if (!empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('account_name', 'like', "%{$search}%")
                  ->orWhere('amount', 'like', "%{$search}%")
                  ->orWhereHas('employee', fn($e) => $e->where('name', 'like', "%{$search}%"));
            });
        }

        if (!empty($filters['employee_id'])) {
            $query->where('employee_id', $filters['employee_id']);
        }

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $statusVal = $filters['status'] === 'approved' || $filters['status'] == 1 ? 1 : 0;
            $query->where('status', $statusVal);
        }

        if (!empty($filters['searchfrom']) || !empty($filters['from_date'])) {
            $from = $filters['searchfrom'] ?? $filters['from_date'];
            $query->whereDate('date', '>=', $from);
        }

        if (!empty($filters['searchto']) || !empty($filters['to_date'])) {
            $to = $filters['searchto'] ?? $filters['to_date'];
            $query->whereDate('date', '<=', $to);
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Find single withdrawal.
     */
    public function find(int $id): EmployeeWithdrawal
    {
        return EmployeeWithdrawal::with('employee')->findOrFail($id);
    }

    /**
     * Store new withdrawal.
     */
    public function store(array $data): EmployeeWithdrawal
    {
        $employeeId = $data['employee_id'] ?? $data['employeeName'] ?? null;
        if (is_array($employeeId) && isset($employeeId['value'])) {
            $employeeId = $employeeId['value'];
        }

        $accountId = $data['receiver_account_id'] ?? $data['account_id'] ?? null;
        $accountName = $data['account_name'] ?? null;

        if (!$accountName && $accountId) {
            foreach ($this->getAccounts() as $acc) {
                if ($acc['value'] == $accountId) {
                    $accountName = $acc['label'];
                    break;
                }
            }
        }

        $amount = (float) ($data['amount'] ?? $data['value'] ?? 0);
        $date = !empty($data['date']) ? $data['date'] : now()->format('Y-m-d');
        $time = !empty($data['time']) ? $data['time'] : now()->format('H:i');

        return EmployeeWithdrawal::create([
            'employee_id'     => (int) $employeeId,
            'account_id'      => $accountId ? (int) $accountId : null,
            'account_name'    => $accountName ?? 'الخزينة الرئيسية',
            'amount'          => $amount,
            'date'            => $date,
            'time'            => $time,
            'withdrawal_date' => $date,
            'status'          => 1, // Automatically approved upon store from this form
            'description'     => $data['description'] ?? 'مسحوبات موظف',
        ]);
    }

    /**
     * Approve and disburse withdrawal.
     */
    public function approve(int $id, ?string $accountName = null, ?int $accountId = null): EmployeeWithdrawal
    {
        $withdrawal = EmployeeWithdrawal::findOrFail($id);

        $updateData = [
            'status'          => 1,
            'withdrawal_date' => now()->format('Y-m-d'),
        ];

        if ($accountName) {
            $updateData['account_name'] = $accountName;
        }

        if ($accountId) {
            $updateData['account_id'] = $accountId;
        }

        $withdrawal->update($updateData);

        return $withdrawal->fresh('employee');
    }

    /**
     * Delete withdrawal.
     */
    public function delete(int $id): bool
    {
        $withdrawal = EmployeeWithdrawal::findOrFail($id);
        return (bool) $withdrawal->delete();
    }
}
