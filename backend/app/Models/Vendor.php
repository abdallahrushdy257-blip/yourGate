<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vendor extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $fillable = [
        'store_id',
        'name',
        'email',
        'phone',
        'address',
        'region',
        'description',
        'identification_number',
        'identification_description',
        'type',
    ];

    protected $appends = [
        'type_string',
    ];

    /**
     * Map vendor type code to human-readable Arabic string.
     */
    public function getTypeStringAttribute(): string
    {
        return match ((string) $this->type) {
            '1' => 'داخلي',
            '2' => 'خارجي',
            default => (string) ($this->type ?? ''),
        };
    }
}
