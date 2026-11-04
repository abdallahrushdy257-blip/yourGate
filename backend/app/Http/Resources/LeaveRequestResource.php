<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaveRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'employee_id' => $this->employee_id,
            'name'        => $this->employee?->name ?? 'غير محدد',
            'type'        => 'إذن عمل',
            'date'        => $this->date?->format('Y-m-d') ?? '',
            'from_time'   => $this->from_time ?? '',
            'to_time'     => $this->to_time ?? '',
            'hours'       => (string) ($this->hours ?? '1'),
            'note'        => $this->note ?? '',
            'status'      => $this->status ?? 'قيد الانتظار',
            'file_path'   => $this->file_path,
            'created_at'  => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
