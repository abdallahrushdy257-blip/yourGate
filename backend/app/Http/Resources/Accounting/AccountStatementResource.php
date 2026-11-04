<?php

namespace App\Http\Resources\Accounting;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountStatementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'account'         => $this->resource['account'] ?? null,
            'date_from'       => $this->resource['date_from'] ?? null,
            'date_to'         => $this->resource['date_to'] ?? null,
            'opening_balance' => (float) ($this->resource['opening_balance'] ?? 0),
            'total_debit'     => (float) ($this->resource['total_debit'] ?? 0),
            'total_credit'    => (float) ($this->resource['total_credit'] ?? 0),
            'net_change'      => (float) ($this->resource['net_change'] ?? 0),
            'closing_balance' => (float) ($this->resource['closing_balance'] ?? 0),
            'transactions'    => $this->resource['transactions'] ?? [],
            'data'            => $this->resource['data'] ?? [],
            'total'           => (int) ($this->resource['total'] ?? 0),
        ];
    }
}
