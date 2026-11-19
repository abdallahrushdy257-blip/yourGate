<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Endowment extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $guarded = ['id'];

    protected $casts = [
        'amount'       => 'float',
        'paid'         => 'float',
        'remain'       => 'float',
        'annualfees'   => 'float',
        'netprofit'    => 'float',
        'status'       => 'integer',
        'transactions' => 'array',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
}
