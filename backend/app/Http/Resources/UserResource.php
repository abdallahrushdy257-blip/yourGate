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

        return [
            'id'              => $this->id,
            'name'            => $this->name,
            'email'           => $this->email,
            'phone'           => $this->phone,
            'address'         => $this->address,
            'organization_id' => $this->organization_id,
            'store_id'        => $this->store_id,
            'email_verified'  => $this->email_verified,
            'is_admin'        => (bool) $this->is_admin,
            'status'          => $this->status ?? 'active',
            'roles'           => $rolesAndPermissions,
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
