<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Payroll;
use App\Models\SalaryAction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PayrollService
{
    /**
     * Ensure default payroll data exists for the given year and month.
     */
    public function ensureDefaults(?int $year = null, ?int $month = null): void
    {
        $year = $year ?: (int) date('Y');
        $month = $month ?: (int) date('m');

        $exists = Payroll::where('year', $year)->where('month', $month)->exists();
        if (!$exists) {
            $employees = Employee::take(4)->get();
            if ($employees->isNotEmpty()) {
                $presets = [
                    [
                        'basic'       => 6000,
                        'allowance'   => 1000,
                        'additions'   => 500,
                        'deductions'  => 200,
                        'absence'     => 0,
                        'invest'      => 0,
                        'insurance'   => 400,
                        'net'         => 6900,
                    ],
                    [
                        'basic'       => 8500,
                        'allowance'   => 1200,
                        'additions'   => 0,
                        'deductions'  => 300,
                        'absence'     => 250,
                        'invest'      => 100,
                        'insurance'   => 550,
                        'net'         => 8500,
                    ],
                    [
                        'basic'       => 5000,
                        'allowance'   => 800,
                        'additions'   => 300,
                        'deductions'  => 0,
                        'absence'     => 0,
                        'invest'      => 0,
                        'insurance'   => 350,
                        'net'         => 5750,
                    ],
                    [
                        'basic'       => 7000,
                        'allowance'   => 900,
                        'additions'   => 1000,
                        'deductions'  => 150,
                        'absence'     => 300,
                        'invest'      => 0,
                        'insurance'   => 450,
                        'net'         => 8000,
                    ],
                ];

                foreach ($employees as $idx => $emp) {
                    $preset = $presets[$idx % count($presets)];
                    $basic = $emp->basic_salary > 0 ? (float) $emp->basic_salary : $preset['basic'];
                    $allowance = ($emp->housing_allowance + $emp->transport_allowance + $emp->communication_allowance) > 0
                        ? (float) ($emp->housing_allowance + $emp->transport_allowance + $emp->communication_allowance)
                        : $preset['allowance'];
                    $insurance = $emp->social_insurance > 0 ? (float) $emp->social_insurance : $preset['insurance'];

                    $net = $basic + $allowance + $preset['additions'] - ($preset['deductions'] + $preset['absence'] + $preset['invest'] + $insurance);

                    Payroll::updateOrCreate(
                        [
                            'employee_id' => $emp->id,
                            'year'        => $year,
                            'month'       => $month,
                        ],
                        [
                            'basic_salary'     => $basic,
                            'allowance'        => $allowance,
                            'additions'        => $preset['additions'],
                            'deductions'       => $preset['deductions'],
                            'absence'          => $preset['absence'],
                            'investigations'   => $preset['invest'],
                            'social_insurance' => $insurance,
                            'net_salary'       => $net,
                            'status'           => 'approved',
                            'payment_date'     => Carbon::createFromDate($year, $month, 28)->format('Y-m-d'),
                            'notes'            => 'مسير رواتب نظامي',
                        ]
                    );
                }
            }
        }
    }

    /**
     * List payroll records filtered by year, month, search, etc.
     */
    public function list(array $filters = [], ?int $perPage = null)
    {
        $year = !empty($filters['year']) ? (int) $filters['year'] : (int) date('Y');
        $month = !empty($filters['month']) ? (int) $filters['month'] : (int) date('m');

        $this->ensureDefaults($year, $month);

        $query = Payroll::with(['employee.jobtitle'])->latest('id');

        if (!empty($filters['year'])) {
            $query->where('year', (int) $filters['year']);
        }

        if (!empty($filters['month'])) {
            $query->where('month', (int) $filters['month']);
        }

        if (!empty($filters['employee_id'])) {
            $query->where('employee_id', (int) $filters['employee_id']);
        }

        if (!empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->whereHas('employee', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nationalid', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($perPage !== null && $perPage > 0) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Store or update a single payroll record.
     */
    public function store(array $data): Payroll
    {
        return DB::transaction(function () use ($data) {
            $basic = (float) ($data['basic_salary'] ?? 0);
            $allowance = (float) ($data['allowance'] ?? 0);
            $additions = (float) ($data['additions'] ?? 0);
            $deductions = (float) ($data['deductions'] ?? 0);
            $absence = (float) ($data['absence'] ?? 0);
            $invest = (float) ($data['investigations'] ?? 0);
            $insurance = (float) ($data['social_insurance'] ?? 0);

            $net = isset($data['net_salary']) && $data['net_salary'] > 0
                ? (float) $data['net_salary']
                : ($basic + $allowance + $additions - ($deductions + $absence + $invest + $insurance));

            return Payroll::updateOrCreate(
                [
                    'employee_id' => (int) $data['employee_id'],
                    'year'        => (int) $data['year'],
                    'month'       => (int) $data['month'],
                ],
                [
                    'basic_salary'     => $basic,
                    'allowance'        => $allowance,
                    'additions'        => $additions,
                    'deductions'       => $deductions,
                    'absence'          => $absence,
                    'investigations'   => $invest,
                    'social_insurance' => $insurance,
                    'net_salary'       => $net,
                    'status'           => $data['status'] ?? 'approved',
                    'payment_date'     => $data['payment_date'] ?? Carbon::now()->format('Y-m-d'),
                    'notes'            => $data['notes'] ?? null,
                ]
            );
        });
    }

    /**
     * Dynamically calculate or generate payroll for all active employees for given year and month.
     */
    public function calculateForPeriod(int $year, int $month): int
    {
        return DB::transaction(function () use ($year, $month) {
            $employees = Employee::where('is_active', true)->get();
            $count = 0;

            foreach ($employees as $emp) {
                $basic = (float) $emp->basic_salary;
                $allowance = (float) ($emp->housing_allowance + $emp->transport_allowance + $emp->communication_allowance + $emp->life_allowance + $emp->work_allowance);
                $insurance = (float) $emp->social_insurance;

                // Load salary actions for this employee in the given month and year
                $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
                $endDate = Carbon::createFromDate($year, $month, 1)->endOfMonth();

                $additions = (float) SalaryAction::where('employee_id', $emp->id)
                    ->where('type', 0)
                    ->whereBetween('date', [$startDate, $endDate])
                    ->sum('amount');

                $deductions = (float) SalaryAction::where('employee_id', $emp->id)
                    ->where('type', 1)
                    ->whereBetween('date', [$startDate, $endDate])
                    ->sum('amount');

                $absence = 0;
                $invest = 0;

                $net = $basic + $allowance + $additions - ($deductions + $absence + $invest + $insurance);

                Payroll::updateOrCreate(
                    [
                        'employee_id' => $emp->id,
                        'year'        => $year,
                        'month'       => $month,
                    ],
                    [
                        'basic_salary'     => $basic,
                        'allowance'        => $allowance,
                        'additions'        => $additions,
                        'deductions'       => $deductions,
                        'absence'          => $absence,
                        'investigations'   => $invest,
                        'social_insurance' => $insurance,
                        'net_salary'       => $net,
                        'status'           => 'approved',
                        'payment_date'     => Carbon::createFromDate($year, $month, 28)->format('Y-m-d'),
                        'notes'            => 'تم الحساب تلقائياً من بيانات الموظف والبدلات',
                    ]
                );

                $count++;
            }

            return $count;
        });
    }

    /**
     * Find single payroll record by ID.
     */
    public function find(int $id): Payroll
    {
        return Payroll::with(['employee.jobtitle'])->findOrFail($id);
    }

    /**
     * Delete payroll record.
     */
    public function delete(int $id): bool
    {
        $payroll = $this->find($id);
        return (bool) $payroll->delete();
    }
}
