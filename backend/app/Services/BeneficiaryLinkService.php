<?php

namespace App\Services;

use App\Models\BeneficiaryFormToken;
use App\Models\HumanCase;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BeneficiaryLinkService
{
    public function __construct(
        protected HumanCaseService $humanCaseService
    ) {}

    /**
     * Create a new secure single-use beneficiary registration link token.
     */
    public function createToken(array $data = [], ?User $user = null): BeneficiaryFormToken
    {
        $hours = (int) ($data['hours'] ?? 24);
        if ($hours <= 0) {
            $hours = 24;
        }

        $storeId = $user?->store_id ?? app('current_store_id', null) ?? Store::value('id') ?? 1;

        $token = new BeneficiaryFormToken();
        $token->store_id   = $storeId;
        $token->created_by = $user?->id;
        $token->code       = Str::random(48);
        $token->label      = $data['label'] ?? null;
        $token->expires_at = now()->addHours($hours);
        $token->is_used    = false;
        $token->save();

        return $token;
    }

    /**
     * List recent tokens for the current store.
     */
    public function listTokens(?int $storeId = null, int $limit = 30): Collection
    {
        $query = BeneficiaryFormToken::with(['humanCase', 'creator'])->latest();

        if ($storeId) {
            $query->where('store_id', $storeId);
        }

        return $query->take($limit)->get();
    }

    /**
     * Find token by code.
     */
    public function findByCode(string $code): ?BeneficiaryFormToken
    {
        return BeneficiaryFormToken::where('code', $code)->first();
    }

    /**
     * Check if token is valid.
     */
    public function validateToken(string $code): array
    {
        $token = $this->findByCode($code);

        if (! $token) {
            return [
                'valid'   => false,
                'message' => 'الرابط غير صحيح أو غير موجود',
                'status'  => 404,
                'token'   => null,
            ];
        }

        if ($token->is_used) {
            return [
                'valid'   => false,
                'message' => 'تم استخدام هذا الرابط مسبقاً وتعبئة البيانات',
                'status'  => 410,
                'token'   => $token,
            ];
        }

        if ($token->isExpired()) {
            return [
                'valid'   => false,
                'message' => 'انتهت صلاحية هذا الرابط (صالح لمدة 24 ساعة فقط)',
                'status'  => 410,
                'token'   => $token,
            ];
        }

        return [
            'valid'   => true,
            'message' => 'الرابط صالح للاستخدام',
            'status'  => 200,
            'token'   => $token,
        ];
    }

    /**
     * Create or update initial HumanCase from token (Step 1).
     */
    public function createCaseFromToken(BeneficiaryFormToken $token, array $data): HumanCase
    {
        return DB::transaction(function () use ($token, $data) {
            if ($token->human_case_id && $case = HumanCase::find($token->human_case_id)) {
                $case->update([
                    'name'          => $data['name'] ?? $case->name,
                    'gender'        => $data['gender'] ?? $case->gender,
                    'dob'           => $data['dob'] ?? $case->dob,
                    'humancasetype' => $data['humancasetype'] ?? $case->humancasetype,
                    'status'        => $data['status'] ?? $case->status,
                    'nationality'   => $data['nationality'] ?? $case->nationality,
                    'familycount'   => $data['familycount'] ?? $case->familycount,
                    'phonenum'      => $data['phonenum'] ?? $case->phonenum,
                    'email'         => $data['email'] ?? $case->email,
                    'accnumber'     => $data['accnumber'] ?? $case->accnumber,
                    'idnumber'      => $data['idnumber'] ?? $case->idnumber,
                    'idsource'      => $data['idsource'] ?? $case->idsource,
                    'iddate'        => $data['iddate'] ?? $case->iddate,
                    'note'          => $data['note'] ?? $case->note,
                ]);

                return $case;
            }

            $case = new HumanCase();
            $case->store_id      = $token->store_id;
            $case->name          = $data['name'];
            $case->gender        = $data['gender'] ?? '0';
            $case->dob           = $data['dob'] ?? null;
            $case->humancasetype = $data['humancasetype'] ?? '1';
            $case->status        = $data['status'] ?? '1'; // Social status
            $case->case_status   = 'معلق';                 // External registrations start as pending
            $case->nationality   = $data['nationality'] ?? null;
            $case->familycount   = $data['familycount'] ?? 0;
            $case->phonenum      = $data['phonenum'] ?? null;
            $case->email         = $data['email'] ?? null;
            $case->accnumber     = $data['accnumber'] ?? null;
            $case->idnumber      = $data['idnumber'] ?? null;
            $case->idsource      = $data['idsource'] ?? null;
            $case->iddate        = $data['iddate'] ?? null;
            $case->note          = $data['note'] ?? null;
            $case->details       = [];
            $case->save();

            $token->human_case_id = $case->id;
            $token->save();

            return $case;
        });
    }

    /**
     * Save banks for external registration (Step 2).
     */
    public function updateBanks(BeneficiaryFormToken $token, array $data, mixed $upload = null): void
    {
        if (! $token->human_case_id) {
            throw new \RuntimeException('لم يتم تسجيل البيانات الأساسية للمستفيد بعد');
        }

        $this->humanCaseService->updateBanks($token->human_case_id, $data, $upload);
    }

    /**
     * Save qualifications for external registration (Step 3).
     */
    public function storeQualifications(BeneficiaryFormToken $token, array $data, mixed $sourceFile = null, mixed $courseFile = null): void
    {
        if (! $token->human_case_id) {
            throw new \RuntimeException('لم يتم تسجيل البيانات الأساسية للمستفيد بعد');
        }

        $this->humanCaseService->storeQualifications($token->human_case_id, $data, $sourceFile, $courseFile);
    }

    /**
     * Save housing for external registration (Step 4).
     */
    public function updateHousing(BeneficiaryFormToken $token, array $data, mixed $upload1 = null, mixed $upload2 = null): void
    {
        if (! $token->human_case_id) {
            throw new \RuntimeException('لم يتم تسجيل البيانات الأساسية للمستفيد بعد');
        }

        $this->humanCaseService->updatePersonalFees($token->human_case_id, $data, $upload1, $upload2);
    }

    /**
     * Save health for external registration (Step 5).
     */
    public function storeHealth(BeneficiaryFormToken $token, array $data, mixed $upload = null): void
    {
        if (! $token->human_case_id) {
            throw new \RuntimeException('لم يتم تسجيل البيانات الأساسية للمستفيد بعد');
        }

        // Reset existing health records when editing
        $case = HumanCase::find($token->human_case_id);
        if ($case) {
            $details = $case->details ?? [];
            $details['health'] = [];
            $details['has_health_issues'] = false;
            $case->details = $details;
            $case->save();
        }

        $illnesses = $data['illness'] ?? null;
        if (is_string($illnesses)) {
            $decoded = json_decode($illnesses, true);
            if (is_array($decoded)) {
                $illnesses = $decoded;
            }
        }

        if (is_array($illnesses)) {
            if (! empty($illnesses)) {
                foreach ($illnesses as $illnessItem) {
                    if (is_array($illnessItem) && ! empty($illnessItem['name'])) {
                        $this->humanCaseService->storeHealth($token->human_case_id, $illnessItem, $upload);
                        $upload = null; // Only attach file to first record
                    }
                }
            } else {
                // Beneficiary explicitly stated no illnesses
                if ($case) {
                    $details = $case->details ?? [];
                    $details['has_health_issues'] = false;
                    $case->details = $details;
                    $case->save();
                }
            }
        } else {
            $this->humanCaseService->storeHealth($token->human_case_id, $data, $upload);
        }
    }

    /**
     * Save dependants for external registration & complete the link (Step 6).
     */
    public function storeDependants(BeneficiaryFormToken $token, array $data): void
    {
        if (! $token->human_case_id) {
            throw new \RuntimeException('لم يتم تسجيل البيانات الأساسية للمستفيد بعد');
        }

        // Reset existing dependants records when editing
        $case = HumanCase::find($token->human_case_id);
        if ($case) {
            $details = $case->details ?? [];
            $details['dependants'] = [];
            $case->details = $details;
            $case->save();
        }

        $dependents = $data['data'] ?? null;
        if (is_string($dependents)) {
            $decoded = json_decode($dependents, true);
            if (is_array($decoded)) {
                $dependents = $decoded;
            }
        }

        if (is_array($dependents)) {
            if (! empty($dependents)) {
                foreach ($dependents as $depItem) {
                    if (is_array($depItem) && ! empty($depItem['name'])) {
                        $this->humanCaseService->storeDependants($token->human_case_id, $depItem);
                    }
                }
            }
        } else {
            $this->humanCaseService->storeDependants($token->human_case_id, $data);
        }

        // Mark link as completed
        $token->is_used = true;
        $token->used_at = now();
        $token->save();
    }

    /**
     * Get beneficiary progress and all saved step data for continuing registration.
     */
    public function getBeneficiaryProgress(BeneficiaryFormToken $token): array
    {
        $default = [
            'suggested_step' => 'mainbeneficiarydata',
            'step_index'     => 0,
            'max_step'       => 0,
            'data'           => [
                'case'           => null,
                'bank'           => null,
                'qualifications' => null,
                'housing'        => null,
                'health'         => null,
                'dependants'     => null,
            ],
        ];

        if (! $token->human_case_id) {
            return $default;
        }

        $case = HumanCase::find($token->human_case_id);
        if (! $case) {
            return $default;
        }

        $details = $case->details ?? [];

        // Check completion of each step
        $hasCase = ! empty($case->name);

        $bankDetails = $details['bankdetails'] ?? [];
        $hasBank = ! empty($bankDetails['name']) || ! empty($bankDetails['iban']) || ! empty($case->accnumber);

        $qual = $details['qualifications'] ?? [];
        $hasQual = ! empty($qual['level']) || ! empty($qual['job']) || ! empty($qual['source']) || ! empty($qual['canwork']);

        $home = $details['home'] ?? $details['personalfeesdetails'] ?? [];
        $hasHome = ! empty($home['state']) || ! empty($home['village']) || ! empty($home['homeType']) || ! empty($home['rent']) || ! empty($home['nationalAdress']);

        $hasHealth = isset($details['health']) || isset($details['has_health_issues']);

        $hasDependants = isset($details['dependants']);

        // Determine max completed step and suggested step
        $suggestedStep = 'mainbeneficiarydata';
        $stepIndex = 0;
        $maxStep = 0;

        if ($hasCase) {
            $suggestedStep = 'bankdata';
            $stepIndex = 1;
            $maxStep = 1;

            if ($hasBank) {
                $suggestedStep = 'qualificationposition';
                $stepIndex = 2;
                $maxStep = 2;

                if ($hasQual) {
                    $suggestedStep = 'housingdata';
                    $stepIndex = 3;
                    $maxStep = 3;

                    if ($hasHome) {
                        $suggestedStep = 'healthdata';
                        $stepIndex = 4;
                        $maxStep = 4;

                        if ($hasHealth) {
                            $suggestedStep = 'dependentsdata';
                            $stepIndex = 5;
                            $maxStep = 5;
                        }
                    }
                }
            }
        }

        // Format Case Data
        $caseData = [
            'name'          => $case->name,
            'gender'        => (string) ($case->gender ?? '0'),
            'dob'           => $case->dob?->format('Y-m-d') ?? '',
            'humancasetype' => (string) ($case->humancasetype ?? '1'),
            'status'        => (string) ($case->status ?? '1'),
            'nationality'   => $case->nationality ?? 'سعودي',
            'familycount'   => (string) ($case->familycount ?? '1'),
            'phonenum'      => $case->phonenum ?? '',
            'email'         => $case->email ?? '',
            'accnumber'     => $case->accnumber ?? '',
            'idnumber'      => $case->idnumber ?? '',
            'idsource'      => $case->idsource ?? '',
            'iddate'        => $case->iddate?->format('Y-m-d') ?? '',
            'note'          => $case->note ?? '',
        ];

        // Format Bank Data
        $bankData = [
            'name'   => $bankDetails['name'] ?? '',
            'branch' => $bankDetails['branch'] ?? '',
            'iban'   => $bankDetails['iban'] ?? ($case->accnumber ?? ''),
            'upload' => $bankDetails['upload'] ?? ($details['bankdetails_upload'] ?? null),
        ];

        // Format Qualifications Data
        $sources = $qual['source'] ?? [];
        if (is_string($sources)) {
            $sources = json_decode($sources, true) ?: [];
        }
        $formattedSources = [];
        if (is_array($sources) && ! empty($sources)) {
            foreach ($sources as $s) {
                $formattedSources[] = [
                    'name'   => $s['sourcename'] ?? $s['name'] ?? '',
                    'amount' => $s['sourceamount'] ?? $s['amount'] ?? '',
                ];
            }
        }
        if (empty($formattedSources)) {
            $formattedSources = [['name' => '', 'amount' => '']];
        }

        $courses = $qual['course'] ?? [];
        if (is_string($courses)) {
            $courses = json_decode($courses, true) ?: [];
        }
        $formattedCourses = [];
        if (is_array($courses) && ! empty($courses)) {
            foreach ($courses as $c) {
                $formattedCourses[] = [
                    'title'   => $c['coursetitle'] ?? $c['title'] ?? '',
                    'address' => $c['courseaddress'] ?? $c['address'] ?? '',
                ];
            }
        }
        if (empty($formattedCourses)) {
            $formattedCourses = [['title' => '', 'address' => '']];
        }

        $qualData = [
            'level'        => $qual['level'] ?? 'ثانوي',
            'canwork'      => (string) ($qual['canwork'] ?? '1'),
            'job'          => $qual['job'] ?? '',
            'note'         => $qual['note'] ?? '',
            'sources'      => $formattedSources,
            'courses'      => $formattedCourses,
            'sourceupload' => $qual['sourceupload'] ?? null,
            'courseupload' => $qual['courseupload'] ?? null,
        ];

        // Format Housing Data
        $bills = $home['bills'] ?? [];
        if (is_string($bills)) {
            $bills = json_decode($bills, true) ?: [];
        }
        if (empty($bills) || ! is_array($bills)) {
            $bills = [
                ['name' => 'فاتورة الكهرباء', 'amount' => ''],
                ['name' => 'فاتورة المياه', 'amount' => ''],
            ];
        }

        $housingData = [
            'homestate'      => $home['state'] ?? $home['homestate'] ?? '',
            'village'        => $home['village'] ?? '',
            'nationalAdress' => $home['nationalAdress'] ?? '',
            'summaryAdress'  => $home['summaryAdress'] ?? '',
            'homeType'       => $home['homeType'] ?? 'شقة',
            'homeOwnership'  => $home['homeOwnership'] ?? 'إيجار',
            'rent'           => (string) ($home['rent'] ?? ''),
            'cars'           => (string) ($home['cars'] ?? '0'),
            'lands'          => (string) ($home['lands'] ?? '0'),
            'components'     => $home['components'] ?? '',
            'furniture'      => $home['furniture'] ?? 'متوسط',
            'cost'           => (string) ($home['cost'] ?? ''),
            'bills'          => $bills,
            'upload1'        => $home['personalfeesdetails_upload1'] ?? null,
            'upload2'        => $home['personalfeesdetails_upload2'] ?? null,
        ];

        // Format Health Data
        $healthList = $details['health'] ?? [];
        $formattedHealth = [];
        if (is_array($healthList) && ! empty($healthList)) {
            foreach ($healthList as $h) {
                $formattedHealth[] = [
                    'name'   => $h['disease_name'] ?? $h['name'] ?? '',
                    'type'   => $h['disease_type'] ?? $h['type'] ?? 'مزمن',
                    'degree' => $h['disease_degree'] ?? $h['degree'] ?? 'متوسطة',
                    'notes'  => $h['notes'] ?? '',
                    'trtype' => $h['treatment_type'] ?? $h['trtype'] ?? '',
                    'trcost' => (string) ($h['treatment_cost'] ?? $h['trcost'] ?? ''),
                ];
            }
        }
        $hasHealthIssues = ! empty($formattedHealth);
        if (empty($formattedHealth)) {
            $formattedHealth = [[
                'name' => '', 'type' => 'مزمن', 'degree' => 'متوسطة', 'notes' => '', 'trtype' => '', 'trcost' => '',
            ]];
        }
        $healthData = [
            'hasHealthIssues' => $hasHealthIssues,
            'illnesses'       => $formattedHealth,
            'upload'          => $details['health_upload'] ?? null,
        ];

        // Format Dependants Data
        $depList = $details['dependants'] ?? [];
        $formattedDeps = [];
        if (is_array($depList) && ! empty($depList)) {
            foreach ($depList as $d) {
                $formattedDeps[] = [
                    'name'        => $d['name'] ?? '',
                    'relation'    => $d['relation'] ?? 'ابن',
                    'gender'      => $d['gender'] ?? 'ذكر',
                    'dateofbirth' => $d['dateofbirth'] ?? $d['dob'] ?? '',
                    'nationalid'  => $d['nationalid'] ?? $d['idnumber'] ?? '',
                    'phone'       => $d['phone'] ?? '',
                    'note'        => $d['note'] ?? '',
                ];
            }
        }
        $hasDependents = ! empty($formattedDeps);
        if (empty($formattedDeps)) {
            $formattedDeps = [[
                'name' => '', 'relation' => 'ابن', 'gender' => 'ذكر', 'dateofbirth' => '', 'nationalid' => '', 'phone' => '', 'note' => '',
            ]];
        }
        $dependentsData = [
            'hasDependents' => $hasDependents,
            'dependents'    => $formattedDeps,
        ];

        return [
            'suggested_step' => $suggestedStep,
            'step_index'     => $stepIndex,
            'max_step'       => $maxStep,
            'data'           => [
                'case'           => $caseData,
                'bank'           => $bankData,
                'qualifications' => $qualData,
                'housing'        => $housingData,
                'health'         => $healthData,
                'dependants'     => $dependentsData,
            ],
        ];
    }
}
