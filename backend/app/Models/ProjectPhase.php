<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectPhase extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $fillable = [
        'store_id',
        'project_id',
        'name',
        'start_date',
        'end_date',
        'priority',
        'budget',
        'status',
        'description',
        'performance_summary',
        'remaining_work',
    ];

    protected $casts = [
        'start_date' => 'date:Y-m-d',
        'end_date'   => 'date:Y-m-d',
        'budget'     => 'decimal:2',
        'status'     => 'integer',
    ];

    protected $appends = [
        'priority_string',
        'status_string',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(ProjectAssignment::class, 'phase_id');
    }

    public function risks(): HasMany
    {
        return $this->hasMany(ProjectRisk::class, 'phase_id');
    }

    public function getPriorityStringAttribute(): string
    {
        return match ((string) $this->priority) {
            '1' => 'منخفض',
            '3' => 'عالي',
            '4' => 'عاجل',
            default => 'متوسط',
        };
    }

    public function getStatusStringAttribute(): string
    {
        return match ((int) $this->status) {
            2 => 'مكتمل',
            3 => 'ملغي',
            default => 'قيد التنفيذ',
        };
    }
}
