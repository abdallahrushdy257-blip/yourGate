<?php

namespace App\Models;

use App\Traits\BelongsToStore;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChartOfAccount extends Model
{
    use BelongsToStore;

    protected $table = 'chart_of_accounts';

    public const TYPE_ASSET      = 'asset';
    public const TYPE_LIABILITY  = 'liability';
    public const TYPE_NET_ASSETS = 'net_assets';
    public const TYPE_REVENUE    = 'revenue';
    public const TYPE_EXPENSE    = 'expense';

    public const NATURE_DEBIT  = 'debit';
    public const NATURE_CREDIT = 'credit';

    public const CASH_FLOW_NONE      = 0;
    public const CASH_FLOW_OPERATING = 1;
    public const CASH_FLOW_INVESTING = 2;
    public const CASH_FLOW_FINANCING = 3;

    /** Top-level roots every store tree starts with. */
    public const ROOT_ACCOUNTS = [
        ['code' => '1', 'name' => 'الأصول', 'name_en' => 'Assets'],
        ['code' => '2', 'name' => 'الالتزامات وصافي الأصول', 'name_en' => 'Liabilities & Net Assets'],
        ['code' => '3', 'name' => 'الإيرادات والتبرعات', 'name_en' => 'Revenues & Donations'],
        ['code' => '4', 'name' => 'المصروفات', 'name_en' => 'Expenses'],
    ];

    /** Fixed-asset group prefix (depreciable accounts). */
    public const FIXED_ASSETS_PREFIX = '121';

    protected $fillable = [
        'store_id',
        'parent_id',
        'code',
        'name',
        'name_en',
        'level',
        'account_type',
        'nature',
        'is_payable',
        'is_active',
        'is_system',
        'opening_balance',
        'cash_flow_type',
        'cash_flow_assets_effect',
        'cash_flow_liabilities_effect',
        'scrap_value',
        'useful_life',
        'description',
    ];

    protected $casts = [
        'level'           => 'integer',
        'is_payable'      => 'boolean',
        'is_active'       => 'boolean',
        'is_system'       => 'boolean',
        'opening_balance' => 'decimal:2',
        'cash_flow_type'  => 'integer',
        'scrap_value'     => 'decimal:2',
        'useful_life'     => 'integer',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('code');
    }

    public function journalEntryLines(): HasMany
    {
        return $this->hasMany(JournalEntryLine::class, 'chart_of_account_id');
    }

    public function scopePostable(Builder $query): Builder
    {
        return $query->where('is_payable', true);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function isDepreciable(): bool
    {
        return str_starts_with($this->code, self::FIXED_ASSETS_PREFIX);
    }

    public static function typeFromCode(string $code): string
    {
        return match ($code[0] ?? '') {
            '1'     => self::TYPE_ASSET,
            '2'     => str_starts_with($code, '23') ? self::TYPE_NET_ASSETS : self::TYPE_LIABILITY,
            '3'     => self::TYPE_REVENUE,
            default => self::TYPE_EXPENSE,
        };
    }

    public static function natureFromType(string $type): string
    {
        return in_array($type, [self::TYPE_ASSET, self::TYPE_EXPENSE], true)
            ? self::NATURE_DEBIT
            : self::NATURE_CREDIT;
    }

    public static function cashFlowLabel(int $type): ?string
    {
        return match ($type) {
            self::CASH_FLOW_OPERATING => __('accounts.cash_flow.operating'),
            self::CASH_FLOW_INVESTING => __('accounts.cash_flow.investing'),
            self::CASH_FLOW_FINANCING => __('accounts.cash_flow.financing'),
            default                   => null,
        };
    }
}
