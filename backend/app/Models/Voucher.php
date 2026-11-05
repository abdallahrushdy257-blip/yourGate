<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Voucher extends Model
{
    use HasFactory, BelongsToStore, SoftDeletes;

    protected $fillable = [
        'store_id',
        'voucher_number',
        'voucher_type',
        'payment_method',
        'date',
        'amount',
        'debit_account_id',
        'credit_account_id',
        'description',
        'category',
        'status',
        'journal_entry_id',
        'created_by',
    ];

    protected $casts = [
        'date'   => 'date:Y-m-d',
        'amount' => 'decimal:2',
    ];

    public function debitAccount(): BelongsTo
    {
        return $this->belongsTo(ChartOfAccount::class, 'debit_account_id');
    }

    public function creditAccount(): BelongsTo
    {
        return $this->belongsTo(ChartOfAccount::class, 'credit_account_id');
    }

    public function journalEntry(): BelongsTo
    {
        return $this->belongsTo(JournalEntry::class, 'journal_entry_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
