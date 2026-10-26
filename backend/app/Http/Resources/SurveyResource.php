<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SurveyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'humancase_id'       => $this->humancase_id,
            'humancase_name'     => $this->humanCase?->name ?? 'غير محدد',
            'satisfaction_score' => $this->satisfaction_score,
            'nps_score'          => $this->nps_score,
            'nps_category'       => $this->nps_category,
            'notes'              => $this->notes,
            'period'             => $this->period,
            'submitted_at'       => $this->submitted_at?->toISOString() ?? $this->created_at?->toISOString(),
            'created_at'         => $this->created_at?->toISOString(),
        ];
    }
}
