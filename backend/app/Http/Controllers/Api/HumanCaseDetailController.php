<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HumanCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HumanCaseDetailController extends Controller
{
    /**
     * Get beneficiary details structure for bank, home, qualifications, etc.
     */
    public function get(int $id): JsonResponse
    {
        $case = HumanCase::findOrFail($id);
        $details = $case->details ?? [];

        if (empty($details['bankdetails'])) {
            $details['bankdetails'] = [
                'name'   => '',
                'branch' => '',
                'iban'   => $case->accnumber ?? '',
            ];
        }

        return response()->json([
            'status'  => 200,
            'id'      => $case->id,
            'name'    => $case->name,
            'details' => $details,
        ], Response::HTTP_OK);
    }

    /**
     * Update bank details for beneficiary.
     */
    public function updateBanks(Request $request): JsonResponse
    {
        $id = (int) $request->input('id');
        $case = HumanCase::findOrFail($id);

        $details = $case->details ?? [];
        $details['bankdetails'] = [
            'name'   => $request->input('name', ''),
            'branch' => $request->input('branch', ''),
            'iban'   => $request->input('iban', ''),
        ];

        $case->details = $details;
        if ($request->filled('iban')) {
            $case->accnumber = $request->input('iban');
        }
        $case->save();

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
        $case = HumanCase::findOrFail($id);

        $details = $case->details ?? [];
        $details['qualifications'] = $request->except(['_token']);
        $case->details = $details;
        $case->save();

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
        $case = HumanCase::findOrFail($id);

        $details = $case->details ?? [];
        $details['home'] = $request->except(['_token']);
        $case->details = $details;
        $case->save();

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
        $case = HumanCase::findOrFail($id);

        $details = $case->details ?? [];
        $healthList = $details['health'] ?? [];

        $healthList[] = [
            'id'             => count($healthList) + 1,
            'disease_name'   => $request->input('disease_name', $request->input('name', '')),
            'disease_type'   => $request->input('disease_type', $request->input('type', '')),
            'disease_degree' => $request->input('disease_degree', $request->input('degree', '')),
            'treatment_type' => $request->input('treatment_type', $request->input('trtype', '')),
            'treatment_cost' => $request->input('treatment_cost', $request->input('trcost', '')),
            'notes'          => $request->input('notes', ''),
        ];

        $details['health'] = $healthList;
        $case->details = $details;
        $case->save();

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
        $case = HumanCase::findOrFail($id);
        $healthList = $case->details['health'] ?? [];

        return response()->json($healthList, Response::HTTP_OK);
    }

    /**
     * Store dependent for beneficiary.
     */
    public function storeDependants(Request $request): JsonResponse
    {
        $id = (int) $request->input('id', $request->input('humancase_id'));
        $case = HumanCase::findOrFail($id);

        $details = $case->details ?? [];
        $dependents = $details['dependants'] ?? [];

        $dependents[] = [
            'id'          => count($dependents) + 1,
            'name'        => $request->input('name', ''),
            'dateofbirth' => $request->input('dateofbirth', $request->input('dob', '')),
            'phone'       => $request->input('phone', ''),
            'relation'    => $request->input('relation', ''),
            'gender'      => $request->input('gender', ''),
            'note'        => $request->input('note', ''),
        ];

        $details['dependants'] = $dependents;
        $case->details = $details;
        $case->save();

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
        $case = HumanCase::findOrFail($id);
        $dependents = $case->details['dependants'] ?? [];

        return response()->json($dependents, Response::HTTP_OK);
    }

    /**
     * Update case status / decision.
     */
    public function updateStatus(Request $request): JsonResponse
    {
        $id = (int) $request->input('id');
        $case = HumanCase::findOrFail($id);

        if ($request->filled('status')) {
            $case->status = $request->input('status');
        }
        if ($request->filled('note')) {
            $case->note = $request->input('note');
        }
        $case->save();

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
        $case = HumanCase::findOrFail($id);

        $details = $case->details ?? [];
        $vouchers = $details['vouchers'] ?? [];

        $vouchers[] = [
            'id'             => count($vouchers) + 1,
            'amount'         => $request->input('amount'),
            'date'           => $request->input('date'),
            'payment_method' => $request->input('payment_method'),
            'account'        => $request->input('account'),
            'description'    => $request->input('description'),
        ];

        $details['vouchers'] = $vouchers;
        $case->details = $details;
        $case->save();

        return response()->json([
            'status'  => 200,
            'message' => 'تم إنشاء سند الدفع بنجاح',
        ], Response::HTTP_OK);
    }
}
