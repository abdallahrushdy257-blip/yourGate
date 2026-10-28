<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kpi extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $table = 'kpis';

    protected $fillable = [
        'store_id',
        'quiz',
        'target',
    ];

    protected $casts = [
        'target' => 'decimal:2',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}
