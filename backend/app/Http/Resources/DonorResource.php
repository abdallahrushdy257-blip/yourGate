<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                         => $this->id,
            'name'                       => $this->name,
            'address'                    => $this->address ?? '',
            'phone'                      => $this->phone ?? '',
            'email'                      => $this->email ?? '',
            'type'                       => (string) ($this->type ?? ''),
            'type_string'                => $this->type_string,
            'interest'                   => $this->interest?->name ?? '',
            'interest_id'                => $this->interest_id,
            'donorInterests'             => $this->interest_id,
            'identification_number'      => $this->identification_number ?? '',
            'identification_description' => $this->identification_description ?? '',
            'created_at'                 => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
