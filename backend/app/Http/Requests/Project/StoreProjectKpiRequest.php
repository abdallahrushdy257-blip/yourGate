<?php

namespace App\Http\Requests\Project;

use App\Http\Requests\BaseApiRequest;

class StoreProjectKpiRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $kpis = $this->input('kpis', []);
        if (is_array($kpis)) {
            foreach ($kpis as $key => $kpi) {
                if (isset($kpi['actual']) && ($kpi['actual'] === '' || $kpi['actual'] === null)) {
                    $kpis[$key]['actual'] = 0;
                }
                if (isset($kpi['target']) && ($kpi['target'] === '' || $kpi['target'] === null)) {
                    $kpis[$key]['target'] = 100;
                }
            }
            $this->merge([
                'project_id' => $this->input('project_id') ? (int) $this->input('project_id') : null,
                'kpis' => $kpis,
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'project_id'       => ['required', 'integer', 'exists:projects,id'],
            'kpis'             => ['required', 'array'],
            'kpis.*.kpi_id'    => ['nullable'],
            'kpis.*.actual'    => ['nullable', 'numeric'],
            'kpis.*.target'    => ['nullable', 'numeric'],
            'kpis.*.quiz'      => ['nullable', 'string'],
        ];
    }
}
