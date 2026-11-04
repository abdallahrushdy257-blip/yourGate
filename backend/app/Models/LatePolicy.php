<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LatePolicy extends Model
{
    use HasFactory, BelongsToStore;

    protected $table = 'late_policies';

    protected $fillable = [
        'store_id',
        'category',
        'from_minute',
        'to_minute',
        'hour',
        'type',
        'value',
        'active',
        'note',
    ];

    protected $casts = [
        'from_minute' => 'integer',
        'to_minute'   => 'integer',
        'hour'        => 'float',
        'value'       => 'float',
        'active'      => 'boolean',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}
