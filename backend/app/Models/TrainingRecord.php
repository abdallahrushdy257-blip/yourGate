<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TrainingRecord extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $guarded = ['id'];

    protected $casts = [
        'hours' => 'float',
        'type'  => 'integer',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
}
