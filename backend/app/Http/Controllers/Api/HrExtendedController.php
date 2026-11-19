<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\HrExtendedService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HrExtendedController extends Controller
{
    public function __construct(
        protected HrExtendedService $hrService
    ) {}

    // ── Volunteers ────────────────────────────────────────────────────

    public function indexVolunteers(Request $request): JsonResponse
    {
        return response()->json($this->hrService->listVolunteers($request->all()), Response::HTTP_OK);
    }

    public function showVolunteer(int $id): JsonResponse
    {
        return response()->json($this->hrService->findVolunteer($id), Response::HTTP_OK);
    }

    public function storeVolunteer(Request $request): JsonResponse
    {
        $v = $this->hrService->storeVolunteer(
            $request->all(),
            $request->file('profile'),
            $request->file('upload')
        );

        return response()->json([
            'success' => true,
            'message' => 'تم إضافة المتطوع بنجاح',
            'data'    => $v,
        ], Response::HTTP_OK);
    }

    public function updateVolunteer(Request $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        $v = $this->hrService->updateVolunteer($targetId, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث بيانات المتطوع بنجاح',
            'data'    => $v,
        ], Response::HTTP_OK);
    }

    public function destroyVolunteer(int $id): JsonResponse
    {
        $this->hrService->deleteVolunteer($id);

        return response()->json(['success' => true], Response::HTTP_OK);
    }

    public function storeVolunteerVoucher(Request $request): JsonResponse
    {
        $res = $this->hrService->storeVolunteerVoucher($request->all());

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل سند الصرف للمتطوع بنجاح',
            'data'    => $res,
        ], Response::HTTP_OK);
    }

    // ── Performance Evaluations ───────────────────────────────────────

    public function kpiReport(Request $request): JsonResponse
    {
        return response()->json($this->hrService->listEvaluations($request->all()), Response::HTTP_OK);
    }

    public function storeEvaluation(Request $request): JsonResponse
    {
        $ev = $this->hrService->storeEvaluation($request->all(), $request->file('attachment'));

        return response()->json([
            'id'      => $ev->id,
            'success' => true,
            'data'    => $ev,
        ], Response::HTTP_OK);
    }

    public function quizsAll(): JsonResponse
    {
        return response()->json($this->hrService->quizsAll(), Response::HTTP_OK);
    }

    public function storeEvaluationQuizs(Request $request): JsonResponse
    {
        $id = (int) $request->input('id', 1);
        $ev = $this->hrService->storeEvaluationQuizs($id, $request->input('quiz', []));

        return response()->json([
            'success' => true,
            'data'    => $ev,
        ], Response::HTTP_OK);
    }

    // ── Training Records ──────────────────────────────────────────────

    public function indexTraining(Request $request): JsonResponse
    {
        return response()->json($this->hrService->listTrainingRecords($request->all()), Response::HTTP_OK);
    }

    public function storeTraining(Request $request): JsonResponse
    {
        $record = $this->hrService->storeTrainingRecord($request->all(), $request->file('attachment'));

        return response()->json([
            'success' => true,
            'data'    => $record,
        ], Response::HTTP_CREATED);
    }

    public function updateTraining(Request $request, int $id): JsonResponse
    {
        $record = $this->hrService->updateTrainingRecord($id, $request->all(), $request->file('attachment'));

        return response()->json([
            'success' => true,
            'data'    => $record,
        ], Response::HTTP_OK);
    }

    public function destroyTraining(int $id): JsonResponse
    {
        $this->hrService->deleteTrainingRecord($id);

        return response()->json(['success' => true], Response::HTTP_OK);
    }

    // ── KSA Assessments ───────────────────────────────────────────────

    public function indexKsa(Request $request): JsonResponse
    {
        return response()->json($this->hrService->listKsaAssessments($request->all()), Response::HTTP_OK);
    }

    public function storeKsa(Request $request): JsonResponse
    {
        $ksa = $this->hrService->storeKsaAssessment($request->all(), $request->file('attachment'));

        return response()->json([
            'success' => true,
            'data'    => $ksa,
        ], Response::HTTP_CREATED);
    }

    public function updateKsa(Request $request, int $id): JsonResponse
    {
        $ksa = $this->hrService->updateKsaAssessment($id, $request->all(), $request->file('attachment'));

        return response()->json([
            'success' => true,
            'data'    => $ksa,
        ], Response::HTTP_OK);
    }

    public function destroyKsa(int $id): JsonResponse
    {
        $this->hrService->deleteKsaAssessment($id);

        return response()->json(['success' => true], Response::HTTP_OK);
    }

    // ── Employee Papers & Uploads ─────────────────────────────────────

    public function indexPapers(Request $request): JsonResponse
    {
        return response()->json($this->hrService->listPapers($request->all()), Response::HTTP_OK);
    }

    public function showPaper(int $id): JsonResponse
    {
        return response()->json($this->hrService->findPaper($id), Response::HTTP_OK);
    }

    public function storePaper(Request $request): JsonResponse
    {
        $file = $request->file('file') ?? $request->file('upload');
        $paper = $this->hrService->storePaper($request->all(), $file);

        return response()->json([
            'success' => true,
            'data'    => $paper,
        ], Response::HTTP_OK);
    }

    public function updatePaper(Request $request): JsonResponse
    {
        $file = $request->file('file') ?? $request->file('upload');
        $paper = $this->hrService->updatePaper($request->all(), $file);

        return response()->json([
            'success' => true,
            'data'    => $paper,
        ], Response::HTTP_OK);
    }

    // ── HR Reports ────────────────────────────────────────────────────

    public function salaryReport(Request $request): JsonResponse
    {
        return response()->json($this->hrService->salaryReport($request->all()), Response::HTTP_OK);
    }

    public function approvedVacations(Request $request): JsonResponse
    {
        return response()->json($this->hrService->approvedVacations($request->all()), Response::HTTP_OK);
    }
}
