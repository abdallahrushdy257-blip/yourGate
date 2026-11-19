<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrintSetting extends Model
{
    use HasFactory, BelongsToStore;

    protected $guarded = ['id'];

    protected $casts = [
        'settings' => 'array',
    ];
}
