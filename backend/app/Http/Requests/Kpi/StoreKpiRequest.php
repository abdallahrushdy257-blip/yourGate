<?php

namespace App\Http\Requests\Kpi;

use App\Http\Requests\BaseApiRequest;

class StoreKpiRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('target')) {
            $this->merge([
                'target' => ($this->target === '' || $this->target === null) ? 100 : (float) $this->target,
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'quiz'   => ['required', 'string', 'max:255'],
            'target' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
