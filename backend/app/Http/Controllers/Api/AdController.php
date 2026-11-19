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
     * Return donation and payment accounts list for vouchers from Chart of Accounts tree (Cash & Banks).
     */
    public function donationAccounts(): JsonResponse
    {
        $accounts = app(\App\Services\Accounting\GeneralVoucherService::class)->getCashAndBankAccounts();

        $formatted = $accounts->map(function ($acc) {
            return [
                'id'           => $acc->id,
                'name'         => "{$acc->code} - {$acc->name}",
                'account_name' => $acc->name,
                'code'         => $acc->code,
                'value'        => $acc->id,
                'label'        => "{$acc->code} - {$acc->name}",
            ];
        })->values()->toArray();

        if (empty($formatted)) {
            $defaultAccount = \App\Models\ChartOfAccount::firstOrCreate(
                ['code' => '11101001'],
                [
                    'name'            => 'النقدية بالصندوق والبنوك',
                    'name_en'         => 'Cash and Banks',
                    'level'           => 5,
                    'account_type'    => \App\Models\ChartOfAccount::TYPE_ASSET,
                    'nature'          => \App\Models\ChartOfAccount::NATURE_DEBIT,
                    'is_payable'      => true,
                    'is_active'       => true,
                    'is_system'       => true,
                    'opening_balance' => 0,
                ]
            );
            $formatted = [[
                'id'           => $defaultAccount->id,
                'name'         => "{$defaultAccount->code} - {$defaultAccount->name}",
                'account_name' => $defaultAccount->name,
                'code'         => $defaultAccount->code,
                'value'        => $defaultAccount->id,
                'label'        => "{$defaultAccount->code} - {$defaultAccount->name}",
            ]];
        }

        return response()->json([
            'success' => true,
            'data'    => $formatted,
        ], Response::HTTP_OK);
    }
}
