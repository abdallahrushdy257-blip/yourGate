<?php

namespace App\Services;

use App\Models\Interest;
use App\Models\Store;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

class AuthService
{
    /**
     * Register a new user representative and create their store.
     */
    public function register(array $data): User
    {
        return DB::transaction(function () use ($data) {
            // 1. Create a dedicated Store for this tenant
            $slugBase = Str::slug($data['name']);
            $storeSlug = (! empty($slugBase) ? $slugBase : 'store') . '-' . Str::random(5);

            $store = Store::create([
                'name'   => 'جمعية ' . $data['name'],
                'slug'   => strtolower($storeSlug),
                'status' => 'active',
            ]);

            // 2. Create the User linked to the new Store
            $user = User::create([
                'store_id'          => $store->id,
                'name'              => $data['name'],
                'email'             => strtolower($data['email']),
                'phone'             => $data['phone'],
                'address'           => $data['address'] ?? null,
                'password'          => $data['password'],
                'is_admin'          => false,
                'status'            => 'active',
                'email_verified_at' => now(),
            ]);

            // 3. Assign Admin role within their store
            setPermissionsTeamId($store->id);
            $adminRole = Role::firstOrCreate([
                'name'       => 'admin',
                'guard_name' => 'web',
                'store_id'   => $store->id,
            ]);
            $user->assignRole($adminRole);

            // 4. Seed initial default donor interests for this new store
            $defaultInterests = [
                ['name' => 'التعليم', 'description' => 'دعم المشاريع التعليمية'],
                ['name' => 'الصحة', 'description' => 'دعم المستشفيات'],
                ['name' => 'الأيتام', 'description' => 'رعاية الأيتام'],
                ['name' => 'الإغاثة', 'description' => 'المساعدات الإنسانية'],
            ];

            foreach ($defaultInterests as $item) {
                Interest::create([
                    'store_id'    => $store->id,
                    'name'        => $item['name'],
                    'description' => $item['description'],
                ]);
            }

            return $user->load('store');
        });
    }

    /**
     * Authenticate user and issue Sanctum token.
     */
    public function login(string $email, string $password): array
    {
        $user = User::where('email', strtolower($email))->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'email' => ['الحساب معطل أو غير نشط، يرجى التواصل مع الإدارة'],
            ]);
        }

        // Set permissions team id if user belongs to a store
        if ($user->store_id) {
            setPermissionsTeamId($user->store_id);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user'  => $user->load('store'),
            'token' => $token,
        ];
    }

    /**
     * Log out user by deleting current token.
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }
}
