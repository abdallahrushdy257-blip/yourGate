<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attendance extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $table = 'attendances';

    protected $fillable = [
        'store_id',
        'employee_id',
        'date',
        'check_in',
        'check_out',
        'method',
        'status',
        'notes',
    ];

    protected $casts = [
        'employee_id' => 'integer',
        'date'        => 'date',
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
