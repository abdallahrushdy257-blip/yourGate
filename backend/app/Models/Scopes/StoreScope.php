<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class StoreScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        $user = auth('sanctum')->user() ?? auth()->user() ?? request()?->user();
        $storeId = app()->has('current_store_id') 
            ? app('current_store_id') 
            : $user?->store_id;

        if ($storeId) {
            $builder->where($model->qualifyColumn('store_id'), $storeId);
        }
    }
}
