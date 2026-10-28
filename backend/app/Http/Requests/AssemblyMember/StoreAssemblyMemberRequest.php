<?php

namespace App\Http\Requests\AssemblyMember;

use App\Http\Requests\BaseApiRequest;

class StoreAssemblyMemberRequest extends BaseApiRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'                     => ['required', 'string', 'max:255'],
            'dob'                      => ['nullable', 'date'],
            'dateofbirth'              => ['nullable', 'date'],
            'nationalid'               => ['nullable', 'string', 'max:50'],
            'idexpire'                 => ['nullable', 'date'],
            'nationalid_expire'        => ['nullable', 'date'],
            'startjoin'                => ['nullable', 'date'],
            'start_subscription_date'  => ['nullable', 'date'],
            'endjoin'                  => ['nullable', 'date'],
            'end_subscription_date'    => ['nullable', 'date'],
            'status'                   => ['nullable', 'in:1,2'],
            'membertype'               => ['nullable', 'string', 'max:50'],
            'subscription_type'        => ['nullable', 'string', 'max:50'],
            'startmember'              => ['nullable', 'date'],
            'start_membership_date'    => ['nullable', 'date'],
            'job'                      => ['nullable', 'string', 'max:255'],
            'jobAddress'               => ['nullable', 'string', 'max:255'],
            'jobaddress'               => ['nullable', 'string', 'max:255'],
            'fees'                     => ['nullable', 'numeric', 'min:0'],
            'subscription_fees'        => ['nullable', 'numeric', 'min:0'],
            'notes'                    => ['nullable', 'string', 'max:2000'],
            'upload'                   => ['nullable'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'اسم العضو مطلوب',
            'fees.numeric'  => 'قيمة الاشتراك يجب أن تكون رقماً',
        ];
    }
}
