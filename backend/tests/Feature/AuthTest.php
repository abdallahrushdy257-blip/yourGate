<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_successfully(): void
    {
        $payload = [
            'name'                  => 'أحمد محمود',
            'email'                 => 'ahmed@example.com',
            'phone'                 => '0555555555',
            'address'               => 'الرياض - حي الملز',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'message',
                'user' => ['id', 'name', 'email', 'phone', 'organization_id', 'is_admin'],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'ahmed@example.com',
            'phone' => '0555555555',
        ]);

        $this->assertDatabaseHas('stores', [
            'name' => 'جمعية أحمد محمود',
        ]);
    }

    public function test_registration_validation_errors(): void
    {
        $response = $this->postJson('/api/register', [
            'name'     => '',
            'email'    => 'invalid-email',
            'password' => 'short',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure(['success', 'message', 'errors']);
    }

    public function test_user_can_login_successfully(): void
    {
        $user = User::factory()->create([
            'email'    => 'user@example.com',
            'password' => 'password123',
            'is_admin' => false,
            'status'   => 'active',
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'user@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'token',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'organization_id',
                    'email_verified',
                    'is_admin',
                    'roles',
                ],
            ]);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        $response = $this->postJson('/api/login', [
            'email'    => 'nonexistent@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure(['errors' => ['email']]);
    }

    public function test_authenticated_user_can_fetch_profile_and_logout(): void
    {
        $user = User::factory()->create([
            'email'    => 'profile@example.com',
            'password' => 'password123',
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        // Fetch user
        $userResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/user');

        $userResponse->assertStatus(200)
            ->assertJsonPath('email', 'profile@example.com');

        // Logout
        $logoutResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/logout');

        $logoutResponse->assertStatus(200)
            ->assertJsonPath('success', true);
    }
}
