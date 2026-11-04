<?php

namespace App\Exceptions\Accounting;

use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ChartOfAccountException extends Exception
{
    public function __construct(string $message, protected int $status = Response::HTTP_UNPROCESSABLE_ENTITY)
    {
        parent::__construct($message);
    }

    public static function hasChildren(): self
    {
        return new self(__('accounts.errors.has_children'));
    }

    public static function systemAccount(): self
    {
        return new self(__('accounts.errors.system_account'));
    }

    public static function parentHasBalance(): self
    {
        return new self(__('accounts.errors.parent_has_balance'));
    }

    public static function codeOverflow(): self
    {
        return new self(__('accounts.errors.code_overflow'));
    }

    public static function invalidCode(): self
    {
        return new self(__('accounts.errors.invalid_code'));
    }

    public static function templateMissing(string $path): self
    {
        return new self(__('accounts.errors.template_missing', ['path' => $path]), Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
            'errors'  => ['account' => [$this->getMessage()]],
        ], $this->status);
    }
}
