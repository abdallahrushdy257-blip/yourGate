<?php

namespace App\Services;

use App\Models\Store;
use App\Models\Survey;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SurveyService
{
    /**
     * Get surveys list and calculated stats (Total, Average Satisfaction, NPS).
     */
    public function list(array $filters = [], ?int $storeId = null): array
    {
        $query = Survey::with('humanCase')->latest('submitted_at');

        if (! empty($filters['period'])) {
            $query->where('period', $filters['period']);
        }

        if ($storeId) {
            $query->where('store_id', $storeId);
        }

        $surveys = $query->get();

        $total = $surveys->count();

        // Calculate average satisfaction score (1 to 5)
        $withSatisfaction = $surveys->whereNotNull('satisfaction_score');
        $avgSatisfaction = $withSatisfaction->count() > 0
            ? round($withSatisfaction->avg('satisfaction_score'), 1)
            : null;

        // Calculate Net Promoter Score (NPS)
        $withNps = $surveys->whereNotNull('nps_score');
        $npsCount = $withNps->count();

        if ($npsCount > 0) {
            $promoters = $withNps->where('nps_score', '>=', 9)->count();
            $detractors = $withNps->where('nps_score', '<=', 6)->count();
            $passives = $withNps->whereBetween('nps_score', [7, 8])->count();
            $nps = (int) round((($promoters - $detractors) / $npsCount) * 100);
        } else {
            $promoters = 0;
            $detractors = 0;
            $passives = 0;
            $nps = null;
        }

        return [
            'data'  => $surveys,
            'stats' => [
                'total'            => $total,
                'avg_satisfaction' => $avgSatisfaction,
                'nps'              => $nps,
                'promoters'        => $promoters,
                'passives'         => $passives,
                'detractors'       => $detractors,
            ],
            'meta'  => [
                'current_period' => now()->year . '-Q' . (int) ceil(now()->month / 3),
            ],
        ];
    }

    /**
     * Store new satisfaction survey.
     */
    public function store(array $data, ?User $user = null): Survey
    {
        return DB::transaction(function () use ($data, $user) {
            $period = ! empty($data['period'])
                ? (string) $data['period']
                : now()->year . '-Q' . (int) ceil(now()->month / 3);

            $storeId = $user?->store_id ?? app('current_store_id', null) ?? Store::value('id') ?? 1;

            $survey = new Survey();
            $survey->store_id           = $storeId;
            $survey->humancase_id       = ! empty($data['humancase_id']) ? (int) $data['humancase_id'] : null;
            $survey->user_id            = $user?->id;
            $survey->period             = $period;
            $survey->satisfaction_score = isset($data['satisfaction_score']) && $data['satisfaction_score'] !== ''
                ? (int) $data['satisfaction_score']
                : null;
            $survey->nps_score          = isset($data['nps_score']) && $data['nps_score'] !== ''
                ? (int) $data['nps_score']
                : null;
            $survey->notes              = $data['notes'] ?? null;
            $survey->submitted_at       = now();
            $survey->save();

            return $survey->load('humanCase');
        });
    }

    /**
     * Delete survey.
     */
    public function delete(int $id): bool
    {
        $survey = Survey::findOrFail($id);

        return (bool) $survey->delete();
    }
}
