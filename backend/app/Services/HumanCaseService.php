<?php

namespace App\Services;

use App\Models\HumanCase;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class HumanCaseService
{
    /**
     * Get list of beneficiaries with optional search, date filtering, and pagination.
     */
    public function list(array $filters = []): Collection
    {
        $query = HumanCase::query()->latest();

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('idnumber', 'like', "%{$search}%")
                  ->orWhere('phonenum', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('accnumber', 'like', "%{$search}%")
                  ->orWhere('note', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['searchfrom'])) {
            $query->whereDate('created_at', '>=', $filters['searchfrom']);
        }

        if (! empty($filters['searchto'])) {
            $query->whereDate('created_at', '<=', $filters['searchto']);
        }

        if (! empty($filters['status'])) {
            if (is_array($filters['status'])) {
                $query->whereIn('status', $filters['status']);
            } else {
                $query->where('status', $filters['status']);
            }
        }

        if (! empty($filters['case_status'])) {
            $caseStatuses = (array) $filters['case_status'];
            $query->where(function ($q) use ($caseStatuses) {
                $q->whereIn('case_status', $caseStatuses)
                  ->orWhereIn('status', $caseStatuses);
            });
        }

        $page = max(1, (int) ($filters['page'] ?? 1));
        $perPage = (int) ($filters['perpage'] ?? $filters['per_page'] ?? 10);

        if ($perPage > 0) {
            $query->skip(($page - 1) * $perPage)->take($perPage);
        }

        return $query->get();
    }

    /**
     * Get rejected beneficiaries.
     */
    public function rejected(array $filters = []): Collection
    {
        $filters['case_status'] = ['3', 'مرفوض', 'مستبعد', 'rejected'];

        return $this->list($filters);
    }

    /**
     * Get all beneficiaries without pagination.
     */
    public function all(): Collection
    {
        return HumanCase::query()->latest()->get();
    }

    /**
     * Find a beneficiary by ID.
     */
    public function find(int $id): HumanCase
    {
        return HumanCase::findOrFail($id);
    }

    /**
     * Create a new beneficiary.
     */
    public function create(array $data): HumanCase
    {
        return DB::transaction(function () use ($data) {
            return HumanCase::create([
                'name'          => $data['name'],
                'gender'        => $data['gender'] ?? null,
                'dob'           => $data['dob'] ?? null,
                'humancasetype' => $data['humancasetype'] ?? null,
                'status'        => $data['status'] ?? '1',
                'nationality'   => $data['nationality'] ?? null,
                'familycount'   => ! empty($data['familycount']) ? (int) $data['familycount'] : null,
                'phonenum'      => $data['phonenum'] ?? null,
                'email'         => $data['email'] ?? null,
                'accnumber'     => $data['accnumber'] ?? null,
                'idnumber'      => $data['idnumber'] ?? null,
                'idsource'      => $data['idsource'] ?? null,
                'iddate'        => $data['iddate'] ?? null,
                'note'          => $data['note'] ?? null,
            ]);
        });
    }

    /**
     * Update an existing beneficiary.
     */
    public function update(int $id, array $data): HumanCase
    {
        return DB::transaction(function () use ($id, $data) {
            $humanCase = HumanCase::findOrFail($id);

            $humanCase->update([
                'name'          => $data['name'],
                'gender'        => $data['gender'] ?? $humanCase->gender,
                'dob'           => $data['dob'] ?? $humanCase->dob,
                'humancasetype' => $data['humancasetype'] ?? $humanCase->humancasetype,
                'status'        => $data['status'] ?? $humanCase->status,
                'nationality'   => $data['nationality'] ?? $humanCase->nationality,
                'familycount'   => isset($data['familycount']) ? (int) $data['familycount'] : $humanCase->familycount,
                'phonenum'      => $data['phonenum'] ?? $humanCase->phonenum,
                'email'         => $data['email'] ?? $humanCase->email,
                'accnumber'     => $data['accnumber'] ?? $humanCase->accnumber,
                'idnumber'      => $data['idnumber'] ?? $humanCase->idnumber,
                'idsource'      => $data['idsource'] ?? $humanCase->idsource,
                'iddate'        => $data['iddate'] ?? $humanCase->iddate,
                'note'          => $data['note'] ?? $humanCase->note,
            ]);

            return $humanCase;
        });
    }

    /**
     * Delete a beneficiary.
     */
    public function delete(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $humanCase = HumanCase::findOrFail($id);

            return (bool) $humanCase->delete();
        });
    }

    /**
     * Get beneficiary details structure for bank, home, qualifications, etc.
     */
    public function getDetails(int $id): array
    {
        $case = HumanCase::findOrFail($id);
        $details = $case->details ?? [];

        if (empty($details['bankdetails'])) {
            $details['bankdetails'] = [
                'name'   => '',
                'branch' => '',
                'iban'   => $case->accnumber ?? '',
                'upload' => $details['bankdetails_upload'] ?? '',
            ];
        } else {
            if (empty($details['bankdetails']['upload']) && ! empty($details['bankdetails_upload'])) {
                $details['bankdetails']['upload'] = $details['bankdetails_upload'];
            }
            if (empty($details['bankdetails_upload']) && ! empty($details['bankdetails']['upload'])) {
                $details['bankdetails_upload'] = $details['bankdetails']['upload'];
            }
        }

        if (! empty($details['health']) && is_array($details['health'])) {
            $lastHealth = end($details['health']);
            if (! empty($lastHealth['upload'])) {
                $details['health_upload'] = $lastHealth['upload'];
                $details['healthdetails_upload'] = $lastHealth['upload'];
            }
        }

        if (empty($details['personalfeesdetails']) && ! empty($details['home'])) {
            $details['personalfeesdetails'] = $details['home'];
        } elseif (empty($details['home']) && ! empty($details['personalfeesdetails'])) {
            $details['home'] = $details['personalfeesdetails'];
        }

        $health = $details['health'] ?? [];
        foreach ($health as &$h) {
            if (! empty($h['upload']) && empty($h['attachment'])) {
                $h['attachment'] = $h['upload'];
            }
        }
        unset($h);

        $dependants = $details['dependants'] ?? [];

        $qual = $details['qualifications'] ?? $details['work_education'] ?? [];
        $workEducation = [
            'educationlevel'      => $qual['educationlevel'] ?? $qual['education_level'] ?? '',
            'job'                 => $qual['job'] ?? '',
            'canwork'             => $qual['canwork'] ?? $qual['can_work'] ?? 1,
            'incomesource'        => ! empty($qual['incomesource']) && is_array($qual['incomesource']) ? $qual['incomesource'] : [
                ['name' => $qual['incomesource'] ?? $qual['income_source'] ?? 'راتب', 'amount' => $qual['incomeamount'] ?? $qual['income_amount'] ?? 0]
            ],
            'incomesource_upload' => $qual['incomesource_upload'] ?? $qual['sourceupload'] ?? null,
            'courses'             => ! empty($qual['courses']) && is_array($qual['courses']) ? $qual['courses'] : [
                ['title' => $qual['course_title'] ?? 'دورة عامة', 'address' => $qual['course_address'] ?? '']
            ],
            'courses_upload'      => $qual['courses_upload'] ?? $qual['courseupload'] ?? null,
        ];

        $caseData = [
            'id'                 => $case->id,
            'name'               => $case->name,
            'type'               => (string) ($case->humancasetype ?? '1'),
            'humancasetype'      => (string) ($case->humancasetype ?? '1'),
            'gender'             => (string) ($case->gender ?? '0'),
            'gender_string'      => $case->gender_string,
            'dob'                => $case->dob?->format('Y-m-d') ?? '',
            'dateofbirth'        => $case->dateofbirth,
            'status'               => (string) ($case->status ?? '1'),
            'status_string'        => $case->status_string,
            'social_status_string' => $case->social_status_string,
            'case_status'          => (string) ($case->case_status ?? 'موافقة'),
            'case_status_string'   => $case->case_status_string,
            'case_status_code'     => $case->case_status_code,
            'nationality'        => $case->nationality ?? '',
            'phonenum'           => $case->phonenum ?? '',
            'phone'              => $case->phonenum ?? '',
            'email'              => $case->email ?? '',
            'accnumber'          => $case->accnumber ?? '',
            'idnumber'           => $case->idnumber ?? '',
            'idsource'           => $case->idsource ?? '',
            'iddate'             => $case->iddate?->format('Y-m-d') ?? '',
            'note'               => $case->note ?? '',
            'created_at'         => $case->created_at?->toISOString() ?? now()->toISOString(),
            'updated_at'         => $case->updated_at?->toISOString() ?? now()->toISOString(),
            'details'            => array_merge($details, [
                'nationality'        => $case->nationality ?? '',
                'id_number'          => $case->idnumber ?? '',
                'phone_number'       => $case->phonenum ?? '',
                'email'              => $case->email ?? '',
                'id_source'          => $case->idsource ?? '',
                'id_expiration_date' => $case->iddate?->format('Y-m-d') ?? '',
                'account_number'     => $case->accnumber ?? '',
                'note'               => $case->note ?? '',
            ]),
        ];

        return [
            'status'             => 200,
            'id'                 => $case->id,
            'name'               => $case->name,
            'case'               => $caseData,
            'case_status'        => $case->case_status,
            'case_status_string' => $case->case_status_string,
            'case_status_code'   => $case->case_status_code,
            'details'            => $details,
            'work_education'     => $workEducation,
            'health'             => $health,
            'dependants'         => $dependants,
        ];
    }

    /**
     * Update bank details for beneficiary including IBAN image upload.
     */
    public function updateBanks(int $id, array $data, mixed $file = null): HumanCase
    {
        return DB::transaction(function () use ($id, $data, $file) {
            $case = HumanCase::findOrFail($id);
            $details = $case->details ?? [];
            $bankDetails = $details['bankdetails'] ?? [];

            $bankDetails['name'] = $data['name'] ?? ($bankDetails['name'] ?? '');
            $bankDetails['branch'] = $data['branch'] ?? ($bankDetails['branch'] ?? '');
            $bankDetails['iban'] = $data['iban'] ?? ($bankDetails['iban'] ?? '');

            if ($file instanceof \Illuminate\Http\UploadedFile) {
                $path = $file->store('humancases/bank', 'public');
                $url = asset('storage/' . $path);
                $bankDetails['upload'] = $url;
                $details['bankdetails_upload'] = $url;
            } elseif (! empty($details['bankdetails_upload']) && empty($bankDetails['upload'])) {
                $bankDetails['upload'] = $details['bankdetails_upload'];
            }

            $details['bankdetails'] = $bankDetails;
            if (isset($bankDetails['upload'])) {
                $details['bankdetails_upload'] = $bankDetails['upload'];
            }

            $case->details = $details;
            if (! empty($data['iban'])) {
                $case->accnumber = $data['iban'];
            }
            $case->save();

            return $case;
        });
    }

    /**
     * Store/Update qualifications and income sources with file uploads.
     */
    public function storeQualifications(int $id, array $data, mixed $sourceFile = null, mixed $courseFile = null): HumanCase
    {
        return DB::transaction(function () use ($id, $data, $sourceFile, $courseFile) {
            $case = HumanCase::findOrFail($id);
            $details = $case->details ?? [];
            $qual = $details['qualifications'] ?? [];

            foreach ($data as $k => $v) {
                if ($k !== '_token' && $k !== 'sourceupload' && $k !== 'courseupload' && ! ($v instanceof \Illuminate\Http\UploadedFile)) {
                    $qual[$k] = $v;
                }
            }

            if ($sourceFile instanceof \Illuminate\Http\UploadedFile) {
                $path = $sourceFile->store('humancases/qualifications', 'public');
                $url = asset('storage/' . $path);
                $qual['sourceupload'] = $url;
                $qual['incomesource_upload'] = $url;
                $details['work_education']['incomesource_upload'] = $url;
            }

            if ($courseFile instanceof \Illuminate\Http\UploadedFile) {
                $path = $courseFile->store('humancases/qualifications', 'public');
                $url = asset('storage/' . $path);
                $qual['courseupload'] = $url;
                $qual['courses_upload'] = $url;
                $details['work_education']['courses_upload'] = $url;
            }

            $details['qualifications'] = $qual;
            $case->details = $details;
            $case->save();

            return $case;
        });
    }

    /**
     * Update housing data and personal fees with attachments.
     */
    public function updatePersonalFees(int $id, array $data, mixed $upload1 = null, mixed $upload2 = null): HumanCase
    {
        return DB::transaction(function () use ($id, $data, $upload1, $upload2) {
            $case = HumanCase::findOrFail($id);
            $details = $case->details ?? [];
            $home = $details['home'] ?? [];

            foreach ($data as $k => $v) {
                if ($k !== '_token' && $k !== 'personalfeesdetails_upload1' && $k !== 'personalfeesdetails_upload2' && $k !== 'upload1' && $k !== 'upload2' && ! ($v instanceof \Illuminate\Http\UploadedFile)) {
                    $home[$k] = $v;
                }
            }

            if ($upload1 instanceof \Illuminate\Http\UploadedFile) {
                $path = $upload1->store('humancases/housing', 'public');
                $url = asset('storage/' . $path);
                $home['personalfeesdetails_upload1'] = $url;
                $details['personalfeesdetails_upload1'] = $url;
            }

            if ($upload2 instanceof \Illuminate\Http\UploadedFile) {
                $path = $upload2->store('humancases/housing', 'public');
                $url = asset('storage/' . $path);
                $home['personalfeesdetails_upload2'] = $url;
                $details['personalfeesdetails_upload2'] = $url;
            }

            $details['home'] = $home;
            $case->details = $details;
            $case->save();

            return $case;
        });
    }

    /**
     * Store health record for beneficiary.
     */
    public function storeHealth(int $id, array $data, mixed $file = null): HumanCase
    {
        return DB::transaction(function () use ($id, $data, $file) {
            $case = HumanCase::findOrFail($id);
            $details = $case->details ?? [];
            $healthList = $details['health'] ?? [];

            $attachment = null;
            if ($file instanceof \Illuminate\Http\UploadedFile) {
                $path = $file->store('humancases/health', 'public');
                $attachment = asset('storage/' . $path);
            } elseif (! empty($data['existing_upload'])) {
                $attachment = $data['existing_upload'];
            } elseif (! empty($details['health_upload'])) {
                $attachment = $details['health_upload'];
            }

            $items = [];
            if (! empty($data['illness'])) {
                $decoded = is_string($data['illness']) ? json_decode($data['illness'], true) : $data['illness'];
                if (is_array($decoded)) {
                    $items = $decoded;
                }
            }
            if (empty($items)) {
                $items = [$data];
            }

            foreach ($items as $item) {
                if (! is_array($item)) {
                    continue;
                }
                $healthList[] = [
                    'id'             => count($healthList) + 1,
                    'humancase_id'   => $case->id,
                    'disease_name'   => $item['disease_name'] ?? $item['name'] ?? '',
                    'disease_type'   => $item['disease_type'] ?? $item['type'] ?? '',
                    'disease_degree' => $item['disease_degree'] ?? $item['degree'] ?? '',
                    'treatment_type' => $item['treatment_type'] ?? $item['trtype'] ?? '',
                    'treatment_cost' => $item['treatment_cost'] ?? $item['trcost'] ?? '',
                    'notes'          => $item['notes'] ?? '',
                    'upload'         => $attachment,
                ];
            }

            $details['health'] = $healthList;
            if ($attachment) {
                $details['health_upload'] = $attachment;
                $details['healthdetails_upload'] = $attachment;
            }
            $case->details = $details;
            $case->save();

            return $case;
        });
    }

    /**
     * Get health data for table component.
     */
    public function showHealthData(int $id): array
    {
        $case = HumanCase::findOrFail($id);
        $list = $case->details['health'] ?? [];

        return array_map(function ($item) use ($case) {
            $item['humancase_id'] = $item['humancase_id'] ?? $case->id;
            return $item;
        }, $list);
    }

    /**
     * Get single health record for editing.
     */
    public function showSingleHealth(int $id): array
    {
        foreach (HumanCase::all() as $case) {
            foreach ($case->details['health'] ?? [] as $item) {
                if ((int) ($item['id'] ?? 0) === $id) {
                    $item['humancase_id'] = $case->id;
                    return $item;
                }
            }
        }

        $case = HumanCase::find($id) ?? HumanCase::first();
        $first = $case?->details['health'][0] ?? [];

        return array_merge([
            'id'             => $id,
            'humancase_id'   => $case?->id ?? $id,
            'disease_name'   => '',
            'disease_type'   => '',
            'disease_degree' => '',
            'treatment_type' => '',
            'treatment_cost' => '',
            'notes'          => '',
        ], $first, ['humancase_id' => $case?->id ?? $id]);
    }

    /**
     * Update single health record.
     */
    public function updateSingleHealth(int $id, array $data, mixed $file = null): array
    {
        return DB::transaction(function () use ($id, $data, $file) {
            $targetCase = null;
            $targetIndex = null;

            foreach (HumanCase::all() as $case) {
                foreach ($case->details['health'] ?? [] as $idx => $item) {
                    if ((int) ($item['id'] ?? 0) === $id) {
                        $targetCase = $case;
                        $targetIndex = $idx;
                        break 2;
                    }
                }
            }

            if (! $targetCase) {
                $targetCase = HumanCase::find($id) ?? HumanCase::firstOrFail();
                $targetIndex = 0;
            }

            $details = $targetCase->details ?? [];
            $healthList = $details['health'] ?? [];
            $existing = $healthList[$targetIndex] ?? ['id' => $id];

            $attachment = $existing['upload'] ?? null;
            if ($file instanceof \Illuminate\Http\UploadedFile) {
                $path = $file->store('humancases/health', 'public');
                $attachment = asset('storage/' . $path);
            }

            $updated = array_merge($existing, [
                'id'             => $existing['id'] ?? $id,
                'humancase_id'   => $targetCase->id,
                'disease_name'   => $data['disease_name'] ?? $data['name'] ?? ($existing['disease_name'] ?? ''),
                'disease_type'   => $data['disease_type'] ?? $data['type'] ?? ($existing['disease_type'] ?? ''),
                'disease_degree' => $data['disease_degree'] ?? $data['degree'] ?? ($existing['disease_degree'] ?? ''),
                'treatment_type' => $data['treatment_type'] ?? $data['trtype'] ?? ($existing['treatment_type'] ?? ''),
                'treatment_cost' => $data['treatment_cost'] ?? $data['trcost'] ?? ($existing['treatment_cost'] ?? ''),
                'notes'          => $data['notes'] ?? ($existing['notes'] ?? ''),
                'upload'         => $attachment,
            ]);

            $healthList[$targetIndex] = $updated;
            $details['health'] = array_values($healthList);
            $targetCase->details = $details;
            $targetCase->save();

            return $updated;
        });
    }

    /**
     * Store dependent for beneficiary.
     */
    public function storeDependants(int $id, array $data): HumanCase
    {
        return DB::transaction(function () use ($id, $data) {
            $case = HumanCase::findOrFail($id);
            $details = $case->details ?? [];
            $dependents = $details['dependants'] ?? [];

            $items = [];
            if (! empty($data['data'])) {
                $decoded = is_string($data['data']) ? json_decode($data['data'], true) : $data['data'];
                if (is_array($decoded)) {
                    $items = $decoded;
                }
            }
            if (empty($items)) {
                $items = [$data];
            }

            foreach ($items as $item) {
                if (! is_array($item)) {
                    continue;
                }
                $dependents[] = [
                    'id'                => count($dependents) + 1,
                    'humancase_id'      => $case->id,
                    'name'              => $item['name'] ?? '',
                    'dateofbirth'       => $item['dateofbirth'] ?? $item['dob'] ?? '',
                    'phone'             => $item['phone'] ?? '',
                    'relation'          => $item['relation'] ?? '',
                    'gender'            => $item['gender'] ?? '',
                    'note'              => $item['note'] ?? $item['notes'] ?? '',
                    'healthstatus'      => $item['healthstatus'] ?? $item['health'] ?? '',
                    'educationlevel'    => $item['educationlevel'] ?? $item['grade'] ?? '',
                    'educationfees'     => $item['educationfees'] ?? $item['gradecost'] ?? '',
                    'nationalid'        => $item['nationalid'] ?? '',
                    'nationalid_expire' => $item['nationalid_expire'] ?? $item['idexpire'] ?? '',
                    'nationalid_source' => $item['nationalid_source'] ?? $item['idsource'] ?? '',
                ];
            }

            $details['dependants'] = $dependents;
            $case->details = $details;
            $case->save();

            return $case;
        });
    }

    /**
     * Get dependents data for table component.
     */
    public function showDependantsData(int $id): array
    {
        $case = HumanCase::findOrFail($id);
        $list = $case->details['dependants'] ?? [];

        return array_map(function ($item) use ($case) {
            $item['humancase_id'] = $item['humancase_id'] ?? $case->id;
            return $item;
        }, $list);
    }

    /**
     * Get single dependent record for editing.
     */
    public function showSingleDependent(int $id): array
    {
        foreach (HumanCase::all() as $case) {
            foreach ($case->details['dependants'] ?? [] as $item) {
                if ((int) ($item['id'] ?? 0) === $id) {
                    $item['humancase_id'] = $case->id;
                    return $item;
                }
            }
        }

        $case = HumanCase::find($id) ?? HumanCase::first();
        $first = $case?->details['dependants'][0] ?? [];

        return array_merge([
            'id'                => $id,
            'humancase_id'      => $case?->id ?? $id,
            'name'              => '',
            'gender'            => '0',
            'dateofbirth'       => '',
            'relation'          => '',
            'healthstatus'      => '',
            'educationlevel'    => '',
            'educationfees'     => '',
            'nationalid'        => '',
            'nationalid_expire' => '',
            'nationalid_source' => '',
            'phone'             => '',
            'note'              => '',
        ], $first, ['humancase_id' => $case?->id ?? $id]);
    }

    /**
     * Update single dependent record.
     */
    public function updateSingleDependent(int $id, array $data): array
    {
        return DB::transaction(function () use ($id, $data) {
            $targetCase = null;
            $targetIndex = null;

            foreach (HumanCase::all() as $case) {
                foreach ($case->details['dependants'] ?? [] as $idx => $item) {
                    if ((int) ($item['id'] ?? 0) === $id) {
                        $targetCase = $case;
                        $targetIndex = $idx;
                        break 2;
                    }
                }
            }

            if (! $targetCase) {
                $targetCase = HumanCase::find($id) ?? HumanCase::firstOrFail();
                $targetIndex = 0;
            }

            $details = $targetCase->details ?? [];
            $dependents = $details['dependants'] ?? [];
            $existing = $dependents[$targetIndex] ?? ['id' => $id];

            $updated = array_merge($existing, [
                'id'                => $existing['id'] ?? $id,
                'humancase_id'      => $targetCase->id,
                'name'              => $data['name'] ?? ($existing['name'] ?? ''),
                'gender'            => $data['gender'] ?? ($existing['gender'] ?? '0'),
                'relation'          => $data['relation'] ?? ($existing['relation'] ?? ''),
                'healthstatus'      => $data['healthstatus'] ?? $data['health'] ?? ($existing['healthstatus'] ?? ''),
                'dateofbirth'       => $data['dateofbirth'] ?? $data['dob'] ?? ($existing['dateofbirth'] ?? ''),
                'educationlevel'    => $data['educationlevel'] ?? $data['grade'] ?? ($existing['educationlevel'] ?? ''),
                'educationfees'     => $data['educationfees'] ?? $data['gradecost'] ?? ($existing['educationfees'] ?? ''),
                'nationalid'        => $data['nationalid'] ?? ($existing['nationalid'] ?? ''),
                'nationalid_expire' => $data['nationalid_expire'] ?? $data['idexpire'] ?? ($existing['nationalid_expire'] ?? ''),
                'nationalid_source' => $data['nationalid_source'] ?? $data['idsource'] ?? ($existing['nationalid_source'] ?? ''),
                'phone'             => $data['phone'] ?? ($existing['phone'] ?? ''),
                'note'              => $data['note'] ?? $data['notes'] ?? ($existing['note'] ?? ''),
            ]);

            $dependents[$targetIndex] = $updated;
            $details['dependants'] = array_values($dependents);
            $targetCase->details = $details;
            $targetCase->save();

            return $updated;
        });
    }

    /**
     * Update case status / decision.
     */
    public function updateStatus(int $id, ?string $status, ?string $note): HumanCase
    {
        return DB::transaction(function () use ($id, $status, $note) {
            $case = HumanCase::findOrFail($id);

            if ($status !== null && $status !== '') {
                $case->case_status = $status;
                $details = $case->details ?? [];
                $details['decision'] = $status;
                $case->details = $details;
            }
            if ($note !== null) {
                $case->note = $note;
            }
            $case->save();

            return $case;
        });
    }

    /**
     * Store voucher for beneficiary.
     */
    public function storeVoucher(int $id, array $data): HumanCase
    {
        return DB::transaction(function () use ($id, $data) {
            $case = HumanCase::findOrFail($id);
            $details = $case->details ?? [];
            $vouchers = $details['vouchers'] ?? [];

            $amount = (float) ($data['amount'] ?? 0);
            $date = $data['date'] ?? now()->toDateString();

            $vouchers[] = [
                'id'             => count($vouchers) + 1,
                'amount'         => $data['amount'] ?? null,
                'date'           => $date,
                'payment_method' => $data['payment_method'] ?? $data['type'] ?? null,
                'account'        => $data['account'] ?? null,
                'description'    => $data['description'] ?? null,
            ];

            $details['vouchers'] = $vouchers;
            $case->details = $details;
            $case->save();

            if ($amount > 0) {
                app(\App\Services\Accounting\AccountingSyncService::class)->recordPayment([
                    'amount'         => $amount,
                    'date'           => $date,
                    'account'        => $data['account'] ?? null,
                    'description'    => $data['description'] ?? "سند صرف للمستفيد ({$case->name})",
                    'reference_type' => 'beneficiary_voucher',
                    'reference_id'   => $case->id,
                ]);
            }

            return $case;
        });
    }
}

