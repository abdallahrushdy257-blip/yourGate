<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class KsaAssessment extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $guarded = ['id'];

    protected $casts = [
        'knowledge_score' => 'float',
        'skills_score'    => 'float',
        'attitude_score'  => 'float',
        'total_score'     => 'float',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function assessor()
    {
        return $this->belongsTo(Employee::class, 'assessor_id');
    }
}
