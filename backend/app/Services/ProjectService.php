<?php

namespace App\Services;

use App\Models\Donor;
use App\Models\Project;
use App\Models\ProjectDetail;
use App\Models\ProjectTransaction;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class ProjectService
{
    /**
     * Get filtered list of projects.
     */
    public function list(array $filters = []): Collection
    {
        $query = Project::with(['transactions'])->latest('id');

        if (! empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['searchFrom']) || ! empty($filters['dateFrom'])) {
            $dateFrom = $filters['searchFrom'] ?? $filters['dateFrom'];
            $query->whereDate('dateoflaunch', '>=', $dateFrom);
        }

        if (! empty($filters['searchTo']) || ! empty($filters['dateTo'])) {
            $dateTo = $filters['searchTo'] ?? $filters['dateTo'];
            $query->whereDate('dateoflaunch', '<=', $dateTo);
        }

        if (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('status', (int) $filters['status']);
        }

        if (! empty($filters['marketingmethod'])) {
            $query->where('marketingmethod', (int) $filters['marketingmethod']);
        }

        return $query->get();
    }

    /**
     * Find a single project by ID.
     */
    public function find(int $id): Project
    {
        return Project::with([
            'transactions.donor',
            'transactions.beneficiary',
            'details',
            'phases',
            'assignments',
            'kpis',
            'uploads',
            'risks',
        ])->findOrFail($id);
    }

    /**
     * Create a new project.
     */
    public function create(array $data, ?UploadedFile $attachment = null): Project
    {
        return DB::transaction(function () use ($data, $attachment) {
            if ($attachment && $attachment->isValid()) {
                $data['attachment'] = $attachment->store('projects', 'public');
            }

            return Project::create($data);
        });
    }

    /**
     * Update an existing project.
     */
    public function update(Project $project, array $data, ?UploadedFile $attachment = null): Project
    {
        return DB::transaction(function () use ($project, $data, $attachment) {
            if ($attachment && $attachment->isValid()) {
                $data['attachment'] = $attachment->store('projects', 'public');
            }

            $project->update($data);

            return $project->fresh(['transactions', 'details']);
        });
    }

    /**
     * Cancel a project (status = 3).
     */
    public function cancel(Project $project): Project
    {
        $project->update(['status' => 3]);

        return $project;
    }

    /**
     * Activate a project (status = 1).
     */
    public function activate(Project $project): Project
    {
        $project->update(['status' => 1]);

        return $project;
    }

    /**
     * Close a project (status = 2).
     */
    public function close(Project $project): Project
    {
        $project->update(['status' => 2]);

        return $project;
    }

    /**
     * Delete a project.
     */
    public function delete(Project $project): bool
    {
        return (bool) $project->delete();
    }

    /**
     * Calculate progress percentage for a project.
     */
    public function progressPercentage(Project $project): float
    {
        if ((int) $project->status === 2) {
            return 100.0;
        }

        if ($project->total <= 0) {
            return 0.0;
        }

        return round(min(100.0, max(0.0, ($project->amount / $project->total) * 100.0)), 1);
    }

    /**
     * Store design or marketing request for a project.
     */
    public function storeDetail(array $data, ?UploadedFile $upload1 = null, ?UploadedFile $upload2 = null): ProjectDetail
    {
        return DB::transaction(function () use ($data, $upload1, $upload2) {
            $projectId = (int) ($data['project_id'] ?? $data['id'] ?? 0);
            $project = Project::findOrFail($projectId);

            if ($upload1 && $upload1->isValid()) {
                $data['upload'] = $upload1->store('project_details', 'public');
            }
            if ($upload2 && $upload2->isValid()) {
                $data['upload2'] = $upload2->store('project_details', 'public');
            }

            $data['project_id'] = $project->id;

            return ProjectDetail::create($data);
        });
    }

    /**
     * Store a payment voucher transaction for a project.
     */
    public function storePayment(array $data): ProjectTransaction
    {
        return DB::transaction(function () use ($data) {
            $projectId = (int) ($data['project_id'] ?? $data['id'] ?? 0);
            $project = Project::findOrFail($projectId);

            $amount = (float) $data['amount'];
            $invoiceNumber = 'PAY-PRJ-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -5));

            return ProjectTransaction::create([
                'project_id'       => $project->id,
                'human_cases_id'   => $data['selhuman'] ?? $data['human_cases_id'] ?? null,
                'invoice_number'   => $invoiceNumber,
                'transaction_type' => 2,
                'type'             => $data['type'] ?? 'صرف للمشروع',
                'amount'           => $amount,
                'date'             => $data['date'] ?? now()->toDateString(),
                'account'          => $data['account'] ?? null,
                'balanceid'        => $data['balanceid'] ?? null,
                'notes'            => $data['notes'] ?? null,
            ]);
        });
    }

    /**
     * Store a receipt donation transaction for a project.
     */
    public function storeReceipt(array $data): ProjectTransaction
    {
        return DB::transaction(function () use ($data) {
            $projectId = (int) ($data['project_id'] ?? $data['id'] ?? 0);
            $project = Project::findOrFail($projectId);

            $amount = (float) $data['amount'];
            $invoiceNumber = 'REC-PRJ-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -5));

            $transaction = ProjectTransaction::create([
                'project_id'       => $project->id,
                'donor_id'         => $data['seldonor'] ?? $data['donor_id'] ?? null,
                'invoice_number'   => $invoiceNumber,
                'transaction_type' => 1,
                'type'             => $data['type'] ?? 'قبض للمشروع',
                'amount'           => $amount,
                'date'             => $data['date'] ?? now()->toDateString(),
                'account'          => $data['account'] ?? null,
                'balanceid'        => $data['balanceid'] ?? null,
                'notes'            => $data['notes'] ?? null,
            ]);

            // Update project collected amount
            $project->increment('amount', $amount);

            return $transaction->load(['donor', 'project']);
        });
    }

    /**
     * List all transactions for a project.
     */
    public function transactions(int $projectId): Collection
    {
        return ProjectTransaction::with(['donor', 'beneficiary'])
            ->where('project_id', $projectId)
            ->latest('id')
            ->get();
    }

    // ── Project Phases ──────────────────────────────────────────

    public function listPhases(int $projectId, array $filters = []): Collection
    {
        $query = \App\Models\ProjectPhase::where('project_id', $projectId)->latest('id');

        if (!empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->get();
    }

    public function allPhases(int $projectId): Collection
    {
        return \App\Models\ProjectPhase::where('project_id', $projectId)
            ->select('id', 'name', 'status')
            ->get();
    }

    public function storePhase(array $data): \App\Models\ProjectPhase
    {
        return \App\Models\ProjectPhase::create($data);
    }

    public function completePhase(array $data): \App\Models\ProjectPhase
    {
        $phase = \App\Models\ProjectPhase::findOrFail((int) $data['phase_id']);
        $phase->update([
            'status'              => 2,
            'performance_summary' => $data['performance_summary'] ?? $phase->performance_summary,
            'remaining_work'      => $data['remaining_work'] ?? $phase->remaining_work,
            'description'         => $data['notes'] ?? ($data['description'] ?? $phase->description),
        ]);

        return $phase;
    }

    public function cancelPhase(int $id): \App\Models\ProjectPhase
    {
        $phase = \App\Models\ProjectPhase::findOrFail($id);
        $phase->update(['status' => 3]);

        return $phase;
    }

    public function activatePhase(int $id): \App\Models\ProjectPhase
    {
        $phase = \App\Models\ProjectPhase::findOrFail($id);
        $phase->update(['status' => 1]);

        return $phase;
    }

    // ── Project Assignments / Members ───────────────────────────

    public function listAssignments(int $projectId): Collection
    {
        return \App\Models\ProjectAssignment::with(['phase'])
            ->where('project_id', $projectId)
            ->latest('id')
            ->get();
    }

    public function storeAssignment(array $data): \App\Models\ProjectAssignment
    {
        if (empty($data['responsible_name']) && !empty($data['responsible_id'])) {
            $user = \App\Models\User::find($data['responsible_id']);
            $data['responsible_name'] = $user?->name ?? 'مسؤول';
        }

        return \App\Models\ProjectAssignment::create($data);
    }

    public function deleteAssignment(int $id): bool
    {
        $assignment = \App\Models\ProjectAssignment::findOrFail($id);
        return (bool) $assignment->delete();
    }

    // ── Project KPIs ────────────────────────────────────────────

    public function listKpis(int $projectId): Collection
    {
        return \App\Models\ProjectKpi::where('project_id', $projectId)->latest('id')->get();
    }

    public function defaultQuizs(): array
    {
        return [
            ['id' => 1, 'quiz' => 'نسبة الالتزام بالجدول الزمني للمشروع', 'target' => 100, 'actual' => 0, 'status' => 'خطر'],
            ['id' => 2, 'quiz' => 'نسبة الصرف ومطابقة الميزانية المعتمدة', 'target' => 100, 'actual' => 0, 'status' => 'خطر'],
            ['id' => 3, 'quiz' => 'معدل رضا المستفيدين وأصحاب المصلحة', 'target' => 90, 'actual' => 0, 'status' => 'خطر'],
            ['id' => 4, 'quiz' => 'نسبة إنجاز المخرجات التشغيلية للمشروع', 'target' => 100, 'actual' => 0, 'status' => 'خطر'],
        ];
    }

    public function storeKpis(int $projectId, array $kpis): Collection
    {
        return DB::transaction(function () use ($projectId, $kpis) {
            $defaultQuizMap = collect($this->defaultQuizs())->keyBy('id');

            foreach ($kpis as $item) {
                $actual = (float) ($item['actual'] ?? 0);
                $kpiId = $item['kpi_id'] ?? null;
                $defaultItem = $defaultQuizMap->get($kpiId);

                $target = (float) ($item['target'] ?? $defaultItem['target'] ?? 100);
                $quiz = $item['quiz'] ?? $defaultItem['quiz'] ?? "مؤشر أداء #{$kpiId}";

                $status = 'خطر';
                if ($actual >= $target) {
                    $status = 'ممتاز';
                } elseif ($actual >= $target * 0.8) {
                    $status = 'تحذير';
                }

                \App\Models\ProjectKpi::updateOrCreate(
                    [
                        'project_id' => $projectId,
                        'kpi_id'     => $kpiId,
                    ],
                    [
                        'quiz'   => $quiz,
                        'target' => $target,
                        'actual' => $actual,
                        'status' => $status,
                    ]
                );
            }

            return \App\Models\ProjectKpi::where('project_id', $projectId)->get();
        });
    }

    public function deleteKpi(int $id): bool
    {
        $kpi = \App\Models\ProjectKpi::findOrFail($id);
        return (bool) $kpi->delete();
    }

    // ── Project Uploads / Attachments ───────────────────────────

    public function listUploads(int $projectId): Collection
    {
        return \App\Models\ProjectUpload::where('project_id', $projectId)->latest('id')->get();
    }

    public function storeUploads(array $data, array $files): Collection
    {
        $created = collect();
        $description = $data['description'] ?? null;

        foreach ($files as $index => $file) {
            if ($file instanceof UploadedFile && $file->isValid()) {
                $path = $file->store('project_uploads', 'public');
                $desc = is_array($description) ? ($description[$index] ?? null) : $description;

                $upload = \App\Models\ProjectUpload::create([
                    'project_id'  => (int) $data['project_id'],
                    'description' => $desc,
                    'upload'      => $path,
                ]);
                $created->push($upload);
            }
        }

        return new Collection($created);
    }

    public function storeUpload(array $data, UploadedFile|array $files): \App\Models\ProjectUpload|Collection
    {
        if (is_array($files)) {
            $uploads = $this->storeUploads($data, $files);
            return $uploads->count() === 1 ? $uploads->first() : $uploads;
        }

        return $this->storeUploads($data, [$files])->first();
    }

    public function deleteUpload(int $id): bool
    {
        $upload = \App\Models\ProjectUpload::findOrFail($id);
        return (bool) $upload->delete();
    }

    // ── Project Risks ───────────────────────────────────────────

    public function listRisks(int $projectId): Collection
    {
        return \App\Models\ProjectRisk::with(['phase'])
            ->where('project_id', $projectId)
            ->latest('id')
            ->get();
    }

    public function storeRisk(array $data): \App\Models\ProjectRisk
    {
        return \App\Models\ProjectRisk::create($data);
    }

    public function findRisk(int $id): \App\Models\ProjectRisk
    {
        return \App\Models\ProjectRisk::with(['phase', 'project'])->findOrFail($id);
    }

    public function storeRiskMitigation(array $data): \App\Models\ProjectRisk
    {
        $risk = \App\Models\ProjectRisk::findOrFail($data['risk_id']);

        $risk->update([
            'mitigation_description' => $data['description'],
            'mitigation_impactlevel' => isset($data['impactlevel']) ? (int) $data['impactlevel'] : $risk->mitigation_impactlevel,
            'mitigation_probability' => isset($data['probability']) ? (int) $data['probability'] : $risk->mitigation_probability,
            'mitigation_status'      => $data['status'] ?? 'قيد المعالجة',
            'status'                 => 'قيد المعالجة',
            'action_plan'            => $data['description'],
        ]);

        return $risk->load(['phase', 'project']);
    }

    public function riskReport(int $projectId): Collection
    {
        return \App\Models\ProjectRisk::with(['phase'])
            ->where('project_id', $projectId)
            ->get();
    }

    // ── Dropdowns Helpers ───────────────────────────────────────

    public function listEmployees(): Collection
    {
        return \App\Models\User::select('id', 'name', 'email')->get();
    }

    public function listVolunteers(): Collection
    {
        return \App\Models\Donor::select('id', 'name', 'phone')->get();
    }
}
