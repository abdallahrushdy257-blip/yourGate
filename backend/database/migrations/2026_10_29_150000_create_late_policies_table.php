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
        Schema::create('late_policies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->string('category', 50)->default('late'); // late, overtime, absence_without_permission
            $table->unsignedInteger('from_minute')->default(0);
            $table->unsignedInteger('to_minute')->default(0);
            $table->decimal('hour', 8, 2)->default(0);
            $table->string('type', 50)->default('day_fraction'); // day_fraction, fixed_amount
            $table->decimal('value', 12, 2)->default(0);
            $table->boolean('active')->default(true);
            $table->string('note', 500)->nullable();
            $table->timestamps();

            $table->index(['store_id', 'category']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('late_policies');
    }
};
