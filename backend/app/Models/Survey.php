<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Survey extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $fillable = [
        'store_id',
        'humancase_id',
        'user_id',
        'period',
        'satisfaction_score',
        'nps_score',
        'notes',
        'submitted_at',
    ];

    protected $casts = [
        'satisfaction_score' => 'integer',
        'nps_score'          => 'integer',
        'submitted_at'       => 'datetime',
    ];

    protected $appends = [
        'nps_category',
    ];

    public function humanCase(): BelongsTo
    {
        return $this->belongsTo(HumanCase::class, 'humancase_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getNpsCategoryAttribute(): ?string
    {
        if ($this->nps_score === null) {
            return null;
        }

        if ($this->nps_score >= 9) {
            return 'promoter';
        }

        if ($this->nps_score >= 7) {
            return 'passive';
        }

        return 'detractor';
    }
}
