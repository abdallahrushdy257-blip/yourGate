<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectPhaseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'store_id'            => $this->store_id,
            'project_id'          => $this->project_id,
            'name'                => $this->name,
            'start_date'          => $this->start_date ? $this->start_date->format('Y-m-d') : null,
            'end_date'            => $this->end_date ? $this->end_date->format('Y-m-d') : null,
            'priority'            => $this->priority,
            'priority_string'     => $this->priority_string,
            'budget'              => (float) $this->budget,
            'status'              => (int) $this->status,
            'status_string'       => $this->status_string,
            'description'         => $this->description,
            'notes'               => $this->description,
            'performance_summary' => $this->performance_summary,
            'remaining_work'      => $this->remaining_work,
            'created_at'          => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
