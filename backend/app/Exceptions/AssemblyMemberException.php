<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class AssemblyMemberException extends Exception
{
    public function __construct(string $message, protected int $status = Response::HTTP_UNPROCESSABLE_ENTITY)
    {
        parent::__construct($message);
    }

    public static function hasTransactions(): self
    {
        return new self('لا يمكن حذف العضو لوجود تعاملات أو حركات مسجلة عليه (اشتراكات، لجان، أو محاضر اجتماعات).');
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
            'errors'  => [
                'member' => [$this->getMessage()],
            ],
        ], $this->status);
    }
}
