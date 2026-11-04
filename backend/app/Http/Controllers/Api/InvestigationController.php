<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Investigation\StoreInvestigationRequest;
use App\Http\Requests\Investigation\UpdateInvestigationRequest;
use App\Http\Resources\InvestigationResource;
use App\Services\InvestigationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InvestigationController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected InvestigationService $investigationService
    ) {}

    /**
     * Display a listing of investigations.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->filled('perpage') 
            ? (int) $request->input('perpage') 
            : ($request->filled('per_page') ? (int) $request->input('per_page') : null);

        $results = $this->investigationService->list($request->all(), $perPage);

        if ($perPage && method_exists($results, 'items')) {
            return response()->json([
                'success'      => true,
                'data'         => InvestigationResource::collection($results->items()),
                'current_page' => $results->currentPage(),
                'per_page'     => $results->perPage(),
                'total'        => $results->total(),
                'last_page'    => $results->lastPage(),
            ], Response::HTTP_OK);
        }

        $collection = InvestigationResource::collection($results);

        return response()->json([
            'success' => true,
            'data'    => $collection,
            'total'   => count($results),
        ], Response::HTTP_OK);
    }

    /**
     * Store a new investigation.
     */
    public function store(StoreInvestigationRequest $request): JsonResponse
    {
        $investigation = $this->investigationService->store($request->validated());

        return $this->createdResponse(
            new InvestigationResource($investigation->load(['employee', 'investigator'])),
            __('Investigation created successfully')
        );
    }

    /**
     * Display the specified investigation.
     */
    public function show(int $id): JsonResponse
    {
        $investigation = $this->investigationService->find($id);

        return $this->successResponse(
            new InvestigationResource($investigation),
            __('Investigation retrieved successfully')
        );
    }

    /**
     * Update the specified investigation.
     */
    public function update(UpdateInvestigationRequest $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');

        $investigation = $this->investigationService->update($targetId, $request->validated());

        return $this->successResponse(
            new InvestigationResource($investigation),
            __('Investigation updated successfully')
        );
    }

    /**
     * Remove the specified investigation.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->investigationService->delete($id);

        return $this->successResponse(
            null,
            __('Investigation deleted successfully')
        );
    }
}
