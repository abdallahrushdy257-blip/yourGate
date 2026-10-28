<?php

namespace App\Http\Requests\Committee;

use App\Http\Requests\BaseApiRequest;

class StoreCommitteeRequest extends BaseApiRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->has('members') && is_string($this->input('members'))) {
            $decoded = json_decode($this->input('members'), true);
            if (is_array($decoded)) {
                $this->merge(['members' => $decoded]);
            }
        }
    }

    public function rules(): array
    {
        return [
            'name'           => ['required', 'string', 'max:255'],
            'description'    => ['nullable', 'string', 'max:5000'],
            'members'        => ['nullable', 'array'],
            'members.*.id'   => ['nullable'],
            'members.*.name' => ['nullable', 'string'],
            'members.*.role' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'اسم اللجنة مطلوب',
        ];
    }
}
