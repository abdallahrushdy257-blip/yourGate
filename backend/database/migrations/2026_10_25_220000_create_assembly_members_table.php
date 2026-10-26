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
        Schema::create('assembly_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->string('membership_serial')->nullable()->index();
            $table->string('name');
            $table->date('dateofbirth')->nullable();
            $table->string('nationalid')->nullable()->index();
            $table->date('nationalid_expire')->nullable();
            $table->date('start_subscription_date')->nullable();
            $table->date('end_subscription_date')->nullable();
            $table->unsignedTinyInteger('status')->default(2)->comment('1: مجلس ادارة, 2: جمعية عمومية');
            $table->string('subscription_type')->nullable();
            $table->date('start_membership_date')->nullable();
            $table->string('job')->nullable();
            $table->string('jobaddress')->nullable();
            $table->decimal('subscription_fees', 12, 2)->nullable()->default(0);
            $table->text('notes')->nullable();
            $table->string('upload')->nullable();
            $table->timestamps();

            $table->index(['store_id', 'created_at']);
            $table->index(['store_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assembly_members');
    }
};
