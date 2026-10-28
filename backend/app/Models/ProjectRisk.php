<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectRisk extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $fillable = [
        'store_id',
        'project_id',
        'phase_id',
        'description',
        'impactlevel',
        'probability',
        'status',
        'action_plan',
        'responsible_person',
        'mitigation_description',
        'mitigation_impactlevel',
        'mitigation_probability',
        'mitigation_status',
    ];

    protected $casts = [
        'impactlevel'            => 'integer',
        'probability'            => 'integer',
        'mitigation_impactlevel' => 'integer',
        'mitigation_probability' => 'integer',
    ];

    protected $appends = [
        'impact_level_string',
        'probability_string',
        'status_string',
        'phase_name',
        'mitigation_impact',
        'mitigation_probability_string',
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

    public function getImpactLevelStringAttribute(): string
    {
        return match ((int) $this->impactlevel) {
            1 => 'منخفض',
            3 => 'مرتفع',
            default => 'متوسط',
        };
    }

    public function getProbabilityStringAttribute(): string
    {
        return match ((int) $this->probability) {
            1 => 'منخفض',
            3 => 'مرتفع',
            default => 'متوسط',
        };
    }

    public function getStatusStringAttribute(): string
    {
        return $this->status ?: 'مفتوح';
    }

    public function getMitigationImpactAttribute(): string
    {
        return match ((int) $this->mitigation_impactlevel) {
            1 => 'منخفض',
            3 => 'مرتفع',
            default => $this->mitigation_impactlevel ? 'متوسط' : 'لم يحدد',
        };
    }

    public function getMitigationProbabilityStringAttribute(): string
    {
        return match ((int) $this->mitigation_probability) {
            1 => 'منخفض',
            3 => 'مرتفع',
            default => $this->mitigation_probability ? 'متوسط' : 'لم يحدد',
        };
    }
}
