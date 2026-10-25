<?php

namespace App\Http\Requests\Interest;

use App\Http\Requests\BaseApiRequest;

class StoreInterestRequest extends BaseApiRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
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
            'name'        => 'الاسم',
            'description' => 'الوصف',
        ];
    }
}
