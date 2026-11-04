<?php

namespace App\Exceptions\Accounting;

use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class JournalEntryException extends Exception
{
    public function __construct(string $message, protected int $status = Response::HTTP_UNPROCESSABLE_ENTITY)
    {
        parent::__construct($message);
    }

    public static function unbalanced(float $debit, float $credit): self
    {
        return new self("القيد غير متوازن: إجمالي المدين ({$debit}) لا يساوي إجمالي الدائن ({$credit}).", Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public static function emptyLines(): self
    {
        return new self("يجب إدخال طرفين على الأقل للقيد المحاسبي بمبالغ أكبر من الصفر.", Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public static function accountNotPayable(string $code, string $name): self
    {
        return new self("الحساب ({$code} - {$name}) حساب رئيسي تجميعي ولا يقبل قيود مباشرة. اختر حساباً فرعياً.", Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public static function nonPositiveAmount(): self
    {
        return new self("إجمالي مبالغ القيد يجب أن يكون أكبر من الصفر.", Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
            'errors'  => ['entry' => [$this->getMessage()]],
        ], $this->status);
    }
}
