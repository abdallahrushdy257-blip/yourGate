<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShopTransaction extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $fillable = [
        'store_id',
        'shop_id',
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
        'amount' => 'decimal:2',
        'transaction_type' => 'integer',
        'date' => 'date',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function donor()
    {
        return $this->belongsTo(Donor::class);
    }

    public function beneficiary()
    {
        return $this->belongsTo(HumanCase::class, 'human_cases_id');
    }

    public function getTransactionTypeStringAttribute(): string
    {
        return match ($this->transaction_type) {
            1 => 'سند قبض (تبرع)',
            2 => 'سند صرف',
            default => 'حركة نقدية',
        };
    }

    public function getFormattedAmountAttribute(): string
    {
        return number_format((float) $this->amount, 2) . ' ر.س';
    }
}
