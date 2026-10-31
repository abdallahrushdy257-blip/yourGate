<?php

namespace App\Http\Requests\Shop;

use App\Http\Requests\BaseApiRequest;

class StoreShopDetailRequest extends BaseApiRequest
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
            'shop_id'     => ['required', 'integer', 'exists:shops,id'],
            'type'        => ['required', 'integer', 'in:1,2'],
            'description' => ['nullable', 'string'],
            'note'        => ['nullable', 'string'],
            'upload'      => ['nullable', 'file', 'max:10240'],
            'upload2'     => ['nullable', 'file', 'max:10240'],
        ];
    }
}
