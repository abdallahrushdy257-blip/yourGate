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

    public function getSurveyQuestions(): JsonResponse
    {
        $questions = $this->service->getSurveyQuestions();

        return response()->json(['data' => $questions], Response::HTTP_OK);
    }

    public function saveSurveyQuestions(Request $request): JsonResponse
    {
        $questions = (array) $request->input('questions', []);
        $saved = $this->service->saveSurveyQuestions($questions);

        return response()->json(['data' => $saved], Response::HTTP_OK);
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

    // ── Super Admin Organizations & Subscription Modules ──────────────────

    public function approvedOrganizations(): JsonResponse
    {
        return response()->json($this->service->getOrganizations('approved'), Response::HTTP_OK);
    }

    public function pendingOrganizations(): JsonResponse
    {
        return response()->json($this->service->getOrganizations('pending'), Response::HTTP_OK);
    }

    public function rejectedOrganizations(): JsonResponse
    {
        return response()->json($this->service->getOrganizations('rejected'), Response::HTTP_OK);
    }

    public function showOrganization(int $id): JsonResponse
    {
        $org = $this->service->findOrganization($id);
        return response()->json($org, Response::HTTP_OK);
    }

    public function updateOrgStatus(Request $request, int $id, ?string $action = null): JsonResponse
    {
        $status = match ($action) {
            'approve' => 'approved',
            'reject'  => 'rejected',
            default   => $request->input('status', 'approved'),
        };

        $note = $request->input('note', $request->input('reason'));
        $updated = $this->service->updateOrganizationStatus($id, $status, $note);

        return response()->json([
            'status'  => Response::HTTP_OK,
            'message' => 'تم تحديث حالة الجمعية بنجاح.',
            'data'    => $updated,
        ], Response::HTTP_OK);
    }

    public function subscriptionModules(): JsonResponse
    {
        return response()->json($this->service->getSubscriptionModules(), Response::HTTP_OK);
    }

    public function storeSubscriptionModule(Request $request): JsonResponse
    {
        $created = $this->service->storeSubscriptionModule($request->all());
        return response()->json([
            'status'  => Response::HTTP_OK,
            'message' => 'تم إضافة الموديول بنجاح.',
            'data'    => $created,
        ], Response::HTTP_OK);
    }

    public function destroySubscriptionModule(int $id): JsonResponse
    {
        $this->service->deleteSubscriptionModule($id);
        return response()->json([
            'status'  => Response::HTTP_OK,
            'message' => 'تم حذف الموديول بنجاح.',
        ], Response::HTTP_OK);
    }

    public function storeModules(int $id): JsonResponse
    {
        return response()->json($this->service->getStoreModules($id), Response::HTTP_OK);
    }

    public function saveStoreModule(Request $request, int $id): JsonResponse
    {
        $created = $this->service->storeStoreModule($id, $request->all());
        return response()->json([
            'status'  => Response::HTTP_OK,
            'message' => 'تم تعيين الموديول بنجاح.',
            'data'    => $created,
        ], Response::HTTP_OK);
    }

    public function destroyStoreModule(int $id, ?int $moduleId = null): JsonResponse
    {
        $mId = $moduleId ?? $id;
        $this->service->deleteStoreModule($id, $mId);
        return response()->json([
            'status'  => Response::HTTP_OK,
            'message' => 'تم إلغاء الموديول بنجاح.',
        ], Response::HTTP_OK);
    }

    public function storeRequests(int $id): JsonResponse
    {
        return response()->json($this->service->getStoreRequests($id), Response::HTTP_OK);
    }

    public function saveStoreRequest(Request $request, int $id): JsonResponse
    {
        $created = $this->service->storeStoreRequest($id, $request->all());
        return response()->json([
            'status'  => Response::HTTP_OK,
            'message' => 'تم إرسال الطلب بنجاح.',
            'data'    => $created,
        ], Response::HTTP_OK);
    }

    public function destroyStoreRequest(int $id, ?int $requestId = null): JsonResponse
    {
        $rId = $requestId ?? $id;
        $this->service->deleteStoreRequest($id, $rId);
        return response()->json([
            'status'  => Response::HTTP_OK,
            'message' => 'تم حذف الطلب بنجاح.',
        ], Response::HTTP_OK);
    }
}
