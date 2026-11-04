<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VacationRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'employee_id'  => $this->employee_id,
            'name'         => $this->employee?->name ?? 'غير محدد',
            'vacation_id'  => $this->vacation_id,
            'vacationname' => $this->vacation?->name ?? 'إجازة',
            'description'  => $this->description ?? '',
            'startdate'    => $this->from?->format('Y-m-d') ?? '',
            'enddate'      => $this->to?->format('Y-m-d') ?? '',
            'from'         => $this->from?->format('Y-m-d') ?? '',
            'to'           => $this->to?->format('Y-m-d') ?? '',
            'status'       => $this->status ?? 'قيد الانتظار',
            'file_path'    => $this->file_path,
            'created_at'   => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
