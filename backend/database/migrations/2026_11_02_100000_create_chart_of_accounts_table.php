<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chart_of_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('chart_of_accounts')->restrictOnDelete();

            $table->string('code', 30);
            $table->string('name');
            $table->string('name_en')->nullable();
            $table->unsignedTinyInteger('level')->default(1);

            // asset | liability | net_assets | revenue | expense
            $table->string('account_type', 20);
            // debit | credit
            $table->string('nature', 10);

            $table->boolean('is_payable')->default(false);   // postable (leaf) account
            $table->boolean('is_active')->default(true);
            $table->boolean('is_system')->default(false);    // seeded from the default template

            $table->decimal('opening_balance', 18, 2)->default(0);

            // 0 none | 1 operating | 2 investing | 3 financing
            $table->unsignedTinyInteger('cash_flow_type')->default(0);
            $table->string('cash_flow_assets_effect')->nullable();
            $table->string('cash_flow_liabilities_effect')->nullable();

            // Fixed-asset depreciation settings
            $table->decimal('scrap_value', 18, 2)->nullable();
            $table->unsignedSmallInteger('useful_life')->nullable();

            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['store_id', 'code']);
            $table->index(['store_id', 'parent_id']);
            $table->index(['store_id', 'account_type']);
            $table->index(['store_id', 'is_payable']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chart_of_accounts');
    }
};
