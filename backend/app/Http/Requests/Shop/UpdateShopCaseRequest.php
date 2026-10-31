<?php

namespace App\Http\Requests\Shop;

use App\Http\Requests\BaseApiRequest;

class UpdateShopCaseRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $data = [];

        if ($this->has('benf') || $this->has('human_cases_id')) {
            $benf = $this->input('benf') ?? $this->input('human_cases_id');
            $data['human_cases_id'] = ($benf === '0' || $benf === 0 || empty($benf)) ? null : $benf;
        }

        if ($this->has('name') || $this->has('title')) {
            $data['title'] = $this->input('name') ?? $this->input('title');
        }

        if ($this->has('totalCost') || $this->has('total')) {
            $data['total'] = $this->input('totalCost') ?? $this->input('total');
        }

        if ($this->has('isAssetsSelected') || $this->has('is_assets_selected')) {
            $data['is_assets_selected'] = filter_var($this->input('isAssetsSelected') ?? $this->input('is_assets_selected'), FILTER_VALIDATE_BOOLEAN);
        }

        if ($this->has('numberOfAssets') || $this->has('number_of_assets')) {
            $data['number_of_assets'] = (int) ($this->input('numberOfAssets') ?? $this->input('number_of_assets'));
        }

        if ($this->has('mainCategory') || $this->has('casetype')) {
            $data['casetype'] = $this->input('mainCategory') ?? $this->input('casetype');
        }

        if ($this->has('subCategory') || $this->has('subcasetype')) {
            $data['subcasetype'] = $this->input('subCategory') ?? $this->input('subcasetype');
        }

        if ($this->has('othertext') || $this->has('showOtherTextbox') || $this->has('other_category')) {
            $data['other_category'] = $this->input('othertext') ?? $this->input('showOtherTextbox') ?? $this->input('other_category');
        }

        if ($this->has('postDate') || $this->has('dateoflaunch')) {
            $data['dateoflaunch'] = $this->input('postDate') ?? $this->input('dateoflaunch');
        }

        if ($this->has('deedlineDate') || $this->has('dateofcompletion')) {
            $data['dateofcompletion'] = $this->input('deedlineDate') ?? $this->input('dateofcompletion');
        }

        if ($this->has('marketingmethod')) {
            $data['marketingmethod'] = (int) $this->input('marketingmethod');
        }

        if (! empty($data)) {
            $this->merge($data);
        }
    }

    public function rules(): array
    {
        return [
            'id'                 => 'sometimes|nullable|integer',
            'title'              => 'sometimes|required|string|max:255',
            'human_cases_id'     => 'nullable|exists:human_cases,id',
            'casetype'           => 'nullable|string|max:100',
            'subcasetype'        => 'nullable|string|max:100',
            'other_category'     => 'nullable|string|max:255',
            'is_assets_selected' => 'boolean',
            'number_of_assets'   => 'nullable|integer|min:0',
            'total'              => 'sometimes|required|numeric|min:0',
            'amount'             => 'nullable|numeric|min:0',
            'status'             => 'nullable|integer|in:0,1',
            'dateoflaunch'       => 'nullable|date',
            'dateofcompletion'   => 'nullable|date',
            'marketingmethod'    => 'nullable|integer|in:0,1,2,3',
            'description'        => 'nullable|string',
            'description2'       => 'nullable|string',
            'accounttree'        => 'nullable|string|max:100',
            'document'           => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp|max:10240',
        ];
    }
}
