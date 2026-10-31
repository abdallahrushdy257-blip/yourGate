<?php

namespace App\Http\Requests\MinuteSheet;

use App\Http\Requests\BaseApiRequest;

class StoreMinuteSheetRequest extends BaseApiRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->has('attendees') && is_string($this->input('attendees'))) {
            $decoded = json_decode($this->input('attendees'), true);
            if (is_array($decoded)) {
                $this->merge(['attendees' => $decoded]);
            }
        }

        if ($this->has('committee') && is_string($this->input('committee'))) {
            $decoded = json_decode($this->input('committee'), true);
            if (is_array($decoded)) {
                $this->merge(['committee' => $decoded]);
            }
        }
    }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],
            'date'        => ['nullable', 'date'],
            'type'        => ['nullable', 'in:1,2'],
            'reason'      => ['nullable', 'in:1,2,3,4,5'],
            'note'        => ['nullable', 'string', 'max:5000'],
            'attendees'   => ['nullable', 'array'],
            'committee'   => ['nullable', 'array'],
            'file'        => ['nullable'],
            'upload'      => ['nullable'],
            'paper'       => ['nullable'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'عنوان المحضر مطلوب',
        ];
    }
}
