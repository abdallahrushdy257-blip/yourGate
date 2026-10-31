<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HumanCase;
use App\Services\HumanCaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HumanCaseDetailController extends Controller
{
    public function __construct(
        protected HumanCaseService $humanCaseService
    ) {}

    /**
     * Get beneficiary details structure for bank, home, qualifications, etc.
     */
    public function get(int $id): JsonResponse
    {
        $data = $this->humanCaseService->getDetails($id);

        return response()->json($data, Response::HTTP_OK);
    }

    /**
     * Update bank details for beneficiary.
     */
    public function updateBanks(Request $request): JsonResponse
    {
        $id = (int) $request->input('id');
        $this->humanCaseService->updateBanks(
            $id,
            $request->all(),
            $request->file('upload')
        );

        return response()->json([
            'status'  => 200,
            'message' => 'تم حفظ البيانات البنكية بنجاح',
        ], Response::HTTP_OK);
    }

    /**
     * Store/Update qualifications and income sources.
     */
    public function storeQualifications(Request $request): JsonResponse
    {
        $id = (int) $request->input('id');
        $this->humanCaseService->storeQualifications(
            $id,
            $request->except(['_token']),
            $request->file('sourceupload'),
            $request->file('courseupload')
        );

        return response()->json([
            'status'  => 200,
            'message' => 'تم حفظ المؤهل والوظيفة بنجاح',
        ], Response::HTTP_OK);
    }

    /**
     * Update housing data and expenses.
     */
    public function updatePersonalFees(Request $request): JsonResponse
    {
        $id = (int) $request->input('id');
        $this->humanCaseService->updatePersonalFees(
            $id,
            $request->except(['_token']),
            $request->file('personalfeesdetails_upload1'),
            $request->file('personalfeesdetails_upload2')
        );

        return response()->json([
            'status'  => 200,
            'message' => 'تم حفظ بيانات السكن بنجاح',
        ], Response::HTTP_OK);
    }

    /**
     * Store health record for beneficiary.
     */
    public function storeHealth(Request $request): JsonResponse
    {
        $id = (int) $request->input('id', $request->input('humancase_id'));
        $this->humanCaseService->storeHealth(
            $id,
            $request->all(),
            $request->file('upload')
        );

        return response()->json([
            'status'  => 200,
            'message' => 'تمت إضافة البيانات الصحية بنجاح',
        ], Response::HTTP_OK);
    }

    /**
     * Get health data for table component.
     */
    public function showHealthData(int $id): JsonResponse
    {
        $healthList = $this->humanCaseService->showHealthData($id);

        return response()->json($healthList, Response::HTTP_OK);
    }

    /**
     * Store dependent for beneficiary.
     */
    public function storeDependants(Request $request): JsonResponse
    {
        $id = (int) $request->input('id', $request->input('humancase_id'));
        $this->humanCaseService->storeDependants($id, $request->all());

        return response()->json([
            'status'  => 200,
            'message' => 'تمت إضافة بيانات التابع بنجاح',
        ], Response::HTTP_OK);
    }

    /**
     * Get dependents data for table component.
     */
    public function showDependantsData(int $id): JsonResponse
    {
        $dependents = $this->humanCaseService->showDependantsData($id);

        return response()->json($dependents, Response::HTTP_OK);
    }

    /**
     * Update case status / decision.
     */
    public function updateStatus(Request $request): JsonResponse
    {
        $id = (int) ($request->input('id') ?? $request->route('id'));
        $rawStatus = $request->input('status') ?? $request->input('decision');
        $status = match ((string) $rawStatus) {
            '2', '200', 'approved', 'موافقة' => 'موافقة',
            '3', 'rejected', 'رفض', 'مرفوض'   => 'مرفوض',
            '1', 'pending', 'معلق'           => 'معلق',
            default                          => in_array($rawStatus, ['موافقة', 'مرفوض', 'معلق']) ? $rawStatus : 'موافقة',
        };
        $this->humanCaseService->updateStatus(
            $id,
            $status,
            $request->input('note')
        );

        return response()->json([
            'status'  => 200,
            'message' => 'تم تحديث القرار بنجاح',
        ], Response::HTTP_OK);
    }

    /**
     * Store voucher for beneficiary.
     */
    public function storeVoucher(Request $request): JsonResponse
    {
        $id = (int) $request->input('id');
        $this->humanCaseService->storeVoucher($id, $request->all());

        return response()->json([
            'status'  => 200,
            'message' => 'تم إنشاء سند الدفع بنجاح',
        ], Response::HTTP_OK);
    }
}
