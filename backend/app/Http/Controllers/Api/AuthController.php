<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    /**
     * Register a new representative account.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = $this->authService->register($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء الحساب بنجاح، يمكنك الآن تسجيل الدخول',
            'data'    => [
                'user' => new UserResource($user),
            ],
            'user'    => new UserResource($user),
        ], Response::HTTP_CREATED);
    }

    /**
     * Authenticate user and issue token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();
        $authData = $this->authService->login($credentials['email'], $credentials['password']);

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الدخول بنجاح',
            'token'   => $authData['token'],
            'user'    => new UserResource($authData['user']),
            'data'    => [
                'token' => $authData['token'],
                'user'  => new UserResource($authData['user']),
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Get the authenticated user.
     */
    public function user(Request $request): JsonResponse
    {
        $user = $request->user()->load('store');

        return response()->json(new UserResource($user), Response::HTTP_OK);
    }

    /**
     * Log out the authenticated user.
     */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return $this->successResponse(null, 'تم تسجيل الخروج بنجاح');
    }
}
