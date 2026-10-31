<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopDetailResource extends JsonResource
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
            'shop_id'     => $this->shop_id,
            'type'        => $this->type,
            'type_string' => $this->type_string,
            'description' => $this->description,
            'note'        => $this->note,
            'upload'      => $this->upload,
            'upload2'     => $this->upload2,
            'upload_url'  => $this->upload_url,
            'upload2_url' => $this->upload2_url,
            'status'      => $this->status,
            'created_at'  => $this->created_at?->toIso8601String(),
        ];
    }
}
