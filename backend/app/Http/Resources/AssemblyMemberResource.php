<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssemblyMemberResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                       => $this->id,
            'membership_serial'        => $this->membership_serial,
            'name'                     => $this->name,
            'dateofbirth'              => $this->formatDate($this->dateofbirth),
            'dob'                      => $this->formatDate($this->dateofbirth),
            'nationalid'               => $this->nationalid,
            'nationalid_expire'        => $this->formatDate($this->nationalid_expire),
            'idexpire'                 => $this->formatDate($this->nationalid_expire),
            'start_subscription_date'  => $this->formatDate($this->start_subscription_date),
            'startjoin'                => $this->formatDate($this->start_subscription_date),
            'end_subscription_date'    => $this->formatDate($this->end_subscription_date),
            'endjoin'                  => $this->formatDate($this->end_subscription_date),
            'status'                   => (int) $this->status,
            'status_string'            => $this->status_string,
            'subscription_type'        => (string) ($this->subscription_type ?? ''),
            'subscription_type_string' => $this->subscription_type_string,
            'membertype'               => (string) ($this->subscription_type ?? ''),
            'start_membership_date'    => $this->formatDate($this->start_membership_date),
            'startmember'              => $this->formatDate($this->start_membership_date),
            'job'                      => $this->job,
            'jobaddress'               => $this->jobaddress,
            'jobAddress'               => $this->jobaddress,
            'subscription_fees'        => (float) ($this->subscription_fees ?? 0),
            'fees'                     => (float) ($this->subscription_fees ?? 0),
            'notes'                    => $this->notes,
            'upload'                   => $this->upload,
            'upload_url'               => $this->upload_url,
            'created_at'               => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
        ];
    }

    protected function formatDate(mixed $value): ?string
    {
        if (empty($value)) {
            return null;
        }

        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d');
        }

        return substr((string) $value, 0, 10);
    }
}
