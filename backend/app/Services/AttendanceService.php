<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AttendanceService
{
    /**
     * Ensure default sample attendance records exist.
     */
    public function ensureDefaults(): void
    {
        $employee = Employee::first();
        if (!$employee) {
            return;
        }

        if (Attendance::count() === 0) {
            Attendance::create([
                'employee_id' => $employee->id,
                'date'        => now()->format('Y-m-d'),
                'check_in'    => '08:00',
                'check_out'   => '16:00',
                'method'      => 'يدوي',
                'status'      => 'حاضر',
            ]);

            Attendance::create([
                'employee_id' => $employee->id,
                'date'        => now()->subDays(1)->format('Y-m-d'),
                'check_in'    => '07:55',
                'check_out'   => '15:30',
                'method'      => 'QR',
                'status'      => 'حاضر',
            ]);

            Attendance::create([
                'employee_id' => $employee->id,
                'date'        => now()->subDays(2)->format('Y-m-d'),
                'check_in'    => '08:30',
                'check_out'   => '17:00',
                'method'      => 'يدوي',
                'status'      => 'حاضر',
            ]);
        }
    }

    /**
     * List attendance records with optional search and pagination.
     */
    public function list(array $filters = [], ?int $perPage = null)
    {
        $this->ensureDefaults();

        $query = Attendance::with('employee')->latest('date')->latest('id');

        if (!empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('check_in', 'like', "%{$search}%")
                  ->orWhere('check_out', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%")
                  ->orWhere('method', 'like', "%{$search}%")
                  ->orWhereHas('employee', fn($e) => $e->where('name', 'like', "%{$search}%"));
            });
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
     * Store new attendance log or update current day's log.
     */
    public function store(array $data): Attendance
    {
        $employeeId = $data['employee_id'] ?? $data['name'] ?? null;
        if (!is_numeric($employeeId) && is_string($employeeId)) {
            // Check if string is employee QR / National ID / Name
            $emp = Employee::where('nationalid', $employeeId)
                ->orWhere('name', 'like', "%{$employeeId}%")
                ->first();
            $employeeId = $emp ? $emp->id : Employee::value('id');
        }

        $date = !empty($data['date']) ? $data['date'] : now()->format('Y-m-d');
        $time = !empty($data['time']) ? $data['time'] : now()->format('H:i');
        $type = (string) ($data['type'] ?? '1');
        $method = $data['method'] ?? 'يدوي';

        // Check if an attendance record already exists for this employee on this date
        $existing = Attendance::where('employee_id', $employeeId)
            ->whereDate('date', $date)
            ->first();

        if ($existing) {
            if ($type === '2' || $type === 'إنصراف' || $type === 'انصراف') {
                $existing->update(['check_out' => $time]);
            } else {
                $existing->update(['check_in' => $time]);
            }
            return $existing->fresh('employee');
        }

        $checkIn = ($type === '1' || $type === 'حضور') ? $time : null;
        $checkOut = ($type === '2' || $type === 'إنصراف' || $type === 'انصراف') ? $time : null;

        return Attendance::create([
            'employee_id' => $employeeId,
            'date'        => $date,
            'check_in'    => $checkIn,
            'check_out'   => $checkOut,
            'method'      => $method,
            'status'      => 'حاضر',
            'notes'       => $data['notes'] ?? null,
        ]);
    }

    /**
     * Delete an attendance record.
     */
    public function delete(int $id): bool
    {
        $attendance = Attendance::findOrFail($id);
        return (bool) $attendance->delete();
    }
}
