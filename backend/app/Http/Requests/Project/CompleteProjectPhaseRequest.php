<?php

namespace App\Http\Requests\Project;

use App\Http\Requests\BaseApiRequest;

class CompleteProjectPhaseRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phase_id'            => ['required', 'integer', 'exists:project_phases,id'],
            'project_id'          => ['nullable', 'integer', 'exists:projects,id'],
            'performance_summary' => ['nullable', 'string'],
            'remaining_work'      => ['nullable', 'string'],
            'notes'               => ['nullable', 'string'],
            'description'         => ['nullable', 'string'],
        ];
    }
}
