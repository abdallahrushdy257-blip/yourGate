<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Interest\StoreInterestRequest;
use App\Http\Requests\Interest\UpdateInterestRequest;
use App\Http\Resources\InterestResource;
use App\Services\InterestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InterestController extends Controller
{
    public function __construct(
        protected InterestService $interestService
    ) {}

    /**
     * Display a listing of donor interests.
     */
    public function index(Request $request): JsonResponse
    {
        $interests = $this->interestService->list($request->all());

        return response()->json(InterestResource::collection($interests), Response::HTTP_OK);
    }

    /**
     * Display all donor interests (unpaginated, for dropdowns).
     */
    public function all(): JsonResponse
    {
        $interests = $this->interestService->all();

        return response()->json(InterestResource::collection($interests), Response::HTTP_OK);
    }

    /**
     * Store a newly created donor interest.
     */
    public function store(StoreInterestRequest $request): JsonResponse
    {
        $interest = $this->interestService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تمت إضافة الاهتمام بنجاح',
            'data'    => new InterestResource($interest),
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified donor interest.
     */
    public function update(UpdateInterestRequest $request): JsonResponse
    {
        $interest = $this->interestService->update(
            (int) $request->validated('id'),
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'تم تعديل الاهتمام بنجاح',
            'data'    => new InterestResource($interest),
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified donor interest.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->interestService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف الاهتمام بنجاح',
        ], Response::HTTP_OK);
    }
}
