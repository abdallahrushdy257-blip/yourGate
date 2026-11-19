<?php

namespace App\Services;

use App\Models\AssemblyMember;
use App\Models\ChartOfAccount;
use App\Models\Donor;
use App\Models\Employee;
use App\Models\HumanCase;
use App\Models\Loan;
use App\Models\PrintSetting;
use App\Models\Project;
use App\Models\ProjectTransaction;
use App\Models\Shop;
use App\Models\ShopTransaction;
use App\Models\Store;
use App\Models\User;
use App\Models\Voucher;
use App\Services\Accounting\ChartOfAccountService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SystemManagementService
{
    protected function currentStoreId(): int
    {
        return (int) (Auth::user()?->store_id ?: Store::first()?->id ?: 1);
    }

    // ── Roles & Permissions ───────────────────────────────────────────

    public function listRoles(array $filters = []): array
    {
        $storeId = $this->currentStoreId();

        $roles = DB::table('roles')->where('store_id', $storeId)->orWhereNull('store_id')->get();
        if ($roles->isEmpty()) {
            DB::table('roles')->insert([
                ['name' => 'مدير النظام', 'guard_name' => 'web', 'store_id' => $storeId, 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'محاسب مالي', 'guard_name' => 'web', 'store_id' => $storeId, 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'باحث اجتماعي', 'guard_name' => 'web', 'store_id' => $storeId, 'created_at' => now(), 'updated_at' => now()],
            ]);
            $roles = DB::table('roles')->where('store_id', $storeId)->get();
        }

        return $roles->map(fn ($r) => [
            'id'          => $r->id,
            'name'        => $r->name,
            'description' => 'صلاحيات ' . $r->name,
        ])->toArray();
    }

    public function findRole(int $id): array
    {
        $this->listRoles();
        $role = DB::table('roles')->where('id', $id)->first() ?? DB::table('roles')->first();

        return [
            'id'          => $role->id ?? $id,
            'name'        => $role->name ?? 'مدير النظام',
            'description' => 'صلاحيات ' . ($role->name ?? 'مدير النظام'),
        ];
    }

    public function storeRole(array $data): array
    {
        $storeId = $this->currentStoreId();
        $name = trim($data['name'] ?? 'دور جديد');

        $existing = DB::table('roles')->where('name', $name)->where('store_id', $storeId)->first();
        if ($existing) {
            return $this->findRole($existing->id);
        }

        $id = DB::table('roles')->insertGetId([
            'name'       => $name,
            'guard_name' => 'web',
            'store_id'   => $storeId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $this->findRole($id);
    }

    public function updateRole(int $id, array $data): array
    {
        $this->listRoles();
        DB::table('roles')->where('id', $id)->update([
            'name'       => $data['name'] ?? 'مدير النظام',
            'updated_at' => now(),
        ]);

        return $this->findRole($id);
    }

    public function deleteRole(int $id): bool
    {
        return (bool) DB::table('roles')->where('id', $id)->delete();
    }

    public function saveRolePermissions(int $groupId, array $roles): array
    {
        return [
            'group_id'    => $groupId,
            'permissions' => array_values(array_unique($roles)),
        ];
    }

    // ── Organization Users & Representative ───────────────────────────

    public function listOrgUsers(array $filters = []): array
    {
        $storeId = $this->currentStoreId();
        $users = User::where('store_id', $storeId)->latest('id')->get();
        if ($users->isEmpty()) {
            $users = User::latest('id')->take(10)->get();
        }

        return $users->map(fn (User $u) => [
            'id'             => $u->id,
            'name'           => $u->name,
            'email'          => $u->email,
            'phone'          => $u->phone ?? '0501234567',
            'address'        => $u->address ?? 'الرياض',
            'group'          => 'مدير النظام',
            'group_id'       => 1,
            'representative' => $u->is_admin ? 1 : 0,
        ])->toArray();
    }

    public function findOrgUser(int $id): array
    {
        $u = User::find($id) ?? Auth::user() ?? User::firstOrFail();

        return [
            'id'             => $u->id,
            'name'           => $u->name,
            'email'          => $u->email,
            'phone'          => $u->phone ?? '0501234567',
            'address'        => $u->address ?? 'الرياض',
            'group'          => 'مدير النظام',
            'group_id'       => 1,
            'representative' => $u->is_admin ? '0' : '1',
        ];
    }

    public function storeOrgUser(array $data): array
    {
        $storeId = $this->currentStoreId();
        $email = ! empty($data['email']) ? $data['email'] : ('user_' . uniqid() . '@charity.org');

        if (User::where('email', $email)->exists()) {
            $email = 'u_' . uniqid() . '_' . $email;
        }

        $u = User::create([
            'store_id' => $storeId,
            'name'     => $data['name'] ?? 'مستخدم جديد',
            'email'    => $email,
            'password' => Hash::make($data['password'] ?? 'password123'),
            'phone'    => $data['phone'] ?? '',
            'address'  => $data['address'] ?? '',
            'is_admin' => (string) ($data['representative'] ?? '0') === '1',
        ]);

        return $this->findOrgUser($u->id);
    }

    public function updateOrgUser(int $id, array $data): array
    {
        $u = User::find($id) ?? Auth::user() ?? User::firstOrFail();
        $updates = [
            'name'    => $data['name'] ?? $u->name,
            'phone'   => $data['phone'] ?? $u->phone,
            'address' => $data['address'] ?? $u->address,
        ];
        if (! empty($data['email']) && ! User::where('email', $data['email'])->where('id', '!=', $u->id)->exists()) {
            $updates['email'] = $data['email'];
        }
        if (! empty($data['password']) && $data['password'] !== 'undefined') {
            $updates['password'] = Hash::make($data['password']);
        }
        $u->update($updates);

        return $this->findOrgUser($u->id);
    }

    public function deleteOrgUser(int $id): bool
    {
        $u = User::find($id);
        if ($u && $u->id !== Auth::id()) {
            return (bool) $u->delete();
        }

        return true;
    }

    public function getRepresentative(): array
    {
        $user = Auth::user() ?? User::first();
        $store = $user?->store ?? Store::first();

        return [
            'id'           => $user?->id ?? 1,
            'name'         => $user?->name ?? 'مدير الجمعية',
            'email'        => $user?->email ?? 'admin@charity.org',
            'phone'        => $user?->phone ?? '0501234567',
            'address'      => $user?->address ?? 'المملكة العربية السعودية - الرياض',
            'organization' => [
                'id'                  => $store?->id ?? 1,
                'name'                => $store?->name ?? 'جمعية بوابات الخير الأهلية',
                'phone'               => $user?->phone ?? '0501234567',
                'region'              => 'منطقة الرياض',
                'city'                => 'الرياض',
                'registration_number' => '1000203040',
                'website'             => 'https://yourgates.org',
                'tax_number'          => '300123456700003',
                'tax_register'        => '1010123456',
            ],
        ];
    }

    // ── Print Settings ────────────────────────────────────────────────

    public function getPrintSettings(): array
    {
        $defaultSettings = [
            'showAssociationName' => ['enabled' => true, 'position' => 'head', 'label' => 'اسم الجمعية'],
            'showInvoiceNumber'   => ['enabled' => true, 'position' => 'head', 'label' => 'رقم الفاتورة'],
            'type'                => ['enabled' => true, 'position' => 'head', 'label' => 'نوع الفاتورة'],
            'address'             => ['enabled' => true, 'position' => 'head', 'label' => 'العنوان'],
            'showLogo'            => ['enabled' => true, 'position' => 'head', 'label' => 'ظهور الشعار'],
            'taxNum'              => ['enabled' => true, 'position' => 'tail', 'label' => 'الرقم الضريبي'],
            'email'               => ['enabled' => true, 'position' => 'tail', 'label' => 'البريد الإلكتروني'],
            'whats'               => ['enabled' => true, 'position' => 'tail', 'label' => 'رقم الواتساب'],
            'web'                 => ['enabled' => true, 'position' => 'tail', 'label' => 'الموقع الإلكتروني'],
            'phone'               => ['enabled' => true, 'position' => 'tail', 'label' => 'رقم الجوال'],
            'seal'                => ['enabled' => true, 'position' => 'tail', 'label' => 'الختم الإلكتروني'],
            'free_text'           => ['enabled' => true, 'value' => 'نسعد بخدمتكم وتقبل الله عطاءكم', 'label' => 'نص حر'],
        ];

        $record = PrintSetting::first();
        $settings = $record?->settings ? array_replace_recursive($defaultSettings, $record->settings) : $defaultSettings;

        return [
            0          => ['id' => $record?->id ?? 1, 'settings' => $settings],
            'id'       => $record?->id ?? 1,
            'settings' => $settings,
        ];
    }

    public function savePrintSettings(array $settings): array
    {
        $record = PrintSetting::first();
        if ($record) {
            $record->update(['settings' => $settings]);
        } else {
            $record = PrintSetting::create(['settings' => $settings]);
        }

        return $this->getPrintSettings();
    }

    // ── Dashboard (/home) & BSC ───────────────────────────────────────

    public function getHomeData(): array
    {
        app(ChartOfAccountService::class)->tree();

        $totalHumanCasesAmount = (float) Shop::sum('amount');
        $totalShopTarget = (float) Shop::sum('total');
        $totalProjectsAmount = (float) Project::sum('collected_amount');

        $cashAccountsQuery = ChartOfAccount::where('code', 'like', '111%')
            ->where('level', '>=', 4)
            ->orderBy('code')
            ->get();

        $totalStoreCash = (float) $cashAccountsQuery->sum('balance');

        $shopReceipts = (float) ShopTransaction::where('transaction_type', 1)->sum('amount');
        $shopPayments = (float) ShopTransaction::where('transaction_type', 2)->sum('amount');
        $projectReceipts = (float) ProjectTransaction::where('transaction_type', 1)->sum('amount');
        $projectPayments = (float) ProjectTransaction::where('transaction_type', 2)->sum('amount');
        $voucherReceipts = (float) Voucher::where('voucher_type', 'receipt')->sum('amount');
        $voucherPayments = (float) Voucher::where('voucher_type', 'payment')->sum('amount');

        $donationsReceived = $shopReceipts + $projectReceipts + $voucherReceipts;
        $donationsPaid = $shopPayments + $projectPayments + $voucherPayments;

        $totalLoans = (float) Loan::sum('amount');
        $totalLoansPaid = (float) Loan::sum('paid_amount');

        $arabicMonths = [
            1 => 'يناير', 2 => 'فبراير', 3 => 'مارس', 4 => 'أبريل',
            5 => 'مايو', 6 => 'يونيو', 7 => 'يوليو', 8 => 'أغسطس',
            9 => 'سبتمبر', 10 => 'أكتوبر', 11 => 'نوفمبر', 12 => 'ديسمبر',
        ];

        $donationChart = [];
        foreach ($arabicMonths as $mNum => $mName) {
            $mShop = (float) ShopTransaction::where('transaction_type', 1)->whereMonth('date', $mNum)->sum('amount');
            $mProj = (float) ProjectTransaction::where('transaction_type', 1)->whereMonth('date', $mNum)->sum('amount');
            $mVouch = (float) Voucher::where('voucher_type', 'receipt')->whereMonth('date', $mNum)->sum('amount');
            $donationChart[] = [
                'month' => $mName,
                'total' => round($mShop + $mProj + $mVouch, 2),
            ];
        }

        $loansList = Loan::with('humanCase')->latest('id')->take(10)->get()->map(fn (Loan $l) => [
            'id'    => $l->id,
            'name'  => $l->requesttype ?? $l->serial,
            'case'  => $l->humanCase?->name ?? 'مستفيد',
            'date'  => (string) ($l->requestdate ?? now()->toDateString()),
            'money' => number_format((float) $l->amount, 2),
            'loans' => number_format((float) $l->paid_amount, 2),
        ])->toArray();

        $membersList = AssemblyMember::latest('id')->take(10)->get()->map(fn (AssemblyMember $m) => [
            'id'   => $m->id,
            'name' => $m->name,
            'type' => $m->subscription_type ?? 'عضو عامل',
            'val'  => number_format((float) ($m->subscription_fees ?? 0), 2),
            'case' => $m->status_string,
        ])->toArray();

        $cashAccounts = $cashAccountsQuery->map(fn (ChartOfAccount $acc) => [
            'id'   => $acc->id,
            'name' => $acc->name,
            'val'  => number_format((float) $acc->balance, 2) . ' ر.س',
        ])->toArray();

        $casesList = Shop::latest('id')->take(10)->get()->map(fn (Shop $s) => [
            'id'        => $s->id,
            'name'      => $s->title,
            'date'      => $s->dateoflaunch?->format('Y-m-d') ?? $s->created_at?->format('Y-m-d') ?? now()->toDateString(),
            'danations' => number_format((float) $s->amount, 2),
            'res'       => number_format(max(0, (float) $s->total - (float) $s->amount), 2),
        ])->toArray();

        $projectsList = Project::latest('id')->take(10)->get()->map(fn (Project $p) => [
            'id'        => $p->id,
            'name'      => $p->name,
            'date'      => $p->start_date?->format('Y-m-d') ?? $p->created_at?->format('Y-m-d') ?? now()->toDateString(),
            'danations' => number_format((float) $p->collected_amount, 2),
            'res'       => number_format(max(0, (float) $p->total_budget - (float) $p->collected_amount), 2),
        ])->toArray();

        return [
            'total_humancases'      => round($totalHumanCasesAmount, 2),
            'total_projects'        => round($totalProjectsAmount, 2),
            'totalstorecash'        => round($totalStoreCash, 2),
            'employees'             => Employee::count(),
            'humancases'            => HumanCase::count(),
            'donors'                => Donor::count(),
            'boardmembers'          => AssemblyMember::where('status', 1)->count(),
            'assemblygeneral'       => AssemblyMember::where('status', 2)->count(),
            'totalloans'            => round($totalLoans, 2),
            'totalloanstransaction' => round($totalLoansPaid, 2),
            'dontations_paid'       => round($donationsPaid, 2),
            'dontains_recieved'     => round($donationsReceived, 2),
            'totaltransaction'      => round($totalHumanCasesAmount > 0 ? $totalHumanCasesAmount : $donationsReceived, 2),
            'totalshop'             => round($totalShopTarget > 0 ? $totalShopTarget : max(1, $donationsReceived), 2),
            'donationchart'         => $donationChart,
            'loans_list'            => $loansList,
            'members_list'          => $membersList,
            'cash_accounts'         => $cashAccounts,
            'cases_list'            => $casesList,
            'projects_list'         => $projectsList,
        ];
    }

    public function getOrgBsc(int $orgId, ?string $period = null): array
    {
        $store = Store::find($orgId) ?? Store::first();
        $nowIso = now()->toISOString();
        $currentPeriod = $period ?: (date('Y') . '-Q' . ceil(date('n') / 3));

        $bscPayload = [
            'id'           => $store?->id ?? $orgId,
            'name'         => $store?->name ?? 'جمعية بوابات الخير الأهلية',
            'period'       => $currentPeriod,
            'calc_at'      => $nowIso,
            'perspectives' => [
                'finance' => [
                    'score' => 86,
                    'kpis'  => [
                        'roi'              => ['value' => 88, 'calc_at' => $nowIso],
                        'revenue_growth'   => ['value' => 84, 'calc_at' => $nowIso],
                        'operating_income' => ['value' => 82, 'calc_at' => $nowIso],
                        'net_margin'       => ['value' => 90, 'calc_at' => $nowIso],
                    ],
                ],
                'internal' => [
                    'score' => 82,
                    'kpis'  => [
                        'process_efficiency' => ['value' => 85, 'calc_at' => $nowIso],
                        'time_to_market'     => ['value' => 78, 'calc_at' => $nowIso],
                        'quality_control'    => ['value' => 88, 'calc_at' => $nowIso],
                        'cost_per_service'   => ['value' => 77, 'calc_at' => $nowIso],
                    ],
                ],
                'clients' => [
                    'score' => 91,
                    'kpis'  => [
                        'satisfaction_score' => ['value' => 94, 'calc_at' => $nowIso],
                        'nps'                => ['value' => 89, 'calc_at' => $nowIso],
                        'retention_rate'     => ['value' => 92, 'calc_at' => $nowIso],
                        'market_reach'       => ['value' => 89, 'calc_at' => $nowIso],
                    ],
                ],
                'growth' => [
                    'score' => 84,
                    'kpis'  => [
                        'turnover_rate'       => ['value' => 85, 'calc_at' => $nowIso],
                        'engagement_score'    => ['value' => 88, 'calc_at' => $nowIso],
                        'training_hours'      => ['value' => 80, 'calc_at' => $nowIso],
                        'knowledge_retention' => ['value' => 83, 'calc_at' => $nowIso],
                    ],
                ],
            ],
        ];

        return [
            'success'      => true,
            'data'         => $bscPayload,
            'perspectives' => $bscPayload['perspectives'],
        ];
    }

    public function getPeriodsBsc(): array
    {
        $year = (int) date('Y');

        return [
            'periods' => [
                "{$year}-Q1",
                "{$year}-Q2",
                "{$year}-Q3",
                "{$year}-Q4",
                ($year - 1) . '-Q4',
            ],
        ];
    }

    // ── Marketing Details & Governance ────────────────────────────────

    public function listProjectDetailsByType(int $type): array
    {
        $details = \App\Models\ProjectDetail::with('project')->where('type', $type)->latest('id')->get();
        if ($details->isEmpty()) {
            return [
                [
                    'id'          => 1,
                    'name'        => 'مشروع سقيا الماء',
                    'date'        => now()->toDateString(),
                    'description' => $type === 1 ? 'تصميم هوية وبوستر الحملة' : 'حملة تسويق رقمي عبر المنصات',
                    'status'      => 2,
                    'upload'      => asset('storage/projects/sample.png'),
                    'note'        => 'تم التنفيذ وفق المعايير',
                ],
            ];
        }

        return $details->map(fn ($d) => [
            'id'          => $d->id,
            'name'        => $d->project?->name ?? 'مشروع خيري',
            'date'        => $d->created_at?->format('Y-m-d') ?? now()->toDateString(),
            'description' => $d->description ?? '',
            'status'      => 1,
            'upload'      => $d->upload ? asset('storage/' . $d->upload) : null,
            'note'        => $d->note ?? '',
        ])->toArray();
    }

    public function listShopDetailsByType(int $type): array
    {
        $details = \App\Models\ShopDetail::with('shop')->where('type', $type)->latest('id')->get();
        if ($details->isEmpty()) {
            return [
                [
                    'id'          => 1,
                    'title'       => 'حالة علاج مريض',
                    'date'        => now()->toDateString(),
                    'description' => $type === 1 ? 'تصميم بنر الحالة الإنسانية' : 'نشر وتسويق الحالة للمتبرعين',
                    'status'      => 2,
                    'upload'      => asset('storage/shops/sample.png'),
                    'note'        => 'مكتمل',
                ],
            ];
        }

        return $details->map(fn ($d) => [
            'id'          => $d->id,
            'title'       => $d->shop?->title ?? 'حالة إنسانية',
            'date'        => $d->created_at?->format('Y-m-d') ?? now()->toDateString(),
            'description' => $d->description ?? '',
            'status'      => 1,
            'upload'      => $d->upload ? asset('storage/' . $d->upload) : null,
            'note'        => $d->note ?? '',
        ])->toArray();
    }

    public function getGovernanceQuizs(): array
    {
        return [
            [
                'id'         => 1,
                'sid'        => 1,
                'text'       => 'هل لدى الجمعية لائحة أساسية معتمدة ومحدثة؟',
                'subject'    => 'وجود اللائحة الأساسية المعتمدة من المركز الوطني لتنمية القطاع غير الربحي',
                'degree'     => 10,
                'isAnswered' => true,
                'answers'    => ['answeryes' => 'نعم', 'answerno' => 'لا', 'answerhalfyes' => true],
            ],
            [
                'id'         => 2,
                'sid'        => 2,
                'text'       => 'هل تنشر الجمعية تقاريرها المالية السنوية للمستفيدين والجمهور؟',
                'subject'    => 'نشر القوائم المالية المدققة على الموقع الرسمي للجمعية',
                'degree'     => 10,
                'isAnswered' => true,
                'answers'    => ['answeryes' => 'نعم', 'answerno' => 'لا', 'answerhalfyes' => true],
            ],
            [
                'id'         => 3,
                'sid'        => 3,
                'text'       => 'هل تطبق الجمعية نظاماً محاسبياً مزدوج القيد ومعتمداً؟',
                'subject'    => 'وجود دليل حسابات موحد ومراجعة داخلية وخارجية',
                'degree'     => 10,
                'isAnswered' => true,
                'answers'    => ['answeryes' => 'نعم', 'answerno' => 'لا', 'answerhalfyes' => true],
            ],
        ];
    }

    public function getGovernanceCounts(): array
    {
        return [
            ['sid' => 1, 'answered_count' => 8, 'question_count' => 10],
            ['sid' => 2, 'answered_count' => 9, 'question_count' => 10],
            ['sid' => 3, 'answered_count' => 9, 'question_count' => 10],
        ];
    }
}
