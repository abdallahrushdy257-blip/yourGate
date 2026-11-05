<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EmployeeAdvance\StoreEmployeeAdvanceRequest;
use App\Http\Requests\EmployeeAdvance\UpdateEmployeeAdvanceRequest;
use App\Http\Resources\EmployeeAdvanceResource;
use App\Services\EmployeeAdvanceService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EmployeeAdvanceController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected EmployeeAdvanceService $advanceService
    ) {}

    /**
     * Display a listing of advances.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->filled('perpage') 
            ? (int) $request->input('perpage') 
            : ($request->filled('per_page') ? (int) $request->input('per_page') : null);

        $results = $this->advanceService->list($request->all(), $perPage);

        if ($perPage && method_exists($results, 'items')) {
            return response()->json([
                'success'      => true,
                'data'         => EmployeeAdvanceResource::collection($results->items()),
                'current_page' => $results->currentPage(),
                'per_page'     => $results->perPage(),
                'total'        => $results->total(),
                'last_page'    => $results->lastPage(),
            ], Response::HTTP_OK);
        }

        $collection = EmployeeAdvanceResource::collection($results);

        return response()->json([
            'success' => true,
            'data'    => $collection,
            'total'   => count($results),
        ], Response::HTTP_OK);
    }

    /**
     * Store a new advance and generate installments.
     */
    public function store(StoreEmployeeAdvanceRequest $request): JsonResponse
    {
        $advance = $this->advanceService->store($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تم حفظ السلفة وتوليد الأقساط بنجاح',
            'data'    => new EmployeeAdvanceResource($advance),
        ], Response::HTTP_CREATED);
    }

    /**
     * Display a specific advance with its installments.
     */
    public function show(int $id): JsonResponse
    {
        $advance = $this->advanceService->find($id);

        return response()->json([
            'success' => true,
            'data'    => new EmployeeAdvanceResource($advance),
        ], Response::HTTP_OK);
    }

    /**
     * Update an advance.
     */
    public function update(UpdateEmployeeAdvanceRequest $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (!$targetId) {
            return response()->json([
                'success' => false,
                'message' => 'معرّف السلفة مطلوب للتحديث',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $advance = $this->advanceService->update($targetId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث بيانات السلفة بنجاح',
            'data'    => new EmployeeAdvanceResource($advance),
        ], Response::HTTP_OK);
    }

    /**
     * Delete an advance.
     */
    public function destroy(Request $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (!$targetId) {
            return response()->json([
                'success' => false,
                'message' => 'معرّف السلفة مطلوب للحذف',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->advanceService->delete($targetId);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف السلفة بنجاح',
        ], Response::HTTP_OK);
    }
}
