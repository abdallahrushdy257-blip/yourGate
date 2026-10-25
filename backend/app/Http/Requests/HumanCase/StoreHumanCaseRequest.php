<?php

namespace App\Http\Requests\HumanCase;

use App\Http\Requests\BaseApiRequest;

class StoreHumanCaseRequest extends BaseApiRequest
{
    /**
     * Prepare inputs before validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'dob'         => ! empty($this->dob) ? $this->dob : null,
            'iddate'      => ! empty($this->iddate) ? $this->iddate : null,
            'familycount' => ! empty($this->familycount) ? (int) $this->familycount : null,
            'email'       => ! empty($this->email) ? $this->email : null,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'          => ['required', 'string', 'max:255'],
            'gender'        => ['nullable', 'string', 'max:20'],
            'dob'           => ['nullable', 'date'],
            'humancasetype' => ['nullable', 'string', 'max:50'],
            'status'        => ['nullable', 'string', 'max:50'],
            'nationality'   => ['nullable', 'string', 'max:100'],
            'familycount'   => ['nullable', 'integer'],
            'phonenum'      => ['nullable', 'string', 'max:50'],
            'email'         => ['nullable', 'email', 'max:255'],
            'accnumber'     => ['nullable', 'string', 'max:100'],
            'idnumber'      => ['nullable', 'string', 'max:100'],
            'idsource'      => ['nullable', 'string', 'max:100'],
            'iddate'        => ['nullable', 'date'],
            'note'          => ['nullable', 'string'],
        ];
    }

    /**
     * Custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name'          => 'الإسم',
            'gender'        => 'نوع الجنس',
            'dob'           => 'تاريخ الميلاد',
            'humancasetype' => 'حالة المستفيد',
            'status'        => 'الحالة الإجتماعية',
            'nationality'   => 'الجنسية',
            'familycount'   => 'عدد أفراد الأسرة',
            'phonenum'      => 'رقم الجوال',
            'email'         => 'البريد الإلكتروني',
            'accnumber'     => 'رقم الحساب',
            'idnumber'      => 'رقم الهوية',
            'idsource'      => 'مصدر الهوية',
            'iddate'        => 'تاريخ انتهاء الهوية',
            'note'          => 'ملاحظات إضافية',
        ];
    }
}
