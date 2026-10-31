<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Committee\StoreCommitteeRequest;
use App\Http\Requests\Committee\UpdateCommitteeRequest;
use App\Http\Resources\CommitteeMemberResource;
use App\Http\Resources\CommitteeResource;
use App\Services\CommitteeService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CommitteeController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected CommitteeService $committeeService
    ) {}

    /**
     * Display a listing of committees.
     * Supports both GET and POST requests (for TableComponent filters).
     */
    public function index(Request $request): JsonResponse
    {
        $committees = $this->committeeService->list($request->all());

        return response()->json(CommitteeResource::collection($committees), Response::HTTP_OK);
    }

    /**
     * Display committee statistics.
     */
    public function stats(): JsonResponse
    {
        $stats = $this->committeeService->stats();

        return $this->successResponse($stats, 'تم جلب الإحصائيات بنجاح');
    }

    /**
     * Display the specified committee.
     */
    public function show(int $id): JsonResponse
    {
        $committee = $this->committeeService->find($id);

        return response()->json(new CommitteeResource($committee), Response::HTTP_OK);
    }

    /**
     * Store a newly created committee.
     */
    public function store(StoreCommitteeRequest $request): JsonResponse
    {
        $committee = $this->committeeService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء اللجنة وتشكيل أعضائها بنجاح',
            'data'    => new CommitteeResource($committee),
        ], Response::HTTP_CREATED);
    }

    /**
     * Update the specified committee.
     */
    public function update(UpdateCommitteeRequest $request, int $id): JsonResponse
    {
        $committee = $this->committeeService->update($id, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث بيانات اللجنة وأعضائها بنجاح',
            'data'    => new CommitteeResource($committee),
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified committee.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->committeeService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف اللجنة بنجاح',
        ], Response::HTTP_OK);
    }

    /**
     * List members of a committee (for TableComponent on /committeemembers/:id).
     */
    public function members(Request $request, int $id): JsonResponse
    {
        $members = $this->committeeService->listMembers($id, $request->all());

        return response()->json(CommitteeMemberResource::collection($members), Response::HTTP_OK);
    }
}
