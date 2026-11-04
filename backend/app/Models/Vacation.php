<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vacation extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $table = 'vacations';

    protected $fillable = [
        'store_id',
        'name',
        'description',
        'days',
    ];

    protected $casts = [
        'days' => 'integer',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function requests(): HasMany
    {
        return $this->hasMany(VacationRequest::class, 'vacation_id');
    }
}
