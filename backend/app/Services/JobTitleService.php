<?php

namespace App\Services;

use App\Models\JobTitle;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class JobTitleService
{
    /**
     * Default standard job titles if store has none.
     */
    public function defaultJobTitles(): array
    {
        return [
            [
                'title'            => 'مدير عام',
                'description'      => 'الإشراف العام وتوجيه السياسات التشغيلية والتنفيذية',
                'note'             => 'إدارة عليا',
                'workdayspermonth' => 22,
                'workhoursperday'  => 8,
            ],
            [
                'title'            => 'مدير مالي',
                'description'      => 'إدارة العمليات المالية والتقارير المحاسبية والموازنات',
                'note'             => 'إدارة الشؤون المالية',
                'workdayspermonth' => 22,
                'workhoursperday'  => 8,
            ],
            [
                'title'            => 'مسؤول مشاريع',
                'description'      => 'تخطيط ومتابعة وتقييم تنفيذ المشاريع التنموية',
                'note'             => 'إدارة المشاريع',
                'workdayspermonth' => 22,
                'workhoursperday'  => 8,
            ],
            [
                'title'            => 'موظف دعم وتنسيق',
                'description'      => 'متابعة شؤون المستفيدين وتنسيق المواعيد والزيارات',
                'note'             => 'فريق العمليات',
                'workdayspermonth' => 22,
                'workhoursperday'  => 8,
            ],
        ];
    }

    /**
     * Ensure default job titles exist for current store.
     */
    public function ensureDefaults(): void
    {
        if (JobTitle::count() === 0) {
            foreach ($this->defaultJobTitles() as $item) {
                JobTitle::create($item);
            }
        }
    }

    /**
     * List job titles with optional pagination or collection.
     */
    public function list(array $filters = [], ?int $perPage = null)
    {
        $this->ensureDefaults();

        $query = JobTitle::with('parent')->latest('id');

        if (!empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('note', 'like', "%{$search}%");
            });
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Find a single job title by ID.
     */
    public function find(int $id): JobTitle
    {
        return JobTitle::with(['parent', 'children'])->findOrFail($id);
    }

    /**
     * Store a new job title.
     */
    public function store(array $data): JobTitle
    {
        $payload = $this->normalizePayload($data);

        return JobTitle::create($payload);
    }

    /**
     * Update an existing job title.
     */
    public function update(int $id, array $data): JobTitle
    {
        $jobTitle = JobTitle::findOrFail($id);
        $payload = $this->normalizePayload($data);
        $jobTitle->update($payload);

        return $jobTitle->fresh(['parent']);
    }

    /**
     * Delete a job title.
     */
    public function delete(int $id): bool
    {
        $jobTitle = JobTitle::findOrFail($id);

        return (bool) $jobTitle->delete();
    }

    /**
     * Normalize frontend payload keys to database columns.
     */
    protected function normalizePayload(array $data): array
    {
        $payload = [];

        if (array_key_exists('title', $data) || array_key_exists('name', $data)) {
            $payload['title'] = $data['title'] ?? $data['name'];
        }

        if (array_key_exists('description', $data)) {
            $payload['description'] = $data['description'];
        }

        if (array_key_exists('note', $data)) {
            $payload['note'] = $data['note'];
        }

        if (array_key_exists('workdayspermonth', $data) || array_key_exists('days', $data)) {
            $payload['workdayspermonth'] = (int) ($data['workdayspermonth'] ?? $data['days'] ?? 0);
        }

        if (array_key_exists('workhoursperday', $data) || array_key_exists('hours', $data)) {
            $payload['workhoursperday'] = (int) ($data['workhoursperday'] ?? $data['hours'] ?? 0);
        }

        if (array_key_exists('parent_id', $data) || array_key_exists('mangerjobtitle', $data)) {
            $val = $data['parent_id'] ?? $data['mangerjobtitle'];
            $payload['parent_id'] = (!empty($val) && (int) $val > 0) ? (int) $val : null;
        }

        return $payload;
    }
}
