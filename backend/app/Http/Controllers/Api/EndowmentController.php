<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Services\EndowmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EndowmentController extends Controller
{
    public function __construct(
        protected EndowmentService $endowmentService
    ) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->endowmentService->list($request->all()), Response::HTTP_OK);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->endowmentService->find($id), Response::HTTP_OK);
    }

    public function store(Request $request): JsonResponse
    {
        $e = $this->endowmentService->store($request->all(), $request->file('upload'));

        return response()->json([
            'success' => true,
            'data'    => $e,
        ], Response::HTTP_OK);
    }

    public function update(Request $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id', 1);
        $e = $this->endowmentService->update($targetId, $request->all(), $request->file('upload'));

        return response()->json([
            'success' => true,
            'data'    => $e,
        ], Response::HTTP_OK);
    }

    public function employees(): JsonResponse
    {
        $employees = Employee::select('id', 'name')->get();
        if ($employees->isEmpty()) {
            return response()->json([['id' => 1, 'name' => 'أحمد السالم']], Response::HTTP_OK);
        }

        return response()->json($employees, Response::HTTP_OK);
    }

    public function banks(): JsonResponse
    {
        return response()->json([
            ['id' => 1, 'name' => 'الحساب البنكي الرئيسي (الراجحي)'],
            ['id' => 2, 'name' => 'حساب الأوقاف والاستثمار (الإنماء)'],
            ['id' => 3, 'name' => 'الصندوق النقدي العام بالجمعية'],
        ], Response::HTTP_OK);
    }

    public function storePaymentVoucher(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $this->endowmentService->storeVoucher($request->all(), 2),
        ], Response::HTTP_OK);
    }

    public function storeReceiptVoucher(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $this->endowmentService->storeVoucher($request->all(), 1),
        ], Response::HTTP_OK);
    }

    public function transactions(int $id): JsonResponse
    {
        return response()->json($this->endowmentService->transactions($id), Response::HTTP_OK);
    }

    public function showVoucher(int $id): JsonResponse
    {
        return response()->json($this->endowmentService->showVoucher($id), Response::HTTP_OK);
    }

    // ── Archives ──────────────────────────────────────────────────────

    public function indexArchives(Request $request): JsonResponse
    {
        return response()->json($this->endowmentService->listArchives($request->all()), Response::HTTP_OK);
    }

    public function storeArchive(Request $request): JsonResponse
    {
        $file = $request->file('file') ?? $request->file('upload');
        $this->endowmentService->storeArchive($request->all(), $file);

        return response()->json($this->endowmentService->listArchives(), Response::HTTP_OK);
    }

    public function destroyArchive(int $id): JsonResponse
    {
        $this->endowmentService->deleteArchive($id);

        return response()->json(['success' => true], Response::HTTP_OK);
    }
}
