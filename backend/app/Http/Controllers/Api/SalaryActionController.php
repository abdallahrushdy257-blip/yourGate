<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SalaryAction\StoreSalaryActionRequest;
use App\Http\Requests\SalaryAction\UpdateSalaryActionRequest;
use App\Http\Resources\SalaryActionResource;
use App\Services\SalaryActionService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SalaryActionController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SalaryActionService $salaryActionService
    ) {}

    /**
     * Display a listing of salary actions (discounts and awards).
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->filled('perpage') 
            ? (int) $request->input('perpage') 
            : ($request->filled('per_page') ? (int) $request->input('per_page') : null);

        $results = $this->salaryActionService->list($request->all(), $perPage);

        if ($perPage && method_exists($results, 'items')) {
            return response()->json([
                'success'      => true,
                'data'         => SalaryActionResource::collection($results->items()),
                'current_page' => $results->currentPage(),
                'per_page'     => $results->perPage(),
                'total'        => $results->total(),
                'last_page'    => $results->lastPage(),
            ], Response::HTTP_OK);
        }

        $collection = SalaryActionResource::collection($results);

        return response()->json([
            'success' => true,
            'data'    => $collection,
            'total'   => count($results),
        ], Response::HTTP_OK);
    }

    /**
     * Store a new salary action.
     */
    public function store(StoreSalaryActionRequest $request): JsonResponse
    {
        $action = $this->salaryActionService->store($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تم حفظ المعاملة بنجاح',
            'data'    => new SalaryActionResource($action),
        ], Response::HTTP_OK); // 200 or 201
    }

    /**
     * Display a specific salary action.
     */
    public function show(int $id): JsonResponse
    {
        $action = $this->salaryActionService->find($id);

        return response()->json([
            'success' => true,
            'data'    => new SalaryActionResource($action),
        ], Response::HTTP_OK);
    }

    /**
     * Update a salary action.
     */
    public function update(UpdateSalaryActionRequest $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (!$targetId) {
            return response()->json([
                'success' => false,
                'message' => 'معرّف المعاملة مطلوب للتحديث',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $action = $this->salaryActionService->update($targetId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث المعاملة بنجاح',
            'data'    => new SalaryActionResource($action),
        ], Response::HTTP_OK);
    }

    /**
     * Delete a salary action.
     */
    public function destroy(Request $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (!$targetId) {
            return response()->json([
                'success' => false,
                'message' => 'معرّف المعاملة مطلوب للحذف',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->salaryActionService->delete($targetId);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف المعاملة بنجاح',
        ], Response::HTTP_OK);
    }
}
