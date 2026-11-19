<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vendor extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $fillable = [
        'store_id',
        'name',
        'email',
        'phone',
        'address',
        'region',
        'description',
        'identification_number',
        'identification_description',
        'type',
        'opening_balance',
    ];

    protected $casts = [
        'opening_balance' => 'decimal:2',
    ];

    protected $appends = [
        'type_string',
    ];

    /**
     * Check if the vendor has any financial movements, transactions, or non-zero opening balance.
     */
    public function hasTransactions(): bool
    {
        // 1. Non-zero opening balance
        if (abs((float) ($this->opening_balance ?? 0)) > 0) {
            return true;
        }

        // 2. Direct journal entry references
        if (JournalEntry::where('reference_type', 'vendor')->where('reference_id', $this->id)->exists()) {
            return true;
        }

        // 3. Vouchers referencing this vendor (by description or column if exists)
        if (\Illuminate\Support\Facades\Schema::hasColumn('vouchers', 'vendor_id')) {
            if (\App\Models\Voucher::where('vendor_id', $this->id)->exists()) {
                return true;
            }
        }

        if (\App\Models\Voucher::where('description', 'like', "%{$this->name}%")->exists()) {
            return true;
        }

        return false;
    }

    /**
     * Map vendor type code to human-readable Arabic string.
     */
    public function getTypeStringAttribute(): string
    {
        return match ((string) $this->type) {
            '1' => 'داخلي',
            '2' => 'خارجي',
            default => (string) ($this->type ?? ''),
        };
    }
}
