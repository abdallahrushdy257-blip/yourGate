<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LatePolicyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'uuid'        => (string) $this->id,
            'category'    => $this->category,
            'from_minute' => (int) $this->from_minute,
            'to_minute'   => (int) $this->to_minute,
            'hour'        => (float) $this->hour,
            'type'        => $this->type,
            'value'       => (float) $this->value,
            'active'      => (int) $this->active,
            'note'        => $this->note,
            'created_at'  => $this->created_at?->format('Y-m-d'),
        ];
    }
}
