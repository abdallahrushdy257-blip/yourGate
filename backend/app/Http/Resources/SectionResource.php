<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $manager = $this->manager;

        return [
            'id'             => $this->id,
            'uuid'           => (string) $this->id,
            'name'           => $this->name,
            'dapartmentname' => $this->name,
            'description'    => $this->description,
            'desc'           => $this->description,
            'manager_id'     => $this->manager_id,
            'managerName'    => $manager?->name ?? 'غير محدد',
            'mangername'     => $manager?->name ?? 'غير محدد',
            'manager'        => $manager ? [
                'id'    => $manager->id,
                'name'  => $manager->name,
                'email' => $manager->email,
                'phone' => $manager->phone,
            ] : null,
            'created_at'     => $this->created_at ? $this->created_at->format('Y-m-d') : null,
        ];
    }
}
