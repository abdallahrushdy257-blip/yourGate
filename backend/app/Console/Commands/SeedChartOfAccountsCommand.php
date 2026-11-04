<?php

namespace App\Console\Commands;

use App\Models\Store;
use App\Services\Accounting\ChartOfAccountTemplateService;
use Illuminate\Console\Command;

class SeedChartOfAccountsCommand extends Command
{
    protected $signature = 'accounts:seed
                            {--store=* : Store ID(s) to seed}
                            {--all : Seed every store}';

    protected $description = 'Seed the default chart of accounts into store(s). Idempotent: only missing accounts are added.';

    public function handle(ChartOfAccountTemplateService $templates): int
    {
        $ids = $this->option('store');

        if (! $this->option('all') && empty($ids)) {
            $this->error('Specify --store=ID or --all.');

            return self::INVALID;
        }

        $stores = $this->option('all')
            ? Store::query()->get(['id', 'name'])
            : Store::query()->whereIn('id', $ids)->get(['id', 'name']);

        if ($stores->isEmpty()) {
            $this->warn('No stores found.');

            return self::SUCCESS;
        }

        $template = $templates->loadTemplate();

        foreach ($stores as $store) {
            $created = $templates->seedForStore($store->id, $template);
            $this->line("Store #{$store->id} ({$store->name}): <info>{$created}</info> accounts added.");
        }

        return self::SUCCESS;
    }
}
