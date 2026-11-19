<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\HumanCase;
use App\Models\Loan;
use App\Models\Warrantor;
use App\Services\Accounting\AccountingSyncService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class LoanService
{
    public function ensureDefaults(): void
    {
        if (Warrantor::count() === 0) {
            Warrantor::create([
                'name'           => 'عبدالرحمن العتيبي',
                'address'        => 'الرياض - حي الملقا',
                'phone'          => '0551122334',
                'email'          => 'otaibi@example.com',
                'type'           => 'قطاع حكومي',
                'idnumber'       => '1044556677',
                'account_number' => 'SA4420000001234567891234',
            ]);
            Warrantor::create([
                'name'           => 'فهد القحطاني',
                'address'        => 'جدة - حي الروضة',
                'phone'          => '0559988776',
                'email'          => 'fahad@example.com',
                'type'           => 'قطاع خاص',
                'idnumber'       => '1088776655',
                'account_number' => 'SA5510000009876543210000',
            ]);
        }

        if (Loan::count() === 0) {
            $hc = HumanCase::first();
            $w = Warrantor::first();
            $emp = Employee::first();

            Loan::create([
                'serial'             => 'LN-1001',
                'humancase_id'       => $hc?->id,
                'warrantor_id'       => $w?->id,
                'user_id'            => $emp?->id,
                'requesttype'        => 'قرض حسن لمشروع أسرة منتجة',
                'requestdescription' => 'تمويل مشروع خياطة وتطريز منزلي',
                'priority'           => 1,
                'amount'             => 12000,
                'paid_amount'        => 3000,
                'loancount'          => 12,
                'status'             => 1,
                'requestdate'        => now()->subMonths(2)->toDateString(),
                'responsedate'       => now()->subMonths(1)->toDateString(),
                'approvedate'        => now()->subMonths(1)->toDateString(),
                'fromdate'           => now()->toDateString(),
                'todate'             => now()->addMonths(11)->toDateString(),
                'instructions'       => 'سداد شهري منتظم كل 28 من الشهر',
                'payments'           => [
                    ['id' => 1, 'amount' => 1000, 'date' => now()->addMonth()->toDateString(), 'status' => 'غير مسدد'],
                    ['id' => 2, 'amount' => 1000, 'date' => now()->addMonths(2)->toDateString(), 'status' => 'غير مسدد'],
                ],
                'feasibility'        => [
                    'details' => [
                        'type'        => 1,
                        'address'     => 'الرياض',
                        'contact'     => '1',
                        'description' => 'تواصل عبر واتساب',
                        'phone'       => '0501122334',
                    ],
                    'evaluation' => [
                        'strength'      => 'خبرة فنية عالية بالمنتجات اليدوية',
                        'weaknesses'    => 'محدودية رأس المال التشغيلي',
                        'opportunities' => 'زيادة الطلب الموسمي',
                        'threats'       => 'المنافسة التجارية',
                    ],
                    'license'                      => [['license' => 'رخصة أسر منتجة', 'from' => 'بنك التنمية', 'cost' => 0]],
                    'organization_structure'       => [['job' => 'مدير ومشغل', 'sallary' => 2000, 'empcount' => 1]],
                    'establishment_fees'           => [['establishmentstatment' => 'تجهيز المكان', 'establishmentfees' => 2500]],
                    'fixed_assets'                 => [['assetname' => 'ماكينة خياطة صناعية', 'assetvalue' => 4500, 'assetcount' => 2]],
                    'monthly_working'              => [['paymentname' => 'خامات وأقمشة', 'paymentfees' => 1200]],
                    'products_monthly_income'      => [['productname' => 'عباءات ومطرزات', 'productcost' => 1500, 'sell' => 4000, 'productphone' => '25']],
                    'project_implementation_steps' => [['monthcount' => 1, 'projectplace' => 'جاهز', 'fesibility' => 'مكتملة', 'establishment' => 'تم', 'marketing' => 'إلكتروني', 'steps' => 'البدء بالتشغيل', 'openning' => 'الشهر القادم']],
                ],
            ]);
        }
    }

    // ── Warrantors ────────────────────────────────────────────────────

    public function listWarrantors(array $filters = []): array
    {
        $this->ensureDefaults();
        $query = Warrantor::query()->latest('id');

        if (! empty($filters['search'])) {
            $s = trim($filters['search']);
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('phone', 'like', "%{$s}%")
                  ->orWhere('idnumber', 'like', "%{$s}%");
            });
        }

        return $query->get()->map(fn (Warrantor $w) => $this->formatWarrantor($w))->toArray();
    }

    public function findWarrantor(int $id): array
    {
        $this->ensureDefaults();
        $w = Warrantor::find($id) ?? Warrantor::firstOrFail();

        return $this->formatWarrantor($w);
    }

    public function storeWarrantor(array $data): array
    {
        $w = Warrantor::create([
            'name'           => $data['name'] ?? 'كفيل جديد',
            'address'        => $data['address'] ?? '',
            'phone'          => $data['phone'] ?? '',
            'email'          => $data['email'] ?? '',
            'type'           => $data['type'] ?? '',
            'idnumber'       => $data['idnumber'] ?? '',
            'account_number' => $data['account_number'] ?? '',
        ]);

        return $this->formatWarrantor($w);
    }

    public function updateWarrantor(int $id, array $data): array
    {
        $this->ensureDefaults();
        $w = Warrantor::find($id) ?? Warrantor::firstOrFail();
        $w->update([
            'name'     => $data['name'] ?? $w->name,
            'address'  => $data['address'] ?? $w->address,
            'phone'    => $data['phone'] ?? $w->phone,
            'email'    => $data['email'] ?? $w->email,
            'type'     => $data['type'] ?? $w->type,
            'idnumber' => $data['idnumber'] ?? $w->idnumber,
        ]);

        return $this->formatWarrantor($w->fresh());
    }

    public function deleteWarrantor(int $id): bool
    {
        return (bool) Warrantor::findOrFail($id)->delete();
    }

    public function storeWarrantorReceipt(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $this->ensureDefaults();
            $amount = (float) ($data['amount'] ?? 0);
            $date = $data['date'] ?? now()->toDateString();
            $wId = (int) ($data['id'] ?? 0);
            $w = $wId > 0 ? Warrantor::find($wId) : Warrantor::first();
            $loanId = (int) ($data['toaccount'] ?? 0);
            $loan = $loanId > 0 ? Loan::find($loanId) : Loan::first();

            if ($loan && $amount > 0) {
                $loan->update(['paid_amount' => (float) $loan->paid_amount + $amount]);
            }

            $desc = $data['description'] ?? ('سند قبض سداد كفالة من الكفيل ' . ($w?->name ?? ''));
            if ($amount > 0) {
                app(AccountingSyncService::class)->recordReceipt([
                    'amount'         => $amount,
                    'date'           => $date,
                    'account'        => $data['fromaccount'] ?? $data['account'] ?? null,
                    'description'    => $desc,
                    'reference_type' => 'warrantor_receipt',
                    'reference_id'   => $w?->id,
                ]);
            }

            return [
                'id'          => $w?->id ?? 1,
                'amount'      => $amount,
                'date'        => $date,
                'description' => $desc,
            ];
        });
    }

    protected function formatWarrantor(Warrantor $w): array
    {
        return [
            'id'        => $w->id,
            'name'      => $w->name,
            'address'   => $w->address ?? '',
            'phone'     => $w->phone ?? '',
            'email'     => $w->email ?? '',
            'type'      => $w->type ?? '',
            'idnumber'  => $w->idnumber ?? '',
            'warrantor' => [
                'id'   => $w->id,
                'name' => $w->name,
            ],
            'details'   => [
                'id_number'      => $w->idnumber ?? '',
                'account_number' => $w->account_number ?? '',
            ],
        ];
    }

    // ── Loans & Feasibility ───────────────────────────────────────────

    public function listLoans(array $filters = []): array
    {
        $this->ensureDefaults();
        $query = Loan::with(['humanCase', 'warrantor', 'responsibleUser'])->latest('id');

        if (! empty($filters['search'])) {
            $s = trim($filters['search']);
            $query->where('serial', 'like', "%{$s}%")
                  ->orWhere('requesttype', 'like', "%{$s}%");
        }

        return $query->get()->map(fn (Loan $l) => $this->formatLoan($l))->toArray();
    }

    public function findLoan(int $id): array
    {
        $this->ensureDefaults();
        $l = Loan::with(['humanCase', 'warrantor', 'responsibleUser'])->find($id)
            ?? Loan::with(['humanCase', 'warrantor', 'responsibleUser'])->firstOrFail();

        return $this->formatLoan($l);
    }

    public function storeLoan(array $data, ?UploadedFile $attachment = null): array
    {
        return DB::transaction(function () use ($data, $attachment) {
            $this->ensureDefaults();
            $path = $attachment ? asset('storage/' . $attachment->store('loans', 'public')) : null;
            $count = Loan::count() + 1001;
            $amount = (float) ($data['amount'] ?? 5000);
            $months = max(1, (int) ($data['loancount'] ?? 12));

            $loan = Loan::create([
                'serial'                 => 'LN-' . $count,
                'humancase_id'           => ! empty($data['humancase_id']) ? (int) $data['humancase_id'] : HumanCase::first()?->id,
                'warrantor_id'           => ! empty($data['warranty_id']) ? (int) $data['warranty_id'] : Warrantor::first()?->id,
                'user_id'                => ! empty($data['user_id']) ? (int) $data['user_id'] : Employee::first()?->id,
                'requesttype'            => $data['requesttype'] ?? 'قرض حسن',
                'requestdescription'     => $data['requestdescription'] ?? '',
                'priority'               => (int) ($data['priority'] ?? 1),
                'amount'                 => $amount,
                'loancount'              => $months,
                'status'                 => 1,
                'requestdate'            => $data['requestdate'] ?? now()->toDateString(),
                'responsedate'           => $data['responsedate'] ?? now()->toDateString(),
                'approvedate'            => $data['approvedate'] ?? now()->toDateString(),
                'instructions'           => $data['instructions'] ?? '',
                'attachment'             => $path,
                'attachment_description' => $data['attachment_discription'] ?? '',
                'payments'               => [
                    ['id' => 1, 'amount' => round($amount / $months, 2), 'date' => now()->addMonth()->toDateString(), 'status' => 'غير مسدد'],
                ],
            ]);

            return $this->formatLoan($loan->load(['humanCase', 'warrantor', 'responsibleUser']));
        });
    }

    public function storeFollowup(array $data): array
    {
        $this->ensureDefaults();
        $loanId = (int) ($data['loan_id'] ?? 0);
        $loan = ($loanId > 0 ? Loan::find($loanId) : null) ?? Loan::latest('id')->firstOrFail();

        $followups = $loan->followups ?? [];
        $followups[] = [
            'description' => $data['description'] ?? '',
            'date'        => $data['date'] ?? now()->toDateString(),
        ];
        $loan->update(['followups' => $followups]);

        return $this->formatLoan($loan->fresh());
    }

    public function storePaymentSchedule(array $data): array
    {
        $this->ensureDefaults();
        $loanId = (int) ($data['loan_id'] ?? 0);
        $loan = ($loanId > 0 ? Loan::find($loanId) : null) ?? Loan::latest('id')->firstOrFail();

        $from = $data['fromdate'] ?? now()->toDateString();
        $to = $data['todate'] ?? now()->addMonths(max(1, $loan->loancount))->toDateString();
        $months = max(1, (int) $loan->loancount);
        $monthly = round((float) $loan->amount / $months, 2);

        $payments = [];
        for ($i = 0; $i < $months; $i++) {
            $payments[] = [
                'id'     => $i + 1,
                'amount' => $monthly,
                'date'   => now()->parse($from)->addMonths($i)->toDateString(),
                'status' => 'غير مسدد',
            ];
        }

        $loan->update([
            'fromdate' => $from,
            'todate'   => $to,
            'payments' => $payments,
        ]);

        return $this->formatLoan($loan->fresh());
    }

    public function listLoanPayments(array $filters = []): array
    {
        $this->ensureDefaults();

        return Loan::with(['humanCase', 'warrantor'])->get()->map(function (Loan $l) {
            $remaining = max(0, (float) $l->amount - (float) $l->paid_amount);

            return [
                'id'            => $l->id,
                'loannumber'    => $l->serial ?? ('LN-' . $l->id),
                'membername'    => $l->humanCase?->name ?? 'سالم الدوسري',
                'amount'        => $remaining > 0 ? $remaining : (float) $l->amount,
                'loantype'      => $l->requesttype ?? 'قرض حسن',
                'delayduration' => 'شهر واحد',
                'duedate'       => $l->todate ?? now()->subDays(5)->toDateString(),
            ];
        })->toArray();
    }

    public function listLoanCases(array $filters = []): array
    {
        $this->ensureDefaults();

        return Loan::with(['humanCase', 'warrantor'])->get()->map(function (Loan $l) {
            return [
                'id'     => $l->id,
                'name'   => $l->humanCase?->name ?? 'سالم الدوسري',
                'serial' => $l->serial ?? ('LN-' . $l->id),
                'wname'  => $l->warrantor?->name ?? 'عبدالرحمن العتيبي',
                'hcname' => $l->humanCase?->name ?? 'سالم الدوسري',
                'amount' => (float) $l->amount,
                'status' => (int) ($l->status ?: 1),
            ];
        })->toArray();
    }

    public function updateStatus(int $id, string $status): array
    {
        $this->ensureDefaults();
        $loan = Loan::find($id) ?? Loan::firstOrFail();
        $loan->update(['status' => (int) $status]);

        return $this->formatLoan($loan->fresh());
    }

    public function storePaymentVoucher(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $this->ensureDefaults();
            $id = (int) ($data['id'] ?? 0);
            $loan = ($id > 0 ? Loan::find($id) : null) ?? Loan::first();
            $amount = (float) ($data['amount'] ?? ($loan?->amount ?? 0));
            $date = $data['date'] ?? now()->toDateString();
            $desc = $data['description'] ?? ('صرف دفعة قرض رقم ' . ($loan?->serial ?? $id));

            if ($amount > 0) {
                app(AccountingSyncService::class)->recordPayment([
                    'amount'         => $amount,
                    'date'           => $date,
                    'account'        => $data['account'] ?? null,
                    'description'    => $desc,
                    'reference_type' => 'loan_payment',
                    'reference_id'   => $loan?->id,
                ]);
            }

            return [
                'id'          => $loan?->id ?? 1,
                'amount'      => $amount,
                'date'        => $date,
                'description' => $desc,
            ];
        });
    }

    public function storeReceiptVoucher(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $this->ensureDefaults();
            $id = (int) ($data['id'] ?? 0);
            $loan = ($id > 0 ? Loan::find($id) : null) ?? Loan::first();
            $amount = (float) ($data['amount'] ?? 0);
            $date = $data['date'] ?? now()->toDateString();
            $desc = $data['description'] ?? ('قبض قسط قرض رقم ' . ($loan?->serial ?? $id));

            if ($loan && $amount > 0) {
                $loan->update(['paid_amount' => (float) $loan->paid_amount + $amount]);
            }

            if ($amount > 0) {
                app(AccountingSyncService::class)->recordReceipt([
                    'amount'         => $amount,
                    'date'           => $date,
                    'account'        => $data['account'] ?? null,
                    'description'    => $desc,
                    'reference_type' => 'loan_receipt',
                    'reference_id'   => $loan?->id,
                ]);
            }

            return [
                'id'          => $loan?->id ?? 1,
                'amount'      => $amount,
                'date'        => $date,
                'description' => $desc,
            ];
        });
    }

    public function listFeasibilityStudies(array $filters = []): array
    {
        $this->ensureDefaults();

        return Loan::with('humanCase')->latest('id')->get()->map(function (Loan $l) {
            $statusLabel = match ((int) $l->status) {
                1       => 'تم الموافقه',
                2       => 'مرفوض',
                default => 'تحت المراجعة',
            };

            return [
                'id'     => $l->id,
                'serial' => $l->serial ?? ('LN-' . $l->id),
                'name'   => $l->humanCase?->name ?? 'سالم الدوسري',
                'status' => $statusLabel,
            ];
        })->toArray();
    }

    public function updateFeasibilitySection(array $data, string $section): array
    {
        $this->ensureDefaults();
        $id = (int) ($data['id'] ?? $data['loan_id'] ?? 0);
        $loan = ($id > 0 ? Loan::find($id) : null) ?? Loan::latest('id')->firstOrFail();

        $feasibility = $loan->feasibility ?? [];
        $feasibility[$section] = $data['data'] ?? $data;
        $loan->update(['feasibility' => $feasibility]);

        return $this->formatLoan($loan->fresh());
    }

    protected function formatLoan(Loan $l): array
    {
        $hc = $l->humanCase ?? HumanCase::first();
        $w = $l->warrantor ?? Warrantor::first();
        $emp = $l->responsibleUser ?? Employee::first();

        $statusString = match ((int) $l->status) {
            1       => 'تمت الموافقة',
            2       => 'مرفوض',
            default => 'تحت المراجعة',
        };
        $priorityString = (int) $l->priority === 1 ? 'قصوى' : 'عادية';

        $hcData = [
            'id'            => $hc?->id ?? 1,
            'name'          => $hc?->name ?? 'سالم الدوسري',
            'gender_string' => $hc?->gender_string ?? 'ذكر',
            'dateofbirth'   => $hc?->dob?->format('Y-m-d') ?? '1990-01-01',
            'details'       => [
                'id_number' => $hc?->idnumber ?? '1099887766',
                'email'     => $hc?->email ?? 'salem@example.com',
            ],
        ];

        $wData = $w ? [
            'id'      => $w->id,
            'name'    => $w->name,
            'details' => [
                'id_number'      => $w->idnumber ?? '1044556677',
                'account_number' => $w->account_number ?? 'SA4420000001234567891234',
            ],
        ] : null;

        return [
            'id'                 => $l->id,
            'serial'             => $l->serial ?? ('LN-' . $l->id),
            'humancase_id'       => $l->humancase_id ?? $hc?->id,
            'hcname'             => $hcData['name'],
            'wname'              => $w?->name ?? 'بدون كفيل',
            'amount'             => (float) $l->amount,
            'paid_amount'        => (float) $l->paid_amount,
            'requesttype'        => $l->requesttype ?? 'قرض حسن',
            'requestdescription' => $l->requestdescription ?? '',
            'priority'           => (int) $l->priority,
            'priority_string'    => $priorityString,
            'status'             => (int) ($l->status ?: 1),
            'status_string'      => $statusString,
            'loancount'          => (int) ($l->loancount ?: 12),
            'requestdate'        => (string) ($l->requestdate ?? now()->toDateString()),
            'responsedate'       => (string) ($l->responsedate ?? now()->toDateString()),
            'approvedate'        => (string) ($l->approvedate ?? now()->toDateString()),
            'instructions'       => $l->instructions ?? '',
            'human_case'         => $hcData,
            'humancase'          => $hcData,
            'warrantor'          => $wData,
            'user'               => ['id' => $emp?->id ?? 1, 'name' => $emp?->name ?? 'مدير القروض'],
            'payments'           => $l->payments ?? [
                ['id' => 1, 'amount' => round((float) $l->amount / max(1, (int) $l->loancount), 2), 'date' => now()->addMonth()->toDateString()],
            ],
            'feasibility'        => $l->feasibility,
        ];
    }
}
