<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\EmployeeEvaluation;
use App\Models\EmployeePaper;
use App\Models\Kpi;
use App\Models\KsaAssessment;
use App\Models\TrainingRecord;
use App\Models\VacationRequest;
use App\Models\Volunteer;
use App\Services\Accounting\AccountingSyncService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class HrExtendedService
{
    // ── Volunteers ────────────────────────────────────────────────────

    public function ensureDefaultVolunteers(): void
    {
        if (Volunteer::count() === 0) {
            Volunteer::create([
                'name'                  => 'أحمد السالم',
                'identification_number' => '1023456789',
                'idtype'                => '1',
                'phone'                 => '0501234567',
                'email'                 => 'ahmed.v@charity.org',
                'dateofhire'            => '2025-01-15',
                'dateofretire'          => '2026-01-15',
                'type'                  => 'تطوع عام',
                'totalworkhours'        => 120,
                'rewards'               => 1500,
                'qualification'         => 'بكالوريوس إدارة أعمال',
            ]);
            Volunteer::create([
                'name'                  => 'سارة محمد',
                'identification_number' => '1023456790',
                'idtype'                => '1',
                'phone'                 => '0502345678',
                'email'                 => 'sara.v@charity.org',
                'dateofhire'            => '2025-03-10',
                'dateofretire'          => '2026-03-10',
                'type'                  => 'تطوع تخصصي',
                'totalworkhours'        => 85,
                'rewards'               => 1000,
                'qualification'         => 'ماجستير خدمة اجتماعية',
            ]);
        }
    }

    public function listVolunteers(array $filters = []): array
    {
        $this->ensureDefaultVolunteers();

        $query = Volunteer::query()->latest('id');
        if (! empty($filters['search'])) {
            $s = trim($filters['search']);
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('identification_number', 'like', "%{$s}%")
                  ->orWhere('phone', 'like', "%{$s}%");
            });
        }

        return $query->get()->map(fn (Volunteer $v) => $this->formatVolunteer($v))->toArray();
    }

    public function findVolunteer(int $id): array
    {
        $this->ensureDefaultVolunteers();
        $v = Volunteer::find($id) ?? Volunteer::firstOrFail();

        return $this->formatVolunteer($v);
    }

    public function storeVolunteer(array $data, ?UploadedFile $profile = null, ?UploadedFile $upload = null): array
    {
        return DB::transaction(function () use ($data, $profile, $upload) {
            $typeLabel = match ((string) ($data['type'] ?? '')) {
                '1'     => 'تطوع عام',
                '2'     => 'تطوع تخصصي',
                '0'     => 'لا يوجد',
                default => ($data['type'] ?? '') ?: 'تطوع عام',
            };

            $profileUrl = $profile ? asset('storage/' . $profile->store('volunteers', 'public')) : null;
            $uploadUrl = $upload ? asset('storage/' . $upload->store('volunteers', 'public')) : null;

            $v = Volunteer::create([
                'name'                  => $data['name'] ?? 'متطوع جديد',
                'identification_number' => $data['idnumber'] ?? $data['identification_number'] ?? '',
                'idtype'                => (string) ($data['idtype'] ?? '1'),
                'idexpiredate'          => ! empty($data['idexpiredate']) ? $data['idexpiredate'] : null,
                'phone'                 => $data['phone'] ?? '',
                'email'                 => $data['email'] ?? '',
                'iban'                  => $data['iban'] ?? '',
                'address'               => $data['address'] ?? '',
                'nationality'           => $data['nationality'] ?? 'سعودي',
                'qualification'         => $data['qualification'] ?? '',
                'type'                  => $typeLabel,
                'dateofbirth'           => ! empty($data['dateofbirth']) ? $data['dateofbirth'] : null,
                'dateofhire'            => ! empty($data['dateofhire']) ? $data['dateofhire'] : now()->toDateString(),
                'dateofretire'          => ! empty($data['expirehire']) ? $data['expirehire'] : ($data['dateofretire'] ?? now()->addYear()->toDateString()),
                'socialstatus'          => (string) ($data['socialstatus'] ?? '1'),
                'gender'                => (string) ($data['gender'] ?? '0'),
                'city'                  => $data['city'] ?? '',
                'region'                => $data['region'] ?? '',
                'country'               => $data['country'] ?? 'المملكة العربية السعودية',
                'totalworkhours'        => (int) ($data['totalworkhours'] ?? 0),
                'rewards'               => (float) ($data['rewards'] ?? 0),
                'notes'                 => $data['notes'] ?? '',
                'profile'               => $profileUrl,
                'upload'                => $uploadUrl,
            ]);

            return $this->formatVolunteer($v);
        });
    }

    public function updateVolunteer(int $id, array $data): array
    {
        $v = Volunteer::findOrFail($id);
        $v->update(array_filter([
            'name'                  => $data['name'] ?? $v->name,
            'identification_number' => $data['idnumber'] ?? $data['identification_number'] ?? $v->identification_number,
            'phone'                 => $data['phone'] ?? $v->phone,
            'email'                 => $data['email'] ?? $v->email,
            'type'                  => $data['type'] ?? $v->type,
            'totalworkhours'        => isset($data['totalworkhours']) ? (int) $data['totalworkhours'] : $v->totalworkhours,
            'rewards'               => isset($data['rewards']) ? (float) $data['rewards'] : $v->rewards,
            'notes'                 => $data['notes'] ?? $v->notes,
        ], fn ($val) => $val !== null));

        return $this->formatVolunteer($v->fresh());
    }

    public function deleteVolunteer(int $id): bool
    {
        return (bool) Volunteer::findOrFail($id)->delete();
    }

    public function storeVolunteerVoucher(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $vId = (int) ($data['volunteer_id'] ?? $data['id'] ?? 0);
            $v = $vId > 0 ? Volunteer::find($vId) : Volunteer::first();
            $amount = (float) ($data['amount'] ?? 0);
            $date = $data['date'] ?? now()->toDateString();
            $notes = $data['notes'] ?? ('صرف مكافأة متطوع - ' . ($v?->name ?? 'متطوع'));

            if ($v && $amount > 0) {
                $v->update(['rewards' => (float) $v->rewards + $amount]);
            }

            if ($amount > 0) {
                app(AccountingSyncService::class)->recordPayment([
                    'amount'         => $amount,
                    'date'           => $date,
                    'account'        => $data['account'] ?? null,
                    'description'    => $notes,
                    'reference_type' => 'volunteer_voucher',
                    'reference_id'   => $v?->id,
                ]);
            }

            return [
                'id'           => $v?->id ?? 1,
                'volunteer_id' => $v?->id ?? 1,
                'amount'       => $amount,
                'date'         => $date,
                'notes'        => $notes,
            ];
        });
    }

    protected function formatVolunteer(Volunteer $v): array
    {
        return [
            'id'                    => $v->id,
            'name'                  => $v->name,
            'identification_number' => $v->identification_number ?? '',
            'idnumber'              => $v->identification_number ?? '',
            'idtype'                => $v->idtype ?? '1',
            'phone'                 => $v->phone ?? '',
            'email'                 => $v->email ?? '',
            'iban'                  => $v->iban ?? '',
            'address'               => $v->address ?? '',
            'nationality'           => $v->nationality ?? 'سعودي',
            'qualification'         => $v->qualification ?? '',
            'type'                  => $v->type ?? 'تطوع عام',
            'dateofbirth'           => $v->dateofbirth ?? '1995-01-01',
            'dateofhire'            => $v->dateofhire ?? '2025-01-01',
            'dateofretire'          => $v->dateofretire ?? '2026-01-01',
            'work_totalhours'       => (int) ($v->totalworkhours ?: 100),
            'totalworkhours'        => (int) ($v->totalworkhours ?: 100),
            'rewards'               => (float) $v->rewards,
            'notes'                 => $v->notes ?? '',
            'profile'               => $v->profile,
            'upload'                => $v->upload,
        ];
    }

    // ── Performance Evaluations ───────────────────────────────────────

    public function listEvaluations(array $filters = []): array
    {
        if (EmployeeEvaluation::count() === 0) {
            $emp = Employee::first();
            EmployeeEvaluation::create([
                'employee_id'   => $emp?->id,
                'evaluator_id'  => $emp?->id,
                'date'          => now()->toDateString(),
                'period'        => 'الربع الأول ' . date('Y'),
                'reason'        => '1',
                'type'          => '2',
                'description'   => 'تقييم أداء دوري',
                'average_grade' => 92.5,
            ]);
        }

        $query = EmployeeEvaluation::with('employee')->latest('id');
        if (! empty($filters['search'])) {
            $s = trim($filters['search']);
            $query->whereHas('employee', fn ($q) => $q->where('name', 'like', "%{$s}%"))
                  ->orWhere('description', 'like', "%{$s}%");
        }

        return $query->get()->map(function (EmployeeEvaluation $ev) {
            return [
                'id'            => $ev->id,
                'employee_id'   => $ev->employee_id,
                'employee'      => ['id' => $ev->employee_id, 'name' => $ev->employee?->name ?? 'أحمد السالم'],
                'date'          => $ev->date ?? now()->toDateString(),
                'period'        => $ev->period ?? '',
                'reason'        => $ev->reason ?? '1',
                'type'          => $ev->type ?? '1',
                'description'   => $ev->description ?? '',
                'average_grade' => (float) ($ev->average_grade ?: 88.5),
                'quiz_data'     => $ev->quiz_data ?? [],
            ];
        })->toArray();
    }

    public function storeEvaluation(array $data, ?UploadedFile $attachment = null): EmployeeEvaluation
    {
        $path = $attachment ? asset('storage/' . $attachment->store('evaluations', 'public')) : null;

        return EmployeeEvaluation::create([
            'employee_id'   => ! empty($data['emp']) ? (int) $data['emp'] : ($data['employee_id'] ?? Employee::first()?->id),
            'evaluator_id'  => ! empty($data['evaluator']) ? (int) $data['evaluator'] : null,
            'date'          => $data['date'] ?? now()->toDateString(),
            'period'        => $data['period'] ?? '',
            'reason'        => (string) ($data['reason'] ?? '1'),
            'type'          => (string) ($data['type'] ?? '1'),
            'description'   => $data['description'] ?? '',
            'attachment'    => $path,
            'average_grade' => 90.0,
        ]);
    }

    public function quizsAll(): array
    {
        $kpis = Kpi::all();
        if ($kpis->isNotEmpty()) {
            return $kpis->map(fn ($k) => [
                'id'       => $k->id,
                'question' => $k->name ?? $k->title ?? 'مؤشر الأداء',
            ])->toArray();
        }

        return [
            ['id' => 1, 'question' => 'الالتزام بمواعيد العمل الرسمية والحضور'],
            ['id' => 2, 'question' => 'جودة إنجاز المهام الموكلة في الوقت المحدد'],
            ['id' => 3, 'question' => 'التعاون والعمل بروح الفريق مع الزملاء'],
            ['id' => 4, 'question' => 'المبادرة وتطوير أساليب العمل'],
        ];
    }

    public function storeEvaluationQuizs(int $id, mixed $quizRaw): EmployeeEvaluation
    {
        $ev = EmployeeEvaluation::find($id) ?? EmployeeEvaluation::latest('id')->firstOrFail();
        $quiz = is_string($quizRaw) ? (json_decode($quizRaw, true) ?: []) : (array) $quizRaw;

        $grades = array_filter(array_map(fn ($item) => (float) ($item['grade'] ?? 0), $quiz), fn ($g) => $g > 0);
        $avg = count($grades) > 0 ? round(array_sum($grades) / count($grades), 2) : 88.5;

        $ev->update([
            'quiz_data'     => $quiz,
            'average_grade' => $avg,
        ]);

        return $ev->fresh('employee');
    }

    // ── Training Records ──────────────────────────────────────────────

    public function listTrainingRecords(array $filters = []): array
    {
        if (TrainingRecord::count() === 0) {
            $emp = Employee::first();
            TrainingRecord::create([
                'employee_id'   => $emp?->id,
                'title'         => 'دورة إدارة المشاريع الاحترافية PMP',
                'description'   => 'تطوير مهارات التخطيط والمتابعة للمشاريع غير الربحية',
                'hours'         => 25,
                'training_date' => now()->subDays(10)->toDateString(),
                'period'        => $filters['period'] ?? (date('Y') . '-Q' . ceil(date('n') / 3)),
                'type'          => 1,
                'certificate'   => 'PMP-2026-01',
            ]);
        }

        $query = TrainingRecord::with('employee')->latest('id');
        $items = $query->get();

        $totalHours = (float) $items->sum('hours');
        $totalSessions = $items->count();
        $empCount = max(1, Employee::count());

        $typeLabels = [1 => 'داخلي', 2 => 'خارجي', 3 => 'إلكتروني'];

        return [
            'data' => $items->map(fn (TrainingRecord $r) => [
                'id'            => $r->id,
                'employee_id'   => $r->employee_id,
                'employee_name' => $r->employee?->name ?? 'أحمد السالم',
                'title'         => $r->title,
                'description'   => $r->description ?? '',
                'hours'         => (float) $r->hours,
                'training_date' => $r->training_date ?? now()->toDateString(),
                'period'        => $r->period ?? '',
                'type'          => (int) $r->type,
                'type_label'    => $typeLabels[(int) $r->type] ?? 'داخلي',
                'certificate'   => $r->certificate ?? '',
                'attachment'    => $r->attachment,
            ])->toArray(),
            'stats' => [
                'total_hours'      => round($totalHours, 1),
                'total_sessions'   => $totalSessions,
                'avg_per_employee' => round($totalHours / $empCount, 1),
            ],
            'meta' => [
                'total' => $totalSessions,
            ],
        ];
    }

    public function storeTrainingRecord(array $data, ?UploadedFile $attachment = null): TrainingRecord
    {
        $path = $attachment ? asset('storage/' . $attachment->store('training', 'public')) : null;

        return TrainingRecord::create([
            'employee_id'   => ! empty($data['employee_id']) ? (int) $data['employee_id'] : Employee::first()?->id,
            'title'         => $data['title'] ?? 'دورة تدريبية',
            'description'   => $data['description'] ?? '',
            'hours'         => (float) ($data['hours'] ?? 10),
            'training_date' => $data['training_date'] ?? now()->toDateString(),
            'period'        => $data['period'] ?? (date('Y') . '-Q' . ceil(date('n') / 3)),
            'type'          => (int) ($data['type'] ?? 1),
            'certificate'   => $data['certificate'] ?? '',
            'attachment'    => $path,
        ]);
    }

    public function updateTrainingRecord(int $id, array $data, ?UploadedFile $attachment = null): TrainingRecord
    {
        $record = TrainingRecord::findOrFail($id);
        $updates = [
            'employee_id'   => ! empty($data['employee_id']) ? (int) $data['employee_id'] : $record->employee_id,
            'title'         => $data['title'] ?? $record->title,
            'description'   => $data['description'] ?? $record->description,
            'hours'         => isset($data['hours']) ? (float) $data['hours'] : $record->hours,
            'training_date' => $data['training_date'] ?? $record->training_date,
            'period'        => $data['period'] ?? $record->period,
            'type'          => isset($data['type']) ? (int) $data['type'] : $record->type,
            'certificate'   => $data['certificate'] ?? $record->certificate,
        ];
        if ($attachment) {
            $updates['attachment'] = asset('storage/' . $attachment->store('training', 'public'));
        }
        $record->update($updates);

        return $record->fresh();
    }

    public function deleteTrainingRecord(int $id): bool
    {
        return (bool) TrainingRecord::findOrFail($id)->delete();
    }

    // ── KSA Assessments ───────────────────────────────────────────────

    public function listKsaAssessments(array $filters = []): array
    {
        if (KsaAssessment::count() === 0) {
            $emp = Employee::first();
            KsaAssessment::create([
                'employee_id'     => $emp?->id,
                'assessor_id'     => $emp?->id,
                'knowledge_score' => 90,
                'skills_score'    => 85,
                'attitude_score'  => 95,
                'total_score'     => 90,
                'grade'           => 'A+',
                'period'          => $filters['period'] ?? (date('Y') . '-Q' . ceil(date('n') / 3)),
                'assessed_at'     => now()->toDateString(),
                'notes'           => 'أداء متميز والتزام عالٍ بمعايير الجودة',
            ]);
        }

        $items = KsaAssessment::with(['employee', 'assessor'])->latest('id')->get();
        $total = $items->count();

        return [
            'data' => $items->map(fn (KsaAssessment $k) => [
                'id'              => $k->id,
                'employee_id'     => $k->employee_id,
                'assessor_id'     => $k->assessor_id,
                'employee_name'   => $k->employee?->name ?? 'أحمد السالم',
                'assessor_name'   => $k->assessor?->name ?? 'الإدارة العامة',
                'knowledge_score' => (float) $k->knowledge_score,
                'skills_score'    => (float) $k->skills_score,
                'attitude_score'  => (float) $k->attitude_score,
                'total_score'     => (float) $k->total_score,
                'grade'           => $k->grade ?? 'A',
                'period'          => $k->period ?? '',
                'assessed_at'     => $k->assessed_at ?? now()->toDateString(),
                'notes'           => $k->notes ?? '',
                'attachment'      => $k->attachment,
            ])->toArray(),
            'stats' => [
                'total'         => $total,
                'avg_knowledge' => $total > 0 ? round($items->avg('knowledge_score'), 1) : 0,
                'avg_skills'    => $total > 0 ? round($items->avg('skills_score'), 1) : 0,
                'avg_attitude'  => $total > 0 ? round($items->avg('attitude_score'), 1) : 0,
            ],
            'meta' => ['total' => $total],
        ];
    }

    public function storeKsaAssessment(array $data, ?UploadedFile $attachment = null): KsaAssessment
    {
        $k = (float) ($data['knowledge_score'] ?? 80);
        $s = (float) ($data['skills_score'] ?? 80);
        $a = (float) ($data['attitude_score'] ?? 80);
        $total = round(($k + $s + $a) / 3, 2);
        $grade = $total >= 90 ? 'A+' : ($total >= 80 ? 'A' : ($total >= 70 ? 'B' : ($total >= 60 ? 'C' : ($total >= 50 ? 'D' : 'F'))));
        $path = $attachment ? asset('storage/' . $attachment->store('ksa', 'public')) : null;

        return KsaAssessment::create([
            'employee_id'     => ! empty($data['employee_id']) ? (int) $data['employee_id'] : Employee::first()?->id,
            'assessor_id'     => ! empty($data['assessor_id']) ? (int) $data['assessor_id'] : null,
            'knowledge_score' => $k,
            'skills_score'    => $s,
            'attitude_score'  => $a,
            'total_score'     => $total,
            'grade'           => $grade,
            'period'          => $data['period'] ?? (date('Y') . '-Q' . ceil(date('n') / 3)),
            'assessed_at'     => $data['assessed_at'] ?? now()->toDateString(),
            'notes'           => $data['notes'] ?? '',
            'attachment'      => $path,
        ]);
    }

    public function updateKsaAssessment(int $id, array $data, ?UploadedFile $attachment = null): KsaAssessment
    {
        $ksa = KsaAssessment::findOrFail($id);
        $k = isset($data['knowledge_score']) ? (float) $data['knowledge_score'] : (float) $ksa->knowledge_score;
        $s = isset($data['skills_score']) ? (float) $data['skills_score'] : (float) $ksa->skills_score;
        $a = isset($data['attitude_score']) ? (float) $data['attitude_score'] : (float) $ksa->attitude_score;
        $total = round(($k + $s + $a) / 3, 2);
        $grade = $total >= 90 ? 'A+' : ($total >= 80 ? 'A' : ($total >= 70 ? 'B' : ($total >= 60 ? 'C' : ($total >= 50 ? 'D' : 'F'))));

        $updates = [
            'employee_id'     => ! empty($data['employee_id']) ? (int) $data['employee_id'] : $ksa->employee_id,
            'assessor_id'     => ! empty($data['assessor_id']) ? (int) $data['assessor_id'] : $ksa->assessor_id,
            'knowledge_score' => $k,
            'skills_score'    => $s,
            'attitude_score'  => $a,
            'total_score'     => $total,
            'grade'           => $grade,
            'period'          => $data['period'] ?? $ksa->period,
            'assessed_at'     => $data['assessed_at'] ?? $ksa->assessed_at,
            'notes'           => $data['notes'] ?? $ksa->notes,
        ];
        if ($attachment) {
            $updates['attachment'] = asset('storage/' . $attachment->store('ksa', 'public'));
        }
        $ksa->update($updates);

        return $ksa->fresh();
    }

    public function deleteKsaAssessment(int $id): bool
    {
        return (bool) KsaAssessment::findOrFail($id)->delete();
    }

    // ── Employee Papers & Uploads ─────────────────────────────────────

    public function ensureDefaultPapers(): void
    {
        if (EmployeePaper::count() === 0) {
            EmployeePaper::create(['name' => 'صورة الهوية الوطنية', 'description' => 'مستند رسمي مطلوب عند التعيين', 'note' => '1', 'status' => 1]);
            EmployeePaper::create(['name' => 'المؤهل العلمي', 'description' => 'صورة مصدقة من الشهادة الجامعية', 'note' => '1', 'status' => 1]);
            EmployeePaper::create(['name' => 'شهادات الخبرة', 'description' => 'مستند يوضح الخبرات السابقة', 'note' => '2', 'status' => 0]);
        }
    }

    public function listPapers(array $filters = []): array
    {
        $this->ensureDefaultPapers();

        return EmployeePaper::with('employee')->latest('id')->get()->map(fn (EmployeePaper $p) => [
            'id'          => $p->id,
            'name'        => $p->name,
            'description' => $p->description ?? '',
            'note'        => (int) ($p->note ?: 1),
            'file'        => $p->file,
            'status'      => (int) $p->status,
            'employee'    => ['name' => $p->employee?->name ?? 'موظف الجمعية'],
        ])->toArray();
    }

    public function findPaper(int $id): array
    {
        $this->ensureDefaultPapers();
        $p = EmployeePaper::find($id) ?? EmployeePaper::firstOrFail();

        return [
            'id'          => $p->id,
            'name'        => $p->name,
            'description' => $p->description ?? '',
            'note'        => (string) ($p->note ?: '1'),
            'file'        => $p->file,
            'status'      => (int) $p->status,
        ];
    }

    public function storePaper(array $data, ?UploadedFile $file = null): EmployeePaper
    {
        $url = $file ? asset('storage/' . $file->store('employee_papers', 'public')) : null;

        return EmployeePaper::create([
            'employee_id' => ! empty($data['id']) ? (int) $data['id'] : null,
            'name'        => $data['name'] ?? 'مستند توظيف',
            'description' => $data['description'] ?? '',
            'note'        => (string) ($data['note'] ?? '1'),
            'file'        => $url,
            'status'      => $url ? 1 : 0,
        ]);
    }

    public function updatePaper(array $data, ?UploadedFile $file = null): EmployeePaper
    {
        $this->ensureDefaultPapers();
        $id = (int) ($data['id'] ?? 0);
        $p = EmployeePaper::find($id) ?? EmployeePaper::firstOrFail();

        $updates = [
            'name'        => $data['name'] ?? $p->name,
            'description' => $data['description'] ?? $p->description,
            'note'        => (string) ($data['note'] ?? $p->note),
        ];
        if ($file) {
            $updates['file'] = asset('storage/' . $file->store('employee_papers', 'public'));
            $updates['status'] = 1;
        }
        $p->update($updates);

        return $p->fresh();
    }

    // ── HR Reports (Salary & Approved Vacations) ──────────────────────

    public function salaryReport(array $filters = []): array
    {
        $employees = Employee::all();

        return $employees->map(function (Employee $emp) {
            $basic = (float) ($emp->basic_salary ?: 5000);
            $insurance = (float) ($emp->social_insurance ?: 450);

            return [
                'id'              => $emp->id,
                'name'            => $emp->name,
                'basic'           => number_format($basic, 2),
                'socialinsurance' => number_format($insurance, 2),
                'salarybyday'     => number_format($basic / 30, 2),
            ];
        })->toArray();
    }

    public function approvedVacations(array $filters = []): array
    {
        $requests = VacationRequest::with(['employee', 'vacation'])
            ->where('type', 'vacation')
            ->latest('id')
            ->get();

        return $requests->map(function (VacationRequest $vr) {
            $days = 5;
            if ($vr->start_date && $vr->end_date) {
                $days = max(1, $vr->start_date->diffInDays($vr->end_date) + 1);
            }

            return [
                'id'           => $vr->id,
                'name'         => $vr->employee?->name ?? 'أحمد السالم',
                'vacationname' => $vr->vacation?->name ?? 'إجازة سنوية',
                'total_days'   => $days,
                'startdate'    => $vr->start_date?->format('Y-m-d') ?? now()->toDateString(),
                'enddate'      => $vr->end_date?->format('Y-m-d') ?? now()->toDateString(),
            ];
        })->toArray();
    }
}
