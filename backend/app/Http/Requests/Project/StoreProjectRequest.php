<?php

namespace App\Http\Requests\Project;

use App\Http\Requests\BaseApiRequest;

class StoreProjectRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $merge = [
            'name'            => $this->input('name'),
            'description'     => $this->input('description'),
            'dateoflaunch'    => $this->input('dateoflaunch') ?? $this->input('startdate'),
            'deadline'        => $this->input('deadline') ?? $this->input('enddate'),
            'marketingmethod' => (int) ($this->input('marketingmethod') ?? 0),
            'accounttree'     => $this->input('accounttree'),
        ];

        if ($this->has('total') || $this->has('budget')) {
            $merge['total'] = (float) ($this->input('total') ?? $this->input('budget') ?? 0);
        }

        $this->merge($merge);
    }

    public function rules(): array
    {
        return [
            'name'            => 'required|string|max:255',
            'description'     => 'nullable|string',
            'total'           => 'required|numeric|min:0',
            'dateoflaunch'    => 'nullable|date',
            'deadline'        => 'nullable|date',
            'marketingmethod' => 'nullable|integer',
            'accounttree'     => 'nullable|string|max:255',
            'attachment'      => 'nullable|file|max:10240',
        ];
    }
}
