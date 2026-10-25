<?php

namespace App\Traits;

use App\Models\Scopes\StoreScope;
use App\Models\Store;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToStore
{
    /**
     * Boot the trait to attach global scope and auto-assign store_id.
     */
    protected static function bootBelongsToStore(): void
    {
        static::addGlobalScope(new StoreScope);

        static::creating(function (Model $model) {
            if (empty($model->store_id)) {
                $user = auth('sanctum')->user() ?? auth()->user() ?? request()?->user();
                $storeId = app()->has('current_store_id') 
                    ? app('current_store_id') 
                    : ($user?->store_id ?? Store::value('id') ?? 1);

                $model->store_id = $storeId;
            }
        });
    }

    /**
     * Get the store that owns the model.
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}
