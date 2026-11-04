<?php

namespace App\Http\Resources\Voucher;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VoucherResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $methodsAr = [
            'cash'     => 'نقدي',
            'network'  => 'شبكة',
            'transfer' => 'تحويل بنكي',
            'deposit'  => 'إيداع',
            'check'    => 'شيك',
            'knet'     => 'KNET',
        ];

        return [
            'id'                   => $this->id,
            'voucher_number'       => $this->voucher_number,
            'voucher_type'         => $this->voucher_type,
            'voucher_type_label'   => $this->voucher_type === 'receipt' ? 'سند قبض' : 'سند صرف',
            'payment_method'       => $this->payment_method,
            'payment_method_label' => $methodsAr[$this->payment_method] ?? $this->payment_method,
            'date'                 => $this->date ? $this->date->format('Y-m-d') : null,
            'amount'               => (float) $this->amount,
            'debit_account_id'     => $this->debit_account_id,
            'debit_account'        => $this->debitAccount ? [
                'id'   => $this->debitAccount->id,
                'code' => $this->debitAccount->code,
                'name' => $this->debitAccount->name,
            ] : null,
            'credit_account_id'    => $this->credit_account_id,
            'credit_account'       => $this->creditAccount ? [
                'id'   => $this->creditAccount->id,
                'code' => $this->creditAccount->code,
                'name' => $this->creditAccount->name,
            ] : null,
            'description'          => $this->description,
            'category'             => $this->category,
            'status'               => $this->status,
            'status_label'         => $this->status === 'posted' ? 'مرحل' : ($this->status === 'draft' ? 'مسودة' : 'ملغي'),
            'journal_entry_id'     => $this->journal_entry_id,
            'created_at'           => $this->created_at?->toISOString(),
        ];
    }
}
