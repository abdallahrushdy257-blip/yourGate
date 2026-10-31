<?php

namespace Database\Seeders;

use App\Models\AssemblyMember;
use App\Models\Store;
use Illuminate\Database\Seeder;

class AssemblyMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $store = Store::first();
        if (! $store) {
            return;
        }

        AssemblyMember::firstOrCreate([
            'store_id' => $store->id,
            'name'     => 'د. خالد بن سلطان آل سعود',
        ], [
            'status'                  => 1,
            'subscription_type'       => '5',
            'job'                     => 'رئيس مجلس الإدارة',
            'jobaddress'              => 'الرياض',
            'nationalid'              => '1012345678',
            'start_membership_date'   => '2024-01-01',
            'start_subscription_date' => '2026-01-01',
            'end_subscription_date'   => '2027-01-01',
            'subscription_fees'       => 5000,
            'notes'                   => 'عضو مؤسس ورئيس المجلس',
        ]);

        AssemblyMember::firstOrCreate([
            'store_id' => $store->id,
            'name'     => 'م. عبدالله محمد الرشيد',
        ], [
            'status'                  => 1,
            'subscription_type'       => '4',
            'job'                     => 'مستشار تقني',
            'jobaddress'              => 'جدة',
            'nationalid'              => '1023456789',
            'start_membership_date'   => '2024-03-15',
            'start_subscription_date' => '2026-01-01',
            'end_subscription_date'   => '2027-01-01',
            'subscription_fees'       => 2500,
            'notes'                   => 'عضو مجلس إدارة',
        ]);

        AssemblyMember::firstOrCreate([
            'store_id' => $store->id,
            'name'     => 'أ. نورة بنت عبدالرحمن الفهد',
        ], [
            'status'                  => 2,
            'subscription_type'       => '1',
            'job'                     => 'سيدة أعمال',
            'jobaddress'              => 'الرياض',
            'nationalid'              => '1034567890',
            'start_membership_date'   => '2025-06-01',
            'start_subscription_date' => '2026-01-01',
            'end_subscription_date'   => '2027-01-01',
            'subscription_fees'       => 1000,
            'notes'                   => 'عضو داعم في الجمعية العمومية',
        ]);
    }
}
