<?php

namespace App\Http\Requests\LatePolicy;

use App\Http\Requests\BaseApiRequest;

class UpdateLatePolicyRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id'          => 'nullable',
            'uuid'        => 'nullable',
            'category'    => 'sometimes|required|string|in:late,overtime,absence_without_permission',
            'from_minute' => 'nullable|integer|min:0',
            'to_minute'   => 'nullable|integer|min:0',
            'hour'        => 'nullable|numeric|min:0',
            'type'        => 'sometimes|required|string|in:day_fraction,fixed_amount',
            'value'       => 'sometimes|required|numeric|min:0',
            'active'      => 'nullable|boolean',
            'note'        => 'nullable|string|max:500',
        ];
    }
}
