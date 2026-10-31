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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('total', 14, 2)->default(0)->comment('Project Budget / Target Amount');
            $table->decimal('amount', 14, 2)->default(0)->comment('Collected Donations Amount');
            $table->date('dateoflaunch')->nullable()->comment('Start Date');
            $table->date('deadline')->nullable()->comment('End Date');
            $table->unsignedTinyInteger('marketingmethod')->default(0)->comment('1: Donors, 2: Gov, 3: Stores');
            $table->string('accounttree')->nullable();
            $table->string('attachment')->nullable();
            $table->unsignedTinyInteger('status')->default(1)->comment('1: in_progress/active, 2: completed, 3: cancelled');
            $table->softDeletes();
            $table->timestamps();

            $table->index(['store_id', 'status']);
            $table->index(['store_id', 'dateoflaunch']);
        });

        Schema::create('project_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('donor_id')->nullable()->constrained('donors')->nullOnDelete();
            $table->foreignId('human_cases_id')->nullable()->constrained('human_cases')->nullOnDelete();
            $table->string('invoice_number')->index();
            $table->unsignedTinyInteger('transaction_type')->default(1)->comment('1: receipt, 2: payment');
            $table->string('type')->nullable();
            $table->decimal('amount', 14, 2)->default(0);
            $table->date('date')->nullable();
            $table->string('account')->nullable();
            $table->string('balanceid')->nullable();
            $table->text('notes')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['store_id', 'project_id']);
            $table->index(['store_id', 'date']);
            $table->index(['store_id', 'transaction_type']);
        });

        Schema::create('project_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->unsignedTinyInteger('type')->default(1)->comment('1: design request, 2: marketing request');
            $table->text('description')->nullable();
            $table->text('note')->nullable();
            $table->string('upload')->nullable();
            $table->string('upload2')->nullable();
            $table->string('status')->default('pending');
            $table->softDeletes();
            $table->timestamps();

            $table->index(['store_id', 'project_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_details');
        Schema::dropIfExists('project_transactions');
        Schema::dropIfExists('projects');
    }
};
