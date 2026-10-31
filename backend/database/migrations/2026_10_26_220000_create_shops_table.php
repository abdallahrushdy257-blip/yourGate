<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('human_cases_id')->nullable()->constrained('human_cases')->nullOnDelete();
            $table->string('title');
            $table->string('casetype')->nullable();
            $table->string('subcasetype')->nullable();
            $table->string('other_category')->nullable();
            $table->boolean('is_assets_selected')->default(false);
            $table->integer('number_of_assets')->default(0);
            $table->decimal('cost_per_asset', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->decimal('amount', 12, 2)->default(0);
            $table->unsignedTinyInteger('status')->default(0); // 0: Active / Incomplete, 1: Completed / Closed
            $table->date('dateoflaunch')->nullable();
            $table->date('dateofcompletion')->nullable();
            $table->unsignedTinyInteger('marketingmethod')->default(0); // 1: Donors, 2: Gov Platforms, 3: Assoc Stores
            $table->text('description')->nullable();
            $table->text('description2')->nullable();
            $table->string('accounttree')->nullable();
            $table->string('document')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['store_id', 'status']);
            $table->index(['store_id', 'marketingmethod']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shops');
    }
};
