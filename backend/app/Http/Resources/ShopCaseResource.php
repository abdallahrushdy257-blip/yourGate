<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopCaseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $beneficiary = $this->relationLoaded('beneficiary') ? $this->beneficiary : $this->beneficiary()->first();

        $summary = [
            'id'                     => $this->id,
            'title'                  => $this->title,
            'name'                   => $this->title,
            'total'                  => (float) $this->total,
            'amount'                 => (float) $this->amount,
            'paid_amount'            => (float) $this->paid_amount,
            'total_paid'             => (float) $this->paid_amount,
            'net_balance'            => (float) $this->net_balance,
            'status'                 => (int) $this->status,
            'status_string'          => $this->status_string,
        ];

        return [
            'id'                     => $this->id,
            'store_id'               => $this->store_id,
            'store_name'             => $this->store?->name ?? 'منصة أبوابكم الخيرية',
            'title'                  => $this->title,
            'name'                   => $this->title,
            'human_cases_id'         => $this->human_cases_id,
            'benf'                   => $this->human_cases_id,
            'beneficiary_name'       => $beneficiary?->name ?? 'غير محدد',
            'beneficiary'            => $beneficiary ? [
                'id'       => $beneficiary->id,
                'name'     => $beneficiary->name,
                'idnumber' => $beneficiary->idnumber,
                'phonenum' => $beneficiary->phonenum,
            ] : null,
            'casetype'               => $this->casetype,
            'mainCategory'           => $this->casetype,
            'subcasetype'            => $this->subcasetype,
            'subCategory'            => $this->subcasetype,
            'other_category'         => $this->other_category,
            'showOtherTextbox'       => $this->other_category,
            'is_assets_selected'     => (bool) $this->is_assets_selected,
            'number_of_assets'       => (int) $this->number_of_assets,
            'cost_per_asset'         => (float) $this->cost_per_asset,
            'total'                  => (float) $this->total,
            'totalCost'              => (float) $this->total,
            'amount'                 => (float) $this->amount,
            'paid_amount'            => (float) $this->paid_amount,
            'total_paid'             => (float) $this->paid_amount,
            'net_balance'            => (float) $this->net_balance,
            'remaining'              => (float) $this->remaining,
            'percentage'             => (float) $this->percentage,
            'status'                 => (int) $this->status,
            'status_string'          => $this->status_string,
            'dateoflaunch'           => $this->dateoflaunch ? $this->dateoflaunch->format('Y-m-d') : null,
            'postDate'               => $this->dateoflaunch ? $this->dateoflaunch->format('Y-m-d') : null,
            'dateofcompletion'       => $this->dateofcompletion ? $this->dateofcompletion->format('Y-m-d') : null,
            'deedlineDate'           => $this->dateofcompletion ? $this->dateofcompletion->format('Y-m-d') : null,
            'marketingmethod'        => (int) $this->marketingmethod,
            'marketingmethod_string' => $this->marketingmethod_string,
            'description'            => $this->description,
            'description2'           => $this->description2,
            'accounttree'            => $this->accounttree,
            'document'               => $this->document,
            'document_url'           => $this->document_url,
            'created_at'             => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
            'paid'                   => $summary,
            'recieved'               => $summary,
            'transactions'           => ShopTransactionResource::collection($this->whenLoaded('transactions')),
            'details'                => ShopDetailResource::collection($this->whenLoaded('details')),
            'ads'                    => AdResource::collection($this->whenLoaded('ads')),
        ];
    }
}
