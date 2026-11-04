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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->string('voucher_number', 50);
            $table->string('voucher_type', 20)->default('receipt'); // receipt (قبض), payment (صرف)
            $table->string('payment_method', 30)->default('cash'); // cash, network, transfer, deposit, check, knet
            $table->date('date');
            $table->decimal('amount', 15, 2);
            $table->foreignId('debit_account_id')->constrained('chart_of_accounts')->cascadeOnDelete();
            $table->foreignId('credit_account_id')->constrained('chart_of_accounts')->cascadeOnDelete();
            $table->string('description', 500)->nullable();
            $table->string('category', 50)->default('unrestricted'); // restricted (مقيدة), unrestricted (غير مقيدة)
            $table->string('status', 20)->default('posted');
            $table->foreignId('journal_entry_id')->nullable()->constrained('journal_entries')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['store_id', 'voucher_number']);
            $table->index(['store_id', 'voucher_type', 'date']);
            $table->index(['store_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
