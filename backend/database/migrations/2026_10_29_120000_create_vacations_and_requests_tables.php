<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('vacations')) {
            Schema::create('vacations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->string('name');
                $table->text('description')->nullable();
                $table->integer('days')->default(0);
                $table->timestamps();
                $table->softDeletes();

                $table->index('store_id');
                $table->index('name');
            });
        }

        if (!Schema::hasTable('vacation_requests')) {
            Schema::create('vacation_requests', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
                $table->foreignId('vacation_id')->nullable()->constrained('vacations')->nullOnDelete();
                $table->text('description')->nullable();
                $table->date('from')->nullable();
                $table->date('to')->nullable();
                $table->string('status')->default('قيد الانتظار');
                $table->string('file_path')->nullable();
                $table->timestamps();
                $table->softDeletes();

                $table->index('store_id');
                $table->index('employee_id');
                $table->index('status');
            });
        }

        if (!Schema::hasTable('leave_requests')) {
            Schema::create('leave_requests', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
                $table->date('date')->nullable();
                $table->string('from_time')->nullable();
                $table->string('to_time')->nullable();
                $table->decimal('hours', 5, 2)->nullable();
                $table->text('note')->nullable();
                $table->string('status')->default('قيد الانتظار');
                $table->string('file_path')->nullable();
                $table->timestamps();
                $table->softDeletes();

                $table->index('store_id');
                $table->index('employee_id');
                $table->index('status');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
        Schema::dropIfExists('vacation_requests');
        Schema::dropIfExists('vacations');
    }
};
