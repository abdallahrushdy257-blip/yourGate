<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('attendances')) {
            Schema::create('attendances', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
                $table->date('date');
                $table->string('check_in', 10)->nullable();
                $table->string('check_out', 10)->nullable();
                $table->string('method', 20)->default('يدوي'); // 'يدوي', 'QR'
                $table->string('status', 50)->default('حاضر');
                $table->text('notes')->nullable();
                $table->timestamps();
                $table->softDeletes();

                $table->index('store_id');
                $table->index('employee_id');
                $table->index('date');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
