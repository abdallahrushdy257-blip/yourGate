<?php

namespace App\Http\Requests\Section;

use App\Http\Requests\BaseApiRequest;

class UpdateSectionRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id'             => 'nullable',
            'name'           => 'sometimes|required|string|max:255',
            'description'    => 'nullable|string',
            'desc'           => 'nullable|string',
            'manager_id'     => 'nullable',
            'manger_id'      => 'nullable',
        ];
    }
}
