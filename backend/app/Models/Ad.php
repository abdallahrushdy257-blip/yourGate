<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ad extends Model
{
    use HasFactory, BelongsToStore;

    protected $table = 'ads';

    protected $fillable = [
        'store_id',
        'shop_id',
        'project_id',
        'ad_approved',
        'notes',
    ];

    protected $casts = [
        'ad_approved' => 'boolean',
    ];

    protected $appends = [
        'approved',
    ];

    public function getApprovedAttribute(): bool
    {
        return (bool) $this->ad_approved;
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class, 'shop_id');
    }
}
