<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\Vacation;
use App\Models\VacationRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class VacationRequestService
{
    /**
     * Ensure default sample requests exist if none exist.
     */
    public function ensureDefaults(): void
    {
        $employee = Employee::first();
        if (!$employee) {
            return;
        }

        $vacationType = Vacation::first();

        if (VacationRequest::count() === 0 && $vacationType) {
            VacationRequest::create([
                'employee_id' => $employee->id,
                'vacation_id' => $vacationType->id,
                'description' => 'طلب إجازة اعتيادية سنوية',
                'from'        => now()->addDays(2)->format('Y-m-d'),
                'to'          => now()->addDays(7)->format('Y-m-d'),
                'status'      => 'قيد الانتظار',
            ]);
            VacationRequest::create([
                'employee_id' => $employee->id,
                'vacation_id' => $vacationType->id,
                'description' => 'إجازة سابقة معتمدة',
                'from'        => now()->subDays(15)->format('Y-m-d'),
                'to'          => now()->subDays(10)->format('Y-m-d'),
                'status'      => 'مقبول',
            ]);
        }

        if (LeaveRequest::count() === 0) {
            LeaveRequest::create([
                'employee_id' => $employee->id,
                'date'        => now()->format('Y-m-d'),
                'from_time'   => '08:00',
                'to_time'     => '10:00',
                'hours'       => 2,
                'note'        => 'مهمة عمل خارجية ومراجعة جهة رسمية',
                'status'      => 'قيد الانتظار',
            ]);
            LeaveRequest::create([
                'employee_id' => $employee->id,
                'date'        => now()->subDays(3)->format('Y-m-d'),
                'from_time'   => '13:00',
                'to_time'     => '14:00',
                'hours'       => 1,
                'note'        => 'ظرف شخصي طارئ',
                'status'      => 'مقبول',
            ]);
        }
    }

    /**
     * List vacation requests with search and pagination.
     */
    public function listVacations(array $filters = [], ?int $perPage = null)
    {
        $this->ensureDefaults();

        $query = VacationRequest::with(['employee', 'vacation'])->latest('id');

        if (!empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%")
                  ->orWhereHas('employee', fn($e) => $e->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('vacation', fn($v) => $v->where('name', 'like', "%{$search}%"));
            });
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * List leave/permission requests.
     */
    public function listLeaves(array $filters = [], ?int $perPage = null)
    {
        $this->ensureDefaults();

        $query = LeaveRequest::with('employee')->latest('id');

        if (!empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('note', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%")
                  ->orWhereHas('employee', fn($e) => $e->where('name', 'like', "%{$search}%"));
            });
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Store vacation request.
     */
    public function storeVacation(array $data, $file = null): VacationRequest
    {
        $filePath = null;
        if ($file && $file->isValid()) {
            $filePath = $file->store('vacation_attachments', 'public');
        }

        return VacationRequest::create([
            'employee_id' => $data['employee_id'] ?? $data['name'] ?? $data['empId'],
            'vacation_id' => $data['vacation_id'] ?? $data['type'] ?? $data['vacTypeId'] ?? null,
            'description' => $data['description'] ?? null,
            'from'        => $data['from'] ?? null,
            'to'          => $data['to'] ?? null,
            'status'      => 'قيد الانتظار',
            'file_path'   => $filePath,
        ]);
    }

    /**
     * Store permission request.
     */
    public function storeLeave(array $data, $file = null): LeaveRequest
    {
        $filePath = null;
        if ($file && $file->isValid()) {
            $filePath = $file->store('leave_attachments', 'public');
        }

        // Calculate hours if not provided
        $hours = $data['hours'] ?? null;
        $fromTime = $data['from_time'] ?? $data['permFromTime'] ?? null;
        $toTime = $data['to_time'] ?? $data['permToTime'] ?? null;

        if (!$hours && !empty($fromTime) && !empty($toTime)) {
            $t1 = strtotime($fromTime);
            $t2 = strtotime($toTime);
            if ($t2 > $t1) {
                $hours = round(($t2 - $t1) / 3600, 2);
            }
        }

        return LeaveRequest::create([
            'employee_id' => $data['employee_id'] ?? $data['name'] ?? $data['empId'],
            'date'        => $data['date'] ?? $data['permDate'] ?? null,
            'from_time'   => $fromTime,
            'to_time'     => $toTime,
            'hours'       => $hours ?? 1,
            'note'        => $data['note'] ?? null,
            'status'      => 'قيد الانتظار',
            'file_path'   => $filePath,
        ]);
    }

    /**
     * Update vacation request status.
     */
    public function updateVacationStatus(int $id, string $status): VacationRequest
    {
        $req = VacationRequest::findOrFail($id);
        $normalized = $this->normalizeStatus($status);
        $req->update(['status' => $normalized]);

        return $req->fresh(['employee', 'vacation']);
    }

    /**
     * Update leave request status.
     */
    public function updateLeaveStatus(int $id, string $status): LeaveRequest
    {
        $req = LeaveRequest::findOrFail($id);
        $normalized = $this->normalizeStatus($status);
        $req->update(['status' => $normalized]);

        return $req->fresh('employee');
    }

    /**
     * Normalize request status string.
     */
    protected function normalizeStatus(string $status): string
    {
        if ($status === '1' || $status === 'موافقة' || $status === 'مقبول') {
            return 'مقبول';
        }
        if ($status === '2' || $status === 'رفض' || $status === 'مرفوض' || $status === 'مرفوضة') {
            return 'مرفوض';
        }
        return 'قيد الانتظار';
    }

    /**
     * Delete vacation request.
     */
    public function deleteVacation(int $id): bool
    {
        $req = VacationRequest::findOrFail($id);
        return (bool) $req->delete();
    }

    /**
     * Delete leave request.
     */
    public function deleteLeave(int $id): bool
    {
        $req = LeaveRequest::findOrFail($id);
        return (bool) $req->delete();
    }
}
