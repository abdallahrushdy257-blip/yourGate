<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('volunteers')) {
            Schema::create('volunteers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->string('name');
                $table->string('identification_number')->nullable();
                $table->string('idtype')->nullable();
                $table->date('idexpiredate')->nullable();
                $table->string('phone')->nullable();
                $table->string('email')->nullable();
                $table->string('iban')->nullable();
                $table->string('address')->nullable();
                $table->string('nationality')->nullable();
                $table->string('qualification')->nullable();
                $table->string('type')->nullable();
                $table->date('dateofbirth')->nullable();
                $table->date('dateofhire')->nullable();
                $table->date('dateofretire')->nullable();
                $table->string('socialstatus')->nullable();
                $table->string('gender')->nullable();
                $table->string('city')->nullable();
                $table->string('region')->nullable();
                $table->string('country')->nullable();
                $table->integer('totalworkhours')->default(0);
                $table->decimal('rewards', 14, 2)->default(0);
                $table->text('notes')->nullable();
                $table->string('profile')->nullable();
                $table->string('upload')->nullable();
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('employee_evaluations')) {
            Schema::create('employee_evaluations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->unsignedBigInteger('employee_id')->nullable();
                $table->unsignedBigInteger('evaluator_id')->nullable();
                $table->date('date')->nullable();
                $table->string('period')->nullable();
                $table->string('reason')->nullable();
                $table->string('type')->nullable();
                $table->text('description')->nullable();
                $table->string('attachment')->nullable();
                $table->decimal('average_grade', 8, 2)->default(0);
                $table->json('quiz_data')->nullable();
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('training_records')) {
            Schema::create('training_records', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->unsignedBigInteger('employee_id')->nullable();
                $table->string('title');
                $table->text('description')->nullable();
                $table->decimal('hours', 8, 2)->default(0);
                $table->date('training_date')->nullable();
                $table->string('period')->nullable();
                $table->tinyInteger('type')->default(1);
                $table->string('certificate')->nullable();
                $table->string('attachment')->nullable();
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('ksa_assessments')) {
            Schema::create('ksa_assessments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->unsignedBigInteger('employee_id')->nullable();
                $table->unsignedBigInteger('assessor_id')->nullable();
                $table->decimal('knowledge_score', 8, 2)->default(0);
                $table->decimal('skills_score', 8, 2)->default(0);
                $table->decimal('attitude_score', 8, 2)->default(0);
                $table->decimal('total_score', 8, 2)->default(0);
                $table->string('grade', 10)->nullable();
                $table->string('period')->nullable();
                $table->date('assessed_at')->nullable();
                $table->text('notes')->nullable();
                $table->string('attachment')->nullable();
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('employee_papers')) {
            Schema::create('employee_papers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->unsignedBigInteger('employee_id')->nullable();
                $table->string('name');
                $table->text('description')->nullable();
                $table->string('note')->default('1');
                $table->string('file')->nullable();
                $table->tinyInteger('status')->default(0);
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('warrantors')) {
            Schema::create('warrantors', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->string('name');
                $table->string('address')->nullable();
                $table->string('phone')->nullable();
                $table->string('email')->nullable();
                $table->string('type')->nullable();
                $table->string('idnumber')->nullable();
                $table->string('account_number')->nullable();
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('loans')) {
            Schema::create('loans', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->string('serial')->nullable();
                $table->unsignedBigInteger('humancase_id')->nullable();
                $table->unsignedBigInteger('warrantor_id')->nullable();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->string('requesttype')->nullable();
                $table->text('requestdescription')->nullable();
                $table->tinyInteger('priority')->default(1);
                $table->decimal('amount', 14, 2)->default(0);
                $table->decimal('paid_amount', 14, 2)->default(0);
                $table->integer('loancount')->default(12);
                $table->tinyInteger('status')->default(1);
                $table->date('requestdate')->nullable();
                $table->date('responsedate')->nullable();
                $table->date('approvedate')->nullable();
                $table->date('fromdate')->nullable();
                $table->date('todate')->nullable();
                $table->text('instructions')->nullable();
                $table->string('attachment')->nullable();
                $table->string('attachment_description')->nullable();
                $table->json('followups')->nullable();
                $table->json('payments')->nullable();
                $table->json('feasibility')->nullable();
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('endowments')) {
            Schema::create('endowments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->string('name');
                $table->text('description')->nullable();
                $table->string('endowmentnumber')->nullable();
                $table->date('date')->nullable();
                $table->string('ownertype')->nullable();
                $table->string('endowmentsource')->nullable();
                $table->string('type')->nullable();
                $table->string('description1')->nullable();
                $table->string('area')->nullable();
                $table->string('houseamount')->nullable();
                $table->string('buildnumber')->nullable();
                $table->string('streetname')->nullable();
                $table->string('city')->nullable();
                $table->string('country')->nullable();
                $table->string('zip')->nullable();
                $table->string('state')->nullable();
                $table->string('zipcode')->nullable();
                $table->string('geolocation')->nullable();
                $table->string('latitude')->nullable();
                $table->string('longitude')->nullable();
                $table->string('upload')->nullable();
                $table->string('casetype')->nullable();
                $table->unsignedBigInteger('employee_id')->nullable();
                $table->decimal('amount', 14, 2)->default(0);
                $table->decimal('paid', 14, 2)->default(0);
                $table->decimal('remain', 14, 2)->default(0);
                $table->decimal('annualfees', 14, 2)->default(0);
                $table->decimal('netprofit', 14, 2)->default(0);
                $table->string('account')->nullable();
                $table->tinyInteger('status')->default(1);
                $table->json('transactions')->nullable();
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('archives')) {
            Schema::create('archives', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->string('name');
                $table->text('description')->nullable();
                $table->date('date')->nullable();
                $table->string('upload')->nullable();
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('print_settings')) {
            Schema::create('print_settings', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
                $table->json('settings')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('print_settings');
        Schema::dropIfExists('archives');
        Schema::dropIfExists('endowments');
        Schema::dropIfExists('loans');
        Schema::dropIfExists('warrantors');
        Schema::dropIfExists('employee_papers');
        Schema::dropIfExists('ksa_assessments');
        Schema::dropIfExists('training_records');
        Schema::dropIfExists('employee_evaluations');
        Schema::dropIfExists('volunteers');
    }
};
