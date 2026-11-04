<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Accounting\AccountStatementRequest;
use App\Http\Resources\Accounting\AccountStatementResource;
use App\Services\Accounting\AccountStatementService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AccountStatementController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected AccountStatementService $statementService
    ) {}

    /**
     * General ledger account statement (/accountstatement/accounts).
     */
    public function accounts(AccountStatementRequest $request): JsonResponse
    {
        $statement = $this->statementService->getAccountsStatement($request->validatedNormalized());
        $resource = new AccountStatementResource($statement);

        // For direct frontend TableComponent or rich statement view
        return response()->json([
            'status'          => Response::HTTP_OK,
            'success'         => true,
            'message'         => 'تم جلب كشف الحساب بنجاح.',
            'account'         => $statement['account'],
            'opening_balance' => $statement['opening_balance'],
            'total_debit'     => $statement['total_debit'],
            'total_credit'    => $statement['total_credit'],
            'net_change'      => $statement['net_change'],
            'closing_balance' => $statement['closing_balance'],
            'data'            => $statement['data'],
            'total'           => $statement['total'],
        ], Response::HTTP_OK);
    }

    /**
     * Clients statement (/accountstatement/clients).
     */
    public function clients(Request $request): JsonResponse
    {
        $data = $this->statementService->getClientsStatement($request->all());
        return response()->json($data, Response::HTTP_OK);
    }

    /**
     * Vendors statement (/accountstatement/vendors).
     */
    public function vendors(Request $request): JsonResponse
    {
        $data = $this->statementService->getVendorsStatement($request->all());
        return response()->json($data, Response::HTTP_OK);
    }

    /**
     * Donors statement (/accountstatement/donors).
     */
    public function donors(Request $request): JsonResponse
    {
        $data = $this->statementService->getDonorsStatement($request->all());
        return response()->json($data, Response::HTTP_OK);
    }

    /**
     * Human cases statement (/accountstatement/humancases).
     */
    public function humancases(Request $request): JsonResponse
    {
        $data = $this->statementService->getHumanCasesStatement($request->all());
        return response()->json($data, Response::HTTP_OK);
    }

    /**
     * Warrantors statement (/accountstatement/warrantors).
     */
    public function warrantors(Request $request): JsonResponse
    {
        $data = $this->statementService->getDonorsStatement($request->all());
        return response()->json($data, Response::HTTP_OK);
    }

    /**
     * Management members statement (/accountstatement/managementmembers).
     */
    public function managementmembers(Request $request): JsonResponse
    {
        $data = $this->statementService->getClientsStatement($request->all());
        return response()->json($data, Response::HTTP_OK);
    }

    /**
     * General assembly members statement (/accountstatement/assemblymembers).
     */
    public function assemblymembers(Request $request): JsonResponse
    {
        $data = $this->statementService->getClientsStatement($request->all());
        return response()->json($data, Response::HTTP_OK);
    }
}
