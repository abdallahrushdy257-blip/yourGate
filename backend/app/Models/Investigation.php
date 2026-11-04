<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Investigation extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $table = 'investigations';

    protected $fillable = [
        'store_id',
        'employee_id',
        'investigator_id',
        'reason',
        'result',
        'date',
        'description',
        'attachment',
    ];

    protected $casts = [
        'employee_id'     => 'integer',
        'investigator_id' => 'integer',
        'date'            => 'date:Y-m-d',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function investigator(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'investigator_id');
    }
}
