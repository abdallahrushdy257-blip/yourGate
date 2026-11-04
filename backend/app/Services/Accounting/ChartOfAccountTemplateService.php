<?php

namespace App\Services\Accounting;

use App\Exceptions\Accounting\ChartOfAccountException;
use App\Models\ChartOfAccount;
use App\Models\Scopes\StoreScope;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use SimpleXMLElement;
use ZipArchive;

/**
 * Default chart-of-accounts template:
 *  - converts the source Excel sheet into a versioned JSON template
 *  - seeds (idempotently) the template into any store.
 */
class ChartOfAccountTemplateService
{
    /** Header text => template key */
    protected const HEADER_MAP = [
        'رقم الحساب'        => 'code',
        'اسم الحساب'        => 'name',
        'يمكن الدفع عليه'   => 'is_payable',
        'الرصيد الافتتاحي'  => 'opening_balance',
        'نوع التدفق المالي' => 'cash_flow_type',
        'الشق الأول'        => 'cash_flow_assets_effect',
        'الشق الثاني'       => 'cash_flow_liabilities_effect',
    ];

    public function templatePath(): string
    {
        return database_path('data/chart_of_accounts.json');
    }

    /**
     * Load template rows sorted so every parent precedes its children.
     */
    public function loadTemplate(?string $path = null): array
    {
        $path ??= $this->templatePath();

        if (! is_file($path)) {
            throw ChartOfAccountException::templateMissing($path);
        }

        $rows = json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

        return $this->sortByHierarchy($rows);
    }

    /**
     * Seed missing template accounts into a store. Safe to run repeatedly.
     *
     * @return int number of newly created accounts
     */
    public function seedForStore(int $storeId, ?array $template = null): int
    {
        $template ??= $this->loadTemplate();

        return DB::transaction(function () use ($storeId, $template) {
            $existing = ChartOfAccount::withoutGlobalScope(StoreScope::class)
                ->where('store_id', $storeId)
                ->get(['id', 'code', 'level']);

            $ids    = $existing->pluck('id', 'code')->all();
            $levels = $existing->pluck('level', 'code')->all();
            $now    = now();
            $created = 0;

            $rows = array_merge(
                array_map(fn ($r) => $r + ['is_payable' => false], ChartOfAccount::ROOT_ACCOUNTS),
                $template
            );

            foreach ($rows as $row) {
                $code = (string) $row['code'];
                if (isset($ids[$code])) {
                    continue;
                }

                $parentCode = $this->resolveParentCode($code, $ids);
                $type       = ChartOfAccount::typeFromCode($code);

                $ids[$code] = DB::table('chart_of_accounts')->insertGetId([
                    'store_id'                     => $storeId,
                    'parent_id'                    => $parentCode ? $ids[$parentCode] : null,
                    'code'                         => $code,
                    'name'                         => $row['name'],
                    'name_en'                      => $row['name_en'] ?? null,
                    'level'                        => $levels[$code] = $parentCode ? $levels[$parentCode] + 1 : 1,
                    'account_type'                 => $type,
                    'nature'                       => ChartOfAccount::natureFromType($type),
                    'is_payable'                   => (bool) ($row['is_payable'] ?? false),
                    'is_active'                    => true,
                    'is_system'                    => true,
                    'opening_balance'              => (float) ($row['opening_balance'] ?? 0),
                    'cash_flow_type'               => (int) ($row['cash_flow_type'] ?? 0),
                    'cash_flow_assets_effect'      => $row['cash_flow_assets_effect'] ?? null,
                    'cash_flow_liabilities_effect' => $row['cash_flow_liabilities_effect'] ?? null,
                    'created_at'                   => $now,
                    'updated_at'                   => $now,
                ]);
                $created++;
            }

            $this->normalizeGroupAccounts($storeId);

            return $created;
        });
    }

    /**
     * Any account that has children is a group account and cannot be posted to.
     */
    public function normalizeGroupAccounts(int $storeId): void
    {
        $parentIds = DB::table('chart_of_accounts')
            ->where('store_id', $storeId)
            ->whereNotNull('parent_id')
            ->distinct()
            ->pluck('parent_id');

        DB::table('chart_of_accounts')
            ->where('store_id', $storeId)
            ->whereIn('id', $parentIds)
            ->where('is_payable', true)
            ->update(['is_payable' => false]);
    }

    /**
     * Parent = the longest existing code that is a strict prefix of $code.
     * Works with irregular code lengths found in real-world sheets.
     */
    public function resolveParentCode(string $code, array $codes): ?string
    {
        for ($len = strlen($code) - 1; $len > 0; $len--) {
            $prefix = substr($code, 0, $len);
            if (isset($codes[$prefix])) {
                return $prefix;
            }
        }

        return null;
    }

    /**
     * Convert an Excel (.xlsx) sheet to normalized template rows.
     *
     * @return array{rows: array, warnings: array}
     */
    public function parseExcel(string $path): array
    {
        $sheet = $this->readFirstSheet($path);
        if (empty($sheet)) {
            return ['rows' => [], 'warnings' => ['Sheet is empty.']];
        }

        $header  = array_shift($sheet);
        $columns = $this->mapHeader($header);
        $rows = $warnings = $seen = [];

        foreach ($sheet as $line => $cells) {
            $code = preg_replace('/\D/', '', (string) ($cells[$columns['code']] ?? ''));
            $name = trim(preg_replace('/\s+/u', ' ', (string) ($cells[$columns['name']] ?? '')));

            if ($code === '' || $name === '') {
                continue;
            }

            if (isset($seen[$code])) {
                $warnings[] = "Row " . ($line + 2) . ": duplicate code {$code} ({$name}) skipped; first is ({$seen[$code]}).";
                continue;
            }
            $seen[$code] = $name;

            $rows[] = [
                'code'                         => $code,
                'name'                         => $name,
                'is_payable'                   => trim((string) ($cells[$columns['is_payable']] ?? '')) === 'نعم',
                'opening_balance'              => (float) ($cells[$columns['opening_balance']] ?? 0),
                'cash_flow_type'               => $this->mapCashFlow((string) ($cells[$columns['cash_flow_type']] ?? '')),
                'cash_flow_assets_effect'      => $this->nullableText($cells[$columns['cash_flow_assets_effect']] ?? null),
                'cash_flow_liabilities_effect' => $this->nullableText($cells[$columns['cash_flow_liabilities_effect']] ?? null),
            ];
        }

        return ['rows' => $this->sortByHierarchy($rows), 'warnings' => $warnings];
    }

    public function writeTemplate(array $rows, ?string $path = null): string
    {
        $path ??= $this->templatePath();
        if (! is_dir(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        $lines = array_map(
            fn ($row) => '    ' . json_encode($row, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            array_values($rows)
        );

        file_put_contents($path, "[\n" . implode(",\n", $lines) . "\n]\n");

        return $path;
    }

    protected function sortByHierarchy(array $rows): array
    {
        usort($rows, fn ($a, $b) => [strlen((string) $a['code']), (string) $a['code']] <=> [strlen((string) $b['code']), (string) $b['code']]);

        return $rows;
    }

    protected function mapCashFlow(string $value): int
    {
        return match (true) {
            str_contains($value, 'تشغيل')                                    => ChartOfAccount::CASH_FLOW_OPERATING,
            str_contains($value, 'ستثمار') || str_contains($value, 'سثمار') => ChartOfAccount::CASH_FLOW_INVESTING,
            str_contains($value, 'تمويل')                                    => ChartOfAccount::CASH_FLOW_FINANCING,
            default                                                          => ChartOfAccount::CASH_FLOW_NONE,
        };
    }

    protected function nullableText(mixed $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }

    /**
     * @return array<string,string> template key => column letter
     */
    protected function mapHeader(array $header): array
    {
        $map      = [];
        $defaults = ['code' => 'A', 'name' => 'B', 'is_payable' => 'C', 'opening_balance' => 'D', 'cash_flow_type' => 'E', 'cash_flow_assets_effect' => 'F', 'cash_flow_liabilities_effect' => 'G'];

        foreach ($header as $col => $text) {
            foreach (self::HEADER_MAP as $needle => $key) {
                if (! isset($map[$key]) && str_contains(trim((string) $text), $needle)) {
                    $map[$key] = $col;
                }
            }
        }

        return $map + $defaults;
    }

    /**
     * Minimal dependency-free xlsx reader (first worksheet).
     *
     * @return array<int, array<string,string>> rows of [columnLetter => value]
     */
    protected function readFirstSheet(string $path): array
    {
        if (! is_file($path)) {
            throw new RuntimeException("File not found: {$path}");
        }

        $zip = new ZipArchive();
        if ($zip->open($path) !== true) {
            throw new RuntimeException("Unable to open xlsx: {$path}");
        }

        $shared = [];
        if (($xml = $zip->getFromName('xl/sharedStrings.xml')) !== false) {
            foreach ((new SimpleXMLElement($xml))->si as $si) {
                $shared[] = $this->inlineText($si);
            }
        }

        $sheetXml = $zip->getFromName('xl/worksheets/sheet1.xml');
        $zip->close();

        if ($sheetXml === false) {
            throw new RuntimeException('Worksheet sheet1.xml not found.');
        }

        $rows = [];
        foreach ((new SimpleXMLElement($sheetXml))->sheetData->row as $row) {
            $cells = [];
            foreach ($row->c as $c) {
                $col  = preg_replace('/\d+/', '', (string) $c['r']);
                $type = (string) $c['t'];
                $raw  = (string) $c->v;

                $cells[$col] = match ($type) {
                    's'         => $shared[(int) $raw] ?? '',
                    'inlineStr' => $this->inlineText($c->is),
                    default     => is_numeric($raw) && stripos($raw, 'e') !== false ? sprintf('%.0f', (float) $raw) : $raw,
                };
            }
            $rows[] = $cells;
        }

        return $rows;
    }

    protected function inlineText(SimpleXMLElement $node): string
    {
        if (isset($node->t)) {
            return (string) $node->t;
        }

        $text = '';
        foreach ($node->r as $run) {
            $text .= (string) $run->t;
        }

        return $text;
    }
}
