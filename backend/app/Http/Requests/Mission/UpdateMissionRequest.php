<?php

namespace App\Http\Requests\Mission;

use App\Http\Requests\BaseApiRequest;

class UpdateMissionRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [
            'id'           => ['nullable'],
            'title'        => ['required', 'string', 'max:255'],
            'mission_type' => ['nullable'],
            'description'  => ['nullable', 'string'],
            'start_date'   => ['nullable', 'date'],
            'end_date'     => ['nullable', 'date'],
            'upload'       => ['nullable'],
            'status'       => ['nullable', 'integer'],
            'incharge'     => ['nullable'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'حقل عنوان المهمة مطلوب',
        ];
    }
}
