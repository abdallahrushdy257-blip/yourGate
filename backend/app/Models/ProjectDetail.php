<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class ProjectDetail extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $table = 'project_details';

    protected $fillable = [
        'store_id',
        'project_id',
        'type',
        'description',
        'note',
        'upload',
        'upload2',
        'status',
    ];

    protected $casts = [
        'type' => 'integer',
    ];

    protected $appends = [
        'upload_url',
        'upload2_url',
        'type_string',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function getUploadUrlAttribute(): ?string
    {
        if (! $this->upload) {
            return null;
        }

        return filter_var($this->upload, FILTER_VALIDATE_URL)
            ? $this->upload
            : Storage::disk('public')->url($this->upload);
    }

    public function getUpload2UrlAttribute(): ?string
    {
        if (! $this->upload2) {
            return null;
        }

        return filter_var($this->upload2, FILTER_VALIDATE_URL)
            ? $this->upload2
            : Storage::disk('public')->url($this->upload2);
    }

    public function getTypeStringAttribute(): string
    {
        return (int) $this->type === 1 ? 'طلب تصميم' : 'طلب تسويق وإدارة';
    }
}
