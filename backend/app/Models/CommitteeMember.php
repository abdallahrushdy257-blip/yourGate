<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommitteeMember extends Model
{
    use HasFactory, BelongsToStore;

    protected $table = 'committee_members';

    protected $fillable = [
        'store_id',
        'committee_id',
        'assembly_member_id',
        'name',
        'role',
    ];

    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class, 'committee_id');
    }

    public function assemblyMember(): BelongsTo
    {
        return $this->belongsTo(AssemblyMember::class, 'assembly_member_id');
    }
}
