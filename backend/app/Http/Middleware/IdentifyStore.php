<?php

namespace App\Http\Middleware;

use App\Models\Store;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IdentifyStore
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $storeId = $request->header('X-Store-ID');
        $storeSlug = $request->header('X-Store-Slug');

        $user = auth('sanctum')->user() ?? $request->user();
        $store = null;

        if ($storeId) {
            $store = Store::where('id', $storeId)->where('status', 'active')->first();
        } elseif ($storeSlug) {
            $store = Store::where('slug', $storeSlug)->where('status', 'active')->first();
        } elseif ($user && $user->store_id) {
            $store = Store::where('id', $user->store_id)->where('status', 'active')->first();
        } elseif ($user && empty($user->store_id)) {
            // Auto-heal users registered previously without a store
            $store = Store::firstOrCreate(
                ['slug' => 'store-' . $user->id],
                [
                    'name'   => 'جمعية ' . ($user->name ?: 'المانح'),
                    'status' => 'active',
                ]
            );
            $user->update(['store_id' => $store->id]);
        }

        if ($store) {
            app()->instance('current_store', $store);
            app()->instance('current_store_id', $store->id);
        }

        return $next($request);
    }
}
