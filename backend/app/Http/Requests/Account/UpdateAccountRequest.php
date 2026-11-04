<?php

namespace App\Http\Requests\Account;

use App\Http\Requests\BaseApiRequest;

class UpdateAccountRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id'              => 'nullable',
            'name'            => 'nullable|string|max:255',
            'accountname'     => 'nullable|string|max:255',
            'opening_balance' => 'nullable|numeric',
            'balance'         => 'nullable|numeric',
            'cash_flow_type'  => 'nullable',
            'cashflow'        => 'nullable',
            'cashflowtype'    => 'nullable',
            'description'     => 'nullable|string',
            'check'           => 'nullable',
            'is_active'       => 'nullable',
            'scrap_value'     => 'nullable|numeric',
            'scrap'           => 'nullable|numeric',
            'useful_life'     => 'nullable|integer',
            'duration'        => 'nullable|integer',
        ];
    }

    public function validatedNormalized(): array
    {
        $data = $this->validated();
        $payload = [];

        if (array_key_exists('name', $data) || array_key_exists('accountname', $data)) {
            $payload['name'] = trim((string) ($data['name'] ?? $data['accountname']));
        }

        if (array_key_exists('balance', $data) || array_key_exists('opening_balance', $data)) {
            $payload['opening_balance'] = (float) ($data['balance'] ?? $data['opening_balance']);
        }

        if (array_key_exists('cashflow', $data) || array_key_exists('cash_flow_type', $data) || array_key_exists('cashflowtype', $data)) {
            $payload['cash_flow_type'] = (int) ($data['cashflow'] ?? $data['cash_flow_type'] ?? $data['cashflowtype']);
        }

        if (array_key_exists('description', $data)) {
            $payload['description'] = $data['description'];
        }

        if (array_key_exists('check', $data) || array_key_exists('is_active', $data)) {
            $val = $data['check'] ?? $data['is_active'];
            $payload['is_active'] = (string) $val === '1' || $val === true || $val === 1;
        }

        if (array_key_exists('scrap', $data) || array_key_exists('scrap_value', $data)) {
            $payload['scrap_value'] = (float) ($data['scrap'] ?? $data['scrap_value']);
        }

        if (array_key_exists('duration', $data) || array_key_exists('useful_life', $data)) {
            $payload['useful_life'] = (int) ($data['duration'] ?? $data['useful_life']);
        }

        return $payload;
    }
}
