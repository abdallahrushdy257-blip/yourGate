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
        Schema::create('shop_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
            $table->unsignedTinyInteger('type')->default(1)->comment('1: design request, 2: marketing request');
            $table->text('description')->nullable();
            $table->text('note')->nullable();
            $table->string('upload')->nullable();
            $table->string('upload2')->nullable();
            $table->string('status')->default('pending');
            $table->softDeletes();
            $table->timestamps();

            $table->index(['store_id', 'shop_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shop_details');
    }
};
