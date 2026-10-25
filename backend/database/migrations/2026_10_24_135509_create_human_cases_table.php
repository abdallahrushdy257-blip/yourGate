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
        Schema::create('human_cases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->string('name');
            $table->string('gender')->nullable();
            $table->date('dob')->nullable();
            $table->string('humancasetype')->nullable();
            $table->string('status')->default('1');
            $table->string('nationality')->nullable();
            $table->integer('familycount')->nullable();
            $table->string('phonenum')->nullable();
            $table->string('email')->nullable();
            $table->string('accnumber')->nullable();
            $table->string('idnumber')->nullable();
            $table->string('idsource')->nullable();
            $table->date('iddate')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['store_id', 'created_at']);
            $table->index(['store_id', 'name']);
            $table->index(['store_id', 'idnumber']);
            $table->index(['store_id', 'phonenum']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('human_cases');
    }
};
