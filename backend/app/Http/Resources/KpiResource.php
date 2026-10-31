<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KpiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'store_id'   => $this->store_id,
            'quiz'       => $this->quiz,
            'target'     => (float) $this->target,
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
