<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Voucher\StoreGeneralVoucherRequest;
use App\Http\Resources\Voucher\VoucherResource;
use App\Services\Accounting\GeneralVoucherService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class GeneralVoucherController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected GeneralVoucherService $voucherService
    ) {}

    /**
     * List all vouchers.
     */
    public function index(Request $request): JsonResponse
    {
        $vouchers = $this->voucherService->list($request->all());

        return $this->successResponse(VoucherResource::collection($vouchers), 'تم جلب السندات بنجاح.');
    }

    /**
     * Return cash and bank accounts for receipt/payment vouchers (/generalvoucher/fromaccount).
     */
    public function fromAccount(): JsonResponse
    {
        $accounts = $this->voucherService->getCashAndBankAccounts();

        $formatted = $accounts->map(function ($acc) {
            return [
                'id'         => $acc->id,
                'name'       => "{$acc->code} - {$acc->name}",
                'account_name' => $acc->name,
                'code'       => $acc->code,
                'value'      => $acc->id,
                'label'      => "{$acc->code} - {$acc->name}",
            ];
        });

        // Return direct root array as expected by frontend components
        return response()->json($formatted, Response::HTTP_OK);
    }

    /**
     * Store cash receipt voucher (/generalvoucher/storecashvoucher).
     */
    public function storeCashVoucher(StoreGeneralVoucherRequest $request): JsonResponse
    {
        $payload = $request->validatedNormalized();
        $payload['voucher_type'] = $request->input('voucher_type', $payload['voucher_type'] ?? 'receipt');

        $voucher = $this->voucherService->store($payload);
        $resource = new VoucherResource($voucher);

        $msg = $payload['voucher_type'] === 'payment'
            ? 'تم حفظ وترحيل سند الصرف النقدي بنجاح.'
            : 'تم حفظ وترحيل سند القبض النقدي بنجاح.';

        return response()->json([
            'status'  => Response::HTTP_OK,
            'success' => true,
            'message' => $msg,
            'data'    => $resource,
            'id'      => $voucher->id,
        ], Response::HTTP_CREATED);
    }

    /**
     * Store payment voucher (/generalvoucher/storepaymentvoucher).
     */
    public function storePaymentVoucher(StoreGeneralVoucherRequest $request): JsonResponse
    {
        $payload = $request->validatedNormalized();
        $payload['voucher_type'] = 'payment';

        $voucher = $this->voucherService->store($payload);
        $resource = new VoucherResource($voucher);

        return response()->json([
            'status'  => Response::HTTP_OK,
            'success' => true,
            'message' => 'تم حفظ وترحيل سند الصرف بنجاح.',
            'data'    => $resource,
            'id'      => $voucher->id,
        ], Response::HTTP_CREATED);
    }

    /**
     * Display a specific voucher.
     */
    public function show(int $id): JsonResponse
    {
        $voucher = $this->voucherService->find($id);

        return $this->successResponse(new VoucherResource($voucher));
    }
}
