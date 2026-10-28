<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DonorController;
use App\Http\Controllers\Api\InterestController;
use App\Http\Controllers\Api\VendorController;
use App\Http\Controllers\Api\HumanCaseController;
use Illuminate\Support\Facades\Route;

// Public Auth Endpoints
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public Case View & Quick Donation (Accessible to donors without login)
Route::get('/shop/{id}/view', [\App\Http\Controllers\Api\ShopCaseController::class, 'show']);
Route::post('/shop/public/donate', [\App\Http\Controllers\Api\ShopCaseController::class, 'storeReceipt']);

// Protected Endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Donor Interests CRUD
    Route::get('/donorinterest/all', [InterestController::class, 'all']);
    Route::match(['get', 'post'], '/donorinterest', [InterestController::class, 'index']);
    Route::post('/donorinterest/store', [InterestController::class, 'store']);
    Route::post('/donorinterest/update', [InterestController::class, 'update']);
    Route::get('/donorinterest/{id}/delete', [InterestController::class, 'destroy']);
    Route::delete('/donorinterest/{id}', [InterestController::class, 'destroy']);

    // Donors CRUD
    Route::match(['get', 'post'], '/donor', [DonorController::class, 'index']);
    Route::get('/donor/all', [DonorController::class, 'index']);
    Route::post('/donor/store', [DonorController::class, 'store']);
    Route::get('/donor/{id}', [DonorController::class, 'show']);
    Route::post('/donor/update', [DonorController::class, 'update']);
    Route::get('/donor/{id}/delete', [DonorController::class, 'destroy']);
    Route::delete('/donor/{id}', [DonorController::class, 'destroy']);

    // Vendors (Human Case Vendors) CRUD
    Route::match(['get', 'post'], '/humancasevendor', [VendorController::class, 'index']);
    Route::get('/humancasevendor/component', [VendorController::class, 'component']);
    Route::get('/humancasevendor/all', [VendorController::class, 'component']);
    Route::match(['get', 'post'], '/humancasevendor/act', [VendorController::class, 'act']);
    Route::post('/humancasevendor/store', [VendorController::class, 'store']);
    Route::get('/humancasevendor/{id}', [VendorController::class, 'show']);
    Route::post('/humancasevendor/update', [VendorController::class, 'update']);
    Route::get('/humancasevendor/{id}/delete', [VendorController::class, 'destroy']);
    Route::delete('/humancasevendor/{id}', [VendorController::class, 'destroy']);

    // Beneficiaries (Human Cases) CRUD
    Route::match(['get', 'post'], '/humancases', [HumanCaseController::class, 'index']);
    Route::match(['get', 'post'], '/humancases/rejected', [HumanCaseController::class, 'rejected']);
    Route::post('/humancases/store', [HumanCaseController::class, 'store']);
    Route::get('/humancases/{id}', [HumanCaseController::class, 'show']);
    Route::post('/humancases/update', [HumanCaseController::class, 'update']);
    Route::get('/humancases/{id}/delete', [HumanCaseController::class, 'destroy']);
    Route::delete('/humancases/{id}', [HumanCaseController::class, 'destroy']);

    // Beneficiary Details Sub-Endpoints
    Route::get('/humancasedetails/get/{id}', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'get']);
    Route::post('/humancasedetails/update/banks', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'updateBanks']);
    Route::post('/humancasedetails/qualifications/store', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'storeQualifications']);
    Route::post('/humancasedetails/update/personalfees', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'updatePersonalFees']);
    Route::post('/humancasedetails/health/store', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'storeHealth']);
    Route::match(['get', 'post'], '/humancasedetails/showhealthdata/{id}', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'showHealthData']);
    Route::post('/humancasedetails/dependants/store', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'storeDependants']);
    Route::match(['get', 'post'], '/humancasedetails/showdependantsdata/{id}', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'showDependantsData']);
    Route::post('/humancasedetails/voucher/store', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'storeVoucher']);
    Route::post('/humancasedetails/update/status', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'updateStatus']);
    Route::post('/humancases/update/status', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'updateStatus']);

    // Beneficiary Registration Link Generation
    Route::post('/hcform/request', [\App\Http\Controllers\Api\BeneficiaryLinkController::class, 'generate']);
    Route::get('/hcform/tokens', [\App\Http\Controllers\Api\BeneficiaryLinkController::class, 'tokens']);

    // Beneficiary Satisfaction Surveys
    Route::get('/surveys', [\App\Http\Controllers\Api\SurveyController::class, 'index']);
    Route::post('/surveys', [\App\Http\Controllers\Api\SurveyController::class, 'store']);
    Route::delete('/surveys/{id}', [\App\Http\Controllers\Api\SurveyController::class, 'destroy']);

    // Assembly Members
    Route::match(['get', 'post'], '/assemblymembers', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'index']);
    Route::get('/assemblymembers/stats', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'stats']);
    Route::post('/assemblymembers/store', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'store']);
    Route::get('/assemblymembers/{id}', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'show']);
    Route::post('/assemblymembers/update', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'update']);
    Route::match(['put', 'patch', 'post'], '/assemblymembers/{id}/update', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'update']);
    Route::match(['put', 'patch'], '/assemblymembers/{id}', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'update']);
    Route::delete('/assemblymembers/{id}', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'destroy']);
    Route::match(['get', 'post'], '/receiptorg/assembly', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'payments']);
    Route::match(['get', 'post'], '/receiptorg/assembly/{id}', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'paymentDetails'])->whereNumber('id');
    // Association Committees Endpoints
    Route::match(['get', 'post'], '/associationcommittee', [\App\Http\Controllers\Api\CommitteeController::class, 'index']);
    Route::get('/associationcommittee/stats', [\App\Http\Controllers\Api\CommitteeController::class, 'stats']);
    Route::post('/associationcommittee/store', [\App\Http\Controllers\Api\CommitteeController::class, 'store']);
    Route::get('/associationcommittee/{id}', [\App\Http\Controllers\Api\CommitteeController::class, 'show']);
    Route::match(['put', 'patch', 'post'], '/associationcommittee/update/{id}', [\App\Http\Controllers\Api\CommitteeController::class, 'update']);
    Route::match(['put', 'patch', 'post'], '/associationcommittee/{id}/update', [\App\Http\Controllers\Api\CommitteeController::class, 'update']);
    Route::match(['put', 'patch'], '/associationcommittee/{id}', [\App\Http\Controllers\Api\CommitteeController::class, 'update']);
    Route::delete('/associationcommittee/{id}', [\App\Http\Controllers\Api\CommitteeController::class, 'destroy']);
    Route::match(['get', 'post'], '/associationcommittee/{id}/members', [\App\Http\Controllers\Api\CommitteeController::class, 'members']);
    Route::get('/associationcommittee/components/assemblymembers', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'dropdown']);
    // Minute Sheets Endpoints
    Route::match(['get', 'post'], '/minutesheets', [\App\Http\Controllers\Api\MinuteSheetController::class, 'index']);
    Route::get('/minutesheets/stats', [\App\Http\Controllers\Api\MinuteSheetController::class, 'stats']);
    Route::post('/minutesheets/store', [\App\Http\Controllers\Api\MinuteSheetController::class, 'store']);
    Route::get('/minutesheets/{id}', [\App\Http\Controllers\Api\MinuteSheetController::class, 'show']);
    Route::post('/minutesheets/update', [\App\Http\Controllers\Api\MinuteSheetController::class, 'update']);
    Route::match(['put', 'patch', 'post'], '/minutesheets/update/{id}', [\App\Http\Controllers\Api\MinuteSheetController::class, 'update']);
    Route::match(['put', 'patch', 'post'], '/minutesheets/{id}/update', [\App\Http\Controllers\Api\MinuteSheetController::class, 'update']);
    Route::match(['put', 'patch'], '/minutesheets/{id}', [\App\Http\Controllers\Api\MinuteSheetController::class, 'update']);
    Route::delete('/minutesheets/{id}', [\App\Http\Controllers\Api\MinuteSheetController::class, 'destroy']);

    // Shop (Case Details Report) Endpoints
    Route::match(['get', 'post'], '/shop', [\App\Http\Controllers\Api\ShopCaseController::class, 'index']);
    Route::get('/shop/stats', [\App\Http\Controllers\Api\ShopCaseController::class, 'stats']);
    Route::post('/shop/store', [\App\Http\Controllers\Api\ShopCaseController::class, 'store']);
    Route::get('/shop/{id}/view', [\App\Http\Controllers\Api\ShopCaseController::class, 'show']);
    Route::get('/shop/{id}', [\App\Http\Controllers\Api\ShopCaseController::class, 'show']);
    Route::post('/shop/update', [\App\Http\Controllers\Api\ShopCaseController::class, 'update']);
    Route::match(['put', 'patch', 'post'], '/shop/update/{id}', [\App\Http\Controllers\Api\ShopCaseController::class, 'update']);
    Route::match(['put', 'patch', 'post'], '/shop/{id}/update', [\App\Http\Controllers\Api\ShopCaseController::class, 'update']);
    Route::match(['put', 'patch'], '/shop/{id}', [\App\Http\Controllers\Api\ShopCaseController::class, 'update']);
    Route::get('/shop/{id}/close', [\App\Http\Controllers\Api\ShopCaseController::class, 'close']);
    Route::get('/shop/{id}/delete', [\App\Http\Controllers\Api\ShopCaseController::class, 'destroy']);
    Route::delete('/shop/{id}', [\App\Http\Controllers\Api\ShopCaseController::class, 'destroy']);
    Route::post('/shoptransaction/storerec', [\App\Http\Controllers\Api\ShopCaseController::class, 'storeReceipt']);
    Route::post('/shoptransaction/storepay', [\App\Http\Controllers\Api\ShopCaseController::class, 'storePayment']);
    Route::match(['get', 'post'], '/shoptransaction/{id}', [\App\Http\Controllers\Api\ShopCaseController::class, 'transactions'])->whereNumber('id');
    Route::match(['get', 'post'], '/shoptransaction/case/totalrecieved', [\App\Http\Controllers\Api\ShopCaseController::class, 'totalReceived']);
    Route::match(['get', 'post'], '/shoptransaction/case/recieved/{id}', [\App\Http\Controllers\Api\ShopCaseController::class, 'donorDonations'])->whereNumber('id');
    Route::match(['get', 'post'], '/shoptransaction/case/totalpaid', [\App\Http\Controllers\Api\ShopCaseController::class, 'totalPaid']);
    Route::match(['get', 'post'], '/shoptransaction/case/paid/{id}', [\App\Http\Controllers\Api\ShopCaseController::class, 'beneficiaryPayments'])->whereNumber('id');
    Route::post('/shopdetails/store', [\App\Http\Controllers\Api\ShopCaseController::class, 'storeDetail']);

    // Ads Endpoints
    Route::post('/ads/shop/store', [\App\Http\Controllers\Api\AdController::class, 'storeShop']);
    Route::match(['get', 'post'], '/organization/ads', [\App\Http\Controllers\Api\AdController::class, 'index']);
    Route::post('/organization/ads/status/update', [\App\Http\Controllers\Api\AdController::class, 'updateStatus']);

    // Donation Accounts Dropdown
    Route::get('/transactions/components/donations', [\App\Http\Controllers\Api\AdController::class, 'donationAccounts']);

    // Projects Endpoints
    Route::match(['get', 'post'], '/projects', [\App\Http\Controllers\Api\ProjectController::class, 'index']);
    Route::post('/projects/store', [\App\Http\Controllers\Api\ProjectController::class, 'store']);
    Route::get('/projects/{id}', [\App\Http\Controllers\Api\ProjectController::class, 'show'])->whereNumber('id');
    Route::post('/projects/update', [\App\Http\Controllers\Api\ProjectController::class, 'update']);
    Route::match(['put', 'patch', 'post'], '/projects/update/{id}', [\App\Http\Controllers\Api\ProjectController::class, 'update'])->whereNumber('id');
    Route::match(['put', 'patch'], '/projects/{id}', [\App\Http\Controllers\Api\ProjectController::class, 'update'])->whereNumber('id');
    Route::get('/projects/{id}/cancel', [\App\Http\Controllers\Api\ProjectController::class, 'cancel'])->whereNumber('id');
    Route::get('/projects/{id}/activate', [\App\Http\Controllers\Api\ProjectController::class, 'activate'])->whereNumber('id');
    Route::get('/projects/{id}/close', [\App\Http\Controllers\Api\ProjectController::class, 'close'])->whereNumber('id');
    Route::match(['get', 'delete'], '/projects/{id}/delete', [\App\Http\Controllers\Api\ProjectController::class, 'destroy'])->whereNumber('id');
    Route::delete('/projects/{id}', [\App\Http\Controllers\Api\ProjectController::class, 'destroy'])->whereNumber('id');
    Route::get('/projectprogress/{id}/percentage', [\App\Http\Controllers\Api\ProjectController::class, 'progressPercentage'])->whereNumber('id');
    Route::post('/projectsdetails/store', [\App\Http\Controllers\Api\ProjectController::class, 'storeDetail']);
    Route::post('/shoptransaction/storepayprojects', [\App\Http\Controllers\Api\ProjectController::class, 'storePayment']);
    Route::post('/shoptransaction/storerecprojects', [\App\Http\Controllers\Api\ProjectController::class, 'storeReceipt']);
    Route::get('/shoptransaction/{id}/projects', [\App\Http\Controllers\Api\ProjectController::class, 'transactions'])->whereNumber('id');
    Route::match(['get', 'post'], '/shoptransaction/{id}/payments', [\App\Http\Controllers\Api\ProjectController::class, 'payments'])->whereNumber('id');

    // Project Subsystems (Phases, Members, KPIs, Attachments, Risks)
    Route::match(['get', 'post'], '/projectphase/{id}', [\App\Http\Controllers\Api\ProjectController::class, 'phases'])->whereNumber('id');
    Route::get('/projectphase/{id}/all', [\App\Http\Controllers\Api\ProjectController::class, 'allPhases'])->whereNumber('id');
    Route::post('/projectphase/store', [\App\Http\Controllers\Api\ProjectController::class, 'storePhase']);
    Route::post('/projectprogress/phase/complete', [\App\Http\Controllers\Api\ProjectController::class, 'completePhase']);
    Route::get('/projectphase/{id}/status/cancel', [\App\Http\Controllers\Api\ProjectController::class, 'cancelPhase'])->whereNumber('id');
    Route::get('/projectphase/{id}/status/activate', [\App\Http\Controllers\Api\ProjectController::class, 'activatePhase'])->whereNumber('id');

    Route::match(['get', 'post'], '/projectassignment/{id}', [\App\Http\Controllers\Api\ProjectController::class, 'assignments'])->whereNumber('id');
    Route::post('/projectassignment/store', [\App\Http\Controllers\Api\ProjectController::class, 'storeAssignment']);
    Route::match(['get', 'delete'], '/projectassignment/{id}/delete', [\App\Http\Controllers\Api\ProjectController::class, 'deleteAssignment'])->whereNumber('id');

    // Master KPIs Management (/kpi)
    Route::match(['get', 'post'], '/kpi', [\App\Http\Controllers\Api\KpiController::class, 'index']);
    Route::post('/kpi/store', [\App\Http\Controllers\Api\KpiController::class, 'store']);
    Route::match(['put', 'patch', 'post'], '/kpi/{id}/update', [\App\Http\Controllers\Api\KpiController::class, 'update'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/kpi/update/{id}', [\App\Http\Controllers\Api\KpiController::class, 'update'])->whereNumber('id');
    Route::match(['get', 'delete'], '/kpi/{id}/delete', [\App\Http\Controllers\Api\KpiController::class, 'destroy'])->whereNumber('id');
    Route::delete('/kpi/{id}', [\App\Http\Controllers\Api\KpiController::class, 'destroy'])->whereNumber('id');
    Route::get('/kpi/quizs', [\App\Http\Controllers\Api\KpiController::class, 'quizs']);

    // Project KPIs
    Route::match(['get', 'post'], '/projectkpi/{id}', [\App\Http\Controllers\Api\ProjectController::class, 'kpis'])->whereNumber('id');
    Route::post('/projectkpi/store', [\App\Http\Controllers\Api\ProjectController::class, 'storeKpis']);
    Route::match(['get', 'delete'], '/projectkpi/{id}/delete', [\App\Http\Controllers\Api\ProjectController::class, 'deleteKpi'])->whereNumber('id');

    Route::match(['get', 'post'], '/projectuploads/{id}', [\App\Http\Controllers\Api\ProjectController::class, 'uploads'])->whereNumber('id');
    Route::match(['get', 'post'], '/projectupload/{id}', [\App\Http\Controllers\Api\ProjectController::class, 'uploads'])->whereNumber('id');
    Route::post('/projectuploads/store', [\App\Http\Controllers\Api\ProjectController::class, 'storeUpload']);
    Route::post('/projectupload/store', [\App\Http\Controllers\Api\ProjectController::class, 'storeUpload']);
    Route::match(['get', 'delete'], '/projectuploads/{id}/delete', [\App\Http\Controllers\Api\ProjectController::class, 'deleteUpload'])->whereNumber('id');
    Route::match(['get', 'delete'], '/projectupload/{id}/delete', [\App\Http\Controllers\Api\ProjectController::class, 'deleteUpload'])->whereNumber('id');

    Route::match(['get', 'post'], '/projectrisk/{id}', [\App\Http\Controllers\Api\ProjectController::class, 'risks'])->whereNumber('id');
    Route::post('/projectrisk/risk/store', [\App\Http\Controllers\Api\ProjectController::class, 'storeRisk']);
    Route::match(['get', 'post'], '/projectrisk/mitigation/{id}', [\App\Http\Controllers\Api\ProjectController::class, 'showRisk'])->whereNumber('id');
    Route::get('/projectrisk/detail/{id}', [\App\Http\Controllers\Api\ProjectController::class, 'showRisk'])->whereNumber('id');
    Route::get('/projectrisk/show/{id}', [\App\Http\Controllers\Api\ProjectController::class, 'showRisk'])->whereNumber('id');
    Route::post('/projectrisk/mitigation/store', [\App\Http\Controllers\Api\ProjectController::class, 'storeRiskMitigation']);
    Route::get('/projectrisk/{id}/report', [\App\Http\Controllers\Api\ProjectController::class, 'riskReport'])->whereNumber('id');

    Route::get('/employees/all', [\App\Http\Controllers\Api\ProjectController::class, 'employees']);
    Route::get('/volunteers/all', [\App\Http\Controllers\Api\ProjectController::class, 'volunteers']);
});

// External Beneficiary Multi-Step Registration (Public)
Route::get('/hcrequest/{code}', [\App\Http\Controllers\Api\BeneficiaryLinkController::class, 'check']);
Route::post('/hcrequest/{code}/case', [\App\Http\Controllers\Api\BeneficiaryLinkController::class, 'storeCase']);
Route::post('/hcrequest/{code}/banks', [\App\Http\Controllers\Api\BeneficiaryLinkController::class, 'storeBanks']);
Route::post('/hcrequest/{code}/qualifications', [\App\Http\Controllers\Api\BeneficiaryLinkController::class, 'storeQualifications']);
Route::post('/hcrequest/{code}/homedetails', [\App\Http\Controllers\Api\BeneficiaryLinkController::class, 'storeHousing']);
Route::post('/hcrequest/{code}/healthdetails', [\App\Http\Controllers\Api\BeneficiaryLinkController::class, 'storeHealth']);
Route::post('/hcrequest/{code}/dependantdetails', [\App\Http\Controllers\Api\BeneficiaryLinkController::class, 'storeDependants']);

// Notifications Endpoints (Public/Optional Auth)
Route::get('/notify', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
Route::get('/notify/{id}', [\App\Http\Controllers\Api\NotificationController::class, 'show']);

