<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommitteeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'description'   => $this->description,
            'members_count' => $this->members_count ?? $this->members()->count(),
            'members'       => CommitteeMemberResource::collection($this->relationLoaded('members') ? $this->members : $this->members()->get()),
            'created_at'    => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
