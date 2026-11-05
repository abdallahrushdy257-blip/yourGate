<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $dateFormatted = $this->date ? $this->date->format('Y-m-d') : ($this->created_at?->format('Y-m-d') ?? '');

        return [
            'id'          => $this->id,
            'employee_id' => $this->employee_id,
            'name'        => $this->employee?->name ?? 'غير محدد',
            'att'         => $this->check_in ?? '--',
            'check_in'    => $this->check_in ?? '--',
            'dateleave'   => $this->check_out ?? '--',
            'check_out'   => $this->check_out ?? '--',
            'recorddate'  => $dateFormatted,
            'date'        => $dateFormatted,
            'method'      => $this->method ?? 'يدوي',
            'status'      => $this->status ?? 'حاضر',
            'notes'       => $this->notes ?? '',
            'created_at'  => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
