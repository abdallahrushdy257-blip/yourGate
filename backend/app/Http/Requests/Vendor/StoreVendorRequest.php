<?php

namespace App\Http\Requests\Vendor;

use App\Http\Requests\BaseApiRequest;

class StoreVendorRequest extends BaseApiRequest
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
            'region'                     => ['nullable', 'string', 'max:255'],
            'description'                => ['nullable', 'string'],
            'identification_number'      => ['nullable', 'string', 'max:100'],
            'identification_description' => ['nullable', 'string', 'max:255'],
            'type'                       => ['nullable', 'string', 'max:50'],
        ];
    }

    /**
     * Custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name'                       => 'إسم المورد',
            'phone'                      => 'رقم الجوال',
            'email'                      => 'البريد الإلكتروني',
            'address'                    => 'العنوان',
            'region'                     => 'المنطقة',
            'description'                => 'الوصف',
            'identification_number'      => 'رقم الهوية',
            'identification_description' => 'وصف الهوية',
            'type'                       => 'نوع المورد',
        ];
    }
}
