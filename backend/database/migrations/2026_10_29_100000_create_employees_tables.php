<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('nationalid')->nullable();
            $table->unsignedTinyInteger('idtype')->default(0); // 0: بطاقة هوية, 1: جواز سفر, 2: إقامة
            $table->date('nationalid_expire')->nullable();
            $table->date('dob')->nullable();
            $table->string('gender')->nullable(); // 0/ذكر, 1/أنثى
            $table->unsignedTinyInteger('status')->default(0); // 0: أعزب, 1: متزوج, ...
            $table->string('address')->nullable();
            $table->string('nationality')->nullable();
            $table->string('qualification')->nullable();
            $table->unsignedTinyInteger('worktype')->default(0); // 0: دوام كامل, 1: دوام جزئي
            $table->date('dateofhire')->nullable();
            $table->date('contractexpiration')->nullable();
            $table->foreignId('job_title_id')->nullable()->constrained('job_titles')->nullOnDelete();
            $table->string('iban')->nullable();
            $table->string('photo')->nullable();
            $table->boolean('is_active')->default(true);

            // Salary & allowances
            $table->decimal('basic_salary', 12, 2)->default(0);
            $table->decimal('social_insurance', 12, 2)->default(0);
            $table->decimal('housing_allowance', 12, 2)->default(0);
            $table->decimal('transport_allowance', 12, 2)->default(0);
            $table->decimal('communication_allowance', 12, 2)->default(0);
            $table->decimal('life_allowance', 12, 2)->default(0);
            $table->decimal('work_allowance', 12, 2)->default(0);
            $table->string('salary_account')->nullable();
            $table->decimal('total_salary', 12, 2)->default(0);

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('employee_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->string('title');
            $table->string('file_path');
            $table->string('file_type')->nullable();
            $table->unsignedInteger('file_size')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_documents');
        Schema::dropIfExists('employees');
    }
};
