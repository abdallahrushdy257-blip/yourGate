<?php

namespace App\Http\Requests\Shop;

use App\Http\Requests\BaseApiRequest;

class StoreShopTransactionRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];
        if ($this->has('seldonor') && !$this->has('donor_id')) {
            $merge['donor_id'] = $this->input('seldonor');
        }
        if ($this->has('selhuman') && !$this->has('human_cases_id')) {
            $merge['human_cases_id'] = $this->input('selhuman');
        }
        if ($this->has('id') && !$this->has('shop_id')) {
            $merge['shop_id'] = $this->input('id');
        }
        if (!empty($merge)) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        return [
            'shop_id'         => ['required', 'integer', 'exists:shops,id'],
            'amount'          => ['required', 'numeric', 'min:0.01'],
            'date'            => ['nullable', 'date'],
            'type'            => ['nullable', 'string', 'max:50'],
            'account'         => ['nullable', 'string', 'max:100'],
            'balanceid'       => ['nullable', 'string', 'max:100'],
            'donor_id'        => ['nullable', 'integer', 'exists:donors,id'],
            'human_cases_id'  => ['nullable', 'integer', 'exists:human_cases,id'],
            'notes'           => ['nullable', 'string'],
        ];
    }
}
