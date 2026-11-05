<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class VacationRequest extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $table = 'vacation_requests';

    protected $fillable = [
        'store_id',
        'employee_id',
        'vacation_id',
        'description',
        'from',
        'to',
        'status',
        'file_path',
    ];

    protected $casts = [
        'employee_id' => 'integer',
        'vacation_id' => 'integer',
        'from'        => 'date',
        'to'          => 'date',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function vacation(): BelongsTo
    {
        return $this->belongsTo(Vacation::class, 'vacation_id');
    }
}
