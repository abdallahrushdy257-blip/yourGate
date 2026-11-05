<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobTitle extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $table = 'job_titles';

    protected $fillable = [
        'store_id',
        'parent_id',
        'title',
        'description',
        'note',
        'workdayspermonth',
        'workhoursperday',
    ];

    protected $casts = [
        'parent_id'        => 'integer',
        'workdayspermonth' => 'integer',
        'workhoursperday'  => 'integer',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function getNameAttribute(): string
    {
        return $this->title ?? '';
    }

    public function getDaysAttribute(): int
    {
        return (int) ($this->workdayspermonth ?? 0);
    }

    public function getHoursAttribute(): int
    {
        return (int) ($this->workhoursperday ?? 0);
    }
}
