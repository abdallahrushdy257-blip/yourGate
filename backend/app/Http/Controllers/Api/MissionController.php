<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mission\StoreMissionRequest;
use App\Http\Requests\Mission\UpdateMissionRequest;
use App\Http\Resources\HR\MissionResource;
use App\Services\HR\MissionService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MissionController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected MissionService $missionService
    ) {}

    /**
     * Display a listing of missions.
     * Supports both GET and POST requests (for TableComponent filters).
     */
    public function index(Request $request): JsonResponse
    {
        $missions = $this->missionService->list($request->all());

        return response()->json(MissionResource::collection($missions), Response::HTTP_OK);
    }

    /**
     * Return employees list for mission assignment.
     */
    public function eams(): JsonResponse
    {
        $employees = $this->missionService->getEmployees();

        return response()->json($employees, Response::HTTP_OK);
    }

    /**
     * Store a newly created mission.
     */
    public function store(StoreMissionRequest $request): JsonResponse
    {
        $data = $request->validated();
        if ($request->hasFile('upload')) {
            $data['upload'] = $request->file('upload');
        }

        $mission = $this->missionService->create($data);

        return response()->json(new MissionResource($mission), Response::HTTP_CREATED);
    }

    /**
     * Display the specified mission.
     */
    public function show(int $id): JsonResponse
    {
        $mission = $this->missionService->find($id);

        return response()->json(new MissionResource($mission), Response::HTTP_OK);
    }

    /**
     * Update an existing mission.
     */
    public function update(UpdateMissionRequest $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        $data = $request->validated();
        if ($request->hasFile('upload')) {
            $data['upload'] = $request->file('upload');
        }

        $mission = $this->missionService->update($targetId, $data);

        return response()->json(new MissionResource($mission), Response::HTTP_OK);
    }

    /**
     * Delete the specified mission.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->missionService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف المهمة بنجاح',
        ], Response::HTTP_OK);
    }
}
