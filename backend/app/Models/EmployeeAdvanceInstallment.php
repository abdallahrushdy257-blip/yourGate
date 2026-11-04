<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeAdvanceInstallment extends Model
{
    use HasFactory, BelongsToStore;

    protected $table = 'employee_advance_installments';

    protected $fillable = [
        'store_id',
        'employee_advance_id',
        'installment_number',
        'amount',
        'due_date',
        'status',
        'paid_at',
    ];

    protected $casts = [
        'employee_advance_id' => 'integer',
        'installment_number'  => 'integer',
        'amount'              => 'float',
        'due_date'            => 'date:Y-m-d',
        'paid_at'             => 'datetime',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function advance(): BelongsTo
    {
        return $this->belongsTo(EmployeeAdvance::class, 'employee_advance_id');
    }
}
