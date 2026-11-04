<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Attendance\StoreAttendanceRequest;
use App\Http\Resources\AttendanceResource;
use App\Services\AttendanceService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AttendanceController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected AttendanceService $attendanceService
    ) {}

    /**
     * Display a listing of attendances.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->filled('perpage') 
            ? (int) $request->input('perpage') 
            : ($request->filled('per_page') ? (int) $request->input('per_page') : null);

        $results = $this->attendanceService->list($request->all(), $perPage);

        if ($perPage && method_exists($results, 'items')) {
            return response()->json([
                'success'      => true,
                'data'         => AttendanceResource::collection($results->items()),
                'current_page' => $results->currentPage(),
                'per_page'     => $results->perPage(),
                'total'        => $results->total(),
                'last_page'    => $results->lastPage(),
            ], Response::HTTP_OK);
        }

        $collection = AttendanceResource::collection($results);

        if ($request->has('page') || $request->has('search')) {
            return response()->json([
                'success' => true,
                'data'    => $collection,
                'total'   => count($results),
            ], Response::HTTP_OK);
        }

        return response()->json($collection, Response::HTTP_OK);
    }

    /**
     * Store new attendance log.
     */
    public function store(StoreAttendanceRequest $request): JsonResponse
    {
        $attendance = $this->attendanceService->store($request->validated());
        $res = (new AttendanceResource($attendance))->resolve();

        return response()->json(array_merge([
            'success' => true,
            'message' => 'تم تسجيل الحضور والانصراف بنجاح',
            'data'    => $res,
        ], $res), Response::HTTP_OK);
    }

    /**
     * Delete an attendance record.
     */
    public function destroy(Request $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (!$targetId) {
            return response()->json([
                'success' => false,
                'message' => 'معرّف السجل مطلوب',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->attendanceService->delete($targetId);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف سجل الحضور بنجاح',
        ], Response::HTTP_OK);
    }
}
