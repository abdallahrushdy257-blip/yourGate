<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NotificationController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService
    ) {}

    /**
     * Get list of notifications and count.
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()?->id;
        $result = $this->notificationService->getNotifications($userId);

        $collection = NotificationResource::collection($result['notifications']);

        return response()->json([
            'notifications' => $collection,
            'count'         => $result['count'],
            'data'          => [
                'notifications' => $collection,
                'count'         => $result['count'],
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Get a single notification and mark as read.
     */
    public function show(int $id): JsonResponse
    {
        $notification = $this->notificationService->getNotification($id);

        return response()->json(new NotificationResource($notification), Response::HTTP_OK);
    }
}
