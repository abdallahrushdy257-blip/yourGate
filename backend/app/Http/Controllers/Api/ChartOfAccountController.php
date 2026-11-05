<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Account\StoreAccountRequest;
use App\Http\Requests\Account\UpdateAccountRequest;
use App\Http\Resources\ChartOfAccountResource;
use App\Services\Accounting\ChartOfAccountService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ChartOfAccountController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected ChartOfAccountService $accountService
    ) {}

    /**
     * Display tree structure of accounts (for tree table view).
     */
    public function tree(Request $request): JsonResponse
    {
        $tree = $this->accountService->tree($request->all());
        $collection = ChartOfAccountResource::collection($tree);

        // When requested via legacy /accounttree route, provide root array for direct iteration
        if ($request->is('*accounttree*') && ! $request->has('standard_format')) {
            return response()->json($collection, Response::HTTP_OK);
        }

        return $this->successResponse($collection, __('accounts.fetched'));
    }

    /**
     * Display a flat listing of accounts (for dropdowns, selects, journal lines).
     */
    public function index(Request $request): JsonResponse
    {
        if ($request->boolean('tree') || $request->input('view') === 'tree') {
            return $this->tree($request);
        }

        $accounts = $this->accountService->list($request->all());
        $collection = ChartOfAccountResource::collection($accounts);

        if ($request->is('*accounttree*') && ! $request->has('standard_format')) {
            return response()->json($collection, Response::HTTP_OK);
        }

        return $this->successResponse($collection, __('accounts.fetched'));
    }

    /**
     * Leaf accounts available for journal entries (/accounttree/entry).
     */
    public function entry(): JsonResponse
    {
        $accounts = $this->accountService->list(['payable' => true, 'active' => true]);
        $collection = ChartOfAccountResource::collection($accounts);

        return response()->json($collection, Response::HTTP_OK);
    }

    /**
     * Display details of a specific account.
     */
    public function show(int $id): JsonResponse
    {
        $account = $this->accountService->find($id);

        return $this->successResponse(new ChartOfAccountResource($account));
    }

    /**
     * Suggest next available account code and defaults based on parent.
     */
    public function nextCode(Request $request): JsonResponse
    {
        $parentId = (int) $request->input('parent_id');
        if (! $parentId) {
            return $this->errorResponse('parent_id is required', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $parent = $this->accountService->find($parentId);
        $code = $this->accountService->generateNextCode($parent);

        return $this->successResponse([
            'parent_id'       => $parent->id,
            'parent_code'     => $parent->code,
            'parent_name'     => $parent->name,
            'code'            => $code,
            'suggested_code'  => $code,
            'level'           => $parent->level + 1,
            'account_type'    => $parent->account_type,
            'nature'          => $parent->nature,
            'cash_flow_type'  => (int) $parent->cash_flow_type,
            'is_depreciable'  => $parent->isDepreciable() || str_starts_with($code, '121'),
        ]);
    }

    /**
     * Store a new account.
     */
    public function store(StoreAccountRequest $request): JsonResponse
    {
        $account = $this->accountService->store($request->validatedNormalized());
        $resource = new ChartOfAccountResource($account);

        return response()->json([
            'success' => true,
            'message' => __('accounts.created'),
            'data'    => $resource,
            'id'      => $account->id,
        ], Response::HTTP_CREATED);
    }

    /**
     * Update an existing account.
     */
    public function update(UpdateAccountRequest $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (! $targetId) {
            return $this->errorResponse(__('validation.required', ['attribute' => 'id']), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $account = $this->accountService->update($targetId, $request->validatedNormalized());
        $resource = new ChartOfAccountResource($account);

        return response()->json([
            'success' => true,
            'message' => __('accounts.updated'),
            'data'    => $resource,
            'id'      => $account->id,
        ], Response::HTTP_OK);
    }

    /**
     * Delete an account.
     */
    public function destroy(Request $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (! $targetId) {
            return $this->errorResponse(__('validation.required', ['attribute' => 'id']), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->accountService->delete($targetId);

        return response()->json([
            'success' => true,
            'message' => __('accounts.deleted'),
        ], Response::HTTP_OK);
    }

    /**
     * Seed default template accounts into the current tenant store.
     */
    public function seed(): JsonResponse
    {
        $count = $this->accountService->seedDefaults();

        return $this->successResponse(['created' => $count], __('accounts.seeded', ['count' => $count]));
    }
}
