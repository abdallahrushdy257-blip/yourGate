<?php

namespace App\Http\Requests\Employee;

use App\Http\Requests\BaseApiRequest;

class UpdateEmployeeRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id'                   => 'nullable',
            'name'                 => 'sometimes|required|string|max:255',
            'email'                => 'nullable|email|max:255',
            'phone'                => 'nullable|string|max:50',
            'nationalid'           => 'nullable|string|max:50',
            'idnumber'             => 'nullable|string|max:50',
            'idtype'               => 'nullable',
            'nationalid_expire'    => 'nullable|string',
            'idexpiredate'         => 'nullable|string',
            'dob'                  => 'nullable|string',
            'dateofbirth'          => 'nullable|string',
            'gender'               => 'nullable',
            'status'               => 'nullable',
            'address'              => 'nullable|string|max:500',
            'nationality'          => 'nullable|string|max:100',
            'qualification'        => 'nullable|string|max:255',
            'worktype'             => 'nullable',
            'dateofhire'           => 'nullable|string',
            'workdate'             => 'nullable|string',
            'contractexpiration'   => 'nullable|string',
            'expirehire'           => 'nullable|string',
            'jobtitle'             => 'nullable',
            'job_title_id'         => 'nullable',
            'iban'                 => 'nullable|string|max:100',
            'photo'                => 'nullable',
            'upload'               => 'nullable',
            'basic'                   => 'nullable|numeric',
            'basic_salary'            => 'nullable|numeric',
            'mainBudget'              => 'nullable|numeric',
            'socialinsurance'         => 'nullable|numeric',
            'social_insurance'        => 'nullable|numeric',
            'socialWelfare'           => 'nullable|numeric',
            'house'                   => 'nullable|numeric',
            'housing_allowance'       => 'nullable|numeric',
            'transport'               => 'nullable|numeric',
            'transportation'          => 'nullable|numeric',
            'transport_allowance'     => 'nullable|numeric',
            'communication'           => 'nullable|numeric',
            'communication_allowance' => 'nullable|numeric',
            'life'                    => 'nullable|numeric',
            'life_allowance'          => 'nullable|numeric',
            'work'                    => 'nullable|numeric',
            'work_allowance'          => 'nullable|numeric',
            'account'                 => 'nullable|string',
            'salary_account'          => 'nullable|string',
            'documents'            => 'nullable|array',
            'documents.*.title'    => 'nullable|string',
            'documents.*.file'     => 'nullable',
        ];
    }
}
