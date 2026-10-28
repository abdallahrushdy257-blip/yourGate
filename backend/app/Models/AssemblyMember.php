<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssemblyMember extends Model
{
    use HasFactory, BelongsToStore;

    protected $table = 'assembly_members';

    protected $fillable = [
        'store_id',
        'membership_serial',
        'name',
        'dateofbirth',
        'nationalid',
        'nationalid_expire',
        'start_subscription_date',
        'end_subscription_date',
        'status',
        'subscription_type',
        'start_membership_date',
        'job',
        'jobaddress',
        'subscription_fees',
        'notes',
        'upload',
    ];

    protected $casts = [
        'dateofbirth'             => 'date',
        'nationalid_expire'       => 'date',
        'start_subscription_date' => 'date',
        'end_subscription_date'   => 'date',
        'start_membership_date'   => 'date',
        'status'                  => 'integer',
        'subscription_fees'       => 'float',
    ];

    protected $appends = [
        'status_string',
        'subscription_type_string',
        'upload_url',
    ];

    protected static function booted(): void
    {
        static::creating(function (AssemblyMember $member) {
            if (empty($member->membership_serial)) {
                $maxId = static::withoutGlobalScopes()->max('id') ?? 0;
                $member->membership_serial = 'MEM-' . str_pad((string) ($maxId + 1), 4, '0', STR_PAD_LEFT);
            }
        });
    }

    public function getStatusStringAttribute(): string
    {
        return match ((int) $this->status) {
            1 => 'عضو مجلس ادارة',
            2 => 'عضو جمعية عمومية',
            default => (string) ($this->status ?? ''),
        };
    }

    public function getSubscriptionTypeStringAttribute(): string
    {
        return match ((string) $this->subscription_type) {
            '1' => 'داعمة',
            '2' => 'فخرية',
            '3' => 'عادية',
            '4' => 'عضو مجلس',
            '5' => 'رئيس مجلس',
            '6' => 'نائب رئيس',
            '7' => 'عضو لجنة',
            default => (string) ($this->subscription_type ?? ''),
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
