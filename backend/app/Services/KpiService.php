<?php

namespace App\Services;

use App\Models\Kpi;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class KpiService
{
    /**
     * Default standard KPIs to seed automatically if store has none.
     */
    public function defaultKpis(): array
    {
        return [
            ['quiz' => 'نسبة الالتزام بالجدول الزمني للمشروع', 'target' => 100],
            ['quiz' => 'نسبة الصرف ومطابقة الميزانية المعتمدة', 'target' => 100],
            ['quiz' => 'معدل رضا المستفيدين وأصحاب المصلحة', 'target' => 90],
            ['quiz' => 'نسبة إنجاز المخرجات التشغيلية للمشروع', 'target' => 100],
        ];
    }

    /**
     * Ensure default KPIs exist for current store.
     */
    public function ensureDefaults(): void
    {
        if (Kpi::count() === 0) {
            foreach ($this->defaultKpis() as $item) {
                Kpi::create($item);
            }
        }
    }

    /**
     * List KPIs with optional pagination and filters.
     */
    public function list(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $this->ensureDefaults();

        $query = Kpi::latest('id');

        if (!empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where('quiz', 'like', "%{$search}%");
        }

        return $query->paginate($perPage);
    }

    /**
     * Get all active KPIs for project evaluation (quizs).
     */
    public function quizs(): array
    {
        $this->ensureDefaults();

        return Kpi::latest('id')
            ->get()
            ->map(fn (Kpi $k) => [
                'id'     => $k->id,
                'quiz'   => $k->quiz,
                'target' => (float) $k->target,
                'actual' => 0,
                'status' => 'خطر',
            ])
            ->toArray();
    }

    /**
     * Store a new KPI.
     */
    public function store(array $data): Kpi
    {
        return Kpi::create($data);
    }

    /**
     * Find a single KPI by ID.
     */
    public function find(int $id): Kpi
    {
        return Kpi::findOrFail($id);
    }

    /**
     * Update an existing KPI.
     */
    public function update(int $id, array $data): Kpi
    {
        $kpi = Kpi::findOrFail($id);
        $kpi->update($data);

        return $kpi;
    }

    /**
     * Delete a KPI.
     */
    public function delete(int $id): bool
    {
        $kpi = Kpi::findOrFail($id);

        return (bool) $kpi->delete();
    }
}
