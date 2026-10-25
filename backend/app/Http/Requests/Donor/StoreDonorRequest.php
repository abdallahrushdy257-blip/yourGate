<?php

namespace App\Http\Requests\Donor;

use App\Http\Requests\BaseApiRequest;

class StoreDonorRequest extends BaseApiRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'                       => ['required', 'string', 'max:255'],
            'phone'                      => ['required', 'string', 'max:50'],
            'email'                      => ['nullable', 'email', 'max:255'],
            'address'                    => ['nullable', 'string', 'max:255'],
            'type'                       => ['nullable', 'string', 'max:50'],
            'identification_number'      => ['nullable', 'string', 'max:100'],
            'identification_description' => ['nullable', 'string', 'max:255'],
            'donorInterests'             => ['nullable'],
            'interest_id'                => ['nullable', 'integer'],
        ];
    }

    /**
     * Custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name'                       => 'إسم المانح',
            'phone'                      => 'رقم الجوال',
            'email'                      => 'البريد الإلكتروني',
            'address'                    => 'العنوان',
            'type'                       => 'صفة المانح',
            'identification_number'      => 'رقم الهوية',
            'identification_description' => 'وصف الهوية',
            'donorInterests'             => 'نوع الاهتمام',
            'interest_id'                => 'نوع الاهتمام',
        ];
    }
}
