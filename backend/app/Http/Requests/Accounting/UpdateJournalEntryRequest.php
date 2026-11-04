<?php

namespace App\Http\Requests\Accounting;

use App\Http\Requests\BaseApiRequest;

class UpdateJournalEntryRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id'             => 'nullable|integer',
            'date'           => 'nullable|date',
            'description'    => 'nullable|string',
            'lines'          => 'nullable|array',
            'lines.*.account_id' => 'nullable',
            'lines.*.accountId'  => 'nullable',
            'lines.*.debit'      => 'nullable|numeric|min:0',
            'lines.*.credit'     => 'nullable|numeric|min:0',
            'lines.*.description'=> 'nullable|string|max:255',
            'rows'           => 'nullable|array',
            'accountdebit'   => 'nullable',
            'accountcredit'  => 'nullable',
            'debit'          => 'nullable|numeric',
            'credit'         => 'nullable|numeric',
        ];
    }

    public function validatedNormalized(): array
    {
        $data = $this->validated();
        $date = $data['date'] ?? $this->input('date');
        $description = $data['description'] ?? $this->input('description');

        $lines = [];
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
        } elseif (! empty($data['rows']) && is_array($data['rows'])) {
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

        return [
            'date'        => $date,
            'description' => $description,
            'lines'       => $lines,
        ];
    }
}
