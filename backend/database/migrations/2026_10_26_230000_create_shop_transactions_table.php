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
        Schema::create('shop_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
            $table->foreignId('donor_id')->nullable()->constrained('donors')->nullOnDelete();
            $table->foreignId('human_cases_id')->nullable()->constrained('human_cases')->nullOnDelete();
            $table->string('invoice_number')->index();
            $table->unsignedTinyInteger('transaction_type')->default(1)->comment('1: receipt/donation, 2: payment/expense');
            $table->string('type')->nullable()->comment('payment method / type code');
            $table->decimal('amount', 14, 2)->default(0);
            $table->date('date')->nullable();
            $table->string('account')->nullable();
            $table->string('balanceid')->nullable();
            $table->text('notes')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['store_id', 'shop_id']);
            $table->index(['store_id', 'date']);
            $table->index(['store_id', 'transaction_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shop_transactions');
    }
};
