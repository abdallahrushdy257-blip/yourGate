<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vacation\StoreVacationRequest;
use App\Http\Requests\Vacation\UpdateVacationRequest;
use App\Http\Resources\VacationResource;
use App\Services\VacationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VacationController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected VacationService $vacationService
    ) {}

    /**
     * Display a listing of vacation types (supports TableComponent, pagination, and dropdowns).
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->filled('perpage') 
            ? (int) $request->input('perpage') 
            : ($request->filled('per_page') ? (int) $request->input('per_page') : null);

        $vacations = $this->vacationService->list($request->all(), $perPage);

        if ($perPage && method_exists($vacations, 'items')) {
            return response()->json([
                'success'      => true,
                'data'         => VacationResource::collection($vacations->items()),
                'current_page' => $vacations->currentPage(),
                'per_page'     => $vacations->perPage(),
                'total'        => $vacations->total(),
                'last_page'    => $vacations->lastPage(),
            ], Response::HTTP_OK);
        }

        $collection = VacationResource::collection($vacations);

        if ($request->has('page') || $request->has('search')) {
            return response()->json([
                'success' => true,
                'data'    => $collection,
                'total'   => count($vacations),
            ], Response::HTTP_OK);
        }

        return response()->json($collection, Response::HTTP_OK);
    }

    /**
     * Display a specific vacation type.
     */
    public function show(int $id): JsonResponse
    {
        $vacation = $this->vacationService->find($id);
        $res = (new VacationResource($vacation))->resolve();

        return response()->json(array_merge([
            'success' => true,
            'data'    => $res,
        ], $res), Response::HTTP_OK);
    }

    /**
     * Store a new vacation type.
     */
    public function store(StoreVacationRequest $request): JsonResponse
    {
        $vacation = $this->vacationService->store($request->validated());
        $res = (new VacationResource($vacation))->resolve();

        return response()->json(array_merge([
            'success' => true,
            'message' => 'تم إضافة نوع الإجازة بنجاح',
            'data'    => $res,
            'id'      => $vacation->id,
        ], $res), Response::HTTP_CREATED);
    }

    /**
     * Update an existing vacation type.
     */
    public function update(UpdateVacationRequest $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (!$targetId) {
            return response()->json([
                'success' => false,
                'message' => 'معرّف الإجازة مطلوب للتحديث',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $vacation = $this->vacationService->update($targetId, $request->validated());
        $res = (new VacationResource($vacation))->resolve();

        return response()->json(array_merge([
            'success' => true,
            'message' => 'تم تحديث بيانات نوع الإجازة بنجاح',
            'data'    => $res,
            'id'      => $vacation->id,
        ], $res), Response::HTTP_OK);
    }

    /**
     * Delete a vacation type.
     */
    public function destroy(Request $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (!$targetId) {
            return response()->json([
                'success' => false,
                'message' => 'معرّف الإجازة مطلوب للحذف',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->vacationService->delete($targetId);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف نوع الإجازة بنجاح',
        ], Response::HTTP_OK);
    }
}
