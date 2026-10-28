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
        // 1. Project Phases
        Schema::create('project_phases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->string('name');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('priority')->default('2')->comment('1: low, 2: medium, 3: high, 4: urgent');
            $table->decimal('budget', 14, 2)->default(0);
            $table->unsignedTinyInteger('status')->default(1)->comment('1: in_progress, 2: completed, 3: cancelled');
            $table->text('description')->nullable();
            $table->text('performance_summary')->nullable();
            $table->text('remaining_work')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['store_id', 'project_id']);
            $table->index(['store_id', 'status']);
        });

        // 2. Project Members / Assignments
        Schema::create('project_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('phase_id')->nullable()->constrained('project_phases')->nullOnDelete();
            $table->unsignedTinyInteger('responsible_type')->default(1)->comment('1: employee, 2: volunteer');
            $table->unsignedBigInteger('responsible_id')->nullable();
            $table->string('responsible_name')->nullable();
            $table->string('role')->nullable();
            $table->text('responsibility')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['store_id', 'project_id']);
            $table->index(['store_id', 'phase_id']);
        });

        // 3. Project KPIs
        Schema::create('project_kpis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->unsignedBigInteger('kpi_id')->nullable();
            $table->string('quiz');
            $table->decimal('target', 10, 2)->default(100);
            $table->decimal('actual', 10, 2)->default(0);
            $table->string('status')->default('خطر');
            $table->softDeletes();
            $table->timestamps();

            $table->index(['store_id', 'project_id']);
        });

        // 4. Project Uploads / Attachments
        Schema::create('project_uploads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->string('description')->nullable();
            $table->string('upload');
            $table->softDeletes();
            $table->timestamps();

            $table->index(['store_id', 'project_id']);
        });

        // 5. Project Risks
        Schema::create('project_risks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('phase_id')->nullable()->constrained('project_phases')->nullOnDelete();
            $table->text('description');
            $table->unsignedTinyInteger('impactlevel')->default(2)->comment('1: low, 2: medium, 3: high');
            $table->unsignedTinyInteger('probability')->default(2)->comment('1: low, 2: medium, 3: high');
            $table->string('status')->default('مفتوح');
            $table->text('action_plan')->nullable();
            $table->text('mitigation_description')->nullable();
            $table->unsignedTinyInteger('mitigation_impactlevel')->nullable();
            $table->unsignedTinyInteger('mitigation_probability')->nullable();
            $table->string('mitigation_status')->default('قيد المعالجة');
            $table->string('responsible_person')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['store_id', 'project_id']);
            $table->index(['store_id', 'phase_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_risks');
        Schema::dropIfExists('project_uploads');
        Schema::dropIfExists('project_kpis');
        Schema::dropIfExists('project_assignments');
        Schema::dropIfExists('project_phases');
    }
};
