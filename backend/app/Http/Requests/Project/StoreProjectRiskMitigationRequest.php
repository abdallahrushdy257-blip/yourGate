<?php

namespace App\Http\Requests\Project;

use App\Http\Requests\BaseApiRequest;

class StoreProjectRiskMitigationRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'risk_id' => $this->input('risk_id') ? (int) $this->input('risk_id') : null,
            'impactlevel' => ($this->input('impactlevel') !== '' && $this->input('impactlevel') !== null) ? (int) $this->input('impactlevel') : 1,
            'probability' => ($this->input('probability') !== '' && $this->input('probability') !== null) ? (int) $this->input('probability') : 1,
        ]);
    }

    public function rules(): array
    {
        return [
            'risk_id'     => ['required', 'integer', 'exists:project_risks,id'],
            'description' => ['required', 'string'],
            'impactlevel' => ['nullable', 'integer'],
            'probability' => ['nullable', 'integer'],
            'status'      => ['nullable', 'string'],
        ];
    }
}
