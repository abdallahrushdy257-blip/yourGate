<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('employee_withdrawals')) {
            Schema::create('employee_withdrawals', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
                $table->unsignedBigInteger('account_id')->nullable();
                $table->string('account_name')->default('الخزينة الرئيسية');
                $table->decimal('amount', 12, 2)->default(0);
                $table->date('date')->nullable();
                $table->string('time', 10)->nullable();
                $table->date('withdrawal_date')->nullable();
                $table->tinyInteger('status')->default(0); // 0 = قيد الانتظار, 1 = معتمد
                $table->text('description')->nullable();
                $table->timestamps();
                $table->softDeletes();

                $table->index('store_id');
                $table->index('employee_id');
                $table->index('date');
                $table->index('status');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_withdrawals');
    }
};
