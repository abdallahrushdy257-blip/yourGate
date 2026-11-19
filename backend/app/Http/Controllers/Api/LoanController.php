<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\LoanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LoanController extends Controller
{
    public function __construct(
        protected LoanService $loanService
    ) {}

    // ── Warrantors ────────────────────────────────────────────────────

    public function indexWarrantors(Request $request): JsonResponse
    {
        return response()->json($this->loanService->listWarrantors($request->all()), Response::HTTP_OK);
    }

    public function showWarrantor(int $id): JsonResponse
    {
        return response()->json($this->loanService->findWarrantor($id), Response::HTTP_OK);
    }

    public function storeWarrantor(Request $request): JsonResponse
    {
        $w = $this->loanService->storeWarrantor($request->all());

        return response()->json([
            'success' => true,
            'data'    => $w,
        ], Response::HTTP_OK);
    }

    public function updateWarrantor(Request $request): JsonResponse
    {
        $id = (int) $request->input('id', 1);
        $w = $this->loanService->updateWarrantor($id, $request->all());

        return response()->json([
            'success' => true,
            'data'    => $w,
        ], Response::HTTP_OK);
    }

    public function destroyWarrantor(int $id): JsonResponse
    {
        $this->loanService->deleteWarrantor($id);

        return response()->json(['success' => true], Response::HTTP_OK);
    }

    public function storeWarrantorReceipt(Request $request): JsonResponse
    {
        $res = $this->loanService->storeWarrantorReceipt($request->all());

        return response()->json([
            'success' => true,
            'data'    => $res,
        ], Response::HTTP_OK);
    }

    // ── Loans ─────────────────────────────────────────────────────────

    public function indexLoans(Request $request): JsonResponse
    {
        return response()->json($this->loanService->listLoans($request->all()), Response::HTTP_OK);
    }

    public function showLoan(Request $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id', 1);

        return response()->json($this->loanService->findLoan($targetId), Response::HTTP_OK);
    }

    public function storeLoan(Request $request): JsonResponse
    {
        $file = $request->file('attatchment') ?? $request->file('attachment');
        $loan = $this->loanService->storeLoan($request->all(), $file);

        return response()->json($loan, Response::HTTP_OK);
    }

    public function storeFollowup(Request $request): JsonResponse
    {
        return response()->json($this->loanService->storeFollowup($request->all()), Response::HTTP_OK);
    }

    public function storePaymentSchedule(Request $request): JsonResponse
    {
        return response()->json($this->loanService->storePaymentSchedule($request->all()), Response::HTTP_OK);
    }

    public function indexPayments(Request $request): JsonResponse
    {
        return response()->json($this->loanService->listLoanPayments($request->all()), Response::HTTP_OK);
    }

    public function indexCases(Request $request): JsonResponse
    {
        return response()->json($this->loanService->listLoanCases($request->all()), Response::HTTP_OK);
    }

    public function updateStatus(Request $request): JsonResponse
    {
        $id = (int) $request->input('id', 1);
        $status = (string) $request->input('status', '1');

        return response()->json($this->loanService->updateStatus($id, $status), Response::HTTP_OK);
    }

    public function storePaymentVoucher(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $this->loanService->storePaymentVoucher($request->all()),
        ], Response::HTTP_OK);
    }

    public function storeReceiptVoucher(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $this->loanService->storeReceiptVoucher($request->all()),
        ], Response::HTTP_OK);
    }

    // ── Feasibility Studies ───────────────────────────────────────────

    public function indexFeasibility(Request $request): JsonResponse
    {
        return response()->json($this->loanService->listFeasibilityStudies($request->all()), Response::HTTP_OK);
    }

    public function storeFeasibility(Request $request): JsonResponse
    {
        return response()->json($this->loanService->updateFeasibilitySection($request->all(), 'details'), Response::HTTP_OK);
    }

    public function updateFeasibilitySection(Request $request, string $section = 'general'): JsonResponse
    {
        return response()->json($this->loanService->updateFeasibilitySection($request->all(), $section), Response::HTTP_OK);
    }
}
