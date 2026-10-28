<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectKpi extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $fillable = [
        'store_id',
        'project_id',
        'kpi_id',
        'quiz',
        'target',
        'actual',
        'status',
    ];

    protected $casts = [
        'target' => 'decimal:2',
        'actual' => 'decimal:2',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
