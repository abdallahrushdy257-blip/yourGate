<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                    => $this->id,
            'store_id'              => $this->store_id,
            'name'                  => $this->name,
            'title'                 => $this->name,
            'description'           => $this->description,
            'budget'                => (float) $this->total,
            'total'                 => (float) $this->total,
            'amount'                => (float) $this->amount,
            'paid_amount'           => (float) $this->paid_amount,
            'total_paid'            => (float) $this->paid_amount,
            'net_balance'           => (float) $this->net_balance,
            'remaining'             => (float) $this->remaining,
            'startdate'             => $this->dateoflaunch ? $this->dateoflaunch->format('Y-m-d') : null,
            'dateoflaunch'          => $this->dateoflaunch ? $this->dateoflaunch->format('Y-m-d') : null,
            'deadline'              => $this->deadline ? $this->deadline->format('Y-m-d') : null,
            'marketingmethod'       => (int) $this->marketingmethod,
            'marketingmethodstring' => $this->marketingmethodstring,
            'status'                => (int) $this->status,
            'statusstring'          => $this->statusstring,
            'accounttree'           => $this->accounttree,
            'attachment'            => $this->attachment,
            'attachment_url'        => $this->attachment_url,
            'percentage'            => (float) $this->percentage,
            'created_at'            => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
            'transactions'          => ProjectTransactionResource::collection($this->whenLoaded('transactions')),
            'details'               => ProjectDetailResource::collection($this->whenLoaded('details')),
            'phases'                => ProjectPhaseResource::collection($this->whenLoaded('phases')),
            'assignments'           => ProjectAssignmentResource::collection($this->whenLoaded('assignments')),
            'kpis'                  => ProjectKpiResource::collection($this->whenLoaded('kpis')),
            'uploads'               => ProjectUploadResource::collection($this->whenLoaded('uploads')),
            'risks'                 => ProjectRiskResource::collection($this->whenLoaded('risks')),
        ];
    }
}
