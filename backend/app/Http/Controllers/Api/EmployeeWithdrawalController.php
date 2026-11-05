<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EmployeeWithdrawal\StoreEmployeeWithdrawalRequest;
use App\Http\Resources\EmployeeWithdrawalResource;
use App\Services\EmployeeWithdrawalService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EmployeeWithdrawalController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected EmployeeWithdrawalService $withdrawalService
    ) {}

    /**
     * Display a listing of employee withdrawals.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->filled('perpage') 
            ? (int) $request->input('perpage') 
            : ($request->filled('per_page') ? (int) $request->input('per_page') : null);

        $results = $this->withdrawalService->list($request->all(), $perPage);

        if ($perPage && method_exists($results, 'items')) {
            return response()->json([
                'success'      => true,
                'data'         => EmployeeWithdrawalResource::collection($results->items()),
                'current_page' => $results->currentPage(),
                'per_page'     => $results->perPage(),
                'total'        => $results->total(),
                'last_page'    => $results->lastPage(),
            ], Response::HTTP_OK);
        }

        $collection = EmployeeWithdrawalResource::collection($results);

        if ($request->has('page') || $request->has('search')) {
            return response()->json([
                'success' => true,
                'data'    => $collection,
                'total'   => count($results),
            ], Response::HTTP_OK);
        }

        return response()->json($collection, Response::HTTP_OK);
    }

    /**
     * Get list of treasury / bank accounts.
     */
    public function accounts(): JsonResponse
    {
        return response()->json($this->withdrawalService->getAccounts(), Response::HTTP_OK);
    }

    /**
     * Store a new employee withdrawal.
     */
    public function store(StoreEmployeeWithdrawalRequest $request): JsonResponse
    {
        $withdrawal = $this->withdrawalService->store($request->validated());
        $res = (new EmployeeWithdrawalResource($withdrawal))->resolve();

        return response()->json(array_merge([
            'success' => true,
            'message' => 'تم حفظ مسحوبات الموظف بنجاح',
            'data'    => $res,
        ], $res), Response::HTTP_CREATED);
    }

    /**
     * Approve and disburse an employee withdrawal.
     */
    public function approve(Request $request): JsonResponse
    {
        $id = (int) $request->input('id');
        $accountId = $request->input('payment_account_id');
        $accountName = $request->input('account_name');

        if (!$accountName && $accountId) {
            foreach ($this->withdrawalService->getAccounts() as $acc) {
                if ($acc['value'] == $accountId) {
                    $accountName = $acc['label'];
                    break;
                }
            }
        }

        $withdrawal = $this->withdrawalService->approve($id, $accountName, $accountId ? (int) $accountId : null);
        $res = (new EmployeeWithdrawalResource($withdrawal))->resolve();

        return response()->json([
            'success' => true,
            'message' => 'تم اعتماد وصرف المسحوبات بنجاح',
            'data'    => $res,
        ], Response::HTTP_OK);
    }

    /**
     * Delete an employee withdrawal.
     */
    public function destroy(Request $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (!$targetId) {
            return response()->json([
                'success' => false,
                'message' => 'معرّف السحب مطلوب',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->withdrawalService->delete($targetId);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف المسحوبات بنجاح',
        ], Response::HTTP_OK);
    }
}
