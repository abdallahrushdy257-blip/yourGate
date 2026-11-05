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
        Schema::create('salary_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->tinyInteger('type')->default(0); // 0 = award / bonus, 1 = discount / deduction
            $table->string('reason', 255)->nullable();
            $table->tinyInteger('amounttype')->default(1); // 0 = days, 1 = money
            $table->decimal('amount', 12, 2)->default(0);
            $table->date('date');
            $table->text('description')->nullable();
            $table->string('component', 255)->nullable(); // Account / component tree code
            $table->timestamps();
            $table->softDeletes();

            $table->index(['store_id', 'employee_id']);
            $table->index(['store_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salary_actions');
    }
};
