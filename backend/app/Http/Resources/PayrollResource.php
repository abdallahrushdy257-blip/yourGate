<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayrollResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'store_id'         => $this->store_id,
            'employee_id'      => $this->employee_id,
            'name'             => $this->employee?->name ?? 'غير محدد',
            'employee'         => [
                'id'       => $this->employee?->id,
                'name'     => $this->employee?->name ?? 'غير محدد',
                'jobname'  => $this->employee?->jobtitle?->name ?? '',
                'national' => $this->employee?->nationalid ?? '',
                'iban'     => $this->employee?->iban ?? '',
            ],
            'year'             => $this->year,
            'month'            => str_pad((string) $this->month, 2, '0', STR_PAD_LEFT),
            'basic'            => (float) $this->basic_salary,
            'basic_salary'     => (float) $this->basic_salary,
            'allowance'        => (float) $this->allowance,
            'additions'        => (float) $this->additions,
            'deductions'       => (float) $this->deductions,
            'absence'          => (float) $this->absence,
            'investigations'   => (float) $this->investigations,
            'socialinsurance'  => (float) $this->social_insurance,
            'social_insurance' => (float) $this->social_insurance,
            'net'              => (float) $this->net_salary,
            'net_salary'       => (float) $this->net_salary,
            'status'           => $this->status ?? 'approved',
            'payment_date'     => $this->payment_date ? $this->payment_date->format('Y-m-d') : null,
            'notes'            => $this->notes ?? '',
            'created_at'       => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
