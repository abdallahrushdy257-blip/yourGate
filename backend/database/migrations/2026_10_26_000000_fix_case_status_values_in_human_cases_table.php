<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('human_cases')
            ->where('case_status', '200')
            ->orWhere('case_status', '2')
            ->orWhere('case_status', 'approved')
            ->update(['case_status' => 'موافقة']);

        DB::table('human_cases')
            ->where('case_status', '3')
            ->orWhere('case_status', 'rejected')
            ->update(['case_status' => 'مرفوض']);

        DB::table('human_cases')
            ->where('case_status', '1')
            ->orWhere('case_status', 'pending')
            ->update(['case_status' => 'معلق']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op
    }
};
