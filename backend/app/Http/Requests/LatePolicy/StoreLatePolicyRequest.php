<?php

namespace App\Http\Requests\LatePolicy;

use App\Http\Requests\BaseApiRequest;

class StoreLatePolicyRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category'    => 'required|string|in:late,overtime,absence_without_permission',
            'from_minute' => 'nullable|integer|min:0',
            'to_minute'   => 'nullable|integer|min:0',
            'hour'        => 'nullable|numeric|min:0',
            'type'        => 'required|string|in:day_fraction,fixed_amount',
            'value'       => 'required|numeric|min:0',
            'active'      => 'nullable|boolean',
            'note'        => 'nullable|string|max:500',
        ];
    }
}
