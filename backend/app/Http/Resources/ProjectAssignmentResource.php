<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectAssignmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                      => $this->id,
            'store_id'                => $this->store_id,
            'project_id'              => $this->project_id,
            'phase_id'                => $this->phase_id,
            'phase_name'              => $this->phase_name,
            'responsible_name'        => $this->responsible_name ?: 'مسؤول المشروع',
            'responsible_type'        => (int) $this->responsible_type,
            'responsible_type_string' => $this->responsible_type_string,
            'responsible_id'          => $this->responsible_id,
            'role'                    => $this->role ?: 'عضو فريق',
            'responsibility'          => $this->responsibility,
            'created_at'              => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
