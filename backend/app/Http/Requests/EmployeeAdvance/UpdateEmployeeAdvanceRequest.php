<?php

namespace App\Http\Requests\EmployeeAdvance;

use App\Http\Requests\BaseApiRequest;

class UpdateEmployeeAdvanceRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id'                 => 'nullable',
            'employee_id'        => 'sometimes|required|exists:employees,id',
            'payment_account_id' => 'nullable',
            'amount'             => 'sometimes|required|numeric|min:1',
            'months'             => 'sometimes|required|integer|min:1|max:120',
            'start_date'         => 'sometimes|required|date',
            'notes'              => 'nullable|string|max:1000',
            'status'             => 'nullable|string|in:active,completed,cancelled',
        ];
    }
}
