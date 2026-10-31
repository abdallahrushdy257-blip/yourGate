<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $shop = $this->relationLoaded('shop') ? $this->shop : $this->shop()->first();
        $store = $this->relationLoaded('store') ? $this->store : $this->store()->first();

        return [
            'id'          => $this->id,
            'store_id'    => $this->store_id,
            'org_name'    => $store?->name ?? 'الجمعية الرئيسية',
            'shop_id'     => $this->shop_id,
            'name'        => $shop?->title ?? 'حالة غير محددة',
            'total'       => (float) ($shop?->total ?? 0),
            'ad_approved' => (bool) $this->ad_approved,
            'approved'    => (bool) $this->ad_approved,
            'status_name' => $this->ad_approved ? 'مقبول وممول' : 'قيد المراجعة',
            'notes'       => $this->notes,
            'created_at'  => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
