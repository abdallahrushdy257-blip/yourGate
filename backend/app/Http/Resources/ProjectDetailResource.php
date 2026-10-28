<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'store_id'    => $this->store_id,
            'project_id'  => $this->project_id,
            'type'        => (int) $this->type,
            'type_string' => $this->type_string,
            'description' => $this->description,
            'note'        => $this->note,
            'upload'      => $this->upload,
            'upload_url'  => $this->upload_url,
            'upload2'     => $this->upload2,
            'upload2_url' => $this->upload2_url,
            'status'      => $this->status,
            'created_at'  => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
