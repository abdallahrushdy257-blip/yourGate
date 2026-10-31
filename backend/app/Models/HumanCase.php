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
        'case_status',
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
        'social_status_string',
        'case_status',
        'case_status_string',
        'case_status_code',
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
     * Map social status (الحالة الإجتماعية) based on gender.
     */
    public function getSocialStatusStringAttribute(): string
    {
        $val = trim((string) ($this->status ?? '1'));
        $isFemale = ((string) $this->gender === '1' || strtolower((string) $this->gender) === 'female' || $this->gender === 'أنثى');

        return match ($val) {
            '1', 'أعزب', 'عزباء'   => $isFemale ? 'عزباء' : 'أعزب',
            '2', 'متزوج', 'متزوجة' => $isFemale ? 'متزوجة' : 'متزوج',
            '3', 'مطلق', 'مطلقة'   => $isFemale ? 'مطلقة' : 'مطلق',
            '4', 'أرمل', 'أرملة'   => $isFemale ? 'أرملة' : 'أرمل',
            '200'                  => $isFemale ? 'متزوجة' : 'متزوج',
            default                => $isFemale ? 'عزباء' : 'أعزب',
        };
    }

    /**
     * Map case study decision (دراسة الحالة / قرار الاعتماد).
     */
    public function getCaseStatusStringAttribute(): string
    {
        $val = trim((string) ($this->attributes['case_status'] ?? 'موافقة'));

        return match ($val) {
            '1', 'pending', 'معلق', 'قيد المراجعة'    => 'معلق',
            '2', 'approved', 'موافقة', 'مقبول', '200' => 'موافقة',
            '3', 'rejected', 'مرفوض', 'رفض', 'مستبعد' => 'مرفوض',
            default                                   => ($val !== '' && !is_numeric($val)) ? $val : 'موافقة',
        };
    }

    /**
     * Get numeric code for case study decision (1: معلق, 2: موافقة, 3: مرفوض).
     */
    public function getCaseStatusCodeAttribute(): string
    {
        return match ($this->case_status_string) {
            'مرفوض' => '3',
            'معلق'  => '1',
            default => '2',
        };
    }

    /**
     * Backward-compatible status string representing social status.
     */
    public function getStatusStringAttribute(): string
    {
        return $this->social_status_string;
    }

    /**
     * Format date of birth.
     */
    public function getDateofbirthAttribute(): string
    {
        return $this->dob?->format('Y-m-d') ?? '';
    }
}
