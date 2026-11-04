<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobTitle\StoreJobTitleRequest;
use App\Http\Requests\JobTitle\UpdateJobTitleRequest;
use App\Http\Resources\JobTitleResource;
use App\Services\JobTitleService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JobTitleController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected JobTitleService $jobTitleService
    ) {}

    /**
     * Display a listing of job titles (supports GET & POST for TableComponent / selects).
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->filled('perpage') ? (int) $request->input('perpage') : ($request->filled('per_page') ? (int) $request->input('per_page') : null);

        $titles = $this->jobTitleService->list($request->all(), $perPage);

        if ($perPage && method_exists($titles, 'items')) {
            return response()->json([
                'success'      => true,
                'data'         => JobTitleResource::collection($titles->items()),
                'current_page' => $titles->currentPage(),
                'per_page'     => $titles->perPage(),
                'total'        => $titles->total(),
                'last_page'    => $titles->lastPage(),
            ], Response::HTTP_OK);
        }

        $collection = JobTitleResource::collection($titles);

        if ($request->has('page') || $request->has('search')) {
            return response()->json([
                'success' => true,
                'data'    => $collection,
                'total'   => count($titles),
            ], Response::HTTP_OK);
        }

        return response()->json($collection, Response::HTTP_OK);
    }

    /**
     * Display a specific job title.
     */
    public function show(int $id): JsonResponse
    {
        $jobTitle = $this->jobTitleService->find($id);
        $res = (new JobTitleResource($jobTitle))->resolve();

        return response()->json(array_merge([
            'success' => true,
            'data'    => $res,
        ], $res), Response::HTTP_OK);
    }

    /**
     * Store a new job title.
     */
    public function store(StoreJobTitleRequest $request): JsonResponse
    {
        $jobTitle = $this->jobTitleService->store($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تم إضافة المسمى الوظيفي بنجاح',
            'data'    => new JobTitleResource($jobTitle),
        ], Response::HTTP_CREATED);
    }

    /**
     * Update an existing job title.
     */
    public function update(UpdateJobTitleRequest $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (!$targetId) {
            return response()->json([
                'success' => false,
                'message' => 'معرّف المسمى الوظيفي مطلوب للتحديث',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $jobTitle = $this->jobTitleService->update($targetId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث المسمى الوظيفي بنجاح',
            'data'    => new JobTitleResource($jobTitle),
        ], Response::HTTP_OK);
    }

    /**
     * Delete a job title.
     */
    public function destroy(Request $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (!$targetId) {
            return response()->json([
                'success' => false,
                'message' => 'معرّف المسمى الوظيفي مطلوب للحذف',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->jobTitleService->delete($targetId);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف المسمى الوظيفي بنجاح',
        ], Response::HTTP_OK);
    }
}
