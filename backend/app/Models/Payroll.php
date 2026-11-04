<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payroll extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $table = 'payrolls';

    protected $fillable = [
        'store_id',
        'employee_id',
        'year',
        'month',
        'basic_salary',
        'allowance',
        'additions',
        'deductions',
        'absence',
        'investigations',
        'social_insurance',
        'net_salary',
        'status',
        'payment_date',
        'notes',
    ];

    protected $casts = [
        'employee_id'      => 'integer',
        'year'             => 'integer',
        'month'            => 'integer',
        'basic_salary'     => 'float',
        'allowance'        => 'float',
        'additions'        => 'float',
        'deductions'       => 'float',
        'absence'          => 'float',
        'investigations'   => 'float',
        'social_insurance' => 'float',
        'net_salary'       => 'float',
        'payment_date'     => 'date:Y-m-d',
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
