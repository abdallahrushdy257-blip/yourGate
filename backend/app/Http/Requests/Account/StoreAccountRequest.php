<?php

namespace App\Http\Requests\Account;

use App\Http\Requests\BaseApiRequest;

class StoreAccountRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Standard and frontend-alias keys
            'name'            => 'nullable|string|max:255',
            'accountname'     => 'nullable|string|max:255',
            'parent_id'       => 'nullable',
            'accountid'       => 'nullable',
            'subaccountid'    => 'nullable',
            'accounttypeid'   => 'nullable',
            'code'            => 'nullable|string|max:30',
            'accountNumber'   => 'nullable|string|max:30',
            'opening_balance' => 'nullable|numeric',
            'balance'         => 'nullable|numeric',
            'cash_flow_type'  => 'nullable',
            'cashflowtype'    => 'nullable',
            'cashFlow'        => 'nullable',
            'is_payable'      => 'nullable|boolean',
            'scrap_value'     => 'nullable|numeric',
            'scrap'           => 'nullable|numeric',
            'useful_life'     => 'nullable|integer',
            'duration'        => 'nullable|integer',
            'description'     => 'nullable|string',
        ];
    }

    /**
     * Normalize inputs from either standard payload or legacy form names.
     */
    public function validatedNormalized(): array
    {
        $data = $this->validated();

        $name = $data['name'] ?? $data['accountname'] ?? null;
        if (empty($name)) {
            $name = $this->input('name') ?: $this->input('accountname');
        }

        // Parent ID resolution (deepest selected subaccount, or parent account, or accounttypeid)
        $parentId = null;
        foreach (['subaccountid', 'accountid', 'parent_id', 'accounttypeid'] as $key) {
            $val = $data[$key] ?? $this->input($key);
            if (! empty($val) && (int) $val > 0) {
                $parentId = (int) $val;
                break;
            }
        }

        $balance = $data['opening_balance'] ?? $data['balance'] ?? 0;
        $cashFlow = $data['cash_flow_type'] ?? $data['cashflowtype'] ?? $data['cashFlow'] ?? 0;
        $scrap = $data['scrap_value'] ?? $data['scrap'] ?? null;
        $duration = $data['useful_life'] ?? $data['duration'] ?? null;

        return [
            'name'            => trim((string) $name),
            'parent_id'       => $parentId,
            'code'            => $data['code'] ?? $data['accountNumber'] ?? null,
            'opening_balance' => (float) $balance,
            'cash_flow_type'  => (int) $cashFlow,
            'is_payable'      => filter_var($data['is_payable'] ?? true, FILTER_VALIDATE_BOOLEAN),
            'scrap_value'     => $scrap !== null ? (float) $scrap : null,
            'useful_life'     => $duration !== null ? (int) $duration : null,
            'description'     => $data['description'] ?? null,
        ];
    }
}
