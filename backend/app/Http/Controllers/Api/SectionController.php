<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Section\StoreSectionRequest;
use App\Http\Requests\Section\UpdateSectionRequest;
use App\Http\Resources\SectionResource;
use App\Services\SectionService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SectionController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SectionService $sectionService
    ) {}

    /**
     * Display a listing of sections (supports TableComponent, pagination, and selects).
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->filled('perpage') 
            ? (int) $request->input('perpage') 
            : ($request->filled('per_page') ? (int) $request->input('per_page') : null);

        $sections = $this->sectionService->list($request->all(), $perPage);

        if ($perPage && method_exists($sections, 'items')) {
            return response()->json([
                'success'      => true,
                'data'         => SectionResource::collection($sections->items()),
                'current_page' => $sections->currentPage(),
                'per_page'     => $sections->perPage(),
                'total'        => $sections->total(),
                'last_page'    => $sections->lastPage(),
            ], Response::HTTP_OK);
        }

        $collection = SectionResource::collection($sections);

        if ($request->has('page') || $request->has('search')) {
            return response()->json([
                'success' => true,
                'data'    => $collection,
                'total'   => count($sections),
            ], Response::HTTP_OK);
        }

        return response()->json($collection, Response::HTTP_OK);
    }

    /**
     * Display a specific section.
     */
    public function show(int $id): JsonResponse
    {
        $section = $this->sectionService->find($id);
        $res = (new SectionResource($section))->resolve();

        return response()->json(array_merge([
            'success' => true,
            'data'    => $res,
        ], $res), Response::HTTP_OK);
    }

    /**
     * Store a new section.
     */
    public function store(StoreSectionRequest $request): JsonResponse
    {
        $section = $this->sectionService->store($request->validated());
        $res = (new SectionResource($section))->resolve();

        return response()->json(array_merge([
            'success' => true,
            'message' => 'تم إضافة القسم بنجاح',
            'data'    => $res,
            'id'      => $section->id,
        ], $res), Response::HTTP_CREATED);
    }

    /**
     * Update an existing section.
     */
    public function update(UpdateSectionRequest $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (!$targetId) {
            return response()->json([
                'success' => false,
                'message' => 'معرّف القسم مطلوب للتحديث',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $section = $this->sectionService->update($targetId, $request->validated());
        $res = (new SectionResource($section))->resolve();

        return response()->json(array_merge([
            'success' => true,
            'message' => 'تم تحديث بيانات القسم بنجاح',
            'data'    => $res,
            'id'      => $section->id,
        ], $res), Response::HTTP_OK);
    }

    /**
     * Delete a section.
     */
    public function destroy(Request $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (!$targetId) {
            return response()->json([
                'success' => false,
                'message' => 'معرّف القسم مطلوب للحذف',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->sectionService->delete($targetId);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف القسم بنجاح',
        ], Response::HTTP_OK);
    }

    /**
     * Get organizational chart tree for current store.
     */
    public function chart(): JsonResponse
    {
        $chart = $this->sectionService->getChart();

        return response()->json([
            'success' => true,
            'data'    => $chart,
        ], Response::HTTP_OK);
    }
}
