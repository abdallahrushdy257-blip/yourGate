<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeAdvanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $employee = $this->employee;
        $installments = $this->installments;

        return [
            'id'                 => $this->id,
            'employee_id'        => $this->employee_id,
            'employee'           => $employee ? [
                'id'      => $employee->id,
                'name'    => $employee->name,
                'jobname' => $employee->jobTitle?->title ?? $employee->jobname,
            ] : null,
            'payment_account_id' => $this->payment_account_id,
            'amount'             => (float) $this->amount,
            'months'             => (int) $this->months,
            'monthly_amount'     => (float) $this->monthly_amount,
            'start_date'         => $this->start_date ? substr($this->start_date->toISOString(), 0, 10) : null,
            'end_date'           => $this->end_date ? substr($this->end_date->toISOString(), 0, 10) : null,
            'notes'              => $this->notes,
            'status'             => $this->status ?? 'active',
            'summary'            => [
                'amount'         => (float) $this->amount,
                'months'         => (int) $this->months,
                'monthly_amount' => (float) $this->monthly_amount,
                'start_date'     => $this->start_date ? substr($this->start_date->toISOString(), 0, 10) : null,
                'end_date'       => $this->end_date ? substr($this->end_date->toISOString(), 0, 10) : null,
                'notes'          => $this->notes ?: '-',
                'status'         => $this->status === 'completed' ? 'مكتملة' : ($this->status === 'cancelled' ? 'ملغاة' : 'نشطة'),
            ],
            'installments'       => $installments->map(function ($inst) {
                return [
                    'id'                 => $inst->id,
                    'installment_number' => $inst->installment_number,
                    'amount'             => (float) $inst->amount,
                    'due_date'           => $inst->due_date ? substr($inst->due_date->toISOString(), 0, 10) : null,
                    'status'             => $inst->status,
                    'paid_at'            => $inst->paid_at?->format('Y-m-d H:i:s'),
                ];
            }),
            'created_at'         => $this->created_at?->format('Y-m-d'),
        ];
    }
}
