<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Kpi\StoreKpiRequest;
use App\Http\Resources\KpiResource;
use App\Services\KpiService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class KpiController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected KpiService $kpiService
    ) {}

    /**
     * Display a listing of master KPIs for TableComponent.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 10);
        $kpis = $this->kpiService->list($request->all(), $perPage);

        return response()->json([
            'success'      => true,
            'data'         => KpiResource::collection($kpis->items()),
            'current_page' => $kpis->currentPage(),
            'per_page'     => $kpis->perPage(),
            'total'        => $kpis->total(),
            'last_page'    => $kpis->lastPage(),
        ], Response::HTTP_OK);
    }

    /**
     * Store a new master KPI.
     */
    public function store(StoreKpiRequest $request): JsonResponse
    {
        $kpi = $this->kpiService->store($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تم إضافة مؤشر الأداء بنجاح',
            'data'    => new KpiResource($kpi),
        ], Response::HTTP_CREATED);
    }

    /**
     * Update an existing master KPI.
     */
    public function update(StoreKpiRequest $request, int $id): JsonResponse
    {
        $kpi = $this->kpiService->update($id, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث مؤشر الأداء بنجاح',
            'data'    => new KpiResource($kpi),
        ], Response::HTTP_OK);
    }

    /**
     * Delete a master KPI.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->kpiService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف مؤشر الأداء بنجاح',
        ], Response::HTTP_OK);
    }

    /**
     * Get active KPI quizs for project evaluation.
     */
    public function quizs(): JsonResponse
    {
        $quizs = $this->kpiService->quizs();

        return response()->json([
            'success' => true,
            'data'    => $quizs,
        ], Response::HTTP_OK);
    }
}
