<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectUpload extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $fillable = [
        'store_id',
        'project_id',
        'description',
        'upload',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function getUploadUrlAttribute(): ?string
    {
        if (! $this->upload) {
            return null;
        }

        if (str_starts_with($this->upload, 'http://') || str_starts_with($this->upload, 'https://')) {
            return $this->upload;
        }

        return url('storage/' . ltrim($this->upload, '/'));
    }
}
