<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectKpiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'store_id'   => $this->store_id,
            'project_id' => $this->project_id,
            'kpi_id'     => $this->kpi_id,
            'quiz'       => $this->quiz,
            'target'     => (float) $this->target,
            'actual'     => (float) $this->actual,
            'status'     => $this->status ?: 'خطر',
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
