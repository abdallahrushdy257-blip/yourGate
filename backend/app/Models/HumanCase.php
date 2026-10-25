<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HumanCase extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $fillable = [
        'store_id',
        'name',
        'gender',
        'dob',
        'humancasetype',
        'status',
        'nationality',
        'familycount',
        'phonenum',
        'email',
        'accnumber',
        'idnumber',
        'idsource',
        'iddate',
        'note',
        'details',
    ];

    protected $casts = [
        'dob'         => 'date',
        'iddate'      => 'date',
        'familycount' => 'integer',
        'details'     => 'array',
    ];

    protected $appends = [
        'gender_string',
        'status_string',
        'dateofbirth',
    ];

    /**
     * Map gender code to human-readable string.
     */
    public function getGenderStringAttribute(): string
    {
        return match ((string) $this->gender) {
            '0'     => 'ذكر',
            '1'     => 'أنثى',
            default => (string) ($this->gender ?? ''),
        };
    }

    /**
     * Map status code to human-readable string.
     */
    public function getStatusStringAttribute(): string
    {
        return match ((string) $this->status) {
            '1'     => 'موافقة',
            '2'     => 'معلق',
            '3'     => 'مرفوض',
            default => (string) ($this->status ?? 'موافقة'),
        };
    }

    /**
     * Format date of birth.
     */
    public function getDateofbirthAttribute(): string
    {
        return $this->dob?->format('Y-m-d') ?? '';
    }
}
