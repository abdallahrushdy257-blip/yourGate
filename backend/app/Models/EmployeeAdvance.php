<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmployeeAdvance extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $table = 'employee_advances';

    protected $fillable = [
        'store_id',
        'employee_id',
        'payment_account_id',
        'amount',
        'months',
        'monthly_amount',
        'start_date',
        'end_date',
        'notes',
        'status',
    ];

    protected $casts = [
        'employee_id'        => 'integer',
        'payment_account_id' => 'integer',
        'amount'             => 'float',
        'months'             => 'integer',
        'monthly_amount'     => 'float',
        'start_date'         => 'date:Y-m-d',
        'end_date'           => 'date:Y-m-d',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function installments(): HasMany
    {
        return $this->hasMany(EmployeeAdvanceInstallment::class, 'employee_advance_id')->orderBy('installment_number', 'asc');
    }
}
