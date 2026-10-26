<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BeneficiaryFormToken extends Model
{
    use HasFactory, BelongsToStore;

    protected $fillable = [
        'store_id',
        'created_by',
        'human_case_id',
        'code',
        'label',
        'expires_at',
        'is_used',
        'used_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at'    => 'datetime',
        'is_used'    => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function humanCase(): BelongsTo
    {
        return $this->belongsTo(HumanCase::class, 'human_case_id');
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isValid(): bool
    {
        return ! $this->is_used && ! $this->isExpired();
    }
}
