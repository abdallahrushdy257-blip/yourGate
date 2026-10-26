<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BeneficiaryTokenResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $status = 'نشط';
        if ($this->is_used) {
            $status = 'مستخدم';
        } elseif ($this->isExpired()) {
            $status = 'منتهي';
        }

        return [
            'id'               => $this->id,
            'code'             => $this->code,
            'label'            => $this->label,
            'expires_at'       => $this->expires_at?->toIso8601String(),
            'expires_at_human' => $this->expires_at?->format('Y-m-d H:i'),
            'is_used'          => (bool) $this->is_used,
            'used_at'          => $this->used_at?->format('Y-m-d H:i'),
            'human_case_id'    => $this->human_case_id,
            'beneficiary_name' => $this->humanCase?->name ?? null,
            'status'           => $status,
            'created_at'       => $this->created_at?->format('Y-m-d H:i'),
        ];
    }
}
