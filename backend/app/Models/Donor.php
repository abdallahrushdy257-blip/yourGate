<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Donor extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $fillable = [
        'store_id',
        'interest_id',
        'name',
        'address',
        'phone',
        'email',
        'type',
        'identification_number',
        'identification_description',
    ];

    protected $appends = [
        'type_string',
    ];

    /**
     * Relationship with the Interest model.
     */
    public function interest(): BelongsTo
    {
        return $this->belongsTo(Interest::class);
    }

    /**
     * Relationship with Shop transactions (donations / receipts).
     */
    public function shopTransactions(): HasMany
    {
        return $this->hasMany(ShopTransaction::class);
    }

    /**
     * Relationship with Project transactions.
     */
    public function projectTransactions(): HasMany
    {
        return $this->hasMany(ProjectTransaction::class);
    }

    /**
     * Check if the donor has any financial movements or transactions.
     */
    public function hasTransactions(): bool
    {
        return $this->shopTransactions()->exists()
            || $this->projectTransactions()->exists()
            || JournalEntry::where('reference_type', 'donor_receipt')->where('reference_id', $this->id)->exists();
    }

    /**
     * Map type code to human-readable Arabic string.
     */
    public function getTypeStringAttribute(): string
    {
        return match ((string) $this->type) {
            '1' => 'أفراد',
            '2' => 'مؤسسة أهلية',
            '3' => 'مؤسسة تجارية',
            '4' => 'منصة حكومية',
            default => (string) ($this->type ?? ''),
        };
    }
}
