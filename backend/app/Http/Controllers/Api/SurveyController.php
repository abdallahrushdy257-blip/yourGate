<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSurveyRequest;
use App\Http\Resources\SurveyResource;
use App\Services\SurveyService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SurveyController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SurveyService $surveyService
    ) {}

    /**
     * List surveys with calculated stats for the given period.
     * Endpoint: GET /api/surveys
     */
    public function index(Request $request): JsonResponse
    {
        $result = $this->surveyService->list(
            $request->only(['period']),
            $request->user()?->store_id
        );

        return response()->json([
            'status'  => Response::HTTP_OK,
            'success' => true,
            'data'    => SurveyResource::collection($result['data']),
            'stats'   => $result['stats'],
            'meta'    => $result['meta'],
        ], Response::HTTP_OK);
    }

    /**
     * Store a new beneficiary satisfaction survey.
     * Endpoint: POST /api/surveys
     */
    public function store(StoreSurveyRequest $request): JsonResponse
    {
        $survey = $this->surveyService->store(
            $request->validated(),
            $request->user()
        );

        return response()->json([
            'status'  => Response::HTTP_OK,
            'success' => true,
            'message' => 'تم حفظ استبيان الرضا بنجاح',
            'data'    => new SurveyResource($survey),
        ], Response::HTTP_OK);
    }

    /**
     * Delete survey.
     * Endpoint: DELETE /api/surveys/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $this->surveyService->delete($id);

        return response()->json([
            'status'  => Response::HTTP_OK,
            'success' => true,
            'message' => 'تم حذف الاستبيان بنجاح',
        ], Response::HTTP_OK);
    }
}
