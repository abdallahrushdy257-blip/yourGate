<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmployeeWithdrawal extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $table = 'employee_withdrawals';

    protected $fillable = [
        'store_id',
        'employee_id',
        'account_id',
        'account_name',
        'amount',
        'date',
        'time',
        'withdrawal_date',
        'status',
        'description',
    ];

    protected $casts = [
        'employee_id'     => 'integer',
        'account_id'      => 'integer',
        'amount'          => 'float',
        'date'            => 'date',
        'withdrawal_date' => 'date',
        'status'          => 'integer',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
