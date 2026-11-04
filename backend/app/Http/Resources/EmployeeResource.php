<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $jobTitle = $this->jobtitle;

        $photoUrl = $this->photo 
            ? (str_starts_with($this->photo, 'http') ? $this->photo : url('storage/' . $this->photo))
            : 'https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?semt=ais_hybrid';

        return [
            'id'                       => $this->id,
            'name'                     => $this->name,
            'email'                    => $this->email,
            'phone'                    => $this->phone,
            'nationalid'               => $this->nationalid,
            'idnumber'                 => $this->nationalid,
            'idtype'                   => (int) $this->idtype,
            'nationalid_expire'        => $this->nationalid_expire ? $this->nationalid_expire->format('Y-m-d') : null,
            'idexpiredate'             => $this->nationalid_expire ? $this->nationalid_expire->format('Y-m-d') : null,
            'dob'                      => $this->dob ? $this->dob->format('Y-m-d') : null,
            'dateofbirth'              => $this->dob ? $this->dob->format('Y-m-d') : null,
            'gender'                   => $this->gender,
            'status'                   => (int) $this->status,
            'address'                  => $this->address,
            'nationality'              => $this->nationality,
            'qualification'            => $this->qualification,
            'worktype'                 => (int) $this->worktype,
            'dateofhire'               => $this->dateofhire ? $this->dateofhire->format('Y-m-d') : null,
            'workdate'                 => $this->dateofhire ? $this->dateofhire->format('Y-m-d') : null,
            'contractexpiration'       => $this->contractexpiration ? $this->contractexpiration->format('Y-m-d') : null,
            'expirehire'               => $this->contractexpiration ? $this->contractexpiration->format('Y-m-d') : null,
            'job_title_id'             => $this->job_title_id,
            'jobname'                  => $jobTitle?->title ?? 'غير محدد',
            'jobtitle'                 => $jobTitle ? [
                'id'    => $jobTitle->id,
                'title' => $jobTitle->title,
                'name'  => $jobTitle->title,
            ] : null,
            'iban'                     => $this->iban,
            'ibannumber'               => $this->iban,
            'photo'                    => $photoUrl,
            'basic_salary'             => (float) $this->basic_salary,
            'basic'                    => (float) $this->basic_salary,
            'social_insurance'         => (float) $this->social_insurance,
            'socialinsurance'          => (float) $this->social_insurance,
            'housing_allowance'        => (float) $this->housing_allowance,
            'house'                    => (float) $this->housing_allowance,
            'transport_allowance'      => (float) $this->transport_allowance,
            'transport'                => (float) $this->transport_allowance,
            'transportation'           => (float) $this->transport_allowance,
            'communication_allowance'  => (float) $this->communication_allowance,
            'communication'            => (float) $this->communication_allowance,
            'life_allowance'           => (float) $this->life_allowance,
            'life'                     => (float) $this->life_allowance,
            'work_allowance'           => (float) $this->work_allowance,
            'work'                     => (float) $this->work_allowance,
            'salary_account'           => $this->salary_account,
            'account'                  => $this->salary_account,
            'total_salary'             => (float) $this->total_salary,
            'is_active'                => (bool) $this->is_active,
            'salary'                   => [
                'basic'           => (float) $this->basic_salary,
                'socialinsurance' => (float) $this->social_insurance,
                'house'           => (float) $this->housing_allowance,
                'transport'       => (float) $this->transport_allowance,
                'communication'   => (float) $this->communication_allowance,
                'life'            => (float) $this->life_allowance,
                'work'            => (float) $this->work_allowance,
                'account'         => $this->salary_account,
                'total'           => (float) $this->total_salary,
            ],
            'documents'                => $this->documents ? $this->documents->map(function ($doc) {
                return [
                    'id'        => $doc->id,
                    'title'     => $doc->title,
                    'file_path' => $doc->file_path,
                    'url'       => str_starts_with($doc->file_path, 'http') ? $doc->file_path : url('storage/' . $doc->file_path),
                ];
            }) : [],
            'created_at'               => $this->created_at ? $this->created_at->format('Y-m-d') : null,
        ];
    }
}
