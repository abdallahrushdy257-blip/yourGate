<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Http\Resources\ProjectDetailResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\ProjectTransactionResource;
use App\Models\Project;
use App\Services\ProjectService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected ProjectService $projectService
    ) {}

    /**
     * Display a listing of projects.
     */
    public function index(Request $request): JsonResponse
    {
        $projects = $this->projectService->list($request->all());

        return $this->successResponse(
            ProjectResource::collection($projects),
            'Projects retrieved successfully.'
        );
    }

    /**
     * Store a newly created project.
     */
    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = $this->projectService->create(
            $request->validated(),
            $request->file('attachment')
        );

        return $this->createdResponse(
            new ProjectResource($project),
            'Project created successfully.'
        );
    }

    /**
     * Display the specified project.
     */
    public function show(int $id): JsonResponse
    {
        $project = $this->projectService->find($id);

        return $this->successResponse(
            new ProjectResource($project),
            'Project retrieved successfully.'
        );
    }

    /**
     * Update the specified project.
     */
    public function update(UpdateProjectRequest $request, ?int $id = null): JsonResponse
    {
        $projectId = $id ?? (int) $request->input('id');
        $project = $this->projectService->find($projectId);

        $updatedProject = $this->projectService->update(
            $project,
            $request->validated(),
            $request->file('attachment')
        );

        return $this->successResponse(
            new ProjectResource($updatedProject),
            'Project updated successfully.'
        );
    }

    /**
     * Cancel a project (status = 3).
     */
    public function cancel(int $id): JsonResponse
    {
        $project = $this->projectService->find($id);
        $this->projectService->cancel($project);

        return $this->successResponse(
            new ProjectResource($project),
            'Project cancelled successfully.'
        );
    }

    /**
     * Activate a project (status = 1).
     */
    public function activate(int $id): JsonResponse
    {
        $project = $this->projectService->find($id);
        $this->projectService->activate($project);

        return $this->successResponse(
            new ProjectResource($project),
            'Project activated successfully.'
        );
    }

    /**
     * Close a project (status = 2).
     */
    public function close(int $id): JsonResponse
    {
        $project = $this->projectService->find($id);
        $this->projectService->close($project);

        return $this->successResponse(
            new ProjectResource($project),
            'Project closed successfully.'
        );
    }

    /**
     * Remove the specified project.
     */
    public function destroy(int $id): JsonResponse
    {
        $project = $this->projectService->find($id);
        $this->projectService->delete($project);

        return $this->successResponse(
            null,
            'Project deleted successfully.'
        );
    }

    /**
     * Get completion progress percentage for a project.
     */
    public function progressPercentage(int $id): JsonResponse
    {
        $project = $this->projectService->find($id);
        $percentage = $this->projectService->progressPercentage($project);

        return response()->json([
            'success'    => true,
            'percentage' => $percentage,
            'data'       => [
                'percentage' => $percentage,
            ],
        ]);
    }

    /**
     * Store design or marketing request details for a project.
     */
    public function storeDetail(Request $request): JsonResponse
    {
        $request->validate([
            'id'          => 'required_without:project_id',
            'type'        => 'required|in:1,2',
            'description' => 'nullable|string',
            'note'        => 'nullable|string',
            'upload'      => 'nullable|file|max:10240',
            'upload2'     => 'nullable|file|max:10240',
        ]);

        $detail = $this->projectService->storeDetail(
            $request->all(),
            $request->file('upload'),
            $request->file('upload2')
        );

        return $this->createdResponse(
            new ProjectDetailResource($detail),
            'Project detail request stored successfully.'
        );
    }

    /**
     * Store payment transaction for a project.
     */
    public function storePayment(Request $request): JsonResponse
    {
        $request->validate([
            'project_id' => 'required_without:id',
            'amount'     => 'required|numeric|min:0.01',
            'date'       => 'nullable|date',
            'type'       => 'nullable|string',
            'account'    => 'nullable|string',
        ]);

        $transaction = $this->projectService->storePayment($request->all());

        return $this->createdResponse(
            new ProjectTransactionResource($transaction),
            'Project payment voucher stored successfully.'
        );
    }

    /**
     * Store receipt donation transaction for a project.
     */
    public function storeReceipt(Request $request): JsonResponse
    {
        $request->validate([
            'project_id' => 'required_without:id',
            'amount'     => 'required|numeric|min:0.01',
            'date'       => 'nullable|date',
            'type'       => 'nullable|string',
            'account'    => 'nullable|string',
        ]);

        $transaction = $this->projectService->storeReceipt($request->all());

        return $this->createdResponse(
            new ProjectTransactionResource($transaction),
            'Project receipt voucher stored successfully.'
        );
    }

    /**
     * List transactions for a project.
     */
    public function transactions(int $id): JsonResponse
    {
        $transactions = $this->projectService->transactions($id);

        return $this->successResponse(
            ProjectTransactionResource::collection($transactions),
            'Project transactions retrieved successfully.'
        );
    }

    public function payments(int $id): JsonResponse
    {
        $transactions = $this->projectService->transactions($id);

        return $this->successResponse(
            ProjectTransactionResource::collection($transactions),
            'Project payments retrieved successfully.'
        );
    }

    // ── Project Phases Endpoints ────────────────────────────────

    public function phases(Request $request, int $id): JsonResponse
    {
        $phases = $this->projectService->listPhases($id, $request->all());

        return $this->successResponse(
            \App\Http\Resources\ProjectPhaseResource::collection($phases),
            'Project phases retrieved successfully.'
        );
    }

    public function allPhases(int $id): JsonResponse
    {
        $phases = $this->projectService->allPhases($id);

        return response()->json($phases);
    }

    public function storePhase(\App\Http\Requests\Project\StoreProjectPhaseRequest $request): JsonResponse
    {
        $phase = $this->projectService->storePhase($request->validated());

        return $this->successResponse(
            new \App\Http\Resources\ProjectPhaseResource($phase),
            'Project phase created successfully.'
        );
    }

    public function completePhase(\App\Http\Requests\Project\CompleteProjectPhaseRequest $request): JsonResponse
    {
        $phase = $this->projectService->completePhase($request->validated());

        return $this->successResponse(
            new \App\Http\Resources\ProjectPhaseResource($phase),
            'Project phase completed successfully.'
        );
    }

    public function cancelPhase(int $id): JsonResponse
    {
        $phase = $this->projectService->cancelPhase($id);

        return $this->successResponse(
            new \App\Http\Resources\ProjectPhaseResource($phase),
            'Project phase cancelled successfully.'
        );
    }

    public function activatePhase(int $id): JsonResponse
    {
        $phase = $this->projectService->activatePhase($id);

        return $this->successResponse(
            new \App\Http\Resources\ProjectPhaseResource($phase),
            'Project phase activated successfully.'
        );
    }

    // ── Project Assignments / Members Endpoints ─────────────────

    public function assignments(int $id): JsonResponse
    {
        $assignments = $this->projectService->listAssignments($id);

        return $this->successResponse(
            \App\Http\Resources\ProjectAssignmentResource::collection($assignments),
            'Project assignments retrieved successfully.'
        );
    }

    public function storeAssignment(\App\Http\Requests\Project\StoreProjectAssignmentRequest $request): JsonResponse
    {
        $assignment = $this->projectService->storeAssignment($request->validated());

        return $this->successResponse(
            new \App\Http\Resources\ProjectAssignmentResource($assignment),
            'Project member assigned successfully.'
        );
    }

    public function deleteAssignment(int $id): JsonResponse
    {
        $this->projectService->deleteAssignment($id);

        return $this->successResponse(null, 'Project assignment deleted successfully.');
    }

    // ── Project KPIs Endpoints ──────────────────────────────────

    public function kpis(int $id): JsonResponse
    {
        $kpis = $this->projectService->listKpis($id);

        return $this->successResponse(
            \App\Http\Resources\ProjectKpiResource::collection($kpis),
            'Project KPIs retrieved successfully.'
        );
    }

    public function quizs(): JsonResponse
    {
        $quizs = $this->projectService->defaultQuizs();

        return response()->json($quizs);
    }

    public function storeKpis(\App\Http\Requests\Project\StoreProjectKpiRequest $request): JsonResponse
    {
        $kpis = $this->projectService->storeKpis(
            (int) $request->input('project_id'),
            (array) $request->input('kpis')
        );

        return $this->successResponse(
            \App\Http\Resources\ProjectKpiResource::collection($kpis),
            'Project KPIs stored successfully.'
        );
    }

    public function deleteKpi(int $id): JsonResponse
    {
        $this->projectService->deleteKpi($id);

        return $this->successResponse(null, 'Project KPI deleted successfully.');
    }

    // ── Project Uploads / Attachments Endpoints ─────────────────

    public function uploads(int $id): JsonResponse
    {
        $uploads = $this->projectService->listUploads($id);

        return $this->successResponse(
            \App\Http\Resources\ProjectUploadResource::collection($uploads),
            'Project uploads retrieved successfully.'
        );
    }

    public function storeUpload(\App\Http\Requests\Project\StoreProjectUploadRequest $request): JsonResponse
    {
        $rawFiles = $request->file('upload')
                 ?? $request->file('uploads')
                 ?? $request->file('files')
                 ?? $request->file('attachments');

        $files = is_array($rawFiles) ? $rawFiles : ($rawFiles ? [$rawFiles] : []);

        $uploads = $this->projectService->storeUploads(
            $request->validated(),
            $files
        );

        $data = $uploads->count() === 1
            ? new \App\Http\Resources\ProjectUploadResource($uploads->first())
            : \App\Http\Resources\ProjectUploadResource::collection($uploads);

        return $this->successResponse(
            $data,
            'Project attachment(s) uploaded successfully.'
        );
    }

    public function deleteUpload(int $id): JsonResponse
    {
        $this->projectService->deleteUpload($id);

        return $this->successResponse(null, 'Project attachment deleted successfully.');
    }

    // ── Project Risks Endpoints ─────────────────────────────────

    public function risks(int $id): JsonResponse
    {
        $risks = $this->projectService->listRisks($id);

        return $this->successResponse(
            \App\Http\Resources\ProjectRiskResource::collection($risks),
            'Project risks retrieved successfully.'
        );
    }

    public function storeRisk(\App\Http\Requests\Project\StoreProjectRiskRequest $request): JsonResponse
    {
        $risk = $this->projectService->storeRisk($request->validated());

        return $this->successResponse(
            new \App\Http\Resources\ProjectRiskResource($risk),
            'Project risk stored successfully.'
        );
    }

    public function showRisk(int $id): JsonResponse
    {
        $risk = $this->projectService->findRisk($id);

        return $this->successResponse(
            new \App\Http\Resources\ProjectRiskResource($risk),
            'Project risk retrieved successfully.'
        );
    }

    public function storeRiskMitigation(\App\Http\Requests\Project\StoreProjectRiskMitigationRequest $request): JsonResponse
    {
        $risk = $this->projectService->storeRiskMitigation($request->validated());

        return $this->successResponse(
            new \App\Http\Resources\ProjectRiskResource($risk),
            'Risk mitigation plan saved successfully.'
        );
    }

    public function riskReport(int $id): JsonResponse
    {
        $risks = $this->projectService->riskReport($id);

        return $this->successResponse(
            \App\Http\Resources\ProjectRiskResource::collection($risks),
            'Project risk report generated successfully.'
        );
    }

    // ── Dropdowns Helpers ───────────────────────────────────────

    public function employees(): JsonResponse
    {
        $employees = $this->projectService->listEmployees();

        return response()->json($employees);
    }

    public function volunteers(): JsonResponse
    {
        $volunteers = $this->projectService->listVolunteers();

        return response()->json($volunteers);
    }
}
