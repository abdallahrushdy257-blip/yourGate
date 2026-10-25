<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\HumanCase\StoreHumanCaseRequest;
use App\Http\Requests\HumanCase\UpdateHumanCaseRequest;
use App\Http\Resources\HumanCaseResource;
use App\Services\HumanCaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HumanCaseController extends Controller
{
    public function __construct(
        protected HumanCaseService $humanCaseService
    ) {}

    /**
     * Display a listing of beneficiaries.
     */
    public function index(Request $request): JsonResponse
    {
        $cases = $this->humanCaseService->list($request->all());

        return response()->json(HumanCaseResource::collection($cases), Response::HTTP_OK);
    }

    /**
     * Display rejected beneficiaries.
     */
    public function rejected(Request $request): JsonResponse
    {
        $cases = $this->humanCaseService->rejected($request->all());

        return response()->json(HumanCaseResource::collection($cases), Response::HTTP_OK);
    }

    /**
     * Display the specified beneficiary.
     */
    public function show(int $id): JsonResponse
    {
        $case = $this->humanCaseService->find($id);

        return response()->json(new HumanCaseResource($case), Response::HTTP_OK);
    }

    /**
     * Store a newly created beneficiary.
     */
    public function store(StoreHumanCaseRequest $request): JsonResponse
    {
        $case = $this->humanCaseService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تمت إضافة المستفيد بنجاح',
            'data'    => new HumanCaseResource($case),
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified beneficiary.
     */
    public function update(UpdateHumanCaseRequest $request): JsonResponse
    {
        $case = $this->humanCaseService->update(
            (int) $request->validated('id'),
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'تم تعديل بيانات المستفيد بنجاح',
            'data'    => new HumanCaseResource($case),
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified beneficiary.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->humanCaseService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف المستفيد بنجاح',
        ], Response::HTTP_OK);
    }
}
