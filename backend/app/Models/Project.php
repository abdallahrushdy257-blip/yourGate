<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Project extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $table = 'projects';

    protected $fillable = [
        'store_id',
        'name',
        'description',
        'total',
        'amount',
        'dateoflaunch',
        'deadline',
        'marketingmethod',
        'accounttree',
        'attachment',
        'status',
    ];

    protected $casts = [
        'total'           => 'decimal:2',
        'amount'          => 'decimal:2',
        'dateoflaunch'    => 'date:Y-m-d',
        'deadline'        => 'date:Y-m-d',
        'marketingmethod' => 'integer',
        'status'          => 'integer',
    ];

    protected $appends = [
        'budget',
        'startdate',
        'marketingmethodstring',
        'statusstring',
        'attachment_url',
        'percentage',
        'paid_amount',
        'net_balance',
        'remaining',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(ProjectTransaction::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(ProjectDetail::class);
    }

    public function phases(): HasMany
    {
        return $this->hasMany(ProjectPhase::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(ProjectAssignment::class);
    }

    public function kpis(): HasMany
    {
        return $this->hasMany(ProjectKpi::class);
    }

    public function uploads(): HasMany
    {
        return $this->hasMany(ProjectUpload::class);
    }

    public function risks(): HasMany
    {
        return $this->hasMany(ProjectRisk::class);
    }

    public function getBudgetAttribute(): float
    {
        return (float) $this->total;
    }

    public function getStartdateAttribute(): ?string
    {
        return $this->dateoflaunch ? $this->dateoflaunch->format('Y-m-d') : null;
    }

    public function getMarketingmethodstringAttribute(): string
    {
        return match ((int) $this->marketingmethod) {
            1 => 'المانحون',
            2 => 'المنصات الحكومية',
            3 => 'متاجر الجمعيات',
            default => 'غير محدد',
        };
    }

    public function getStatusstringAttribute(): string
    {
        return match ((int) $this->status) {
            2 => 'مكتمل',
            3 => 'ملغي',
            default => 'قيد التنفيذ',
        };
    }

    public function getAttachmentUrlAttribute(): ?string
    {
        if (! $this->attachment) {
            return null;
        }

        return filter_var($this->attachment, FILTER_VALIDATE_URL)
            ? $this->attachment
            : Storage::disk('public')->url($this->attachment);
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
