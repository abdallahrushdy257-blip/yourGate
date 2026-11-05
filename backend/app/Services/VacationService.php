<?php

namespace App\Services;

use App\Models\Vacation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class VacationService
{
    /**
     * Default standard vacation types.
     */
    public function defaultVacations(): array
    {
        return [
            [
                'name'        => 'إجازة سنوية',
                'description' => 'إجازة اعتيادية سنوية مدفوعة الراتب للموظف',
                'days'        => 21,
            ],
            [
                'name'        => 'إجازة مرضية',
                'description' => 'إجازة بموجب تقرير طبي معتمد',
                'days'        => 7,
            ],
            [
                'name'        => 'إجازة وضع',
                'description' => 'إجازة رعاية مولود للموظفة',
                'days'        => 90,
            ],
            [
                'name'        => 'إجازة اضطرارية',
                'description' => 'إجازة للظروف العائلية والشخصية الطارئة',
                'days'        => 5,
            ],
            [
                'name'        => 'إجازة حج',
                'description' => 'إجازة لأداء فريضة الحج لمرة واحدة طوال الخدمة',
                'days'        => 10,
            ],
        ];
    }

    /**
     * Seed defaults if the store has no vacation types.
     */
    public function ensureDefaults(): void
    {
        if (Vacation::count() === 0) {
            foreach ($this->defaultVacations() as $item) {
                Vacation::create($item);
            }
        }
    }

    /**
     * List vacation types with optional search and pagination.
     */
    public function list(array $filters = [], ?int $perPage = null)
    {
        $this->ensureDefaults();

        $query = Vacation::latest('id');

        if (!empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Find vacation type by ID.
     */
    public function find(int $id): Vacation
    {
        return Vacation::findOrFail($id);
    }

    /**
     * Store new vacation type.
     */
    public function store(array $data): Vacation
    {
        return Vacation::create([
            'name'        => $data['name'],
            'description' => $data['description'] ?? null,
            'days'        => (int) ($data['days'] ?? 0),
        ]);
    }

    /**
     * Update existing vacation type.
     */
    public function update(int $id, array $data): Vacation
    {
        $vacation = Vacation::findOrFail($id);
        $vacation->update([
            'name'        => $data['name'] ?? $vacation->name,
            'description' => array_key_exists('description', $data) ? $data['description'] : $vacation->description,
            'days'        => array_key_exists('days', $data) ? (int) $data['days'] : $vacation->days,
        ]);

        return $vacation->fresh();
    }

    /**
     * Delete vacation type.
     */
    public function delete(int $id): bool
    {
        $vacation = Vacation::findOrFail($id);

        return (bool) $vacation->delete();
    }
}
