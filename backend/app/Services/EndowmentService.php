<?php

namespace App\Services;

use App\Models\Archive;
use App\Models\Employee;
use App\Models\Endowment;
use App\Services\Accounting\AccountingSyncService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class EndowmentService
{
    public function ensureDefaults(): void
    {
        if (Endowment::count() === 0) {
            $emp = Employee::first();
            Endowment::create([
                'name'            => 'وقف الخير العقاري الأول',
                'description'     => 'عمارة سكنية وتجارية مخصصة لدعم الأيتام والأسر المتعففة',
                'endowmentnumber' => '4401002390',
                'date'            => '2025-02-01',
                'ownertype'       => 'صك شرعي',
                'endowmentsource' => 'كتابة العدل الأولى بالرياض',
                'type'            => 'عقار',
                'area'            => '850 م2',
                'houseamount'     => '12',
                'city'            => 'الرياض',
                'country'         => 'المملكة العربية السعودية',
                'casetype'        => 'مؤجر',
                'employee_id'     => $emp?->id,
                'amount'          => 15000,
                'paid'            => 10000,
                'remain'          => 5000,
                'annualfees'      => 20000,
                'netprofit'       => 180000,
                'status'          => 1,
                'transactions'    => [
                    [
                        'id'                      => 1,
                        'invoice_number'          => 'END-00101',
                        'date'                    => now()->subDays(10)->toDateString(),
                        'transaction_type'        => 1,
                        'transaction_type_string' => 'سند قبض (إيراد وقف)',
                        'type_string'             => 'تحويل بنكي',
                        'amount'                  => 45000,
                        'description'             => 'تحصيل إيجار الربع الأول لوقف الخير',
                    ],
                ],
            ]);
        }

        if (Archive::count() === 0) {
            Archive::create([
                'name'        => 'اللائحة الأساسية للجمعية',
                'description' => 'نسخة معتمدة من اللائحة الأساسية والترخيص الرسمي',
                'date'        => now()->subMonths(3)->toDateString(),
                'upload'      => asset('storage/archives/charter.pdf'),
            ]);
        }
    }

    public function list(array $filters = []): array
    {
        $this->ensureDefaults();
        $query = Endowment::with('employee')->latest('id');

        if (! empty($filters['search'])) {
            $s = trim($filters['search']);
            $query->where('name', 'like', "%{$s}%")
                  ->orWhere('type', 'like', "%{$s}%")
                  ->orWhere('endowmentnumber', 'like', "%{$s}%");
        }

        return $query->get()->map(fn (Endowment $e) => $this->formatEndowment($e))->toArray();
    }

    public function find(int $id): array
    {
        $this->ensureDefaults();
        $e = Endowment::with('employee')->find($id) ?? Endowment::with('employee')->firstOrFail();

        return $this->formatEndowment($e);
    }

    public function store(array $data, ?UploadedFile $upload = null): array
    {
        return DB::transaction(function () use ($data, $upload) {
            $url = $upload ? asset('storage/' . $upload->store('endowments', 'public')) : null;
            $annualFees = (float) ($data['annualfees'] ?? 0);
            $amount = (float) ($data['amount'] ?? 0);

            $e = Endowment::create([
                'name'            => $data['name'] ?? 'وقف جديد',
                'description'     => $data['description'] ?? '',
                'endowmentnumber' => $data['endowmentnumber'] ?? '',
                'date'            => ! empty($data['date']) ? $data['date'] : now()->toDateString(),
                'ownertype'       => $data['ownertype'] ?? '',
                'endowmentsource' => $data['endowmentsource'] ?? '',
                'type'            => $data['type'] ?? 'عقار',
                'description1'    => $data['description1'] ?? '',
                'area'            => $data['area'] ?? '',
                'houseamount'     => $data['houseamount'] ?? '',
                'buildnumber'     => $data['buildnumber'] ?? '',
                'streetname'      => $data['streetname'] ?? '',
                'city'            => $data['city'] ?? '',
                'country'         => $data['country'] ?? '',
                'zip'             => $data['zip'] ?? '',
                'state'           => $data['state'] ?? '',
                'zipcode'         => $data['zipcode'] ?? '',
                'geolocation'     => $data['geolocation'] ?? '',
                'latitude'        => $data['latitude'] ?? '',
                'longitude'       => $data['longitude'] ?? '',
                'upload'          => $url,
                'casetype'        => $data['casetype'] ?? 'مؤجر',
                'employee_id'     => ! empty($data['response']) ? (int) $data['response'] : Employee::first()?->id,
                'amount'          => $amount,
                'paid'            => 0,
                'remain'          => $annualFees > 0 ? $annualFees : $amount,
                'annualfees'      => $annualFees,
                'netprofit'       => (float) ($data['netprofit'] ?? 0),
                'account'         => $data['account'] ?? '',
                'status'          => 1,
                'transactions'    => [],
            ]);

            return $this->formatEndowment($e->load('employee'));
        });
    }

    public function update(int $id, array $data, ?UploadedFile $upload = null): array
    {
        $this->ensureDefaults();
        $e = Endowment::find($id) ?? Endowment::firstOrFail();
        $updates = array_filter([
            'name'            => $data['name'] ?? $e->name,
            'description'     => $data['description'] ?? $e->description,
            'endowmentnumber' => $data['endowmentnumber'] ?? $e->endowmentnumber,
            'date'            => $data['date'] ?? $e->date,
            'ownertype'       => $data['ownertype'] ?? $e->ownertype,
            'endowmentsource' => $data['endowmentsource'] ?? $e->endowmentsource,
            'type'            => $data['type'] ?? $e->type,
            'casetype'        => $data['casetype'] ?? $e->casetype,
            'amount'          => isset($data['amount']) ? (float) $data['amount'] : $e->amount,
            'annualfees'      => isset($data['annualfees']) ? (float) $data['annualfees'] : $e->annualfees,
            'netprofit'       => isset($data['netprofit']) ? (float) $data['netprofit'] : $e->netprofit,
        ], fn ($val) => $val !== null);

        if ($upload) {
            $updates['upload'] = asset('storage/' . $upload->store('endowments', 'public'));
        }

        $e->update($updates);

        return $this->formatEndowment($e->fresh('employee'));
    }

    public function storeVoucher(array $data, int $transactionType = 1): array
    {
        return DB::transaction(function () use ($data, $transactionType) {
            $this->ensureDefaults();
            $id = (int) ($data['id'] ?? 0);
            $e = ($id > 0 ? Endowment::find($id) : null) ?? Endowment::firstOrFail();
            $amount = (float) ($data['amount'] ?? 0);
            $date = $data['date'] ?? now()->toDateString();
            $desc = $data['description'] ?? ($transactionType === 1 ? "سند قبض إيراد وقف ({$e->name})" : "سند صرف مصروفات وقف ({$e->name})");
            $invoiceNumber = 'END-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));

            $txs = $e->transactions ?? [];
            $newTx = [
                'id'                      => count($txs) + 1,
                'invoice_number'          => $invoiceNumber,
                'date'                    => $date,
                'transaction_type'        => $transactionType,
                'transaction_type_string' => $transactionType === 1 ? 'سند قبض (إيراد وقف)' : 'سند صرف (مصروف وقف)',
                'type_string'             => 'تحويل بنكي',
                'amount'                  => $amount,
                'description'             => $desc,
            ];
            $txs[] = $newTx;

            $paid = (float) $e->paid + ($transactionType === 2 ? $amount : 0);
            $remain = max(0, (float) $e->annualfees - $paid);
            $e->update([
                'transactions' => $txs,
                'paid'         => $paid,
                'remain'       => $remain,
            ]);

            if ($amount > 0) {
                if ($transactionType === 1) {
                    app(AccountingSyncService::class)->recordReceipt([
                        'amount'         => $amount,
                        'date'           => $date,
                        'account'        => $data['account'] ?? null,
                        'description'    => $desc,
                        'reference_type' => 'endowment_receipt',
                        'reference_id'   => $e->id,
                    ]);
                } else {
                    app(AccountingSyncService::class)->recordPayment([
                        'amount'         => $amount,
                        'date'           => $date,
                        'account'        => $data['account'] ?? null,
                        'description'    => $desc,
                        'reference_type' => 'endowment_payment',
                        'reference_id'   => $e->id,
                    ]);
                }
            }

            return $newTx;
        });
    }

    public function transactions(int $id): array
    {
        $this->ensureDefaults();
        $e = Endowment::find($id) ?? Endowment::first();

        return $e?->transactions ?? [];
    }

    public function showVoucher(int $id): array
    {
        $this->ensureDefaults();
        foreach (Endowment::all() as $e) {
            foreach ($e->transactions ?? [] as $tx) {
                if ((int) ($tx['id'] ?? 0) === $id) {
                    return $tx;
                }
            }
        }

        $first = Endowment::first()?->transactions[0] ?? null;

        return $first ?: [
            'id'                      => $id,
            'invoice_number'          => 'END-00101',
            'amount'                  => 5000,
            'description'             => 'سند وقف خيري',
            'date'                    => now()->toDateString(),
            'transaction_type_string' => 'تحويل بنكي',
        ];
    }

    protected function formatEndowment(Endowment $e): array
    {
        return [
            'id'              => $e->id,
            'name'            => $e->name,
            'description'     => $e->description ?? '',
            'endowmentnumber' => $e->endowmentnumber ?? '',
            'date'            => $e->date ?? now()->toDateString(),
            'ownertype'       => $e->ownertype ?? '',
            'endowmentsource' => $e->endowmentsource ?? '',
            'type'            => $e->type ?? 'عقار',
            'casetype'        => $e->casetype ?? 'مؤجر',
            'status_string'   => $e->casetype ?: 'نشط',
            'empname'         => $e->employee?->name ?? 'أحمد السالم',
            'response'        => $e->employee_id,
            'amount'          => (float) $e->amount,
            'yearlyfees'      => (float) $e->annualfees,
            'annualfees'      => (float) $e->annualfees,
            'annualcost'      => (float) $e->annualfees,
            'remainedfees'    => (float) $e->remain,
            'remainingvalue'  => (float) $e->remain,
            'profit'          => (float) $e->netprofit,
            'netprofit'       => (float) $e->netprofit,
            'total'           => (float) ($e->paid ?: $e->amount),
        ];
    }

    // ── Archives ──────────────────────────────────────────────────────

    public function listArchives(array $filters = []): array
    {
        $this->ensureDefaults();
        $query = Archive::query()->latest('id');

        if (! empty($filters['search'])) {
            $s = trim($filters['search']);
            $query->where('name', 'like', "%{$s}%")
                  ->orWhere('description', 'like', "%{$s}%");
        }

        return $query->get()->map(fn (Archive $a) => [
            'id'          => $a->id,
            'name'        => $a->name,
            'description' => $a->description ?? '',
            'date'        => $a->date ?? $a->created_at?->format('Y-m-d') ?? now()->toDateString(),
            'upload'      => $a->upload ?? '#',
        ])->toArray();
    }

    public function storeArchive(array $data, ?UploadedFile $file = null): Archive
    {
        $url = $file ? asset('storage/' . $file->store('archives', 'public')) : asset('storage/archives/document.pdf');

        return Archive::create([
            'name'        => $data['name'] ?? 'مستند مؤرشف',
            'description' => $data['note'] ?? $data['description'] ?? '',
            'date'        => $data['date'] ?? now()->toDateString(),
            'upload'      => $url,
        ]);
    }

    public function deleteArchive(int $id): bool
    {
        return (bool) Archive::findOrFail($id)->delete();
    }
}
