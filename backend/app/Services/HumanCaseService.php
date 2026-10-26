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
            'status'         => 200,
            'id'             => $case->id,
            'name'           => $case->name,
            'case'           => $caseData,
            'details'        => $details,
            'work_education' => $workEducation,
            'health'         => $health,
            'dependants'     => $dependants,
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

            $healthList[] = [
                'id'             => count($healthList) + 1,
                'disease_name'   => $data['disease_name'] ?? $data['name'] ?? '',
                'disease_type'   => $data['disease_type'] ?? $data['type'] ?? '',
                'disease_degree' => $data['disease_degree'] ?? $data['degree'] ?? '',
                'treatment_type' => $data['treatment_type'] ?? $data['trtype'] ?? '',
                'treatment_cost' => $data['treatment_cost'] ?? $data['trcost'] ?? '',
                'notes'          => $data['notes'] ?? '',
                'upload'         => $attachment,
            ];

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

        return $case->details['health'] ?? [];
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

            $dependents[] = [
                'id'          => count($dependents) + 1,
                'name'        => $data['name'] ?? '',
                'dateofbirth' => $data['dateofbirth'] ?? $data['dob'] ?? '',
                'phone'       => $data['phone'] ?? '',
                'relation'    => $data['relation'] ?? '',
                'gender'      => $data['gender'] ?? '',
                'note'        => $data['note'] ?? '',
            ];

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

        return $case->details['dependants'] ?? [];
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

            $vouchers[] = [
                'id'             => count($vouchers) + 1,
                'amount'         => $data['amount'] ?? null,
                'date'           => $data['date'] ?? null,
                'payment_method' => $data['payment_method'] ?? null,
                'account'        => $data['account'] ?? null,
                'description'    => $data['description'] ?? null,
            ];

            $details['vouchers'] = $vouchers;
            $case->details = $details;
            $case->save();

            return $case;
        });
    }
}

