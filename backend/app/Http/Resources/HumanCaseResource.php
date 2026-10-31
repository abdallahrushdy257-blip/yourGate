<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HumanCaseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'gender'        => (string) ($this->gender ?? ''),
            'gender_string' => $this->gender_string,
            'dob'           => $this->dob?->format('Y-m-d') ?? '',
            'dateofbirth'   => $this->dateofbirth,
            'humancasetype' => (string) ($this->humancasetype ?? ''),
            'status'               => (string) ($this->status ?? '1'),
            'status_string'        => $this->status_string,
            'social_status_string' => $this->social_status_string,
            'case_status'          => (string) ($this->case_status ?? 'موافقة'),
            'case_status_string'   => $this->case_status_string,
            'case_status_code'     => $this->case_status_code,
            'nationality'   => $this->nationality ?? '',
            'familycount'   => $this->familycount,
            'phonenum'      => $this->phonenum ?? '',
            'phone'         => $this->phonenum ?? '',
            'email'         => $this->email ?? '',
            'accnumber'     => $this->accnumber ?? '',
            'idnumber'      => $this->idnumber ?? '',
            'idsource'      => $this->idsource ?? '',
            'iddate'        => $this->iddate?->format('Y-m-d') ?? '',
            'note'          => $this->note ?? '',
            'image'              => $this->details['bankdetails_upload'] ?? $this->details['bankdetails']['upload'] ?? null,
            'bank_image'         => $this->details['bankdetails_upload'] ?? $this->details['bankdetails']['upload'] ?? null,
            'bankdetails_upload' => $this->details['bankdetails_upload'] ?? $this->details['bankdetails']['upload'] ?? null,
            'details'            => $this->details,
            'created_at'    => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
