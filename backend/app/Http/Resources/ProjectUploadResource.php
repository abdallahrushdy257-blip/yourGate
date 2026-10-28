<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectUploadResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'store_id'    => $this->store_id,
            'project_id'  => $this->project_id,
            'description' => $this->description,
            'upload'      => $this->upload_url ?: $this->upload,
            'upload_url'  => $this->upload_url,
            'created_at'  => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
