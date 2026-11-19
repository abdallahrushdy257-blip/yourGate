<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Loan extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $guarded = ['id'];

    protected $casts = [
        'amount'      => 'float',
        'paid_amount' => 'float',
        'priority'    => 'integer',
        'loancount'   => 'integer',
        'status'      => 'integer',
        'followups'   => 'array',
        'payments'    => 'array',
        'feasibility' => 'array',
    ];

    public function humanCase()
    {
        return $this->belongsTo(HumanCase::class, 'humancase_id');
    }

    public function warrantor()
    {
        return $this->belongsTo(Warrantor::class, 'warrantor_id');
    }

    public function responsibleUser()
    {
        return $this->belongsTo(Employee::class, 'user_id');
    }
}
