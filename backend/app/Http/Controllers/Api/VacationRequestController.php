<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LeaveRequestResource;
use App\Http\Resources\VacationRequestResource;
use App\Services\VacationRequestService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VacationRequestController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected VacationRequestService $vacationRequestService
    ) {}

    /**
     * List vacation requests.
     */
    public function indexVacations(Request $request): JsonResponse
    {
        $perPage = $request->filled('perpage') 
            ? (int) $request->input('perpage') 
            : ($request->filled('per_page') ? (int) $request->input('per_page') : null);

        $results = $this->vacationRequestService->listVacations($request->all(), $perPage);

        if ($perPage && method_exists($results, 'items')) {
            return response()->json([
                'success'      => true,
                'data'         => VacationRequestResource::collection($results->items()),
                'current_page' => $results->currentPage(),
                'per_page'     => $results->perPage(),
                'total'        => $results->total(),
                'last_page'    => $results->lastPage(),
            ], Response::HTTP_OK);
        }

        $collection = VacationRequestResource::collection($results);

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
     * List leave/permission requests.
     */
    public function indexLeaves(Request $request): JsonResponse
    {
        $perPage = $request->filled('perpage') 
            ? (int) $request->input('perpage') 
            : ($request->filled('per_page') ? (int) $request->input('per_page') : null);

        $results = $this->vacationRequestService->listLeaves($request->all(), $perPage);

        if ($perPage && method_exists($results, 'items')) {
            return response()->json([
                'success'      => true,
                'data'         => LeaveRequestResource::collection($results->items()),
                'current_page' => $results->currentPage(),
                'per_page'     => $results->perPage(),
                'total'        => $results->total(),
                'last_page'    => $results->lastPage(),
            ], Response::HTTP_OK);
        }

        $collection = LeaveRequestResource::collection($results);

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
     * Store vacation request.
     */
    public function storeVacation(Request $request): JsonResponse
    {
        $file = $request->file('upload');
        $vacReq = $this->vacationRequestService->storeVacation($request->all(), $file);

        return response()->json([
            'success' => true,
            'message' => 'تم تقديم طلب الإجازة بنجاح',
            'data'    => new VacationRequestResource($vacReq),
        ], Response::HTTP_CREATED);
    }

    /**
     * Store permission request.
     */
    public function storeLeave(Request $request): JsonResponse
    {
        $file = $request->file('upload');
        $leaveReq = $this->vacationRequestService->storeLeave($request->all(), $file);

        return response()->json([
            'success' => true,
            'message' => 'تم تقديم طلب الإذن بنجاح',
            'data'    => new LeaveRequestResource($leaveReq),
        ], Response::HTTP_CREATED);
    }

    /**
     * Update vacation request status.
     */
    public function updateVacationStatus(Request $request): JsonResponse
    {
        $id = (int) $request->input('id');
        $status = (string) $request->input('status', 'قيد الانتظار');

        $vacReq = $this->vacationRequestService->updateVacationStatus($id, $status);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث حالة طلب الإجازة بنجاح',
            'data'    => new VacationRequestResource($vacReq),
        ], Response::HTTP_OK);
    }

    /**
     * Update leave request status.
     */
    public function updateLeaveStatus(Request $request): JsonResponse
    {
        $id = (int) $request->input('id');
        $status = (string) $request->input('status', 'قيد الانتظار');

        $leaveReq = $this->vacationRequestService->updateLeaveStatus($id, $status);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث حالة طلب الإذن بنجاح',
            'data'    => new LeaveRequestResource($leaveReq),
        ], Response::HTTP_OK);
    }

    /**
     * Delete vacation request.
     */
    public function destroyVacation(Request $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (!$targetId) {
            return response()->json(['success' => false, 'message' => 'معرّف الطلب مطلوب'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->vacationRequestService->deleteVacation($targetId);

        return response()->json(['success' => true, 'message' => 'تم حذف طلب الإجازة بنجاح'], Response::HTTP_OK);
    }

    /**
     * Delete leave request.
     */
    public function destroyLeave(Request $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (!$targetId) {
            return response()->json(['success' => false, 'message' => 'معرّف الطلب مطلوب'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->vacationRequestService->deleteLeave($targetId);

        return response()->json(['success' => true, 'message' => 'تم حذف طلب الإذن بنجاح'], Response::HTTP_OK);
    }
}
