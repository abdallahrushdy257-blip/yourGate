<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Section;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class SectionService
{
    /**
     * Default realistic sections if store has none.
     */
    public function defaultSections(): array
    {
        return [
            [
                'name'        => 'إدارة تكنولوجيا المعلومات (IT)',
                'description' => 'الدعم الفني، حماية البيانات، وتطوير الأنظمة والبنية التحتية.',
            ],
            [
                'name'        => 'إدارة الموارد البشرية (HR)',
                'description' => 'قسم مسئول عن التوظيف وشؤون الموظفين والتطوير الإداري.',
            ],
            [
                'name'        => 'إدارة الحسابات والمالية',
                'description' => 'متابعة الميزانيات، المبيعات، ومراجعة المصروفات والتقارير المالية.',
            ],
            [
                'name'        => 'إدارة المشاريع والتطوير',
                'description' => 'تخطيط ومتابعة وتقييم تنفيذ البرامج والمشاريع والمبادرات التنموية.',
            ],
        ];
    }

    /**
     * Ensure default sections exist for current store.
     */
    public function ensureDefaults(): void
    {
        if (Section::count() === 0) {
            $employees = Employee::pluck('id')->toArray();
            $empIndex = 0;

            foreach ($this->defaultSections() as $data) {
                if (!empty($employees)) {
                    $data['manager_id'] = $employees[$empIndex % count($employees)];
                    $empIndex++;
                }

                Section::create($data);
            }
        }
    }

    /**
     * List sections with search and pagination.
     */
    public function list(array $filters = [], ?int $perPage = null)
    {
        $this->ensureDefaults();

        $query = Section::with('manager')->latest('id');

        if (!empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('manager', function ($mq) use ($search) {
                      $mq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Get structured organizational chart tree for current store.
     */
    public function getChart(): array
    {
        $this->ensureDefaults();

        $sections = Section::with(['manager.jobtitle', 'employees.jobtitle'])->get();
        $employees = Employee::with('jobtitle')->where('is_active', true)->get();

        // If no employees have section_id assigned yet, distribute active employees cleanly
        $unassigned = $employees->whereNull('section_id');
        if ($unassigned->isNotEmpty() && $sections->isNotEmpty()) {
            $sectionsCount = $sections->count();
            foreach ($unassigned as $idx => $emp) {
                $targetSection = $sections[$idx % $sectionsCount];
                $emp->update(['section_id' => $targetSection->id]);
            }
            // Reload sections with updated employees
            $sections = Section::with(['manager.jobtitle', 'employees.jobtitle'])->get();
        }

        $result = [];
        foreach ($sections as $section) {
            $managerData = null;
            if ($section->manager) {
                $managerData = $this->formatPersonData($section->manager, true);
            }

            // Section employees (excluding manager if manager is among them)
            $sectionEmployees = $section->employees
                ->filter(fn($emp) => !$section->manager_id || $emp->id != $section->manager_id)
                ->map(fn($emp) => $this->formatPersonData($emp, false))
                ->values()
                ->toArray();

            $result[] = [
                'uuid'        => 'dept-' . $section->id,
                'id'          => $section->id,
                'name'        => $section->name,
                'description' => $section->description,
                'manager'     => $managerData,
                'employees'   => $sectionEmployees,
            ];
        }

        return $result;
    }

    /**
     * Format employee person data for cards and profile modal.
     */
    protected function formatPersonData(Employee $emp, bool $isManager): array
    {
        $totalSalary = (float) $emp->total_salary ?: ((float) $emp->basic_salary + (float) $emp->housing_allowance + (float) $emp->transport_allowance);

        $defaultPhoto = $emp->gender === '1' 
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

        return [
            'uuid'                => 'emp-' . $emp->id,
            'id'                  => $emp->id,
            'name'                => $emp->name,
            'photo'               => $emp->photo_url ?? $defaultPhoto,
            'job_number'          => $emp->nationalid ?: ('EMP-' . str_pad((string) $emp->id, 3, '0', STR_PAD_LEFT)),
            'job_title'           => $emp->jobtitle?->title ?? ($isManager ? 'مدير قسم' : 'موظف'),
            'email'               => $emp->email ?? 'emp' . $emp->id . '@company.com',
            'phone'               => $emp->phone ?? '0505' . str_pad((string) $emp->id, 6, '0', STR_PAD_LEFT),
            'address'             => $emp->address ?? 'المملكة العربية السعودية',
            'date_of_joining'     => $emp->dateofhire ? $emp->dateofhire->format('Y-m-d') : ($emp->created_at ? $emp->created_at->format('Y-m-d') : date('Y-m-d')),
            'qualification'       => $emp->qualification ?? 'بكالوريوس',
            'marital_status'      => $emp->status == 1 ? 'married' : 'single',
            'total_salary'        => $totalSalary,
            'bank_account_number' => $emp->iban ?? 'SA' . str_pad((string) $emp->id, 22, '0', STR_PAD_LEFT),
        ];
    }

    /**
     * Find a single section by ID.
     */
    public function find(int $id): Section
    {
        return Section::with('manager')->findOrFail($id);
    }

    /**
     * Store a new section.
     */
    public function store(array $data): Section
    {
        $payload = $this->normalizePayload($data);

        return Section::create($payload);
    }

    /**
     * Update an existing section.
     */
    public function update(int $id, array $data): Section
    {
        $section = Section::findOrFail($id);
        $payload = $this->normalizePayload($data);
        $section->update($payload);

        return $section->fresh('manager');
    }

    /**
     * Delete a section.
     */
    public function delete(int $id): bool
    {
        $section = Section::findOrFail($id);

        return (bool) $section->delete();
    }

    /**
     * Normalize payload aliases.
     */
    protected function normalizePayload(array $data): array
    {
        $payload = [];

        if (array_key_exists('name', $data) || array_key_exists('dapartmentname', $data)) {
            $payload['name'] = trim((string) ($data['name'] ?? $data['dapartmentname']));
        }

        if (array_key_exists('description', $data) || array_key_exists('desc', $data)) {
            $payload['description'] = $data['description'] ?? $data['desc'] ?? null;
        }

        if (array_key_exists('manager_id', $data) || array_key_exists('manger_id', $data)) {
            $val = $data['manager_id'] ?? $data['manger_id'];
            $payload['manager_id'] = (!empty($val) && (int) $val > 0) ? (int) $val : null;
        }

        return $payload;
    }
}
