<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class ShopDetail extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $fillable = [
        'store_id',
        'shop_id',
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

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function getTypeStringAttribute(): string
    {
        return match ($this->type) {
            1 => 'طلب تصميم',
            2 => 'طلب تسويق',
            default => 'طلب إدارة',
        };
    }

    public function getUploadUrlAttribute(): ?string
    {
        return $this->upload ? Storage::url($this->upload) : null;
    }

    public function getUpload2UrlAttribute(): ?string
    {
        return $this->upload2 ? Storage::url($this->upload2) : null;
    }
}
