<?php

namespace App\Http\Requests\Payroll;

use App\Http\Requests\BaseApiRequest;

class StorePayrollRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id'      => 'required|exists:employees,id',
            'year'             => 'required|integer|min:2020|max:2050',
            'month'            => 'required|integer|min:1|max:12',
            'basic_salary'     => 'nullable|numeric|min:0',
            'allowance'        => 'nullable|numeric|min:0',
            'additions'        => 'nullable|numeric|min:0',
            'deductions'       => 'nullable|numeric|min:0',
            'absence'          => 'nullable|numeric|min:0',
            'investigations'   => 'nullable|numeric|min:0',
            'social_insurance' => 'nullable|numeric|min:0',
            'net_salary'       => 'nullable|numeric|min:0',
            'status'           => 'nullable|string|in:draft,approved,paid',
            'payment_date'     => 'nullable|date',
            'notes'            => 'nullable|string|max:1000',
        ];
    }
}
