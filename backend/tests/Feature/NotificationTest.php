<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_notifications_returns_expected_structure(): void
    {
        $store = Store::create([
            'name'   => 'متجر الإشعارات',
            'slug'   => 'notif-store',
            'status' => 'active',
        ]);

        $user = User::factory()->create([
            'store_id' => $store->id,
            'status'   => 'active',
        ]);

        Notification::create([
            'store_id' => $store->id,
            'user_id'  => $user->id,
            'title'    => 'إشعار جديد',
            'subject'  => 'تم استلام تبرع جديد',
            'priority' => 1,
            'is_read'  => false,
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/notify');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'notifications',
                'count',
                'data' => [
                    'notifications',
                    'count',
                ],
            ])
            ->assertJsonPath('count', 1);
    }

    public function test_get_single_notification_marks_as_read(): void
    {
        $store = Store::create([
            'name'   => 'متجر الإشعارات',
            'slug'   => 'notif-store-2',
            'status' => 'active',
        ]);

        $user = User::factory()->create([
            'store_id' => $store->id,
            'status'   => 'active',
        ]);

        $notification = Notification::create([
            'store_id' => $store->id,
            'user_id'  => $user->id,
            'title'    => 'إشعار مهم',
            'subject'  => 'تفاصيل الإشعار',
            'priority' => 2,
            'is_read'  => false,
        ]);

        $response = $this->actingAs($user)
            ->getJson("/api/notify/{$notification->id}");

        $response->assertStatus(200)
            ->assertJsonPath('id', $notification->id)
            ->assertJsonPath('is_read', true);

        $this->assertDatabaseHas('notifications', [
            'id'      => $notification->id,
            'is_read' => 1,
        ]);
    }
}
