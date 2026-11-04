<?php

namespace App\Http\Requests\SalaryAction;

use App\Http\Requests\BaseApiRequest;

class StoreSalaryActionRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id'          => 'nullable',
            'employee_id' => 'nullable',
            'type'        => 'required|in:0,1',
            'reason'      => 'nullable|string|max:255',
            'amounttype'  => 'required|in:0,1',
            'amount'      => 'required|numeric|min:0.01',
            'date'        => 'required|date',
            'description' => 'nullable|string|max:1000',
            'component'   => 'nullable|string|max:255',
        ];
    }
}
