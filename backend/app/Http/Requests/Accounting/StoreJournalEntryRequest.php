<?php

namespace App\Http\Requests\Accounting;

use App\Http\Requests\BaseApiRequest;

class StoreJournalEntryRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date'           => 'nullable|date',
            'description'    => 'nullable|string',
            'entry_number'   => 'nullable|string|max:50',
            'lines'          => 'nullable|array',
            'lines.*.account_id' => 'nullable',
            'lines.*.accountId'  => 'nullable',
            'lines.*.debit'      => 'nullable|numeric|min:0',
            'lines.*.credit'     => 'nullable|numeric|min:0',
            'lines.*.description'=> 'nullable|string|max:255',

            // Legacy keys from AccountingEntry.js
            'accountdebit'   => 'nullable',
            'accountcredit'  => 'nullable',
            'debit'          => 'nullable|numeric',
            'credit'         => 'nullable|numeric',
            'rows'           => 'nullable|array',
        ];
    }

    /**
     * Normalize incoming payload into uniform accounting lines.
     */
    public function validatedNormalized(): array
    {
        $data = $this->validated();
        $date = $data['date'] ?? $this->input('date') ?? now()->toDateString();
        $description = $data['description'] ?? $this->input('description') ?? '';
        $entryNumber = $data['entry_number'] ?? $this->input('entry_number');

        $lines = [];

        // 1. If explicit 'lines' array provided
        if (! empty($data['lines']) && is_array($data['lines'])) {
            foreach ($data['lines'] as $line) {
                $accId = $line['account_id'] ?? $line['accountId'] ?? null;
                $debit = (float) ($line['debit'] ?? 0);
                $credit = (float) ($line['credit'] ?? 0);
                if (! empty($accId) && ($debit > 0 || $credit > 0)) {
                    $lines[] = [
                        'account_id'  => (int) $accId,
                        'debit'       => $debit,
                        'credit'      => $credit,
                        'description' => $line['description'] ?? null,
                    ];
                }
            }
        }

        // 2. If 'rows' array provided from React state
        if (empty($lines) && ! empty($data['rows']) && is_array($data['rows'])) {
            foreach ($data['rows'] as $row) {
                $accId = $row['account_id'] ?? $row['accountId'] ?? null;
                $debit = (float) ($row['debit'] ?? 0);
                $credit = (float) ($row['credit'] ?? 0);
                if (! empty($accId) && ($debit > 0 || $credit > 0)) {
                    $lines[] = [
                        'account_id'  => (int) $accId,
                        'debit'       => $debit,
                        'credit'      => $credit,
                        'description' => $row['description'] ?? null,
                    ];
                }
            }
        }

        // 3. Fallback to legacy single debit / single credit keys
        if (empty($lines)) {
            $accDebit = $data['accountdebit'] ?? $this->input('accountdebit');
            $accCredit = $data['accountcredit'] ?? $this->input('accountcredit');
            $amountDebit = (float) ($data['debit'] ?? $this->input('debit') ?? 0);
            $amountCredit = (float) ($data['credit'] ?? $this->input('credit') ?? 0);

            if ($accDebit && $amountDebit > 0) {
                $lines[] = [
                    'account_id'  => (int) $accDebit,
                    'debit'       => $amountDebit,
                    'credit'      => 0,
                    'description' => $description,
                ];
            }

            if ($accCredit && $amountCredit > 0) {
                $lines[] = [
                    'account_id'  => (int) $accCredit,
                    'debit'       => 0,
                    'credit'      => $amountCredit,
                    'description' => $description,
                ];
            }
        }

        return [
            'date'         => $date,
            'description'  => $description,
            'entry_number' => $entryNumber,
            'lines'        => $lines,
        ];
    }
}
