<?php

namespace App\Http\Requests\Vacation;

use App\Http\Requests\BaseApiRequest;

class UpdateVacationRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id'          => 'nullable|numeric',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'days'        => 'required|numeric|min:0',
        ];
    }
}
