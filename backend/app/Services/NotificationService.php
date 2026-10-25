<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Store;
use Illuminate\Support\Facades\DB;

class NotificationService
{
    /**
     * Get user notifications and unread count.
     */
    public function getNotifications(?int $userId = null): array
    {
        $query = Notification::query()->latest();

        if ($userId) {
            $query->where(function ($q) use ($userId) {
                $q->where('user_id', $userId)
                  ->orWhereNull('user_id');
            });
        }

        $notifications = $query->take(20)->get();

        // If no notifications exist yet for this store/user, seed a welcome notification
        if ($notifications->isEmpty()) {
            $welcome = $this->createWelcomeNotification($userId);
            if ($welcome) {
                $notifications = collect([$welcome]);
            }
        }

        $count = $notifications->where('is_read', false)->count();

        return [
            'notifications' => $notifications,
            'count'         => $count,
        ];
    }

    /**
     * Find notification and mark it as read.
     */
    public function getNotification(int $id): Notification
    {
        return DB::transaction(function () use ($id) {
            $notification = Notification::findOrFail($id);

            if (! $notification->is_read) {
                $notification->update(['is_read' => true]);
            }

            return $notification;
        });
    }

    /**
     * Helper to create a welcome notification.
     */
    protected function createWelcomeNotification(?int $userId): ?Notification
    {
        $storeId = app()->has('current_store_id') 
            ? app('current_store_id') 
            : (auth('sanctum')->user()?->store_id ?? Store::value('id'));

        if (! $storeId) {
            return null;
        }

        return Notification::create([
            'store_id' => $storeId,
            'user_id'  => $userId,
            'title'    => 'مرحباً بك في نظام بواباتكم',
            'subject'  => 'تم تفعيل حسابك وإعداد متجرك بنجاح. يمكنك الآن إدارة كافة العمليات والبيانات بكل سهولة.',
            'priority' => 1,
            'is_read'  => false,
        ]);
    }
}
