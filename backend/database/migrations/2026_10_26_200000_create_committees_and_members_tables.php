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
        Schema::create('committees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index(['store_id', 'created_at']);
        });

        Schema::create('committee_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('committee_id')->constrained('committees')->cascadeOnDelete();
            $table->foreignId('assembly_member_id')->nullable()->constrained('assembly_members')->nullOnDelete();
            $table->string('name');
            $table->string('role')->default('عضو');
            $table->timestamps();

            $table->index(['committee_id', 'store_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('committee_members');
        Schema::dropIfExists('committees');
    }
};
