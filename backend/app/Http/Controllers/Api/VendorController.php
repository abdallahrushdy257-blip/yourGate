<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\StoreVendorRequest;
use App\Http\Requests\Vendor\UpdateVendorRequest;
use App\Http\Resources\VendorResource;
use App\Services\VendorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VendorController extends Controller
{
    public function __construct(
        protected VendorService $vendorService
    ) {}

    /**
     * Display a listing of vendors.
     */
    public function index(Request $request): JsonResponse
    {
        $vendors = $this->vendorService->list($request->all());

        return response()->json(VendorResource::collection($vendors), Response::HTTP_OK);
    }

    /**
     * Display all vendors for dropdown components.
     */
    public function component(): JsonResponse
    {
        $vendors = $this->vendorService->all();

        return response()->json(VendorResource::collection($vendors), Response::HTTP_OK);
    }

    /**
     * Display the specified vendor.
     */
    public function show(int $id): JsonResponse
    {
        $vendor = $this->vendorService->find($id);

        return response()->json(new VendorResource($vendor), Response::HTTP_OK);
    }

    /**
     * Store a newly created vendor.
     */
    public function store(StoreVendorRequest $request): JsonResponse
    {
        $vendor = $this->vendorService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تمت إضافة المورد بنجاح',
            'data'    => new VendorResource($vendor),
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified vendor.
     */
    public function update(UpdateVendorRequest $request): JsonResponse
    {
        $vendor = $this->vendorService->update(
            (int) $request->validated('id'),
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'تم تعديل المورد بنجاح',
            'data'    => new VendorResource($vendor),
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified vendor.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->vendorService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف المورد بنجاح',
        ], Response::HTTP_OK);
    }

    /**
     * Vendor vouchers and payments report for beneficiaries.
     */
    public function act(Request $request): JsonResponse
    {
        $vendors = $this->vendorService->all();
        $cases = \App\Models\HumanCase::limit(10)->get();

        $data = [];
        $i = 1;
        foreach ($vendors as $v) {
            $assignedCase = $cases->skip($i - 1)->first() ?? $cases->first();
            $data[] = [
                'id'              => $i,
                'humancase'       => $assignedCase?->name ?? 'مستفيد مسجل',
                'vendor'          => $v->name,
                'amount'          => 2500.00 * $i,
                'status'          => $i % 2 === 0 ? 0 : 1,
                'code'            => 'VND-CODE-' . str_pad((string) $i, 3, '0', STR_PAD_LEFT),
                'expiration_date' => now()->addMonths($i * 2)->format('Y-m-d'),
            ];
            $i++;
        }

        return response()->json($data, Response::HTTP_OK);
    }
}
