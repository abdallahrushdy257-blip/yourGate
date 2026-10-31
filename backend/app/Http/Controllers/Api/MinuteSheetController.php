<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MinuteSheet\StoreMinuteSheetRequest;
use App\Http\Requests\MinuteSheet\UpdateMinuteSheetRequest;
use App\Http\Resources\MinuteSheetResource;
use App\Services\MinuteSheetService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MinuteSheetController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected MinuteSheetService $minuteSheetService
    ) {}

    /**
     * Display a listing of minute sheets.
     * Supports both GET and POST requests (for TableComponent filters).
     */
    public function index(Request $request): JsonResponse
    {
        $minutes = $this->minuteSheetService->list($request->all());

        return response()->json(MinuteSheetResource::collection($minutes), Response::HTTP_OK);
    }

    /**
     * Display statistical summaries.
     */
    public function stats(): JsonResponse
    {
        $stats = $this->minuteSheetService->stats();

        return $this->successResponse($stats, 'تم جلب الإحصائيات بنجاح');
    }

    /**
     * Display the specified minute sheet.
     */
    public function show(int $id): JsonResponse
    {
        $minute = $this->minuteSheetService->find($id);

        return response()->json(new MinuteSheetResource($minute), Response::HTTP_OK);
    }

    /**
     * Store a newly created minute sheet.
     */
    public function store(StoreMinuteSheetRequest $request): JsonResponse
    {
        $file = $request->file('file') ?? $request->file('upload') ?? $request->file('paper');
        $minute = $this->minuteSheetService->create($request->validated(), $file);

        return response()->json([
            'success' => true,
            'message' => 'تم حفظ محضر الاجتماع بنجاح',
            'data'    => new MinuteSheetResource($minute),
        ], Response::HTTP_CREATED);
    }

    /**
     * Update the specified minute sheet.
     */
    public function update(UpdateMinuteSheetRequest $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        $file = $request->file('file') ?? $request->file('upload') ?? $request->file('paper');
        $minute = $this->minuteSheetService->update($targetId, $request->validated(), $file);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث بيانات المحضر بنجاح',
            'data'    => new MinuteSheetResource($minute),
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified minute sheet.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->minuteSheetService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف المحضر بنجاح',
        ], Response::HTTP_OK);
    }
}
