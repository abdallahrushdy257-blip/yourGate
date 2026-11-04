<?php

namespace App\Http\Requests\JobTitle;

use App\Http\Requests\BaseApiRequest;

class UpdateJobTitleRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id'               => 'nullable|numeric',
            'name'             => 'nullable|string|max:255',
            'title'            => 'nullable|string|max:255',
            'description'      => 'nullable|string',
            'note'             => 'nullable|string',
            'days'             => 'nullable|numeric|min:0',
            'workdayspermonth' => 'nullable|numeric|min:0',
            'hours'            => 'nullable|numeric|min:0',
            'workhoursperday'  => 'nullable|numeric|min:0',
            'mangerjobtitle'   => 'nullable|numeric',
            'parent_id'        => 'nullable|numeric',
        ];
    }
}
