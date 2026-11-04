<?php

namespace App\Http\Resources\HR;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class MissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $uploadUrl = null;
        if ($this->upload) {
            $uploadUrl = filter_var($this->upload, FILTER_VALIDATE_URL)
                ? $this->upload
                : asset('storage/' . ltrim($this->upload, '/'));
        }

        return [
            'id'           => $this->id,
            'title'        => $this->title,
            'mission_type' => $this->mission_type,
            'description'  => $this->description,
            'start_date'   => $this->start_date ? $this->start_date->format('Y-m-d') : null,
            'end_date'     => $this->end_date ? $this->end_date->format('Y-m-d') : null,
            'status'       => $this->status,
            'upload'       => $uploadUrl,
            'incharge'     => is_array($this->incharge) ? $this->incharge : json_decode($this->incharge ?? '[]', true),
            'created_at'   => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
