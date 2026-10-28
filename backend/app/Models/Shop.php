<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Shop extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $table = 'shops';

    protected $fillable = [
        'store_id',
        'human_cases_id',
        'title',
        'casetype',
        'subcasetype',
        'other_category',
        'is_assets_selected',
        'number_of_assets',
        'cost_per_asset',
        'total',
        'amount',
        'status',
        'dateoflaunch',
        'dateofcompletion',
        'marketingmethod',
        'description',
        'description2',
        'accounttree',
        'document',
    ];

    protected $casts = [
        'is_assets_selected' => 'boolean',
        'number_of_assets'   => 'integer',
        'cost_per_asset'     => 'decimal:2',
        'total'              => 'decimal:2',
        'amount'             => 'decimal:2',
        'status'             => 'integer',
        'dateoflaunch'       => 'date:Y-m-d',
        'dateofcompletion'   => 'date:Y-m-d',
        'marketingmethod'    => 'integer',
    ];

    protected $appends = [
        'marketingmethod_string',
        'status_string',
        'document_url',
        'percentage',
        'remaining',
        'paid_amount',
        'net_balance',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function beneficiary(): BelongsTo
    {
        return $this->belongsTo(HumanCase::class, 'human_cases_id');
    }

    public function transactions()
    {
        return $this->hasMany(ShopTransaction::class);
    }

    public function details()
    {
        return $this->hasMany(ShopDetail::class);
    }

    public function ads()
    {
        return $this->hasMany(Ad::class);
    }

    public function getMarketingmethodStringAttribute(): string
    {
        return match ((int) $this->marketingmethod) {
            1 => 'المانحين',
            2 => 'المنصات الحكومية',
            3 => 'متاجر الجمعيات',
            default => 'غير محدد',
        };
    }

    public function getStatusStringAttribute(): string
    {
        return (int) $this->status === 1 ? 'مكتمل' : 'غير مكتمل';
    }

    public function getDocumentUrlAttribute(): ?string
    {
        if (! $this->document) {
            return null;
        }

        return filter_var($this->document, FILTER_VALIDATE_URL)
            ? $this->document
            : Storage::disk('public')->url($this->document);
    }

    public function getPercentageAttribute(): float
    {
        if ($this->total <= 0) {
            return 0.0;
        }

        return round(min(100, max(0, ($this->amount / $this->total) * 100)), 1);
    }

    public function getRemainingAttribute(): float
    {
        return (float) max(0, $this->total - $this->amount);
    }

    public function getPaidAmountAttribute(): float
    {
        if ($this->relationLoaded('transactions')) {
            return (float) $this->transactions->where('transaction_type', 2)->sum('amount');
        }

        return (float) $this->transactions()->where('transaction_type', 2)->sum('amount');
    }

    public function getNetBalanceAttribute(): float
    {
        return (float) max(0, $this->amount - $this->paid_amount);
    }
}
