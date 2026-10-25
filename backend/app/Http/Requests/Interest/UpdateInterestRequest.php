<?php

namespace App\Http\Requests\Interest;

use App\Http\Requests\BaseApiRequest;

class UpdateInterestRequest extends BaseApiRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id'          => ['required', 'exists:interests,id'],
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ];
    }

    /**
     * Custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'id'          => 'المعرف',
            'name'        => 'الاسم',
            'description' => 'الوصف',
        ];
    }
}
