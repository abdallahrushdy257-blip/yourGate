<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectRiskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                     => $this->id,
            'store_id'               => $this->store_id,
            'project_id'             => $this->project_id,
            'phase_id'               => $this->phase_id,
            'phase_name'             => $this->phase_name,
            'description'            => $this->description,
            'impactlevel'            => (int) $this->impactlevel,
            'probability'            => (int) $this->probability,
            'impact_level_string'    => $this->impact_level_string,
            'probability_string'     => $this->probability_string,
            'status'                 => $this->status ?: 'مفتوح',
            'status_string'          => $this->status_string,
            'action_plan'            => $this->action_plan,
            'responsible_person'     => $this->responsible_person,
            'mitigation_description' => $this->mitigation_description,
            'mitigation_impactlevel' => $this->mitigation_impactlevel,
            'mitigation_probability' => $this->mitigation_probability,
            'mitigation_status'      => $this->mitigation_status,
            // Aliases for RiskAssessmentReport.js:
            'risk_phase'             => $this->phase_name ?: 'المشروع ككل',
            'risk_description'       => $this->description ?: 'لا يوجد وصف متاح',
            'risk_probability'       => $this->probability_string ?: 'متوسط',
            'risk_impact'            => $this->impact_level_string ?: 'متوسط',
            'risk_status'            => $this->status ?: 'مفتوح',
            'risk_impact_level'      => ((int) $this->impactlevel > 0) ? (int) $this->impactlevel : 2,
            'risk_probability_level' => ((int) $this->probability > 0) ? (int) $this->probability : 2,
            'mitigation_probability' => $this->mitigation_probability_string ?: 'لم يحدد',
            'mitigation_impact'      => $this->mitigation_impact ?: 'لم يحدد',
            'mitigation_description' => $this->mitigation_description ?: $this->action_plan ?: 'لم يتم تسجيل خطة تخفيف بعد',
            'mitigation_status'      => $this->mitigation_status ?: ($this->mitigation_description ? 'قيد المعالجة' : 'بانتظار المعالجة'),
            'created_at'             => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
