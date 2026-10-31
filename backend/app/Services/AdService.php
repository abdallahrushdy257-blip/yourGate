<?php

namespace App\Services;

use App\Models\Ad;
use App\Models\Shop;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AdService
{
    /**
     * List all ads for the current store.
     */
    public function list(array $filters = []): Collection
    {
        $query = Ad::where('store_id', Auth::user()->store_id)
            ->with(['shop', 'store'])
            ->latest('id');

        if (!empty($filters['shop_id'])) {
            $query->where('shop_id', (int) $filters['shop_id']);
        }

        return $query->get();
    }

    /**
     * Store a new ad request for a shop case.
     */
    public function storeForShop(array $data): Ad
    {
        return DB::transaction(function () use ($data) {
            $storeId = Auth::user()->store_id;

            // Ensure the shop belongs to the current store
            Shop::where('store_id', $storeId)->findOrFail((int) $data['shop_id']);

            return Ad::create([
                'store_id'    => $storeId,
                'shop_id'     => (int) $data['shop_id'],
                'ad_approved' => false,
                'notes'       => $data['notes'] ?? null,
            ]);
        });
    }

    /**
     * Update ad approval status.
     */
    public function updateStatus(int $id, bool|int $approved): Ad
    {
        return DB::transaction(function () use ($id, $approved) {
            $ad = Ad::where('store_id', Auth::user()->store_id)->findOrFail($id);
            $ad->update(['ad_approved' => (bool) $approved]);

            return $ad;
        });
    }
}
