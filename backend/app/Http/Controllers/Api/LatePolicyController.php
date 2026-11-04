<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LatePolicy\StoreLatePolicyRequest;
use App\Http\Requests\LatePolicy\UpdateLatePolicyRequest;
use App\Http\Resources\LatePolicyResource;
use App\Services\LatePolicyService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LatePolicyController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected LatePolicyService $latePolicyService
    ) {}

    /**
     * Display a listing of policies.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->filled('perpage') 
            ? (int) $request->input('perpage') 
            : ($request->filled('per_page') ? (int) $request->input('per_page') : null);

        $results = $this->latePolicyService->list($request->all(), $perPage);

        if ($perPage && method_exists($results, 'items')) {
            return response()->json([
                'success'      => true,
                'data'         => LatePolicyResource::collection($results->items()),
                'current_page' => $results->currentPage(),
                'per_page'     => $results->perPage(),
                'total'        => $results->total(),
                'last_page'    => $results->lastPage(),
            ], Response::HTTP_OK);
        }

        $collection = LatePolicyResource::collection($results);

        return response()->json([
            'success' => true,
            'data'    => $collection,
            'total'   => count($results),
        ], Response::HTTP_OK);
    }

    /**
     * Store a new policy.
     */
    public function store(StoreLatePolicyRequest $request): JsonResponse
    {
        $policy = $this->latePolicyService->store($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تم إضافة السياسة بنجاح',
            'data'    => new LatePolicyResource($policy),
        ], Response::HTTP_CREATED);
    }

    /**
     * Display a specific policy.
     */
    public function show(int $id): JsonResponse
    {
        $policy = $this->latePolicyService->find($id);

        return response()->json([
            'success' => true,
            'data'    => new LatePolicyResource($policy),
        ], Response::HTTP_OK);
    }

    /**
     * Update an existing policy.
     */
    public function update(UpdateLatePolicyRequest $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id') ?? (int) $request->input('uuid');
        if (!$targetId) {
            return response()->json([
                'success' => false,
                'message' => 'معرّف السياسة مطلوب للتحديث',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $policy = $this->latePolicyService->update($targetId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث السياسة بنجاح',
            'data'    => new LatePolicyResource($policy),
        ], Response::HTTP_OK);
    }

    /**
     * Delete a policy.
     */
    public function destroy(Request $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id') ?? (int) $request->input('uuid');
        if (!$targetId) {
            return response()->json([
                'success' => false,
                'message' => 'معرّف السياسة مطلوب للحذف',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->latePolicyService->delete($targetId);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف السياسة بنجاح',
        ], Response::HTTP_OK);
    }
}
