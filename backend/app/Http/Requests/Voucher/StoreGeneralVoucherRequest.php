<?php

namespace App\Http\Requests\Voucher;

use App\Http\Requests\BaseApiRequest;

class StoreGeneralVoucherRequest extends BaseApiRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'amount'            => ['required', 'numeric', 'min:0.01'],
            'date'              => ['required', 'date'],
            'description'       => ['nullable', 'string', 'max:500'],
            'type'              => ['nullable'],
            'payment_method'    => ['nullable', 'string'],
            'fromaccount'       => ['nullable'],
            'toaccount'         => ['nullable'],
            'debit_account_id'  => ['nullable', 'exists:chart_of_accounts,id'],
            'credit_account_id' => ['nullable', 'exists:chart_of_accounts,id'],
            'typevoucher'       => ['nullable'],
            'category'          => ['nullable', 'string'],
            'voucher_type'      => ['nullable', 'in:receipt,payment'],
        ];
    }

    /**
     * Normalize the request into standard database attributes.
     */
    public function validatedNormalized(): array
    {
        $data = $this->validated();

        $voucherType = $data['voucher_type'] ?? 'receipt';

        // Payment method mapping from numeric frontend options
        $typeMap = [
            '1' => 'network',
            '2' => 'transfer',
            '3' => 'deposit',
            '4' => 'check',
            '5' => 'cash',
            '6' => 'knet',
        ];
        $rawType = (string) ($data['type'] ?? $data['payment_method'] ?? '5');
        $paymentMethod = $typeMap[$rawType] ?? ($data['payment_method'] ?? 'cash');

        // Category mapping
        $catMap = [
            '1' => 'restricted',
            '2' => 'unrestricted',
        ];
        $rawCat = (string) ($data['typevoucher'] ?? $data['category'] ?? '2');
        $category = $catMap[$rawCat] ?? ($data['category'] ?? 'unrestricted');

        // In General Receipt Voucher:
        // Cash/Bank account is Debited (fromaccount), Target/Revenue is Credited (toaccount)
        // In General Payment Voucher:
        // Target/Expense is Debited (toaccount), Cash/Bank is Credited (fromaccount)
        if (! empty($data['debit_account_id']) && ! empty($data['credit_account_id'])) {
            $debitAccountId = $data['debit_account_id'];
            $creditAccountId = $data['credit_account_id'];
        } elseif ($voucherType === 'payment') {
            $creditAccountId = $data['fromaccount'] ?? $data['credit_account_id'] ?? null;
            $debitAccountId = $data['toaccount'] ?? $data['debit_account_id'] ?? null;
        } else {
            $debitAccountId = $data['fromaccount'] ?? $data['debit_account_id'] ?? null;
            $creditAccountId = $data['toaccount'] ?? $data['credit_account_id'] ?? null;
        }

        return [
            'voucher_type'      => $voucherType,
            'payment_method'    => $paymentMethod,
            'date'              => $data['date'],
            'amount'            => (float) $data['amount'],
            'debit_account_id'  => (int) $debitAccountId,
            'credit_account_id' => (int) $creditAccountId,
            'description'       => $data['description'] ?? ($voucherType === 'receipt' ? 'سند قبض نقدي' : 'سند صرف نقدي'),
            'category'          => $category,
            'status'            => 'posted',
        ];
    }
}
