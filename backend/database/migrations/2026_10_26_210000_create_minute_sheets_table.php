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
        Schema::create('minute_sheets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->string('title');
            $table->date('date')->nullable();
            $table->unsignedTinyInteger('type')->nullable()->comment('1: جمعية عمومية, 2: مجلس إدارة');
            $table->unsignedTinyInteger('reason')->nullable()->comment('1: عادية, 2: غير عادية, 3: دوري, 4: طارئة, 5: لجان');
            $table->text('note')->nullable();
            $table->string('upload')->nullable();
            $table->timestamps();

            $table->index(['store_id', 'created_at']);
            $table->index(['store_id', 'type']);
        });

        Schema::create('minute_sheet_attendees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('minute_sheet_id')->constrained('minute_sheets')->cascadeOnDelete();
            $table->foreignId('assembly_member_id')->nullable()->constrained('assembly_members')->nullOnDelete();
            $table->foreignId('committee_id')->nullable()->constrained('committees')->nullOnDelete();
            $table->timestamps();

            $table->index(['minute_sheet_id', 'store_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('minute_sheet_attendees');
        Schema::dropIfExists('minute_sheets');
    }
};
