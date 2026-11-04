<?php

namespace App\Http\Requests\Investigation;

use App\Http\Requests\BaseApiRequest;

class StoreInvestigationRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id'     => 'required|exists:employees,id',
            'investigator_id' => 'nullable|exists:employees,id',
            'reason'          => 'nullable|string|max:255',
            'result'          => 'nullable|string|max:255',
            'date'            => 'required|date',
            'description'     => 'nullable|string|max:2000',
            'attach'          => 'nullable',
            'attachment'      => 'nullable',
        ];
    }
}
