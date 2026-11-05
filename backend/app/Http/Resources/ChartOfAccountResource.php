<?php

namespace App\Http\Resources;

use App\Models\ChartOfAccount;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChartOfAccountResource extends JsonResource
{
    /**
     * Transform the resource into an array matching frontend 1:1.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $cashFlowLabel = ChartOfAccount::cashFlowLabel((int) $this->cash_flow_type);
        $balance = isset($this->final_balance) ? (float) $this->final_balance : (float) $this->opening_balance;

        return [
            'id'                           => $this->id,
            'parent_id'                    => $this->parent_id,
            'code'                         => (string) $this->code,
            'number'                       => (string) $this->code, // frontend alias
            'name'                         => $this->name,
            'name_en'                      => $this->name_en,
            'level'                        => (int) $this->level,
            'account_type'                 => $this->account_type,
            'accountType'                  => $cashFlowLabel ?: __('accounts.types.' . $this->account_type, [], $this->account_type), // frontend modal alias
            'nature'                       => $this->nature,
            'is_payable'                   => (bool) $this->is_payable,
            'is_active'                    => (bool) $this->is_active,
            'is_system'                    => (bool) $this->is_system,
            'opening_balance'              => (float) $this->opening_balance,
            'balance'                      => $balance,
            'final_balance'                => $balance,
            'cash_flow_type'               => (int) $this->cash_flow_type,
            'cash_flow_label'              => $cashFlowLabel,
            'cash_flow_assets_effect'      => $this->cash_flow_assets_effect,
            'cash_flow_liabilities_effect' => $this->cash_flow_liabilities_effect,
            'scrap_value'                  => $this->scrap_value !== null ? (float) $this->scrap_value : null,
            'useful_life'                  => $this->useful_life,
            'description'                  => $this->description,
            'children'                     => $this->relationLoaded('children') 
                                                ? self::collection($this->children) 
                                                : [],
            'created_at'                   => $this->created_at?->toIso8601String(),
            'updated_at'                   => $this->updated_at?->toIso8601String(),
        ];
    }
}
