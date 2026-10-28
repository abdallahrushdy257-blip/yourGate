<?php

namespace App\Http\Requests\Ad;

use App\Http\Requests\BaseApiRequest;

class StoreShopAdRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('id') && !$this->has('shop_id')) {
            $this->merge(['shop_id' => $this->input('id')]);
        }
    }

    public function rules(): array
    {
        return [
            'shop_id' => ['required', 'integer', 'exists:shops,id'],
            'notes'   => ['nullable', 'string', 'max:1000'],
        ];
    }
}
