<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $table = 'employees';

    protected $fillable = [
        'store_id',
        'name',
        'email',
        'phone',
        'nationalid',
        'idtype',
        'nationalid_expire',
        'dob',
        'gender',
        'status',
        'address',
        'nationality',
        'qualification',
        'worktype',
        'dateofhire',
        'contractexpiration',
        'job_title_id',
        'section_id',
        'iban',
        'photo',
        'is_active',
        'basic_salary',
        'social_insurance',
        'housing_allowance',
        'transport_allowance',
        'communication_allowance',
        'life_allowance',
        'work_allowance',
        'salary_account',
        'total_salary',
    ];

    protected $casts = [
        'idtype'                  => 'integer',
        'status'                  => 'integer',
        'worktype'                => 'integer',
        'job_title_id'            => 'integer',
        'section_id'              => 'integer',
        'is_active'               => 'boolean',
        'nationalid_expire'       => 'date:Y-m-d',
        'dob'                     => 'date:Y-m-d',
        'dateofhire'              => 'date:Y-m-d',
        'contractexpiration'      => 'date:Y-m-d',
        'basic_salary'            => 'float',
        'social_insurance'        => 'float',
        'housing_allowance'       => 'float',
        'transport_allowance'     => 'float',
        'communication_allowance' => 'float',
        'life_allowance'          => 'float',
        'work_allowance'          => 'float',
        'total_salary'            => 'float',
    ];

    public function jobtitle(): BelongsTo
    {
        return $this->belongsTo(JobTitle::class, 'job_title_id');
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class, 'section_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(EmployeeDocument::class);
    }

    public function getJobnameAttribute(): string
    {
        return $this->jobtitle?->title ?? 'غير محدد';
    }

    public function getPhotoUrlAttribute(): ?string
    {
        if (!$this->photo) return null;
        if (filter_var($this->photo, FILTER_VALIDATE_URL)) return $this->photo;
        return asset('storage/' . $this->photo);
    }
}
