<?php

namespace App\Http\Requests\Project;

use App\Http\Requests\BaseApiRequest;

class UpdateProjectRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];

        if ($this->has('name')) {
            $merge['name'] = $this->input('name');
        }

        if ($this->has('description')) {
            $merge['description'] = $this->input('description');
        }

        if ($this->has('dateoflaunch') || $this->has('startdate')) {
            $merge['dateoflaunch'] = $this->input('dateoflaunch') ?? $this->input('startdate');
        }

        if ($this->has('deadline') || $this->has('enddate')) {
            $merge['deadline'] = $this->input('deadline') ?? $this->input('enddate');
        }

        if ($this->has('total') || $this->has('budget')) {
            $merge['total'] = (float) ($this->input('total') ?? $this->input('budget') ?? 0);
        }

        if ($this->has('marketingmethod')) {
            $merge['marketingmethod'] = (int) $this->input('marketingmethod');
        }

        if ($this->has('accounttree')) {
            $merge['accounttree'] = $this->input('accounttree');
        }

        if ($this->has('status')) {
            $merge['status'] = (int) $this->input('status');
        }

        $this->merge($merge);
    }

    public function rules(): array
    {
        return [
            'id'              => 'nullable|integer',
            'name'            => 'sometimes|required|string|max:255',
            'description'     => 'nullable|string',
            'total'           => 'sometimes|numeric|min:0',
            'dateoflaunch'    => 'nullable|date',
            'deadline'        => 'nullable|date',
            'marketingmethod' => 'nullable|integer',
            'accounttree'     => 'nullable|string|max:255',
            'status'          => 'nullable|integer',
            'attachment'      => 'nullable|file|max:10240',
        ];
    }
}
