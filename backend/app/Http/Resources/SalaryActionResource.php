<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SalaryActionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $employee = $this->employee;

        return [
            'id'          => $this->id,
            'employee_id' => $this->employee_id,
            'name'        => $employee?->name,
            'employee'    => $employee ? [
                'id'      => $employee->id,
                'name'    => $employee->name,
                'jobname' => $employee->jobTitle?->title ?? $employee->jobname,
            ] : null,
            'type'        => (int) $this->type,
            'reason'      => $this->reason ?: ($this->type === 0 ? 'مكافأة وحوافز' : 'خصم راتب'),
            'amounttype'  => (int) $this->amounttype,
            'amount'      => (float) $this->amount,
            'date'        => $this->date ? substr($this->date->toISOString(), 0, 10) : null,
            'description' => $this->description,
            'component'   => $this->component,
            'created_at'  => $this->created_at?->format('Y-m-d'),
        ];
    }
}
