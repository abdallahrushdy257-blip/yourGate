<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Donor\StoreDonorRequest;
use App\Http\Requests\Donor\UpdateDonorRequest;
use App\Http\Resources\DonorResource;
use App\Services\DonorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DonorController extends Controller
{
    public function __construct(
        protected DonorService $donorService
    ) {}

    /**
     * Display a listing of donors.
     */
    public function index(Request $request): JsonResponse
    {
        $donors = $this->donorService->list($request->all());

        return response()->json(DonorResource::collection($donors), Response::HTTP_OK);
    }

    /**
     * Display the specified donor.
     */
    public function show(int $id): JsonResponse
    {
        $donor = $this->donorService->find($id);

        return response()->json(new DonorResource($donor), Response::HTTP_OK);
    }

    /**
     * Store a newly created donor.
     */
    public function store(StoreDonorRequest $request): JsonResponse
    {
        $donor = $this->donorService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تمت إضافة المانح بنجاح',
            'data'    => new DonorResource($donor),
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified donor.
     */
    public function update(UpdateDonorRequest $request): JsonResponse
    {
        $donor = $this->donorService->update(
            (int) $request->validated('id'),
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'تم تعديل المانح بنجاح',
            'data'    => new DonorResource($donor),
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified donor.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->donorService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف المانح بنجاح',
        ], Response::HTTP_OK);
    }
}
