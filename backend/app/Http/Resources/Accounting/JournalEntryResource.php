<?php

namespace App\Http\Resources\Accounting;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JournalEntryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $firstDebit = $this->lines->firstWhere('debit', '>', 0);
        $firstCredit = $this->lines->firstWhere('credit', '>', 0);

        return [
            'id'                  => $this->id,
            'entry_number'        => $this->entry_number,
            'registration_number' => $this->entry_number,
            'date'                => $this->date ? $this->date->format('Y-m-d') : null,
            'description'         => $this->description,
            'reference_type'      => $this->reference_type,
            'type_string'         => 'قيد محاسبي',
            'total_debit'         => (float) $this->total_debit,
            'total_credit'        => (float) $this->total_credit,
            'debt_amount'         => (float) $this->total_debit,
            'credit_amount'       => (float) $this->total_credit,
            'amount'              => (float) $this->total_debit,
            'status'              => $this->status,
            'status_label'        => $this->status === 'posted' ? 'مرحل' : ($this->status === 'draft' ? 'مسودة' : 'ملغي'),
            'created_by'          => $this->created_by,
            'created_at'          => $this->created_at?->toISOString(),
            'lines'               => $this->lines->map(function ($line) {
                return [
                    'id'             => $line->id,
                    'account_id'     => $line->chart_of_account_id,
                    'account_number' => $line->account?->code,
                    'account_name'   => $line->account?->name,
                    'account'        => $line->account ? [
                        'id'   => $line->account->id,
                        'code' => $line->account->code,
                        'name' => $line->account->name,
                    ] : null,
                    'debit'          => (float) $line->debit,
                    'credit'         => (float) $line->credit,
                    'description'    => $line->description,
                    'line_order'     => $line->line_order,
                ];
            }),
            // Legacy aliases for AccountingEntryView.js
            'debitaccount'        => $firstDebit?->account ? [
                'id'   => $firstDebit->account->id,
                'code' => $firstDebit->account->code,
                'name' => $firstDebit->account->name,
            ] : null,
            'creditaccount'       => $firstCredit?->account ? [
                'id'   => $firstCredit->account->id,
                'code' => $firstCredit->account->code,
                'name' => $firstCredit->account->name,
            ] : null,
        ];
    }
}
