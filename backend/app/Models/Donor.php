<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Donor extends Model
{
    use HasFactory, SoftDeletes, BelongsToStore;

    protected $fillable = [
        'store_id',
        'interest_id',
        'name',
        'address',
        'phone',
        'email',
        'type',
        'identification_number',
        'identification_description',
    ];

    protected $appends = [
        'type_string',
    ];

    /**
     * Relationship with the Interest model.
     */
    public function interest(): BelongsTo
    {
        return $this->belongsTo(Interest::class);
    }

    /**
     * Map type code to human-readable Arabic string.
     */
    public function getTypeStringAttribute(): string
    {
        return match ((string) $this->type) {
            '1' => 'أفراد',
            '2' => 'مؤسسة أهلية',
            '3' => 'مؤسسة تجارية',
            '4' => 'منصة حكومية',
            default => (string) ($this->type ?? ''),
        };
    }
}
