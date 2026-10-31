<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectAssignment extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $fillable = [
        'store_id',
        'project_id',
        'phase_id',
        'responsible_type',
        'responsible_id',
        'responsible_name',
        'role',
        'responsibility',
    ];

    protected $casts = [
        'responsible_type' => 'integer',
        'responsible_id'   => 'integer',
    ];

    protected $appends = [
        'responsible_type_string',
        'phase_name',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function phase(): BelongsTo
    {
        return $this->belongsTo(ProjectPhase::class, 'phase_id');
    }

    public function getPhaseNameAttribute(): ?string
    {
        return $this->phase?->name ?? 'المشروع ككل';
    }

    public function getResponsibleTypeStringAttribute(): string
    {
        return match ((int) $this->responsible_type) {
            2 => 'متطوع',
            default => 'موظف',
        };
    }
}
