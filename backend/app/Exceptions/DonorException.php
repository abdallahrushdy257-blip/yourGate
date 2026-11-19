<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class DonorException extends Exception
{
    public function __construct(string $message, protected int $status = Response::HTTP_UNPROCESSABLE_ENTITY)
    {
        parent::__construct($message);
    }

    public static function hasTransactions(): self
    {
        return new self('لا يمكن حذف المانح لوجود حركات وتبرعات مسجلة عليه.');
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
            'errors'  => [
                'donor' => [$this->getMessage()],
            ],
        ], $this->status);
    }
}
