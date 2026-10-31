<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Committee extends Model
{
    use HasFactory, BelongsToStore;

    protected $table = 'committees';

    protected $fillable = [
        'store_id',
        'name',
        'description',
    ];

    public function members(): HasMany
    {
        return $this->hasMany(CommitteeMember::class, 'committee_id');
    }
}
