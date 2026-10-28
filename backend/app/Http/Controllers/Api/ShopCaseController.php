<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\StoreShopCaseRequest;
use App\Http\Requests\Shop\StoreShopDetailRequest;
use App\Http\Requests\Shop\StoreShopTransactionRequest;
use App\Http\Requests\Shop\UpdateShopCaseRequest;
use App\Http\Resources\ShopCaseResource;
use App\Http\Resources\ShopDetailResource;
use App\Http\Resources\ShopTransactionResource;
use App\Services\ShopCaseService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ShopCaseController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected ShopCaseService $shopCaseService
    ) {}

    /**
     * Display a listing of shop cases.
     */
    public function index(Request $request): JsonResponse
    {
        $cases = $this->shopCaseService->list($request->all());

        return response()->json(ShopCaseResource::collection($cases), Response::HTTP_OK);
    }

    /**
     * Display statistical summaries.
     */
    public function stats(): JsonResponse
    {
        $stats = $this->shopCaseService->stats();

        return $this->successResponse($stats, 'تم جلب إحصائيات تقرير الحالات بنجاح');
    }

    /**
     * Display the specified shop case.
     */
    public function show(int $id): JsonResponse
    {
        $case = $this->shopCaseService->find($id);

        return response()->json(new ShopCaseResource($case), Response::HTTP_OK);
    }

    /**
     * Store a newly created shop case.
     */
    public function store(StoreShopCaseRequest $request): JsonResponse
    {
        $file = $request->file('document') ?? $request->file('file');
        $case = $this->shopCaseService->create($request->validated(), $file);

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء ونشر الحالة بنجاح',
            'data'    => new ShopCaseResource($case),
        ], Response::HTTP_CREATED);
    }

    /**
     * Update the specified shop case.
     */
    public function update(UpdateShopCaseRequest $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        $file = $request->file('document') ?? $request->file('file');
        $case = $this->shopCaseService->update($targetId, $request->validated(), $file);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث بيانات الحالة بنجاح',
            'data'    => new ShopCaseResource($case),
        ], Response::HTTP_OK);
    }

    /**
     * Mark the case as closed / completed.
     */
    public function close(int $id): JsonResponse
    {
        $case = $this->shopCaseService->close($id);

        return response()->json([
            'success' => true,
            'message' => 'تم إغلاق الحالة واكتمالها بنجاح',
            'data'    => new ShopCaseResource($case),
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified shop case.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->shopCaseService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف الحالة بنجاح',
        ], Response::HTTP_OK);
    }

    /**
     * List donations / transactions for a specific case.
     */
    public function transactions(Request $request, int $id): JsonResponse
    {
        $transactions = $this->shopCaseService->listTransactions($id, $request->all());

        return response()->json(ShopTransactionResource::collection($transactions), Response::HTTP_OK);
    }

    /**
     * Store a donation receipt voucher.
     */
    public function storeReceipt(StoreShopTransactionRequest $request): JsonResponse
    {
        $transaction = $this->shopCaseService->storeReceipt($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل سند القبض وإضافة التبرع بنجاح',
            'data'    => new ShopTransactionResource($transaction),
        ], Response::HTTP_CREATED);
    }

    /**
     * Store a payment / expense voucher.
     */
    public function storePayment(StoreShopTransactionRequest $request): JsonResponse
    {
        $transaction = $this->shopCaseService->storePayment($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل سند الصرف بنجاح',
            'data'    => new ShopTransactionResource($transaction),
        ], Response::HTTP_CREATED);
    }

    /**
     * Store design or marketing request.
     */
    public function storeDetail(StoreShopDetailRequest $request): JsonResponse
    {
        $upload1 = $request->file('upload');
        $upload2 = $request->file('upload2');

        $detail = $this->shopCaseService->storeDetail($request->validated(), $upload1, $upload2);

        return response()->json([
            'success' => true,
            'message' => 'تم إرسال الطلب بنجاح',
            'data'    => new ShopDetailResource($detail),
        ], Response::HTTP_CREATED);
    }

    /**
     * Get aggregate received donations for donations report.
     */
    public function totalReceived(Request $request): JsonResponse
    {
        $data = $this->shopCaseService->totalReceived($request->all());

        return response()->json($data, Response::HTTP_OK);
    }

    /**
     * Get donation transactions for a specific donor.
     */
    public function donorDonations(Request $request, int $id): JsonResponse
    {
        $data = $this->shopCaseService->donorDonations($id, $request->all());

        return response()->json($data, Response::HTTP_OK);
    }

    /**
     * Get aggregate payments for payment report.
     */
    public function totalPaid(Request $request): JsonResponse
    {
        $data = $this->shopCaseService->totalPaid($request->all());

        return response()->json($data, Response::HTTP_OK);
    }

    /**
     * Get payment vouchers for a specific beneficiary.
     */
    public function beneficiaryPayments(Request $request, int $id): JsonResponse
    {
        $data = $this->shopCaseService->beneficiaryPayments($id, $request->all());

        return response()->json($data, Response::HTTP_OK);
    }
}
