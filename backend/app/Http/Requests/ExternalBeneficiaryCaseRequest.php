<?php

namespace App\Http\Requests;

class ExternalBeneficiaryCaseRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [
            'name'          => ['required', 'string', 'max:255'],
            'gender'        => ['nullable'],
            'dob'           => ['nullable', 'date'],
            'humancasetype' => ['nullable'],
            'status'        => ['nullable'],
            'nationality'   => ['nullable', 'string', 'max:255'],
            'familycount'   => ['nullable'],
            'phonenum'      => ['nullable', 'string', 'max:50'],
            'email'         => ['nullable', 'email', 'max:255'],
            'accnumber'     => ['nullable', 'string', 'max:255'],
            'idnumber'      => ['nullable', 'string', 'max:50'],
            'idsource'      => ['nullable', 'string', 'max:255'],
            'iddate'        => ['nullable', 'date'],
            'note'          => ['nullable', 'string'],
        ];
    }
}
