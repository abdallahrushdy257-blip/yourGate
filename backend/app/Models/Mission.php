<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mission extends Model
{
    use HasFactory, BelongsToStore, SoftDeletes;

    protected $table = 'missions';

    protected $fillable = [
        'store_id',
        'mission_type',
        'title',
        'description',
        'start_date',
        'end_date',
        'status',
        'upload',
        'incharge',
    ];

    protected $casts = [
        'mission_type' => 'integer',
        'status'       => 'integer',
        'start_date'   => 'date:Y-m-d',
        'end_date'     => 'date:Y-m-d',
        'incharge'     => 'array',
    ];
}
