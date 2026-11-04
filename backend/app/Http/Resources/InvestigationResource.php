<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class InvestigationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $attachmentUrl = null;
        if ($this->attachment) {
            $attachmentUrl = filter_var($this->attachment, FILTER_VALIDATE_URL)
                ? $this->attachment
                : Storage::disk('public')->url($this->attachment);
        }

        return [
            'id'              => $this->id,
            'store_id'        => $this->store_id,
            'employee_id'     => $this->employee_id,
            'investigator_id' => $this->investigator_id,
            'name'            => $this->employee?->name ?? 'غير محدد',
            'investigator'    => $this->investigator?->name ?? ($this->investigator_id ? 'غير محدد' : '-'),
            'employee'        => $this->whenLoaded('employee', function () {
                return [
                    'id'   => $this->employee->id,
                    'name' => $this->employee->name,
                ];
            }),
            'reason'          => $this->reason ?? '',
            'result'          => $this->result ?? '',
            'date'            => $this->date ? $this->date->format('Y-m-d') : null,
            'description'     => $this->description ?? '',
            'attachment'      => $this->attachment,
            'attachment_url'  => $attachmentUrl,
            'attach'          => $attachmentUrl,
            'created_at'      => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at'      => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
