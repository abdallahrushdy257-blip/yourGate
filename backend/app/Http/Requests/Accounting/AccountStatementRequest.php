<?php

namespace App\Http\Requests\Accounting;

use App\Http\Requests\BaseApiRequest;

class AccountStatementRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'account_id'  => ['nullable'],
            'search'      => ['nullable', 'string', 'max:255'],
            'searchfrom'  => ['nullable', 'date'],
            'searchto'    => ['nullable', 'date'],
            'date_from'   => ['nullable', 'date'],
            'date_to'     => ['nullable', 'date'],
            'perpage'     => ['nullable', 'integer', 'min:1'],
            'per_page'    => ['nullable', 'integer', 'min:1'],
            'page'        => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function validatedNormalized(): array
    {
        $data = $this->validated();

        $dateFrom = $data['searchfrom'] ?? $data['date_from'] ?? null;
        $dateTo = $data['searchto'] ?? $data['date_to'] ?? null;

        return [
            'account_id' => ! empty($data['account_id']) ? (int) $data['account_id'] : null,
            'search'     => $data['search'] ?? null,
            'date_from'  => $dateFrom,
            'date_to'    => $dateTo,
            'per_page'   => (int) ($data['perpage'] ?? $data['per_page'] ?? 25),
            'page'       => (int) ($data['page'] ?? 1),
        ];
    }
}
