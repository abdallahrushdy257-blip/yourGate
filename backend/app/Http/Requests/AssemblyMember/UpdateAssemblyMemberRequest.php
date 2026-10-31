<?php

namespace App\Http\Requests\AssemblyMember;

use App\Http\Requests\BaseApiRequest;

class UpdateAssemblyMemberRequest extends BaseApiRequest
{
    /**
     * Prepare data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->route('id') && ! $this->has('id')) {
            $this->merge(['id' => (int) $this->route('id')]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id'                       => ['required', 'integer', 'exists:assembly_members,id'],
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
            'id.required'   => 'معرف العضو مطلوب للتعديل',
            'id.exists'     => 'العضو المحدد غير موجود',
            'name.required' => 'اسم العضو مطلوب',
            'fees.numeric'  => 'قيمة الاشتراك يجب أن تكون رقماً',
        ];
    }
}
