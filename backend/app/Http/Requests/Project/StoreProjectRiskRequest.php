<?php

namespace App\Http\Requests\Project;

use App\Http\Requests\BaseApiRequest;

class StoreProjectRiskRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id'   => ['required', 'integer', 'exists:projects,id'],
            'phase_id'     => ['nullable', 'integer', 'exists:project_phases,id'],
            'description'  => ['required', 'string'],
            'impactlevel'  => ['nullable'],
            'probability'  => ['nullable'],
        ];
    }
}
