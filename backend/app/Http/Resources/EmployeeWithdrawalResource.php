<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeWithdrawalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $amount = (float) ($this->amount ?? 0);
        $statusInt = (int) ($this->status ?? 0);

        return [
            'id'              => $this->id,
            'uuid'            => 'w-' . $this->id,
            'employee_id'     => $this->employee_id,
            'employee'        => $this->employee?->name ?? 'موظف غير محدد',
            'employee_name'   => $this->employee?->name ?? 'موظف غير محدد',
            'account_id'      => $this->account_id,
            'account'         => $this->account_name ?? 'الخزينة الرئيسية',
            'amount'          => $amount,
            'amountText'      => number_format($amount, 0, '.', ','),
            'date'            => $this->date ? $this->date->format('Y-m-d') : ($this->created_at?->format('Y-m-d') ?? ''),
            'time'            => $this->time ?? '10:00',
            'withdrawal_date' => $this->withdrawal_date ? $this->withdrawal_date->format('Y-m-d') : ($this->date ? $this->date->format('Y-m-d') : ''),
            'status'          => $statusInt,
            'statusText'      => $statusInt === 1 ? 'معتمد' : 'قيد الانتظار',
            'description'     => $this->description ?? '',
            'created_at'      => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
