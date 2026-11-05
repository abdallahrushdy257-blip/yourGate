<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalaryAction extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $table = 'salary_actions';

    protected $fillable = [
        'store_id',
        'employee_id',
        'type',
        'reason',
        'amounttype',
        'amount',
        'date',
        'description',
        'component',
    ];

    protected $casts = [
        'employee_id' => 'integer',
        'type'        => 'integer',
        'amounttype'  => 'integer',
        'amount'      => 'float',
        'date'        => 'date:Y-m-d',
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
