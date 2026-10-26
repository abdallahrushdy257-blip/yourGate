<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateBeneficiaryLinkRequest;
use App\Http\Requests\ExternalBeneficiaryCaseRequest;
use App\Http\Resources\BeneficiaryTokenResource;
use App\Services\BeneficiaryLinkService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BeneficiaryLinkController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected BeneficiaryLinkService $beneficiaryLinkService
    ) {}

    /**
     * Generate a new single-use beneficiary registration link (Protected).
     * Endpoint: POST /api/hcform/request
     */
    public function generate(CreateBeneficiaryLinkRequest $request): JsonResponse
    {
        $token = $this->beneficiaryLinkService->createToken(
            $request->validated(),
            $request->user()
        );

        $resource = new BeneficiaryTokenResource($token);

        return response()->json([
            'status'     => Response::HTTP_OK,
            'success'    => true,
            'code'       => $token->code,
            'expires_at' => $token->expires_at->toIso8601String(),
            'message'    => 'تم إنشاء رابط تسجيل المستفيد بنجاح',
            'data'       => $resource,
        ], Response::HTTP_OK);
    }

    /**
     * List recent generated links for current store (Protected).
     * Endpoint: GET /api/hcform/tokens
     */
    public function tokens(Request $request): JsonResponse
    {
        $user = $request->user();
        $tokens = $this->beneficiaryLinkService->listTokens($user?->store_id);

        return response()->json([
            'status'  => Response::HTTP_OK,
            'success' => true,
            'data'    => BeneficiaryTokenResource::collection($tokens),
        ], Response::HTTP_OK);
    }

    /**
     * Check if a link/token is valid (Public).
     * Endpoint: GET /api/hcrequest/{code}
     */
    public function check(string $code): JsonResponse
    {
        $validation = $this->beneficiaryLinkService->validateToken($code);

        if (! $validation['valid']) {
            return response()->json([
                'status'  => $validation['status'],
                'valid'   => false,
                'message' => $validation['message'],
            ], $validation['status'] === 404 ? Response::HTTP_NOT_FOUND : Response::HTTP_GONE);
        }

        $token = $validation['token'];
        $progress = $this->beneficiaryLinkService->getBeneficiaryProgress($token);

        return response()->json([
            'status'         => Response::HTTP_OK,
            'valid'          => true,
            'message'        => $validation['message'],
            'human_case_id'  => $token->human_case_id,
            'suggested_step' => $progress['suggested_step'],
            'step_index'     => $progress['step_index'],
            'max_step'       => $progress['max_step'],
            'initial_data'   => $progress['data'],
        ], Response::HTTP_OK);
    }

    /**
     * Step 1: Save basic beneficiary info (Public).
     * Endpoint: POST /api/hcrequest/{code}/case
     */
    public function storeCase(ExternalBeneficiaryCaseRequest $request, string $code): JsonResponse
    {
        $validation = $this->beneficiaryLinkService->validateToken($code);
        if (! $validation['valid']) {
            return response()->json([
                'status'  => $validation['status'],
                'message' => $validation['message'],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $case = $this->beneficiaryLinkService->createCaseFromToken(
            $validation['token'],
            $request->validated()
        );

        return response()->json([
            'status'  => Response::HTTP_OK,
            'success' => true,
            'id'      => $case->id,
            'message' => 'تم حفظ البيانات الأساسية بنجاح',
            'data'    => [
                'id'   => $case->id,
                'name' => $case->name,
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Step 2: Save bank details (Public).
     * Endpoint: POST /api/hcrequest/{code}/banks
     */
    public function storeBanks(Request $request, string $code): JsonResponse
    {
        $validation = $this->beneficiaryLinkService->validateToken($code);
        if (! $validation['valid']) {
            return response()->json([
                'status'  => $validation['status'],
                'message' => $validation['message'],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->beneficiaryLinkService->updateBanks(
            $validation['token'],
            $request->all(),
            $request->file('upload')
        );

        return response()->json([
            'status'  => Response::HTTP_OK,
            'message' => 'تم حفظ البيانات البنكية بنجاح',
        ], Response::HTTP_OK);
    }

    /**
     * Step 3: Save qualifications and income sources (Public).
     * Endpoint: POST /api/hcrequest/{code}/qualifications
     */
    public function storeQualifications(Request $request, string $code): JsonResponse
    {
        $validation = $this->beneficiaryLinkService->validateToken($code);
        if (! $validation['valid']) {
            return response()->json([
                'status'  => $validation['status'],
                'message' => $validation['message'],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->beneficiaryLinkService->storeQualifications(
            $validation['token'],
            $request->except(['_token']),
            $request->file('sourceupload'),
            $request->file('courseupload')
        );

        return response()->json([
            'status'  => Response::HTTP_OK,
            'message' => 'تم حفظ المؤهل والوظيفة بنجاح',
        ], Response::HTTP_OK);
    }

    /**
     * Step 4: Save housing details (Public).
     * Endpoint: POST /api/hcrequest/{code}/homedetails
     */
    public function storeHousing(Request $request, string $code): JsonResponse
    {
        $validation = $this->beneficiaryLinkService->validateToken($code);
        if (! $validation['valid']) {
            return response()->json([
                'status'  => $validation['status'],
                'message' => $validation['message'],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->beneficiaryLinkService->updateHousing(
            $validation['token'],
            $request->except(['_token']),
            $request->file('upload1') ?? $request->file('personalfeesdetails_upload1'),
            $request->file('upload2') ?? $request->file('personalfeesdetails_upload2')
        );

        return response()->json([
            'status'  => Response::HTTP_OK,
            'message' => 'تم حفظ بيانات السكن بنجاح',
        ], Response::HTTP_OK);
    }

    /**
     * Step 5: Save health details (Public).
     * Endpoint: POST /api/hcrequest/{code}/healthdetails
     */
    public function storeHealth(Request $request, string $code): JsonResponse
    {
        $validation = $this->beneficiaryLinkService->validateToken($code);
        if (! $validation['valid']) {
            return response()->json([
                'status'  => $validation['status'],
                'message' => $validation['message'],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->beneficiaryLinkService->storeHealth(
            $validation['token'],
            $request->all(),
            $request->file('upload')
        );

        return response()->json([
            'status'  => Response::HTTP_OK,
            'message' => 'تمت إضافة البيانات الصحية بنجاح',
        ], Response::HTTP_OK);
    }

    /**
     * Step 6: Save dependants details and finalize registration (Public).
     * Endpoint: POST /api/hcrequest/{code}/dependantdetails
     */
    public function storeDependants(Request $request, string $code): JsonResponse
    {
        $validation = $this->beneficiaryLinkService->validateToken($code);
        if (! $validation['valid']) {
            return response()->json([
                'status'  => $validation['status'],
                'message' => $validation['message'],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->beneficiaryLinkService->storeDependants(
            $validation['token'],
            $request->all()
        );

        return response()->json([
            'status'  => Response::HTTP_OK,
            'message' => 'تم حفظ جميع البيانات بنجاح',
        ], Response::HTTP_OK);
    }
}
