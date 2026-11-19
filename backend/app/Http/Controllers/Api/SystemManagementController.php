<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SystemManagementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SystemManagementController extends Controller
{
    public function __construct(
        protected SystemManagementService $service
    ) {}

    // ── Roles & Permissions ───────────────────────────────────────────

    public function indexRoles(Request $request): JsonResponse
    {
        return response()->json($this->service->listRoles($request->all()), Response::HTTP_OK);
    }

    public function showRole(int $id): JsonResponse
    {
        return response()->json($this->service->findRole($id), Response::HTTP_OK);
    }

    public function storeRole(Request $request): JsonResponse
    {
        return response()->json($this->service->storeRole($request->all()), Response::HTTP_OK);
    }

    public function updateRole(Request $request): JsonResponse
    {
        $id = (int) $request->input('id', 1);

        return response()->json($this->service->updateRole($id, $request->all()), Response::HTTP_OK);
    }

    public function destroyRole(int $id): JsonResponse
    {
        $this->service->deleteRole($id);

        return response()->json(['success' => true], Response::HTTP_OK);
    }

    public function saveRolePermissions(Request $request, int $groupId): JsonResponse
    {
        $roles = (array) $request->input('roles', []);

        return response()->json($this->service->saveRolePermissions($groupId, $roles), Response::HTTP_OK);
    }

    // ── Organization Users & Profile ──────────────────────────────────

    public function indexOrgUsers(Request $request): JsonResponse
    {
        return response()->json($this->service->listOrgUsers($request->all()), Response::HTTP_OK);
    }

    public function showOrgUser(int $id): JsonResponse
    {
        return response()->json($this->service->findOrgUser($id), Response::HTTP_OK);
    }

    public function storeOrgUser(Request $request): JsonResponse
    {
        return response()->json($this->service->storeOrgUser($request->all()), Response::HTTP_OK);
    }

    public function updateOrgUser(Request $request): JsonResponse
    {
        $id = (int) $request->input('id', Auth::id() ?: 1);

        return response()->json($this->service->updateOrgUser($id, $request->all()), Response::HTTP_OK);
    }

    public function destroyOrgUser(int $id): JsonResponse
    {
        $this->service->deleteOrgUser($id);

        return response()->json(['success' => true], Response::HTTP_OK);
    }

    public function representative(): JsonResponse
    {
        return response()->json($this->service->getRepresentative(), Response::HTTP_OK);
    }

    public function userData(): JsonResponse
    {
        return response()->json($this->service->findOrgUser((int) (Auth::id() ?: 1)), Response::HTTP_OK);
    }

    public function updateUserData(Request $request): JsonResponse
    {
        $id = (int) (Auth::id() ?: 1);

        return response()->json($this->service->updateOrgUser($id, $request->all()), Response::HTTP_OK);
    }

    // ── Print Settings ────────────────────────────────────────────────

    public function getPrintSettings(): JsonResponse
    {
        return response()->json($this->service->getPrintSettings(), Response::HTTP_OK);
    }

    public function savePrintSettings(Request $request): JsonResponse
    {
        $settings = (array) $request->input('settings', $request->all());

        return response()->json($this->service->savePrintSettings($settings), Response::HTTP_OK);
    }

    // ── Dashboard (/home) & BSC ───────────────────────────────────────

    public function home(): JsonResponse
    {
        return response()->json($this->service->getHomeData(), Response::HTTP_OK);
    }

    public function allBsc(Request $request): JsonResponse
    {
        $orgBsc = $this->service->getOrgBsc(1, $request->input('period'));

        return response()->json(['data' => [$orgBsc['data']]], Response::HTTP_OK);
    }

    public function orgBsc(Request $request, int $orgId): JsonResponse
    {
        return response()->json($this->service->getOrgBsc($orgId, $request->input('period')), Response::HTTP_OK);
    }

    public function compareBsc(Request $request): JsonResponse
    {
        $orgBsc = $this->service->getOrgBsc(1, $request->input('period'));

        return response()->json(['data' => [$orgBsc['data']]], Response::HTTP_OK);
    }

    public function periodsBsc(): JsonResponse
    {
        return response()->json($this->service->getPeriodsBsc(), Response::HTTP_OK);
    }

    public function recalculateBsc(Request $request, int $orgId): JsonResponse
    {
        return response()->json($this->service->getOrgBsc($orgId, $request->input('period')), Response::HTTP_OK);
    }

    // ── Marketing & Governance ────────────────────────────────────────

    public function projectDesigns(): JsonResponse
    {
        return response()->json($this->service->listProjectDetailsByType(1), Response::HTTP_OK);
    }

    public function projectMarketing(): JsonResponse
    {
        return response()->json($this->service->listProjectDetailsByType(2), Response::HTTP_OK);
    }

    public function shopDesigns(): JsonResponse
    {
        return response()->json($this->service->listShopDetailsByType(1), Response::HTTP_OK);
    }

    public function shopMarketing(): JsonResponse
    {
        return response()->json($this->service->listShopDetailsByType(2), Response::HTTP_OK);
    }

    public function detailUploads(int $id): JsonResponse
    {
        return response()->json([asset('storage/projects/sample.png')], Response::HTTP_OK);
    }

    public function governanceQuizs(): JsonResponse
    {
        return response()->json($this->service->getGovernanceQuizs(), Response::HTTP_OK);
    }

    public function storeGovernance(Request $request): JsonResponse
    {
        return response()->json(['success' => true], Response::HTTP_OK);
    }

    public function submittedGovernance(): JsonResponse
    {
        return response()->json([1, 2, 3], Response::HTTP_OK);
    }

    public function countGovernanceQuizs(): JsonResponse
    {
        return response()->json($this->service->getGovernanceCounts(), Response::HTTP_OK);
    }
}
