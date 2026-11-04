<?php

namespace App\Http\Requests\EmployeeAdvance;

use App\Http\Requests\BaseApiRequest;

class StoreEmployeeAdvanceRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id'        => 'required|exists:employees,id',
            'payment_account_id' => 'nullable',
            'amount'             => 'required|numeric|min:1',
            'months'             => 'required|integer|min:1|max:120',
            'start_date'         => 'required|date',
            'notes'              => 'nullable|string|max:1000',
        ];
    }
}
