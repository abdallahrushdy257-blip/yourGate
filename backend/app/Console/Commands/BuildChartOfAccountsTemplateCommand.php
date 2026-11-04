<?php

namespace App\Console\Commands;

use App\Services\Accounting\ChartOfAccountTemplateService;
use Illuminate\Console\Command;

class BuildChartOfAccountsTemplateCommand extends Command
{
    protected $signature = 'accounts:template
                            {path : Path to the source .xlsx file}
                            {--exclude=* : Account codes to exclude from the template}';

    protected $description = 'Convert a chart-of-accounts Excel sheet into the default JSON template (database/data/chart_of_accounts.json)';

    public function handle(ChartOfAccountTemplateService $templates): int
    {
        $result   = $templates->parseExcel($this->argument('path'));
        $excluded = array_map('strval', $this->option('exclude'));
        $rows     = array_values(array_filter($result['rows'], fn ($r) => ! in_array($r['code'], $excluded, true)));

        foreach ($result['warnings'] as $warning) {
            $this->warn($warning);
        }

        $path = $templates->writeTemplate($rows);
        $this->info(count($rows) . " accounts written to {$path}");

        return self::SUCCESS;
    }
}
