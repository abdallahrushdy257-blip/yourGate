<?php

namespace App\Http\Requests\EmployeeWithdrawal;

use App\Http\Requests\BaseApiRequest;

class StoreEmployeeWithdrawalRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id'         => 'required',
            'receiver_account_id' => 'nullable',
            'account_id'          => 'nullable',
            'account_name'        => 'nullable|string|max:255',
            'amount'              => 'nullable|numeric|min:0.01',
            'value'               => 'nullable|numeric|min:0.01',
            'date'                => 'nullable|date',
            'time'                => 'nullable|string',
            'description'         => 'nullable|string',
        ];
    }
}
