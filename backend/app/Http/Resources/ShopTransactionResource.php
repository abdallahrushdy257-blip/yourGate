<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopTransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                       => $this->id,
            'shop_id'                  => $this->shop_id,
            'invoice_number'           => $this->invoice_number,
            'transaction_type'         => $this->transaction_type,
            'transaction_type_string'  => $this->transaction_type_string,
            'type'                     => $this->type,
            'amount'                   => (float) $this->amount,
            'formatted_amount'         => $this->formatted_amount,
            'date'                     => $this->date ? $this->date->format('Y-m-d') : null,
            'account'                  => $this->account,
            'balanceid'                => $this->balanceid,
            'donor_id'                 => $this->donor_id,
            'donor_name'               => $this->donor?->name ?? 'فاعل خير',
            'beneficiary_id'           => $this->human_cases_id,
            'beneficiary_name'         => $this->beneficiary?->name ?? null,
            'notes'                    => $this->notes,
            'created_at'               => $this->created_at?->toIso8601String(),
        ];
    }
}
