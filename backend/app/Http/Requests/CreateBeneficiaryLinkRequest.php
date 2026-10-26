<?php

namespace App\Http\Requests;

class CreateBeneficiaryLinkRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [
            'label' => ['nullable', 'string', 'max:255'],
            'hours' => ['nullable', 'integer', 'min:1', 'max:168'],
        ];
    }
}
