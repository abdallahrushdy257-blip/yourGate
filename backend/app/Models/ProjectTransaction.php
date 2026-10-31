<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectTransaction extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $table = 'project_transactions';

    protected $fillable = [
        'store_id',
        'project_id',
        'donor_id',
        'human_cases_id',
        'invoice_number',
        'transaction_type',
        'type',
        'amount',
        'date',
        'account',
        'balanceid',
        'notes',
    ];

    protected $casts = [
        'transaction_type' => 'integer',
        'amount'           => 'decimal:2',
        'date'             => 'date:Y-m-d',
    ];

    protected $appends = [
        'transaction_type_string',
        'formatted_amount',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function donor(): BelongsTo
    {
        return $this->belongsTo(Donor::class);
    }

    public function beneficiary(): BelongsTo
    {
        return $this->belongsTo(HumanCase::class, 'human_cases_id');
    }

    public function getTransactionTypeStringAttribute(): string
    {
        return match ((int) $this->transaction_type) {
            1 => 'سند قبض / تبرع',
            2 => 'سند صرف / مدفوعات',
            default => 'حركة مالية',
        };
    }

    public function getFormattedAmountAttribute(): string
    {
        return number_format((float) $this->amount, 2) . ' ر.س';
    }
}
