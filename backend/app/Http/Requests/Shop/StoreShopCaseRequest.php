<?php

namespace App\Http\Requests\Shop;

use App\Http\Requests\BaseApiRequest;

class StoreShopCaseRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $benf = $this->input('benf') ?? $this->input('human_cases_id');
        if ($benf === '0' || $benf === 0 || empty($benf)) {
            $benf = null;
        }

        $merge = [
            'title'              => $this->input('name') ?? $this->input('title'),
            'human_cases_id'     => $benf,
            'is_assets_selected' => filter_var($this->input('isAssetsSelected') ?? $this->input('is_assets_selected'), FILTER_VALIDATE_BOOLEAN),
            'number_of_assets'   => (int) ($this->input('numberOfAssets') ?? $this->input('number_of_assets') ?? 0),
            'casetype'           => $this->input('mainCategory') ?? $this->input('casetype'),
            'subcasetype'        => $this->input('subCategory') ?? $this->input('subcasetype'),
            'other_category'     => $this->input('othertext') ?? $this->input('showOtherTextbox') ?? $this->input('other_category'),
            'dateoflaunch'       => $this->input('postDate') ?? $this->input('dateoflaunch'),
            'dateofcompletion'   => $this->input('deedlineDate') ?? $this->input('dateofcompletion'),
            'marketingmethod'    => (int) ($this->input('marketingmethod') ?? 0),
        ];

        if ($this->has('totalCost') || $this->has('total')) {
            $merge['total'] = $this->input('totalCost') ?? $this->input('total');
        }

        $this->merge($merge);
    }

    public function rules(): array
    {
        return [
            'title'              => 'required|string|max:255',
            'human_cases_id'     => 'nullable|exists:human_cases,id',
            'casetype'           => 'nullable|string|max:100',
            'subcasetype'        => 'nullable|string|max:100',
            'other_category'     => 'nullable|string|max:255',
            'is_assets_selected' => 'boolean',
            'number_of_assets'   => 'nullable|integer|min:0',
            'total'              => 'required|numeric|min:0',
            'dateoflaunch'       => 'nullable|date',
            'dateofcompletion'   => 'nullable|date',
            'marketingmethod'    => 'nullable|integer|in:0,1,2,3',
            'description'        => 'nullable|string',
            'description2'       => 'nullable|string',
            'accounttree'        => 'nullable|string|max:100',
            'document'           => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp|max:10240',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'يرجى إدخال مسمى الحالة',
            'total.required' => 'يرجى تحديد إجمالي تكلفة الحالة',
            'total.numeric'  => 'يجب أن تكون قيمة الحالة رقماً صحيحاً',
            'document.max'   => 'حجم الملف يجب ألا يتجاوز 10 ميجابايت',
        ];
    }
}
