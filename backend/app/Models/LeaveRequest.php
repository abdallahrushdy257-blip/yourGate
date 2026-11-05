<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class LeaveRequest extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $table = 'leave_requests';

    protected $fillable = [
        'store_id',
        'employee_id',
        'date',
        'from_time',
        'to_time',
        'hours',
        'note',
        'status',
        'file_path',
    ];

    protected $casts = [
        'employee_id' => 'integer',
        'date'        => 'date',
        'hours'       => 'float',
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
