<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MinuteSheetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'title'         => $this->title,
            'date'          => $this->date ? $this->date->format('Y-m-d') : null,
            'type'          => $this->type,
            'type_string'   => $this->type_string,
            'reason'        => $this->reason,
            'reason_string' => $this->reason_string,
            'note'          => $this->note,
            'upload'        => $this->upload_url ?? $this->upload,
            'upload_url'    => $this->upload_url,
            'attendees'     => $this->attendees->map(function ($a) {
                return [
                    'id'                 => $a->id,
                    'assembly_member_id' => $a->assembly_member_id,
                    'committee_id'       => $a->committee_id,
                    'member_name'        => $a->assemblyMember?->name,
                    'committee_name'     => $a->committee?->name,
                    'value'              => $a->assembly_member_id,
                ];
            }),
            'committee'     => $this->attendees->map(function ($a) {
                return [
                    'value' => $a->committee_id,
                ];
            }),
            'created_at'    => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
