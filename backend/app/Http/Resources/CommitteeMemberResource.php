<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommitteeMemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'committee_id'       => $this->committee_id,
            'assembly_member_id' => $this->assembly_member_id,
            'name'               => $this->name,
            'role'               => $this->role,
            'created_at'         => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
