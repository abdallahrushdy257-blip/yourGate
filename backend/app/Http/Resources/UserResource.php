<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Extract permissions and roles as string array for frontend compatibility
        $rolesAndPermissions = $this->roles 
            ? $this->getAllPermissions()->pluck('name')->merge($this->getRoleNames())->unique()->values()->all()
            : [];

        $orgData = [
            'id'   => $this->store_id ?? $this->organization_id ?? 1,
            'name' => $this->relationLoaded('store') && $this->store ? $this->store->name : 'الجمعية الخيرية',
            'slug' => $this->relationLoaded('store') && $this->store ? $this->store->slug : 'charity',
        ];

        return [
            'id'              => $this->id,
            'name'            => $this->name,
            'email'           => $this->email,
            'phone'           => $this->phone,
            'address'         => $this->address,
            'organization_id' => $this->organization_id ?? $this->store_id ?? 1,
            'store_id'        => $this->store_id,
            'email_verified'  => $this->email_verified,
            'is_admin'        => (bool) $this->is_admin,
            'status'          => $this->status ?? 'active',
            'roles'           => $rolesAndPermissions,
            'user'            => [
                'id'    => $this->id,
                'name'  => $this->name,
                'email' => $this->email,
                'phone' => $this->phone,
            ],
            'organization'    => $orgData,
            'store'           => $this->whenLoaded('store', function () {
                return [
                    'id'   => $this->store->id,
                    'name' => $this->store->name,
                    'slug' => $this->store->slug,
                ];
            }),
            'created_at'      => $this->created_at?->toISOString(),
        ];
    }
}
