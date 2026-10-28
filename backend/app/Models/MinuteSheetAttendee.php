<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MinuteSheetAttendee extends Model
{
    use HasFactory, BelongsToStore;

    protected $table = 'minute_sheet_attendees';

    protected $fillable = [
        'store_id',
        'minute_sheet_id',
        'assembly_member_id',
        'committee_id',
    ];

    public function minuteSheet(): BelongsTo
    {
        return $this->belongsTo(MinuteSheet::class, 'minute_sheet_id');
    }

    public function assemblyMember(): BelongsTo
    {
        return $this->belongsTo(AssemblyMember::class, 'assembly_member_id');
    }

    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class, 'committee_id');
    }
}
