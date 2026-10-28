<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ad\StoreShopAdRequest;
use App\Http\Resources\AdResource;
use App\Services\AdService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected AdService $adService
    ) {}

    /**
     * List all ads.
     */
    public function index(Request $request): JsonResponse
    {
        $ads = $this->adService->list($request->all());

        return response()->json(AdResource::collection($ads), Response::HTTP_OK);
    }

    /**
     * Store ad request for a shop case.
     */
    public function storeShop(StoreShopAdRequest $request): JsonResponse
    {
        $ad = $this->adService->storeForShop($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل وإرسال طلب الإعلان للحالة بنجاح',
            'data'    => new AdResource($ad),
        ], Response::HTTP_CREATED);
    }

    /**
     * Update ad approval status.
     */
    public function updateStatus(Request $request): JsonResponse
    {
        $id = (int) $request->input('id');
        $approved = (bool) $request->input('approved', false);

        $ad = $this->adService->updateStatus($id, $approved);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث حالة الإعلان بنجاح',
            'data'    => new AdResource($ad),
        ], Response::HTTP_OK);
    }

    /**
     * Return donation accounts list for vouchers.
     */
    public function donationAccounts(): JsonResponse
    {
        $accounts = [
            ['id' => 1, 'name' => 'الحساب البنكي الرئيسي (الراجحي)', 'value' => 'الحساب البنكي الرئيسي (الراجحي)'],
            ['id' => 2, 'name' => 'حساب التبرعات والزكاة (الإنماء)', 'value' => 'حساب التبرعات والزكاة (الإنماء)'],
            ['id' => 3, 'name' => 'الصندوق النقدي العام بالجمعية', 'value' => 'الصندوق النقدي العام بالجمعية'],
            ['id' => 4, 'name' => 'حساب بطاقات مدى والشبكة', 'value' => 'حساب بطاقات مدى والشبكة'],
            ['id' => 5, 'name' => 'حساب سداد للمدفوعات الرقمية', 'value' => 'حساب سداد للمدفوعات الرقمية'],
        ];

        return response()->json([
            'success' => true,
            'data'    => $accounts,
        ], Response::HTTP_OK);
    }
}
