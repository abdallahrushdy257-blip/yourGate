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
        Schema::create('job_titles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->unsignedBigInteger('parent_id')->nullable()->index();
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('note')->nullable();
            $table->unsignedSmallInteger('workdayspermonth')->default(22);
            $table->unsignedSmallInteger('workhoursperday')->default(8);
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('job_titles')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_titles');
    }
};
