<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectPaymentReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $vouchers = $this->relationLoaded('transactions')
            ? $this->transactions->where('transaction_type', 2)
            : $this->transactions()->where('transaction_type', 2)->get();

        $totalPaid = (float) $vouchers->sum('amount');
        $budget = (float) $this->total;
        $remainingBudget = max(0.0, $budget - $totalPaid);
        $percentage = $budget > 0 ? round(min(100, ($totalPaid / $budget) * 100), 1) : 0.0;

        return [
            'id'                  => $this->id,
            'project_id'          => $this->id,
            'name'                => $this->name,
            'project_name'        => $this->name,
            'budget'              => $budget,
            'total'               => $budget,
            'collected_amount'    => (float) $this->amount,
            'paid_amount'         => $totalPaid,
            'total_paid'          => $totalPaid,
            'amount'              => $totalPaid,
            'remaining'           => $remainingBudget,
            'paid_percentage'     => $percentage,
            'vouchers_count'      => $vouchers->count(),
            'startdate'           => $this->dateoflaunch ? $this->dateoflaunch->format('Y-m-d') : null,
            'dateoflaunch'        => $this->dateoflaunch ? $this->dateoflaunch->format('Y-m-d') : null,
            'deadline'            => $this->deadline ? $this->deadline->format('Y-m-d') : null,
            'status'              => (int) $this->status,
            'status_string'       => $this->statusstring,
            'statusstring'        => $this->statusstring,
            'marketing_method'    => $this->marketingmethodstring,
            'marketingmethodstring' => $this->marketingmethodstring,
            'created_at'          => $this->created_at ? $this->created_at->format('Y-m-d') : null,
        ];
    }
}
