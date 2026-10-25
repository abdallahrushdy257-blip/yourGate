<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Interest extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $fillable = [
        'store_id',
        'name',
        'description',
    ];

    public function donors(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Donor::class);
    }
}
