<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\EmployeeDocument;
use App\Models\JobTitle;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EmployeeService
{
    /**
     * Default realistic employees if store has none.
     */
    public function defaultEmployees(): array
    {
        return [
            [
                'name'                    => 'أحمد محمد علي',
                'email'                   => 'ahmed.ali@example.com',
                'phone'                   => '0501234567',
                'nationalid'              => '1023456789',
                'idtype'                  => 0,
                'dob'                     => '1992-05-14',
                'gender'                  => '0',
                'status'                  => 1,
                'address'                 => 'الرياض، المملكة العربية السعودية',
                'nationality'             => 'سعودي',
                'qualification'           => 'بكالوريوس إدارة أعمال',
                'worktype'                => 0,
                'dateofhire'              => '2023-01-15',
                'contractexpiration'      => '2027-01-15',
                'job_title_match'         => 'مسؤول مشاريع',
                'iban'                    => 'SA0380000000608010167519',
                'basic_salary'            => 8500.00,
                'social_insurance'        => 850.00,
                'housing_allowance'       => 2000.00,
                'transport_allowance'     => 1000.00,
                'communication_allowance' => 300.00,
                'life_allowance'          => 500.00,
                'work_allowance'          => 500.00,
                'salary_account'          => '41101001,41101002',
                'total_salary'            => 11950.00,
            ],
            [
                'name'                    => 'سارة إبراهيم',
                'email'                   => 'sara.ibrahim@example.com',
                'phone'                   => '0502345678',
                'nationalid'              => '1023456790',
                'idtype'                  => 0,
                'dob'                     => '1995-08-22',
                'gender'                  => '1',
                'status'                  => 0,
                'address'                 => 'جدة، المملكة العربية السعودية',
                'nationality'             => 'سعودية',
                'qualification'           => 'بكالوريوس محاسبة مالية',
                'worktype'                => 0,
                'dateofhire'              => '2022-09-10',
                'contractexpiration'      => '2026-09-10',
                'job_title_match'         => 'مدير مالي',
                'iban'                    => 'SA0380000000608010167520',
                'basic_salary'            => 6500.00,
                'social_insurance'        => 650.00,
                'housing_allowance'       => 1500.00,
                'transport_allowance'     => 800.00,
                'communication_allowance' => 200.00,
                'life_allowance'          => 400.00,
                'work_allowance'          => 400.00,
                'salary_account'          => '41101001,41101002',
                'total_salary'            => 9150.00,
            ],
            [
                'name'                    => 'محمد خالد',
                'email'                   => 'mohamed.khaled@example.com',
                'phone'                   => '0503456789',
                'nationalid'              => '1023456791',
                'idtype'                  => 0,
                'dob'                     => '1996-03-11',
                'gender'                  => '0',
                'status'                  => 0,
                'address'                 => 'الدمام، المملكة العربية السعودية',
                'nationality'             => 'سعودي',
                'qualification'           => 'دبلوم علاقات عامة',
                'worktype'                => 0,
                'dateofhire'              => '2021-06-20',
                'contractexpiration'      => '2025-06-20',
                'job_title_match'         => 'موظف دعم وتنسيق',
                'iban'                    => 'SA0380000000608010167521',
                'basic_salary'            => 5000.00,
                'social_insurance'        => 500.00,
                'housing_allowance'       => 1200.00,
                'transport_allowance'     => 600.00,
                'communication_allowance' => 150.00,
                'life_allowance'          => 300.00,
                'work_allowance'          => 300.00,
                'salary_account'          => '41101001,41101002',
                'total_salary'            => 7050.00,
            ],
            [
                'name'                    => 'ريم عبدالله',
                'email'                   => 'reem.abdullah@example.com',
                'phone'                   => '0504567890',
                'nationalid'              => '1023456792',
                'idtype'                  => 0,
                'dob'                     => '1993-11-30',
                'gender'                  => '1',
                'status'                  => 1,
                'address'                 => 'الرياض، المملكة العربية السعودية',
                'nationality'             => 'سعودية',
                'qualification'           => 'ماجستير إدارة الموارد البشرية',
                'worktype'                => 0,
                'dateofhire'              => '2020-11-05',
                'contractexpiration'      => '2026-11-05',
                'job_title_match'         => 'مدير مالي',
                'iban'                    => 'SA0380000000608010167522',
                'basic_salary'            => 9000.00,
                'social_insurance'        => 900.00,
                'housing_allowance'       => 2200.00,
                'transport_allowance'     => 1000.00,
                'communication_allowance' => 300.00,
                'life_allowance'          => 500.00,
                'work_allowance'          => 500.00,
                'salary_account'          => '41101001,41101002',
                'total_salary'            => 12600.00,
            ],
            [
                'name'                    => 'يوسف حنان',
                'email'                   => 'yousef.hanan@example.com',
                'phone'                   => '0505678901',
                'nationalid'              => '1023456793',
                'idtype'                  => 0,
                'dob'                     => '1988-01-20',
                'gender'                  => '0',
                'status'                  => 1,
                'address'                 => 'الرياض، المملكة العربية السعودية',
                'nationality'             => 'سعودي',
                'qualification'           => 'ماجستير إدارة عامة',
                'worktype'                => 0,
                'dateofhire'              => '2024-02-01',
                'contractexpiration'      => '2028-02-01',
                'job_title_match'         => 'مدير عام',
                'iban'                    => 'SA0380000000608010167523',
                'basic_salary'            => 12000.00,
                'social_insurance'        => 1200.00,
                'housing_allowance'       => 3000.00,
                'transport_allowance'     => 1500.00,
                'communication_allowance' => 500.00,
                'life_allowance'          => 800.00,
                'work_allowance'          => 800.00,
                'salary_account'          => '41101001,41101002',
                'total_salary'            => 17400.00,
            ],
        ];
    }

    /**
     * Ensure default employees exist for current store.
     */
    public function ensureDefaults(): void
    {
        if (Employee::count() === 0) {
            $titles = JobTitle::pluck('id', 'title')->toArray();

            foreach ($this->defaultEmployees() as $data) {
                $jobMatch = $data['job_title_match'] ?? null;
                unset($data['job_title_match']);

                if ($jobMatch && isset($titles[$jobMatch])) {
                    $data['job_title_id'] = $titles[$jobMatch];
                } elseif (!empty($titles)) {
                    $data['job_title_id'] = reset($titles);
                }

                Employee::create($data);
            }
        }
    }

    /**
     * List employees with search, filters and pagination.
     */
    public function list(array $filters = [], ?int $perPage = null)
    {
        $this->ensureDefaults();

        $query = Employee::with(['jobtitle', 'documents'])->latest('id');

        if (!empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nationalid', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhereHas('jobtitle', function ($jq) use ($search) {
                      $jq->where('title', 'like', "%{$search}%");
                  });
            });
        }

        if (!empty($filters['searchfrom'])) {
            $query->whereDate('dateofhire', '>=', $filters['searchfrom']);
        }

        if (!empty($filters['searchto'])) {
            $query->whereDate('dateofhire', '<=', $filters['searchto']);
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Find a single employee by ID.
     */
    public function find(int $id): Employee
    {
        return Employee::with(['jobtitle', 'documents'])->findOrFail($id);
    }

    /**
     * Store a new employee (supports multi-step payloads and files).
     */
    public function store(array $data): Employee
    {
        return DB::transaction(function () use ($data) {
            $payload = $this->normalizePayload($data);

            if (!empty($data['photo']) && $data['photo'] instanceof UploadedFile) {
                $payload['photo'] = $data['photo']->store('employees/photos', 'public');
            } elseif (!empty($data['upload']) && $data['upload'] instanceof UploadedFile) {
                $payload['photo'] = $data['upload']->store('employees/photos', 'public');
            }

            $employee = Employee::create($payload);

            $this->handleDocuments($employee, $data);

            return $employee->fresh(['jobtitle', 'documents']);
        });
    }

    /**
     * Update an employee.
     */
    public function update(int $id, array $data): Employee
    {
        return DB::transaction(function () use ($id, $data) {
            $employee = Employee::findOrFail($id);
            $payload = $this->normalizePayload($data);

            if (!empty($data['photo']) && $data['photo'] instanceof UploadedFile) {
                if ($employee->photo && !str_starts_with($employee->photo, 'http')) {
                    Storage::disk('public')->delete($employee->photo);
                }
                $payload['photo'] = $data['photo']->store('employees/photos', 'public');
            } elseif (!empty($data['upload']) && $data['upload'] instanceof UploadedFile) {
                if ($employee->photo && !str_starts_with($employee->photo, 'http')) {
                    Storage::disk('public')->delete($employee->photo);
                }
                $payload['photo'] = $data['upload']->store('employees/photos', 'public');
            }

            $employee->update($payload);

            $this->handleDocuments($employee, $data);

            return $employee->fresh(['jobtitle', 'documents']);
        });
    }

    /**
     * Delete an employee.
     */
    public function delete(int $id): bool
    {
        $employee = Employee::findOrFail($id);

        return (bool) $employee->delete();
    }

    /**
     * Attach or create documents for an employee.
     */
    protected function handleDocuments(Employee $employee, array $data): void
    {
        if (empty($data['documents']) || !is_array($data['documents'])) {
            return;
        }

        foreach ($data['documents'] as $doc) {
            if (empty($doc['file']) || !($doc['file'] instanceof UploadedFile)) {
                continue;
            }

            $path = $doc['file']->store('employees/documents', 'public');

            EmployeeDocument::create([
                'store_id'    => $employee->store_id,
                'employee_id' => $employee->id,
                'title'       => !empty($doc['title']) ? $doc['title'] : $doc['file']->getClientOriginalName(),
                'file_path'   => $path,
                'file_type'   => $doc['file']->getClientOriginalExtension(),
                'file_size'   => $doc['file']->getSize(),
            ]);
        }
    }

    /**
     * Normalize frontend payload aliases into database columns.
     */
    protected function normalizePayload(array $data): array
    {
        $payload = [];

        if (array_key_exists('name', $data)) {
            $payload['name'] = trim((string) $data['name']);
        }

        if (array_key_exists('email', $data)) {
            $payload['email'] = $data['email'] ?: null;
        }

        if (array_key_exists('phone', $data)) {
            $payload['phone'] = $data['phone'] ?: null;
        }

        if (array_key_exists('nationalid', $data) || array_key_exists('idnumber', $data)) {
            $payload['nationalid'] = $data['nationalid'] ?? $data['idnumber'] ?? null;
        }

        if (array_key_exists('idtype', $data)) {
            $payload['idtype'] = (int) $data['idtype'];
        }

        if (array_key_exists('nationalid_expire', $data) || array_key_exists('idexpiredate', $data)) {
            $val = $data['nationalid_expire'] ?? $data['idexpiredate'];
            $payload['nationalid_expire'] = $val ? substr($val, 0, 10) : null;
        }

        if (array_key_exists('dob', $data) || array_key_exists('dateofbirth', $data)) {
            $val = $data['dob'] ?? $data['dateofbirth'];
            $payload['dob'] = $val ? substr($val, 0, 10) : null;
        }

        if (array_key_exists('gender', $data)) {
            $payload['gender'] = (string) $data['gender'];
        }

        if (array_key_exists('status', $data)) {
            $payload['status'] = (int) $data['status'];
        }

        if (array_key_exists('address', $data)) {
            $payload['address'] = $data['address'] ?: null;
        }

        if (array_key_exists('nationality', $data)) {
            $payload['nationality'] = $data['nationality'] ?: null;
        }

        if (array_key_exists('qualification', $data)) {
            $payload['qualification'] = $data['qualification'] ?: null;
        }

        if (array_key_exists('worktype', $data)) {
            $payload['worktype'] = (int) $data['worktype'];
        }

        if (array_key_exists('dateofhire', $data) || array_key_exists('workdate', $data)) {
            $val = $data['dateofhire'] ?? $data['workdate'];
            $payload['dateofhire'] = $val ? substr($val, 0, 10) : null;
        }

        if (array_key_exists('contractexpiration', $data) || array_key_exists('expirehire', $data)) {
            $val = $data['contractexpiration'] ?? $data['expirehire'];
            $payload['contractexpiration'] = $val ? substr($val, 0, 10) : null;
        }

        if (array_key_exists('job_title_id', $data) || array_key_exists('jobtitle', $data)) {
            $val = $data['job_title_id'] ?? $data['jobtitle'];
            $payload['job_title_id'] = (!empty($val) && (int) $val > 0) ? (int) $val : null;
        }

        if (array_key_exists('iban', $data)) {
            $payload['iban'] = $data['iban'] ?: null;
        }

        if (array_key_exists('is_active', $data)) {
            $payload['is_active'] = (bool) $data['is_active'];
        }

        // Salary fields
        $basic = (float) ($data['basic_salary'] ?? $data['basic'] ?? $data['mainBudget'] ?? 0);
        $social = (float) ($data['social_insurance'] ?? $data['socialinsurance'] ?? $data['socialWelfare'] ?? 0);
        $house = (float) ($data['housing_allowance'] ?? $data['house'] ?? 0);
        $transport = (float) ($data['transport_allowance'] ?? $data['transport'] ?? $data['transportation'] ?? 0);
        $communication = (float) ($data['communication_allowance'] ?? $data['communication'] ?? 0);
        $life = (float) ($data['life_allowance'] ?? $data['life'] ?? 0);
        $work = (float) ($data['work_allowance'] ?? $data['work'] ?? 0);

        if (array_key_exists('basic', $data) || array_key_exists('basic_salary', $data) || array_key_exists('mainBudget', $data)) {
            $payload['basic_salary'] = $basic;
        }
        if (array_key_exists('socialinsurance', $data) || array_key_exists('social_insurance', $data) || array_key_exists('socialWelfare', $data)) {
            $payload['social_insurance'] = $social;
        }
        if (array_key_exists('house', $data) || array_key_exists('housing_allowance', $data)) {
            $payload['housing_allowance'] = $house;
        }
        if (array_key_exists('transport', $data) || array_key_exists('transportation', $data) || array_key_exists('transport_allowance', $data)) {
            $payload['transport_allowance'] = $transport;
        }
        if (array_key_exists('communication', $data) || array_key_exists('communication_allowance', $data)) {
            $payload['communication_allowance'] = $communication;
        }
        if (array_key_exists('life', $data) || array_key_exists('life_allowance', $data)) {
            $payload['life_allowance'] = $life;
        }
        if (array_key_exists('work', $data) || array_key_exists('work_allowance', $data)) {
            $payload['work_allowance'] = $work;
        }
        if (array_key_exists('account', $data) || array_key_exists('salary_account', $data) || array_key_exists('type', $data)) {
            $payload['salary_account'] = $data['salary_account'] ?? $data['account'] ?? $data['type'] ?? null;
        }

        // Calculate total
        $payload['total_salary'] = max(0, $basic + $house + $transport + $communication + $life + $work - $social);

        return $payload;
    }
}
