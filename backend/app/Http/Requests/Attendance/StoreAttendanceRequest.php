<?php

namespace App\Http\Requests\Attendance;

use App\Http\Requests\BaseApiRequest;

class StoreAttendanceRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => 'nullable',
            'name'        => 'nullable',
            'type'        => 'nullable',
            'date'        => 'nullable|date',
            'time'        => 'nullable|string',
            'check_in'    => 'nullable|string',
            'check_out'   => 'nullable|string',
            'method'      => 'nullable|string',
            'notes'       => 'nullable|string',
        ];
    }
}
