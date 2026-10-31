<?php

namespace App\Http\Requests\Project;

use App\Http\Requests\BaseApiRequest;

class StoreProjectAssignmentRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id'       => ['required', 'integer', 'exists:projects,id'],
            'phase_id'         => ['nullable', 'integer', 'exists:project_phases,id'],
            'responsible_type' => ['nullable', 'integer'],
            'responsible_id'   => ['nullable'],
            'responsible_name' => ['nullable', 'string', 'max:255'],
            'role'             => ['nullable', 'string', 'max:255'],
            'responsibility'   => ['nullable', 'string'],
        ];
    }
}
