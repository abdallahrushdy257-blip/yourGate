<?php

namespace App\Http\Requests\Project;

use App\Http\Requests\BaseApiRequest;

class StoreProjectPhaseRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];
        if ($this->has('startdate') && !$this->has('start_date')) {
            $merge['start_date'] = $this->input('startdate');
        }
        if ($this->has('enddate') && !$this->has('end_date')) {
            $merge['end_date'] = $this->input('enddate');
        }
        if (!empty($merge)) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        return [
            'project_id'  => ['required', 'integer', 'exists:projects,id'],
            'name'        => ['required', 'string', 'max:255'],
            'start_date'  => ['nullable', 'date'],
            'end_date'    => ['nullable', 'date'],
            'priority'    => ['nullable', 'string', 'max:50'],
            'budget'      => ['nullable', 'numeric', 'min:0'],
            'status'      => ['nullable'],
            'description' => ['nullable', 'string'],
        ];
    }
}
