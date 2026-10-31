<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Default Store
        $store = Store::firstOrCreate(
            ['slug' => 'main-store'],
            [
                'name'   => 'المتجر الرئيسي',
                'status' => 'active',
            ]
        );

        // 2. Set current team/store for Spatie permissions
        setPermissionsTeamId($store->id);

        // 3. Create Basic Roles for the store
        $roles = ['admin', 'manager', 'accountant', 'cashier'];
        foreach ($roles as $roleName) {
            Role::firstOrCreate([
                'name'       => $roleName,
                'guard_name' => 'web',
                'store_id'   => $store->id,
            ]);
        }

        // 4. Create Initial Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@yourgates.com'],
            [
                'store_id' => $store->id,
                'name'     => 'المدير العام',
                'password' => Hash::make('password123'),
            ]
        );

        $admin->assignRole('admin');

        // 5. Create Initial Donor Interests
        $interests = [
            ['name' => 'التعليم', 'description' => 'دعم المشاريع التعليمية'],
            ['name' => 'الصحة', 'description' => 'دعم المستشفيات'],
            ['name' => 'الأيتام', 'description' => 'رعاية الأيتام'],
            ['name' => 'الإغاثة', 'description' => 'المساعدات الإنسانية'],
        ];
        foreach ($interests as $item) {
            \App\Models\Interest::firstOrCreate(
                ['store_id' => $store->id, 'name' => $item['name']],
                ['description' => $item['description']]
            );
        }

        // 6. Create Initial Donors
        $sampleInterest = \App\Models\Interest::where('store_id', $store->id)->first();
        $donors = [
            [
                'name'                       => 'عبدالرحمن بن فهد السبيعي',
                'phone'                      => '0501234567',
                'email'                      => 'abdulrahman@example.com',
                'address'                    => 'الرياض - حي النخيل',
                'type'                       => '1',
                'identification_number'      => '1098765432',
                'identification_description' => 'هوية وطنية',
            ],
            [
                'name'                       => 'مؤسسة الغيث الأهلية',
                'phone'                      => '0559876543',
                'email'                      => 'alghaith@example.com',
                'address'                    => 'جدة - طريق الملك',
                'type'                       => '2',
                'identification_number'      => '7001234567',
                'identification_description' => 'سجل مؤسسة غير ربحية',
            ],
            [
                'name'                       => 'شركة الوفاق التجارية',
                'phone'                      => '0541122334',
                'email'                      => 'info@alwefaq.com',
                'address'                    => 'الدمام - الشاطئ',
                'type'                       => '3',
                'identification_number'      => '1010567890',
                'identification_description' => 'سجل تجاري',
            ],
        ];

        foreach ($donors as $donorData) {
            \App\Models\Donor::firstOrCreate(
                ['store_id' => $store->id, 'phone' => $donorData['phone']],
                array_merge($donorData, ['interest_id' => $sampleInterest?->id])
            );
        }

        // 7. Create Initial Vendors
        $vendors = [
            [
                'name'                       => 'شركة الإمداد الطبية الحديثة',
                'email'                      => 'info@medical-supply.com',
                'phone'                      => '0509988776',
                'address'                    => 'الرياض - طريق الملك فهد',
                'region'                     => 'الرياض',
                'description'                => 'توريد الأجهزة والمستلزمات الطبية',
                'identification_number'      => '1010778899',
                'identification_description' => 'سجل تجاري',
                'type'                       => '1',
            ],
            [
                'name'                       => 'مؤسسة البناء والإعمار الدولية',
                'email'                      => 'contact@construction-intl.com',
                'phone'                      => '0554433221',
                'address'                    => 'جدة - حي الأندلس',
                'region'                     => 'مكة المكرمة',
                'description'                => 'مقاولات وترميم المنازل للمستفيدين',
                'identification_number'      => '4030112233',
                'identification_description' => 'سجل تجاري',
                'type'                       => '2',
            ],
        ];

        foreach ($vendors as $vendorData) {
            \App\Models\Vendor::firstOrCreate(
                ['store_id' => $store->id, 'phone' => $vendorData['phone']],
                $vendorData
            );
        }

        // 8. Create Initial Beneficiaries
        $beneficiaries = [
            [
                'name'          => 'محمد بن صالح المطيري',
                'gender'        => '0',
                'dob'           => '1984-06-12',
                'humancasetype' => '2',
                'status'        => '1',
                'nationality'   => 'سعودي',
                'familycount'   => 5,
                'phonenum'      => '0501234888',
                'email'         => 'mohammed.m@example.com',
                'accnumber'     => 'SA4480000123456789012345',
                'idnumber'      => '1088776655',
                'idsource'      => 'الرياض',
                'iddate'        => '2028-05-01',
                'note'          => 'أسرة متعففة',
            ],
            [
                'name'          => 'فاطمة بنت ناصر العتيبي',
                'gender'        => '1',
                'dob'           => '1992-11-25',
                'humancasetype' => '1',
                'status'        => '1',
                'nationality'   => 'سعودية',
                'familycount'   => 3,
                'phonenum'      => '0559988112',
                'email'         => 'fatima.o@example.com',
                'accnumber'     => 'SA5580000987654321098765',
                'idnumber'      => '1099887766',
                'idsource'      => 'جدة',
                'iddate'        => '2027-12-15',
                'note'          => 'دعم إيجار مسكن',
            ],
        ];

        foreach ($beneficiaries as $bData) {
            \App\Models\HumanCase::firstOrCreate(
                ['store_id' => $store->id, 'idnumber' => $bData['idnumber']],
                $bData
            );
        }

        // 9. Assembly Members
        $this->call(AssemblyMemberSeeder::class);

        // 10. Initial Shop Cases & Transactions
        $case = \App\Models\HumanCase::where('store_id', $store->id)->first();
        $donor = \App\Models\Donor::where('store_id', $store->id)->first();

        $shop = \App\Models\Shop::firstOrCreate(
            ['store_id' => $store->id, 'title' => 'كفالة أسرة متعففة بالرياض'],
            [
                'human_cases_id'   => $case?->id,
                'casetype'         => 'حالة اغاثة',
                'subcasetype'      => 'كفالة أسرة',
                'total'            => 15000.00,
                'amount'           => 6500.00,
                'status'           => 0,
                'marketingmethod'  => 1,
                'dateoflaunch'     => '2026-01-01',
                'dateofcompletion' => '2026-12-31',
                'description'      => 'مشروع كفالة متكامل للأسر المحتاجة بالرياض',
            ]
        );

        if ($shop && $donor) {
            \App\Models\ShopTransaction::firstOrCreate(
                ['store_id' => $store->id, 'invoice_number' => 'REC-20260101-001'],
                [
                    'shop_id'          => $shop->id,
                    'donor_id'         => $donor->id,
                    'human_cases_id'   => $case?->id,
                    'transaction_type' => 1,
                    'type'             => '2',
                    'amount'           => 4500.00,
                    'date'             => '2026-02-15',
                    'account'          => 'مصرف الراجحي',
                    'notes'            => 'تبرع كفالة أسرة',
                ]
            );

            \App\Models\ShopTransaction::firstOrCreate(
                ['store_id' => $store->id, 'invoice_number' => 'PAY-20260201-001'],
                [
                    'shop_id'          => $shop->id,
                    'human_cases_id'   => $case?->id,
                    'transaction_type' => 2,
                    'type'             => '1',
                    'amount'           => 2000.00,
                    'date'             => '2026-02-20',
                    'account'          => 'الصندوق الرئيسي',
                    'notes'            => 'صرف سلة غذائية ومستلزمات للأسرة',
                ]
            );
        }
    }
}
