<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MinuteSheet extends Model
{
    use HasFactory, BelongsToStore;

    protected $table = 'minute_sheets';

    protected $fillable = [
        'store_id',
        'title',
        'date',
        'type',
        'reason',
        'note',
        'upload',
    ];

    protected $casts = [
        'date'   => 'date',
        'type'   => 'integer',
        'reason' => 'integer',
    ];

    protected $appends = [
        'type_string',
        'reason_string',
        'upload_url',
    ];

    public function attendees(): HasMany
    {
        return $this->hasMany(MinuteSheetAttendee::class, 'minute_sheet_id');
    }

    public function getTypeStringAttribute(): string
    {
        return match ((int) $this->type) {
            1 => 'جمعية عمومية',
            2 => 'مجلس إدارة',
            default => (string) ($this->type ?? ''),
        };
    }

    public function getReasonStringAttribute(): string
    {
        return match ((int) $this->reason) {
            1 => 'عادية',
            2 => 'غير عادية',
            3 => 'دوري',
            4 => 'طارئة',
            5 => 'لجان',
            default => (string) ($this->reason ?? ''),
        };
    }

    public function getUploadUrlAttribute(): ?string
    {
        if (empty($this->upload)) {
            return null;
        }

        if (str_starts_with($this->upload, 'http://') || str_starts_with($this->upload, 'https://')) {
            return $this->upload;
        }

        return asset('storage/' . ltrim($this->upload, '/'));
    }
}
