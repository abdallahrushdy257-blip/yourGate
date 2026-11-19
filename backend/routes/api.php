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
    Route::post('/donor/receipt', [DonorController::class, 'storeReceipt']);
    Route::post('/donor/update', [DonorController::class, 'update']);
    Route::get('/donor/{id}', [DonorController::class, 'show'])->whereNumber('id');
    Route::get('/donor/{id}/delete', [DonorController::class, 'destroy'])->whereNumber('id');
    Route::delete('/donor/{id}', [DonorController::class, 'destroy'])->whereNumber('id');

    // Vendors (Human Case Vendors) CRUD
    Route::match(['get', 'post'], '/humancasevendor', [VendorController::class, 'index']);
    Route::get('/humancasevendor/component', [VendorController::class, 'component']);
    Route::get('/humancasevendor/all', [VendorController::class, 'component']);
    Route::match(['get', 'post'], '/humancasevendor/act', [VendorController::class, 'act']);
    Route::post('/humancasevendor/store', [VendorController::class, 'store']);
    Route::post('/humancasevendor/update', [VendorController::class, 'update']);
    Route::get('/humancasevendor/{id}', [VendorController::class, 'show'])->whereNumber('id');
    Route::get('/humancasevendor/{id}/delete', [VendorController::class, 'destroy'])->whereNumber('id');
    Route::delete('/humancasevendor/{id}', [VendorController::class, 'destroy'])->whereNumber('id');

    // Vendor aliases for Accounting / Purchases
    Route::match(['get', 'post'], '/vendor', [VendorController::class, 'index']);
    Route::get('/vendor/all', [VendorController::class, 'component']);
    Route::get('/vendor/component', [VendorController::class, 'component']);
    Route::post('/vendor/store', [VendorController::class, 'store']);
    Route::post('/vendor/vendorstore', [VendorController::class, 'store']);
    Route::post('/vendor/update', [VendorController::class, 'update']);
    Route::get('/vendor/{id}', [VendorController::class, 'show'])->whereNumber('id');
    Route::get('/vendor/{id}/delete', [VendorController::class, 'destroy'])->whereNumber('id');
    Route::delete('/vendor/{id}', [VendorController::class, 'destroy'])->whereNumber('id');

    // Client aliases (العملاء) for Accounting / Sales
    Route::match(['get', 'post'], '/client', [VendorController::class, 'index']);
    Route::get('/client/all', [VendorController::class, 'component']);
    Route::get('/client/component', [VendorController::class, 'component']);
    Route::post('/client/store', [VendorController::class, 'store']);
    Route::post('/client/clientstore', [VendorController::class, 'store']);
    Route::post('/client/update', [VendorController::class, 'update']);
    Route::get('/client/{id}', [VendorController::class, 'show'])->whereNumber('id');
    Route::get('/client/{id}/delete', [VendorController::class, 'destroy'])->whereNumber('id');
    Route::delete('/client/{id}', [VendorController::class, 'destroy'])->whereNumber('id');

    // Beneficiaries (Human Cases) CRUD
    Route::match(['get', 'post'], '/humancases', [HumanCaseController::class, 'index']);
    Route::match(['get', 'post'], '/humancases/rejected', [HumanCaseController::class, 'rejected']);
    Route::post('/humancases/store', [HumanCaseController::class, 'store']);
    Route::post('/humancases/update', [HumanCaseController::class, 'update']);
    Route::get('/humancases/{id}', [HumanCaseController::class, 'show'])->whereNumber('id');
    Route::get('/humancases/{id}/delete', [HumanCaseController::class, 'destroy'])->whereNumber('id');
    Route::delete('/humancases/{id}', [HumanCaseController::class, 'destroy'])->whereNumber('id');
    Route::post('/humancases/{id}/voucher', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'storeVoucher'])->whereNumber('id');

    // Beneficiary Details Sub-Endpoints
    Route::get('/humancasedetails/get/{id}', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'get'])->whereNumber('id');
    Route::post('/humancasedetails/update/banks', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'updateBanks']);
    Route::post('/humancasedetails/qualifications/store', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'storeQualifications']);
    Route::post('/humancasedetails/update/personalfees', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'updatePersonalFees']);
    Route::post('/humancasedetails/health/store', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'storeHealth']);
    Route::match(['get', 'post'], '/humancasedetails/showhealthdata/{id}', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'showHealthData'])->whereNumber('id');
    Route::get('/humancasedetails/show/{id}/health', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'showSingleHealth'])->whereNumber('id');
    Route::post('/humancasedetails/update/healthdata/{id}', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'updateSingleHealth'])->whereNumber('id');
    Route::post('/humancasedetails/dependants/store', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'storeDependants']);
    Route::match(['get', 'post'], '/humancasedetails/showdependantsdata/{id}', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'showDependantsData'])->whereNumber('id');
    Route::get('/humancasedetails/show/{id}/dependants', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'showSingleDependent'])->whereNumber('id');
    Route::post('/humancasedetails/update/dependsdata/{id}', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'updateSingleDependent'])->whereNumber('id');
    Route::post('/humancasedetails/voucher/store', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'storeVoucher']);
    Route::post('/humancasedetails/update/status', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'updateStatus']);
    Route::post('/humancases/update/status', [\App\Http\Controllers\Api\HumanCaseDetailController::class, 'updateStatus']);

    // Beneficiary Registration Link Generation
    Route::post('/hcform/request', [\App\Http\Controllers\Api\BeneficiaryLinkController::class, 'generate']);
    Route::get('/hcform/tokens', [\App\Http\Controllers\Api\BeneficiaryLinkController::class, 'tokens']);

    // Beneficiary Satisfaction Surveys
    Route::get('/surveys', [\App\Http\Controllers\Api\SurveyController::class, 'index']);
    Route::post('/surveys', [\App\Http\Controllers\Api\SurveyController::class, 'store']);
    Route::delete('/surveys/{id}', [\App\Http\Controllers\Api\SurveyController::class, 'destroy'])->whereNumber('id');

    // Assembly Members
    Route::match(['get', 'post'], '/assemblymembers', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'index']);
    Route::get('/assemblymembers/stats', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'stats']);
    Route::post('/assemblymembers/store', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'store']);
    Route::post('/assemblymembers/update', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'update']);
    Route::get('/assemblymembers/{id}', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'show'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/assemblymembers/{id}/update', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'update'])->whereNumber('id');
    Route::match(['put', 'patch'], '/assemblymembers/{id}', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'update'])->whereNumber('id');
    Route::delete('/assemblymembers/{id}', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'destroy'])->whereNumber('id');
    Route::match(['get', 'post'], '/receiptorg/assembly', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'payments']);
    Route::post('/receiptorg/assembly/store', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'storeReceipt']);
    Route::post('/receiptorg/assembly/paid/store', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'storePayment']);
    Route::match(['get', 'post'], '/receiptorg/assembly/{id}', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'paymentDetails'])->whereNumber('id');
    // Association Committees Endpoints
    Route::match(['get', 'post'], '/associationcommittee', [\App\Http\Controllers\Api\CommitteeController::class, 'index']);
    Route::get('/associationcommittee/stats', [\App\Http\Controllers\Api\CommitteeController::class, 'stats']);
    Route::post('/associationcommittee/store', [\App\Http\Controllers\Api\CommitteeController::class, 'store']);
    Route::get('/associationcommittee/components/assemblymembers', [\App\Http\Controllers\Api\AssemblyMemberController::class, 'dropdown']);
    Route::get('/associationcommittee/{id}', [\App\Http\Controllers\Api\CommitteeController::class, 'show'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/associationcommittee/update/{id}', [\App\Http\Controllers\Api\CommitteeController::class, 'update'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/associationcommittee/{id}/update', [\App\Http\Controllers\Api\CommitteeController::class, 'update'])->whereNumber('id');
    Route::match(['put', 'patch'], '/associationcommittee/{id}', [\App\Http\Controllers\Api\CommitteeController::class, 'update'])->whereNumber('id');
    Route::delete('/associationcommittee/{id}', [\App\Http\Controllers\Api\CommitteeController::class, 'destroy'])->whereNumber('id');
    Route::match(['get', 'post'], '/associationcommittee/{id}/members', [\App\Http\Controllers\Api\CommitteeController::class, 'members'])->whereNumber('id');
    // Minute Sheets Endpoints
    Route::match(['get', 'post'], '/minutesheets', [\App\Http\Controllers\Api\MinuteSheetController::class, 'index']);
    Route::get('/minutesheets/stats', [\App\Http\Controllers\Api\MinuteSheetController::class, 'stats']);
    Route::post('/minutesheets/store', [\App\Http\Controllers\Api\MinuteSheetController::class, 'store']);
    Route::post('/minutesheets/update', [\App\Http\Controllers\Api\MinuteSheetController::class, 'update']);
    Route::get('/minutesheets/{id}', [\App\Http\Controllers\Api\MinuteSheetController::class, 'show'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/minutesheets/update/{id}', [\App\Http\Controllers\Api\MinuteSheetController::class, 'update'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/minutesheets/{id}/update', [\App\Http\Controllers\Api\MinuteSheetController::class, 'update'])->whereNumber('id');
    Route::match(['put', 'patch'], '/minutesheets/{id}', [\App\Http\Controllers\Api\MinuteSheetController::class, 'update'])->whereNumber('id');
    Route::delete('/minutesheets/{id}', [\App\Http\Controllers\Api\MinuteSheetController::class, 'destroy'])->whereNumber('id');

    // Shop (Case Details Report) Endpoints
    Route::match(['get', 'post'], '/shop', [\App\Http\Controllers\Api\ShopCaseController::class, 'index']);
    Route::get('/shop/stats', [\App\Http\Controllers\Api\ShopCaseController::class, 'stats']);
    Route::post('/shop/store', [\App\Http\Controllers\Api\ShopCaseController::class, 'store']);
    Route::post('/shop/update', [\App\Http\Controllers\Api\ShopCaseController::class, 'update']);
    Route::get('/shop/{id}/view', [\App\Http\Controllers\Api\ShopCaseController::class, 'show'])->whereNumber('id');
    Route::get('/shop/{id}', [\App\Http\Controllers\Api\ShopCaseController::class, 'show'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/shop/update/{id}', [\App\Http\Controllers\Api\ShopCaseController::class, 'update'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/shop/{id}/update', [\App\Http\Controllers\Api\ShopCaseController::class, 'update'])->whereNumber('id');
    Route::match(['put', 'patch'], '/shop/{id}', [\App\Http\Controllers\Api\ShopCaseController::class, 'update'])->whereNumber('id');
    Route::get('/shop/{id}/close', [\App\Http\Controllers\Api\ShopCaseController::class, 'close'])->whereNumber('id');
    Route::get('/shop/{id}/delete', [\App\Http\Controllers\Api\ShopCaseController::class, 'destroy'])->whereNumber('id');
    Route::delete('/shop/{id}', [\App\Http\Controllers\Api\ShopCaseController::class, 'destroy'])->whereNumber('id');
    Route::post('/shoptransaction/storerec', [\App\Http\Controllers\Api\ShopCaseController::class, 'storeReceipt']);
    Route::post('/shoptransaction/storepay', [\App\Http\Controllers\Api\ShopCaseController::class, 'storePayment']);
    Route::get('/shoptransaction/{id}/shop/showrec', [\App\Http\Controllers\Api\ShopCaseController::class, 'showReceiptVoucher'])->whereNumber('id');
    Route::get('/shoptransaction/{id}/project/showrec', [\App\Http\Controllers\Api\ShopCaseController::class, 'showProjectReceiptVoucher'])->whereNumber('id');
    Route::get('/shoptransaction/{id}/assembly', [\App\Http\Controllers\Api\ShopCaseController::class, 'showAssemblyVoucher'])->whereNumber('id');
    Route::get('/shoptransaction/{id}/humancase', [\App\Http\Controllers\Api\ShopCaseController::class, 'showHumanCaseVoucher'])->whereNumber('id');
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
    Route::match(['get', 'post'], '/projectpaymentreport', [\App\Http\Controllers\Api\ProjectController::class, 'paymentReport']);
    Route::match(['get', 'post'], '/projects/payments/report', [\App\Http\Controllers\Api\ProjectController::class, 'paymentReport']);
    Route::get('/projectpaymentreport/stats', [\App\Http\Controllers\Api\ProjectController::class, 'paymentReportStats']);

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

    // Master Job Titles Management (/jobtitle)
    Route::match(['get', 'post'], '/jobtitle', [\App\Http\Controllers\Api\JobTitleController::class, 'index']);
    Route::post('/jobtitle/store', [\App\Http\Controllers\Api\JobTitleController::class, 'store']);
    Route::get('/jobtitle/{id}', [\App\Http\Controllers\Api\JobTitleController::class, 'show'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/jobtitle/update', [\App\Http\Controllers\Api\JobTitleController::class, 'update']);
    Route::match(['put', 'patch', 'post'], '/jobtitle/{id}/update', [\App\Http\Controllers\Api\JobTitleController::class, 'update'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/jobtitle/update/{id}', [\App\Http\Controllers\Api\JobTitleController::class, 'update'])->whereNumber('id');
    Route::match(['get', 'delete'], '/jobtitle/{id}/delete', [\App\Http\Controllers\Api\JobTitleController::class, 'destroy'])->whereNumber('id');
    Route::delete('/jobtitle/{id}', [\App\Http\Controllers\Api\JobTitleController::class, 'destroy'])->whereNumber('id');

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
    Route::match(['get', 'delete'], '/projectrisk/{id}/delete', [\App\Http\Controllers\Api\ProjectController::class, 'destroyRisk'])->whereNumber('id');
    Route::delete('/projectrisk/{id}', [\App\Http\Controllers\Api\ProjectController::class, 'destroyRisk'])->whereNumber('id');

    Route::get('/employees/all', [\App\Http\Controllers\Api\ProjectController::class, 'employees']);
    Route::get('/volunteers/all', [\App\Http\Controllers\Api\ProjectController::class, 'volunteers']);

    // Master Employees Management (/employees)
    Route::match(['get', 'post'], '/employees', [\App\Http\Controllers\Api\EmployeeController::class, 'index']);
    Route::post('/employees/store', [\App\Http\Controllers\Api\EmployeeController::class, 'store']);
    Route::get('/employees/{id}', [\App\Http\Controllers\Api\EmployeeController::class, 'show'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/employees/update', [\App\Http\Controllers\Api\EmployeeController::class, 'update']);
    Route::match(['put', 'patch', 'post'], '/employees/{id}/update', [\App\Http\Controllers\Api\EmployeeController::class, 'update'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/employees/update/{id}', [\App\Http\Controllers\Api\EmployeeController::class, 'update'])->whereNumber('id');
    Route::match(['get', 'delete'], '/employees/{id}/delete', [\App\Http\Controllers\Api\EmployeeController::class, 'destroy'])->whereNumber('id');
    Route::delete('/employees/{id}', [\App\Http\Controllers\Api\EmployeeController::class, 'destroy'])->whereNumber('id');
    Route::post('/salary/store', [\App\Http\Controllers\Api\EmployeeController::class, 'storeSalary']);

    // Master Sections & Departments Management (/sections & /departments)
    Route::match(['get', 'post'], '/sections', [\App\Http\Controllers\Api\SectionController::class, 'index']);
    Route::match(['get', 'post'], '/departments', [\App\Http\Controllers\Api\SectionController::class, 'index']);
    Route::match(['get', 'post'], '/organizational-chart', [\App\Http\Controllers\Api\SectionController::class, 'chart']);
    Route::match(['get', 'post'], '/organizationalchart', [\App\Http\Controllers\Api\SectionController::class, 'chart']);
    Route::post('/sections/store', [\App\Http\Controllers\Api\SectionController::class, 'store']);
    Route::get('/sections/{id}', [\App\Http\Controllers\Api\SectionController::class, 'show'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/sections/update', [\App\Http\Controllers\Api\SectionController::class, 'update']);
    Route::match(['put', 'patch', 'post'], '/sections/{id}/update', [\App\Http\Controllers\Api\SectionController::class, 'update'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/sections/update/{id}', [\App\Http\Controllers\Api\SectionController::class, 'update'])->whereNumber('id');
    Route::match(['get', 'delete'], '/sections/{id}/delete', [\App\Http\Controllers\Api\SectionController::class, 'destroy'])->whereNumber('id');
    Route::delete('/sections/{id}', [\App\Http\Controllers\Api\SectionController::class, 'destroy'])->whereNumber('id');

    // Master Vacation Types (/vacations, /leavestype)
    Route::match(['get', 'post'], '/vacations', [\App\Http\Controllers\Api\VacationController::class, 'index']);
    Route::match(['get', 'post'], '/leavestype', [\App\Http\Controllers\Api\VacationController::class, 'index']);
    Route::match(['get', 'post'], '/leave-types', [\App\Http\Controllers\Api\VacationController::class, 'index']);
    Route::post('/vacations/store', [\App\Http\Controllers\Api\VacationController::class, 'store']);
    Route::get('/vacations/{id}', [\App\Http\Controllers\Api\VacationController::class, 'show'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/vacations/update', [\App\Http\Controllers\Api\VacationController::class, 'update']);
    Route::match(['put', 'patch', 'post'], '/vacations/{id}/update', [\App\Http\Controllers\Api\VacationController::class, 'update'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/vacations/update/{id}', [\App\Http\Controllers\Api\VacationController::class, 'update'])->whereNumber('id');
    Route::match(['get', 'delete', 'post'], '/vacations/{id}/delete', [\App\Http\Controllers\Api\VacationController::class, 'destroy'])->whereNumber('id');
    Route::delete('/vacations/{id}', [\App\Http\Controllers\Api\VacationController::class, 'destroy'])->whereNumber('id');

    // Vacation Requests & Permissions (/vacationrequests & /leaverequests)
    Route::match(['get', 'post'], '/vacationrequests', [\App\Http\Controllers\Api\VacationRequestController::class, 'indexVacations']);
    Route::post('/vacationrequests/store', [\App\Http\Controllers\Api\VacationRequestController::class, 'storeVacation']);
    Route::post('/vacationrequests/status/update', [\App\Http\Controllers\Api\VacationRequestController::class, 'updateVacationStatus']);
    Route::match(['get', 'delete', 'post'], '/vacationrequests/{id}/delete', [\App\Http\Controllers\Api\VacationRequestController::class, 'destroyVacation'])->whereNumber('id');
    Route::delete('/vacationrequests/{id}', [\App\Http\Controllers\Api\VacationRequestController::class, 'destroyVacation'])->whereNumber('id');

    Route::match(['get', 'post'], '/leaverequests', [\App\Http\Controllers\Api\VacationRequestController::class, 'indexLeaves']);
    Route::post('/leaverequests/store', [\App\Http\Controllers\Api\VacationRequestController::class, 'storeLeave']);
    Route::post('/leaverequests/status/update', [\App\Http\Controllers\Api\VacationRequestController::class, 'updateLeaveStatus']);
    Route::match(['get', 'delete', 'post'], '/leaverequests/{id}/delete', [\App\Http\Controllers\Api\VacationRequestController::class, 'destroyLeave'])->whereNumber('id');
    Route::delete('/leaverequests/{id}', [\App\Http\Controllers\Api\VacationRequestController::class, 'destroyLeave'])->whereNumber('id');

    // Master Employee Withdrawals (/employeewithdrawal, /employeewithdrawals)
    Route::match(['get', 'post'], '/employeewithdrawal', [\App\Http\Controllers\Api\EmployeeWithdrawalController::class, 'index']);
    Route::match(['get', 'post'], '/employeewithdrawals', [\App\Http\Controllers\Api\EmployeeWithdrawalController::class, 'index']);
    Route::get('/employeewithdrawal/accounts', [\App\Http\Controllers\Api\EmployeeWithdrawalController::class, 'accounts']);
    Route::post('/employeewithdrawal/store', [\App\Http\Controllers\Api\EmployeeWithdrawalController::class, 'store']);
    Route::post('/employeewithdrawals/store', [\App\Http\Controllers\Api\EmployeeWithdrawalController::class, 'store']);
    Route::post('/employeewithdrawal/approve', [\App\Http\Controllers\Api\EmployeeWithdrawalController::class, 'approve']);
    Route::match(['get', 'delete', 'post'], '/employeewithdrawal/{id}/delete', [\App\Http\Controllers\Api\EmployeeWithdrawalController::class, 'destroy'])->whereNumber('id');
    Route::delete('/employeewithdrawal/{id}', [\App\Http\Controllers\Api\EmployeeWithdrawalController::class, 'destroy'])->whereNumber('id');

    // Master Attendance & Departure Management (/attendances, /attendance)
    Route::match(['get', 'post'], '/attendances', [\App\Http\Controllers\Api\AttendanceController::class, 'index']);
    Route::match(['get', 'post'], '/attendance', [\App\Http\Controllers\Api\AttendanceController::class, 'index']);
    Route::post('/attendances/store', [\App\Http\Controllers\Api\AttendanceController::class, 'store']);
    Route::post('/attendance/store', [\App\Http\Controllers\Api\AttendanceController::class, 'store']);
    Route::match(['get', 'delete', 'post'], '/attendances/{id}/delete', [\App\Http\Controllers\Api\AttendanceController::class, 'destroy'])->whereNumber('id');
    Route::delete('/attendances/{id}', [\App\Http\Controllers\Api\AttendanceController::class, 'destroy'])->whereNumber('id');

    // Late & Overtime & Absence Policies (/late-policies, /late_policies)
    Route::match(['get', 'post'], '/late-policies', [\App\Http\Controllers\Api\LatePolicyController::class, 'index']);
    Route::match(['get', 'post'], '/late_policies', [\App\Http\Controllers\Api\LatePolicyController::class, 'index']);
    Route::match(['get', 'post'], '/latepolicies', [\App\Http\Controllers\Api\LatePolicyController::class, 'index']);
    Route::post('/late-policies/store', [\App\Http\Controllers\Api\LatePolicyController::class, 'store']);
    Route::post('/late_policies/store', [\App\Http\Controllers\Api\LatePolicyController::class, 'store']);
    Route::get('/late-policies/{id}', [\App\Http\Controllers\Api\LatePolicyController::class, 'show'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/late-policies/update', [\App\Http\Controllers\Api\LatePolicyController::class, 'update']);
    Route::match(['put', 'patch', 'post'], '/late_policies/update', [\App\Http\Controllers\Api\LatePolicyController::class, 'update']);
    Route::match(['put', 'patch', 'post'], '/late-policies/{id}/update', [\App\Http\Controllers\Api\LatePolicyController::class, 'update'])->whereNumber('id');
    Route::match(['get', 'delete', 'post'], '/late-policies/{id}/delete', [\App\Http\Controllers\Api\LatePolicyController::class, 'destroy'])->whereNumber('id');
    Route::match(['get', 'delete', 'post'], '/late_policies/{id}/delete', [\App\Http\Controllers\Api\LatePolicyController::class, 'destroy'])->whereNumber('id');
    Route::delete('/late-policies/{id}', [\App\Http\Controllers\Api\LatePolicyController::class, 'destroy'])->whereNumber('id');

    // Scheduled Employee Advances (/employee-advances, /employeeadvances)
    Route::match(['get', 'post'], '/employee-advances', [\App\Http\Controllers\Api\EmployeeAdvanceController::class, 'index']);
    Route::match(['get', 'post'], '/employeeadvances', [\App\Http\Controllers\Api\EmployeeAdvanceController::class, 'index']);
    Route::post('/employee-advances/store', [\App\Http\Controllers\Api\EmployeeAdvanceController::class, 'store']);
    Route::post('/employeeadvances/store', [\App\Http\Controllers\Api\EmployeeAdvanceController::class, 'store']);
    Route::get('/employee-advances/{id}', [\App\Http\Controllers\Api\EmployeeAdvanceController::class, 'show'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/employee-advances/update', [\App\Http\Controllers\Api\EmployeeAdvanceController::class, 'update']);
    Route::match(['put', 'patch', 'post'], '/employeeadvances/update', [\App\Http\Controllers\Api\EmployeeAdvanceController::class, 'update']);
    Route::match(['get', 'delete', 'post'], '/employee-advances/{id}/delete', [\App\Http\Controllers\Api\EmployeeAdvanceController::class, 'destroy'])->whereNumber('id');
    Route::match(['get', 'delete', 'post'], '/employeeadvances/{id}/delete', [\App\Http\Controllers\Api\EmployeeAdvanceController::class, 'destroy'])->whereNumber('id');
    Route::delete('/employee-advances/{id}', [\App\Http\Controllers\Api\EmployeeAdvanceController::class, 'destroy'])->whereNumber('id');

    // Discounts and Awards Management (/salaryactions)
    Route::match(['get', 'post'], '/salaryactions', [\App\Http\Controllers\Api\SalaryActionController::class, 'index']);
    Route::post('/salaryactions/store', [\App\Http\Controllers\Api\SalaryActionController::class, 'store']);
    Route::get('/salaryactions/{id}', [\App\Http\Controllers\Api\SalaryActionController::class, 'show'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/salaryactions/update', [\App\Http\Controllers\Api\SalaryActionController::class, 'update']);
    Route::match(['get', 'delete', 'post'], '/salaryactions/{id}/delete', [\App\Http\Controllers\Api\SalaryActionController::class, 'destroy'])->whereNumber('id');
    Route::delete('/salaryactions/{id}', [\App\Http\Controllers\Api\SalaryActionController::class, 'destroy'])->whereNumber('id');

    // Administrative Investigations (/investigations)
    Route::match(['get', 'post'], '/investigations', [\App\Http\Controllers\Api\InvestigationController::class, 'index']);
    Route::post('/investigations/store', [\App\Http\Controllers\Api\InvestigationController::class, 'store']);
    Route::get('/investigations/{id}', [\App\Http\Controllers\Api\InvestigationController::class, 'show'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/investigations/update', [\App\Http\Controllers\Api\InvestigationController::class, 'update']);
    Route::match(['put', 'patch', 'post'], '/investigations/update/{id}', [\App\Http\Controllers\Api\InvestigationController::class, 'update'])->whereNumber('id');
    Route::match(['get', 'delete', 'post'], '/investigations/{id}/delete', [\App\Http\Controllers\Api\InvestigationController::class, 'destroy'])->whereNumber('id');
    Route::delete('/investigations/{id}', [\App\Http\Controllers\Api\InvestigationController::class, 'destroy'])->whereNumber('id');

    // Payroll Management (/payroll)
    Route::match(['get', 'post'], '/payroll', [\App\Http\Controllers\Api\PayrollController::class, 'index']);
    Route::post('/payroll/store', [\App\Http\Controllers\Api\PayrollController::class, 'store']);
    Route::post('/payroll/calculate', [\App\Http\Controllers\Api\PayrollController::class, 'calculate']);
    Route::get('/payroll/{id}', [\App\Http\Controllers\Api\PayrollController::class, 'show'])->whereNumber('id');
    Route::get('/payroll/{id}/voucher', [\App\Http\Controllers\Api\PayrollController::class, 'voucher'])->whereNumber('id');
    Route::match(['get', 'delete', 'post'], '/payroll/{id}/delete', [\App\Http\Controllers\Api\PayrollController::class, 'destroy'])->whereNumber('id');
    Route::delete('/payroll/{id}', [\App\Http\Controllers\Api\PayrollController::class, 'destroy'])->whereNumber('id');

    // Missions Management (/missions)
    Route::match(['get', 'post'], '/missions', [\App\Http\Controllers\Api\MissionController::class, 'index']);
    Route::get('/missions/eams', [\App\Http\Controllers\Api\MissionController::class, 'eams']);
    Route::post('/missions/store', [\App\Http\Controllers\Api\MissionController::class, 'store']);
    Route::get('/missions/{id}', [\App\Http\Controllers\Api\MissionController::class, 'show'])->whereNumber('id');
    Route::post('/missions/update', [\App\Http\Controllers\Api\MissionController::class, 'update']);
    Route::match(['put', 'patch', 'post'], '/missions/{id}', [\App\Http\Controllers\Api\MissionController::class, 'update'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/missions/{id}/update', [\App\Http\Controllers\Api\MissionController::class, 'update'])->whereNumber('id');
    Route::match(['get', 'delete', 'post'], '/missions/{id}/delete', [\App\Http\Controllers\Api\MissionController::class, 'destroy'])->whereNumber('id');
    Route::delete('/missions/{id}', [\App\Http\Controllers\Api\MissionController::class, 'destroy'])->whereNumber('id');


    // Chart of Accounts & Tree Management (/chartofaccounts & /accounttree)
    Route::get('/chartofaccounts', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'tree']);
    Route::get('/chartofaccounts/list', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'index']);
    Route::post('/chartofaccounts/store', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'store']);
    Route::get('/chartofaccounts/{id}', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'show'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/chartofaccounts/{id}/update', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'update'])->whereNumber('id');
    Route::post('/chartofaccounts/update', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'update']);
    Route::match(['get', 'delete'], '/chartofaccounts/{id}/delete', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'destroy'])->whereNumber('id');
    Route::delete('/chartofaccounts/{id}', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'destroy'])->whereNumber('id');
    Route::post('/chartofaccounts/seed', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'seed']);
    Route::get('/chartofaccounts/next-code', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'nextCode']);

    Route::get('/accounttree', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'tree']);
    Route::get('/accounttree/entry', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'entry']);
    Route::get('/accounttree/next-code', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'nextCode']);
    Route::post('/accounttree/store', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'store']);
    Route::post('/accounttree/update', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'update']);
    Route::match(['get', 'delete'], '/accounttree/{id}/delete', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'destroy'])->whereNumber('id');
    Route::delete('/accounttree/{id}', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'destroy'])->whereNumber('id');
    Route::match(['get', 'post'], '/warehouse/transaction/warehousecontentcode', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'entry']);
    Route::match(['get', 'post'], '/warehouse/transaction/invoicecode', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'invoiceCode']);
    Route::match(['get', 'post'], '/warehouse/all', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'warehouseAll']);

    // Warehouse & Inventory Management Endpoints
    Route::match(['get', 'post'], '/category', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'categories']);
    Route::post('/category/store', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'storeCategory']);
    Route::match(['get', 'post'], '/unit', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'units']);
    Route::post('/unit/store', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'storeUnit']);
    Route::match(['get', 'post'], '/warehouse', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'warehouses']);
    Route::post('/warehouse/store', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'storeWarehouse']);
    Route::post('/items/barcode', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'itemBarcode']);
    Route::post('/items/store', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'storeItem']);
    Route::post('/items/prices/store', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'storeItem']);
    Route::post('/warehouse/transaction/purchase/store', fn (\Illuminate\Http\Request $r) => app(\App\Http\Controllers\Api\ChartOfAccountController::class)->storeWarehouseTransaction($r, 'purchase'));
    Route::post('/warehouse/transaction/purchase/return', fn (\Illuminate\Http\Request $r) => app(\App\Http\Controllers\Api\ChartOfAccountController::class)->storeWarehouseTransaction($r, 'purchase_return'));
    Route::post('/warehouse/transaction/selling/store', fn (\Illuminate\Http\Request $r) => app(\App\Http\Controllers\Api\ChartOfAccountController::class)->storeWarehouseTransaction($r, 'selling'));
    Route::post('/warehouse/transaction/selling/return', fn (\Illuminate\Http\Request $r) => app(\App\Http\Controllers\Api\ChartOfAccountController::class)->storeWarehouseTransaction($r, 'selling_return'));
    Route::post('/warehouse/transaction/details', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'warehouseTransactionDetails']);
    Route::match(['get', 'post'], '/warehouse/report/purchase', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'purchaseReport']);
    Route::match(['get', 'post'], '/warehouse/report/selling', [\App\Http\Controllers\Api\ChartOfAccountController::class, 'sellingReport']);

    // Accounting Journal Entries (/transactions & /accounting-entries)
    Route::match(['get', 'post'], '/transactions', [\App\Http\Controllers\Api\AccountingEntryController::class, 'index']);
    Route::post('/transactions/generalentry', [\App\Http\Controllers\Api\AccountingEntryController::class, 'store']);
    Route::post('/transactions/store', [\App\Http\Controllers\Api\AccountingEntryController::class, 'store']);
    Route::get('/transactions/{id}', [\App\Http\Controllers\Api\AccountingEntryController::class, 'show'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/transactions/{id}', [\App\Http\Controllers\Api\AccountingEntryController::class, 'update'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/transactions/{id}/update', [\App\Http\Controllers\Api\AccountingEntryController::class, 'update'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/transactions/update', [\App\Http\Controllers\Api\AccountingEntryController::class, 'update']);
    Route::match(['get', 'delete', 'post'], '/transactions/{id}/delete', [\App\Http\Controllers\Api\AccountingEntryController::class, 'destroy'])->whereNumber('id');
    Route::delete('/transactions/{id}', [\App\Http\Controllers\Api\AccountingEntryController::class, 'destroy'])->whereNumber('id');

    Route::get('/accounting-entries', [\App\Http\Controllers\Api\AccountingEntryController::class, 'index']);
    Route::post('/accounting-entries', [\App\Http\Controllers\Api\AccountingEntryController::class, 'store']);
    Route::get('/accounting-entries/{id}', [\App\Http\Controllers\Api\AccountingEntryController::class, 'show'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/accounting-entries/{id}', [\App\Http\Controllers\Api\AccountingEntryController::class, 'update'])->whereNumber('id');
    Route::delete('/accounting-entries/{id}', [\App\Http\Controllers\Api\AccountingEntryController::class, 'destroy'])->whereNumber('id');

    // General Vouchers (سندات القبض والصرف العامة)
    Route::get('/generalvoucher/fromaccount', [\App\Http\Controllers\Api\GeneralVoucherController::class, 'fromAccount']);
    Route::post('/generalvoucher/storecashvoucher', [\App\Http\Controllers\Api\GeneralVoucherController::class, 'storeCashVoucher']);
    Route::post('/generalvoucher/storepaymentvoucher', [\App\Http\Controllers\Api\GeneralVoucherController::class, 'storePaymentVoucher']);
    Route::get('/generalvoucher/{id}', [\App\Http\Controllers\Api\GeneralVoucherController::class, 'show'])->whereNumber('id');
    Route::get('/generalvouchers', [\App\Http\Controllers\Api\GeneralVoucherController::class, 'index']);

    // Account Statements (كشوف الحسابات)
    Route::match(['get', 'post'], '/accountstatement/accounts', [\App\Http\Controllers\Api\AccountStatementController::class, 'accounts']);
    Route::match(['get', 'post'], '/accountstatement/clients', [\App\Http\Controllers\Api\AccountStatementController::class, 'clients']);
    Route::match(['get', 'post'], '/accountstatement/customers', [\App\Http\Controllers\Api\AccountStatementController::class, 'clients']);
    Route::match(['get', 'post'], '/accountstatement/vendors', [\App\Http\Controllers\Api\AccountStatementController::class, 'vendors']);
    Route::match(['get', 'post'], '/accountstatement/suppliers', [\App\Http\Controllers\Api\AccountStatementController::class, 'vendors']);
    Route::match(['get', 'post'], '/accountstatement/donors', [\App\Http\Controllers\Api\AccountStatementController::class, 'donors']);
    Route::match(['get', 'post'], '/accountstatement/donor', [\App\Http\Controllers\Api\AccountStatementController::class, 'donors']);
    Route::match(['get', 'post'], '/accountstatement/humancases', [\App\Http\Controllers\Api\AccountStatementController::class, 'humancases']);
    Route::match(['get', 'post'], '/accountstatement/humancase', [\App\Http\Controllers\Api\AccountStatementController::class, 'humancases']);
    Route::match(['get', 'post'], '/accountstatement/warrantors', [\App\Http\Controllers\Api\AccountStatementController::class, 'warrantors']);
    Route::match(['get', 'post'], '/accountstatement/affiliates', [\App\Http\Controllers\Api\AccountStatementController::class, 'warrantors']);
    Route::match(['get', 'post'], '/accountstatement/managementmembers', [\App\Http\Controllers\Api\AccountStatementController::class, 'managementmembers']);
    Route::match(['get', 'post'], '/accountstatement/managementmember', [\App\Http\Controllers\Api\AccountStatementController::class, 'managementmembers']);
    Route::match(['get', 'post'], '/accountstatement/boards', [\App\Http\Controllers\Api\AccountStatementController::class, 'managementmembers']);
    Route::match(['get', 'post'], '/accountstatement/assemblymembers', [\App\Http\Controllers\Api\AccountStatementController::class, 'assemblymembers']);
    Route::match(['get', 'post'], '/accountstatement/associationmember', [\App\Http\Controllers\Api\AccountStatementController::class, 'assemblymembers']);
    Route::match(['get', 'post'], '/accountstatement/generalassembly', [\App\Http\Controllers\Api\AccountStatementController::class, 'assemblymembers']);

    // Financial Reports & Balance Sheet & Income Statement
    Route::get('/generalbudget', [\App\Http\Controllers\Api\BalanceSheetController::class, 'index']);
    Route::get('/balancesheet', [\App\Http\Controllers\Api\BalanceSheetController::class, 'index']);
    Route::get('/reports/balancesheet', [\App\Http\Controllers\Api\BalanceSheetController::class, 'index']);
    Route::match(['get', 'post'], '/incomestatement', [\App\Http\Controllers\Api\BalanceSheetController::class, 'incomeStatement']);
    Route::match(['get', 'post'], '/reports/incomestatement', [\App\Http\Controllers\Api\BalanceSheetController::class, 'incomeStatement']);

    // HR Extended Subsystems (Volunteers, Evaluations, Training, KSA, Employee Papers, Reports)
    Route::match(['get', 'post'], '/volunteers', [\App\Http\Controllers\Api\HrExtendedController::class, 'indexVolunteers']);
    Route::post('/volunteers/store', [\App\Http\Controllers\Api\HrExtendedController::class, 'storeVolunteer']);
    Route::post('/volunteers/voucher/payment', [\App\Http\Controllers\Api\HrExtendedController::class, 'storeVolunteerVoucher']);
    Route::get('/volunteers/{id}', [\App\Http\Controllers\Api\HrExtendedController::class, 'showVolunteer'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], '/volunteers/{id}/update', [\App\Http\Controllers\Api\HrExtendedController::class, 'updateVolunteer'])->whereNumber('id');
    Route::delete('/volunteers/{id}', [\App\Http\Controllers\Api\HrExtendedController::class, 'destroyVolunteer'])->whereNumber('id');

    Route::match(['get', 'post'], '/evaluation/kpireport', [\App\Http\Controllers\Api\HrExtendedController::class, 'kpiReport']);
    Route::post('/evaluation/store', [\App\Http\Controllers\Api\HrExtendedController::class, 'storeEvaluation']);
    Route::get('/quizs/all', [\App\Http\Controllers\Api\HrExtendedController::class, 'quizsAll']);
    Route::post('/evaluation/storequizs', [\App\Http\Controllers\Api\HrExtendedController::class, 'storeEvaluationQuizs']);

    Route::get('/training-records', [\App\Http\Controllers\Api\HrExtendedController::class, 'indexTraining']);
    Route::post('/training-records', [\App\Http\Controllers\Api\HrExtendedController::class, 'storeTraining']);
    Route::match(['put', 'patch', 'post'], '/training-records/{id}', [\App\Http\Controllers\Api\HrExtendedController::class, 'updateTraining'])->whereNumber('id');
    Route::delete('/training-records/{id}', [\App\Http\Controllers\Api\HrExtendedController::class, 'destroyTraining'])->whereNumber('id');

    Route::get('/ksa-assessments', [\App\Http\Controllers\Api\HrExtendedController::class, 'indexKsa']);
    Route::post('/ksa-assessments', [\App\Http\Controllers\Api\HrExtendedController::class, 'storeKsa']);
    Route::match(['put', 'patch', 'post'], '/ksa-assessments/{id}', [\App\Http\Controllers\Api\HrExtendedController::class, 'updateKsa'])->whereNumber('id');
    Route::delete('/ksa-assessments/{id}', [\App\Http\Controllers\Api\HrExtendedController::class, 'destroyKsa'])->whereNumber('id');

    Route::match(['get', 'post'], '/employeepapers', [\App\Http\Controllers\Api\HrExtendedController::class, 'indexPapers']);
    Route::post('/employeepapers/store', [\App\Http\Controllers\Api\HrExtendedController::class, 'storePaper']);
    Route::post('/employeepapers/update', [\App\Http\Controllers\Api\HrExtendedController::class, 'updatePaper']);
    Route::get('/employeepapers/{id}', [\App\Http\Controllers\Api\HrExtendedController::class, 'showPaper'])->whereNumber('id');
    Route::match(['get', 'post'], '/employees/{id}/papers', [\App\Http\Controllers\Api\HrExtendedController::class, 'indexPapers'])->whereNumber('id');
    Route::post('/employeeuploads/store', [\App\Http\Controllers\Api\HrExtendedController::class, 'storePaper']);
    Route::post('/employeeuploads/update', [\App\Http\Controllers\Api\HrExtendedController::class, 'updatePaper']);

    Route::match(['get', 'post'], '/salary', [\App\Http\Controllers\Api\HrExtendedController::class, 'salaryReport']);
    Route::match(['get', 'post'], '/vacationrequests/approved', [\App\Http\Controllers\Api\HrExtendedController::class, 'approvedVacations']);
    Route::post('/deduction/store', [\App\Http\Controllers\Api\SalaryActionController::class, 'store']);
    Route::post('/leavepermissions/store', [\App\Http\Controllers\Api\VacationRequestController::class, 'storeLeave']);

    // Loans, Warrantors, Delays & Feasibility Studies
    Route::match(['get', 'post'], '/warrantor', [\App\Http\Controllers\Api\LoanController::class, 'indexWarrantors']);
    Route::match(['get', 'post'], '/warrantors', [\App\Http\Controllers\Api\LoanController::class, 'indexWarrantors']);
    Route::post('/warrantor/store', [\App\Http\Controllers\Api\LoanController::class, 'storeWarrantor']);
    Route::post('/warrantor/update', [\App\Http\Controllers\Api\LoanController::class, 'updateWarrantor']);
    Route::get('/warrantor/{id}', [\App\Http\Controllers\Api\LoanController::class, 'showWarrantor'])->whereNumber('id');
    Route::delete('/warrantor/{id}', [\App\Http\Controllers\Api\LoanController::class, 'destroyWarrantor'])->whereNumber('id');
    Route::post('/receiptorg/affiliate/store', [\App\Http\Controllers\Api\LoanController::class, 'storeWarrantorReceipt']);

    Route::match(['get', 'post'], '/loans', [\App\Http\Controllers\Api\LoanController::class, 'indexLoans']);
    Route::post('/loans/store', [\App\Http\Controllers\Api\LoanController::class, 'storeLoan']);
    Route::post('/loans/loan', [\App\Http\Controllers\Api\LoanController::class, 'showLoan']);
    Route::post('/loans/followup/store', [\App\Http\Controllers\Api\LoanController::class, 'storeFollowup']);
    Route::post('/loans/payment/store', [\App\Http\Controllers\Api\LoanController::class, 'storePaymentSchedule']);
    Route::match(['get', 'post'], '/loans/payment', [\App\Http\Controllers\Api\LoanController::class, 'indexPayments']);
    Route::match(['get', 'post'], '/loans/payment/case', [\App\Http\Controllers\Api\LoanController::class, 'indexPayments']);
    Route::match(['get', 'post'], '/loans/cases', [\App\Http\Controllers\Api\LoanController::class, 'indexCases']);
    Route::get('/loans/allcases', [\App\Http\Controllers\Api\LoanController::class, 'indexCases']);
    Route::post('/loans/update/status', [\App\Http\Controllers\Api\LoanController::class, 'updateStatus']);
    Route::post('/loans/payment/voucher', [\App\Http\Controllers\Api\LoanController::class, 'storePaymentVoucher']);
    Route::post('/loans/receipt/voucher', [\App\Http\Controllers\Api\LoanController::class, 'storeReceiptVoucher']);
    Route::get('/loans/{id}', [\App\Http\Controllers\Api\LoanController::class, 'showLoan'])->whereNumber('id');
    Route::match(['get', 'post'], '/delays', [\App\Http\Controllers\Api\LoanController::class, 'indexPayments']);

    Route::match(['get', 'post'], '/feasibilitystudies', [\App\Http\Controllers\Api\LoanController::class, 'indexFeasibility']);
    Route::post('/feasibilitystudies/store', [\App\Http\Controllers\Api\LoanController::class, 'storeFeasibility']);
    Route::post('/feasibilitystudies/updateassets', fn (\Illuminate\Http\Request $r) => app(\App\Http\Controllers\Api\LoanController::class)->updateFeasibilitySection($r, 'fixed_assets'));
    Route::post('/feasibilitystudies/updateestablishmentfees', fn (\Illuminate\Http\Request $r) => app(\App\Http\Controllers\Api\LoanController::class)->updateFeasibilitySection($r, 'establishment_fees'));
    Route::post('/feasibilitystudies/updatemonthlyworking', fn (\Illuminate\Http\Request $r) => app(\App\Http\Controllers\Api\LoanController::class)->updateFeasibilitySection($r, 'monthly_working'));
    Route::post('/feasibilitystudies/updateorgchart', fn (\Illuminate\Http\Request $r) => app(\App\Http\Controllers\Api\LoanController::class)->updateFeasibilitySection($r, 'organization_structure'));
    Route::post('/feasibilitystudies/updateproductsincome', fn (\Illuminate\Http\Request $r) => app(\App\Http\Controllers\Api\LoanController::class)->updateFeasibilitySection($r, 'products_monthly_income'));
    Route::post('/feasibilitystudies/updateprojectsteps', fn (\Illuminate\Http\Request $r) => app(\App\Http\Controllers\Api\LoanController::class)->updateFeasibilitySection($r, 'project_implementation_steps'));
    Route::post('/feasibilitystudies/updateswot', fn (\Illuminate\Http\Request $r) => app(\App\Http\Controllers\Api\LoanController::class)->updateFeasibilitySection($r, 'evaluation'));
    Route::post('/feasibilitystudies/updatetechnicalside', fn (\Illuminate\Http\Request $r) => app(\App\Http\Controllers\Api\LoanController::class)->updateFeasibilitySection($r, 'license'));

    // Endowments & Archives
    Route::match(['get', 'post'], '/endowments', [\App\Http\Controllers\Api\EndowmentController::class, 'index']);
    Route::post('/endowments/store', [\App\Http\Controllers\Api\EndowmentController::class, 'store']);
    Route::post('/endowments/update', [\App\Http\Controllers\Api\EndowmentController::class, 'update']);
    Route::get('/endowments/employees', [\App\Http\Controllers\Api\EndowmentController::class, 'employees']);
    Route::get('/endowments/banks', [\App\Http\Controllers\Api\EndowmentController::class, 'banks']);
    Route::match(['get', 'post'], '/endowments/totalpaid', [\App\Http\Controllers\Api\EndowmentController::class, 'index']);
    Route::post('/endowments/paymentvoucher', [\App\Http\Controllers\Api\EndowmentController::class, 'storePaymentVoucher']);
    Route::post('/endowments/recieptvoucher', [\App\Http\Controllers\Api\EndowmentController::class, 'storeReceiptVoucher']);
    Route::get('/endowments/{id}', [\App\Http\Controllers\Api\EndowmentController::class, 'show'])->whereNumber('id');
    Route::match(['get', 'post'], '/shoptransaction/endowments/{id}', [\App\Http\Controllers\Api\EndowmentController::class, 'transactions'])->whereNumber('id');
    Route::get('/shoptransaction/{id}/endowments', [\App\Http\Controllers\Api\EndowmentController::class, 'showVoucher'])->whereNumber('id');

    Route::match(['get', 'post'], '/archives', [\App\Http\Controllers\Api\EndowmentController::class, 'indexArchives']);
    Route::post('/archives/store', [\App\Http\Controllers\Api\EndowmentController::class, 'storeArchive']);
    Route::match(['get', 'delete'], '/archives/{id}/delete', [\App\Http\Controllers\Api\EndowmentController::class, 'destroyArchive'])->whereNumber('id');
    Route::delete('/archives/{id}', [\App\Http\Controllers\Api\EndowmentController::class, 'destroyArchive'])->whereNumber('id');

    // Roles, Permissions, Organization Users, Print Settings, Dashboard (/home) & BSC
    Route::match(['get', 'post'], '/permissions', [\App\Http\Controllers\Api\SystemManagementController::class, 'indexRoles']);
    Route::post('/permissions/store', [\App\Http\Controllers\Api\SystemManagementController::class, 'storeRole']);
    Route::post('/permissions/update', [\App\Http\Controllers\Api\SystemManagementController::class, 'updateRole']);
    Route::get('/permissions/{id}', [\App\Http\Controllers\Api\SystemManagementController::class, 'showRole'])->whereNumber('id');
    Route::match(['get', 'delete'], '/permissions/{id}/delete', [\App\Http\Controllers\Api\SystemManagementController::class, 'destroyRole'])->whereNumber('id');
    Route::post('/permissions/{groupId}/roles', [\App\Http\Controllers\Api\SystemManagementController::class, 'saveRolePermissions'])->whereNumber('groupId');

    Route::match(['get', 'post'], '/orgusers', [\App\Http\Controllers\Api\SystemManagementController::class, 'indexOrgUsers']);
    Route::post('/orgusers/store', [\App\Http\Controllers\Api\SystemManagementController::class, 'storeOrgUser']);
    Route::post('/orgusers/update', [\App\Http\Controllers\Api\SystemManagementController::class, 'updateOrgUser']);
    Route::get('/orgusers/representative', [\App\Http\Controllers\Api\SystemManagementController::class, 'representative']);
    Route::get('/orgusers/{id}', [\App\Http\Controllers\Api\SystemManagementController::class, 'showOrgUser'])->whereNumber('id');
    Route::match(['get', 'delete'], '/orgusers/{id}/delete', [\App\Http\Controllers\Api\SystemManagementController::class, 'destroyOrgUser'])->whereNumber('id');

    Route::get('/user/data', [\App\Http\Controllers\Api\SystemManagementController::class, 'userData']);
    Route::post('/user/update', [\App\Http\Controllers\Api\SystemManagementController::class, 'updateUserData']);

    Route::get('/print', [\App\Http\Controllers\Api\SystemManagementController::class, 'getPrintSettings']);
    Route::post('/print/store', [\App\Http\Controllers\Api\SystemManagementController::class, 'savePrintSettings']);

    Route::get('/settings/survey-questions', [\App\Http\Controllers\Api\SystemManagementController::class, 'getSurveyQuestions']);
    Route::post('/settings/survey-questions', [\App\Http\Controllers\Api\SystemManagementController::class, 'saveSurveyQuestions']);

    Route::get('/home', [\App\Http\Controllers\Api\SystemManagementController::class, 'home']);

    Route::get('/bsc', [\App\Http\Controllers\Api\SystemManagementController::class, 'allBsc']);
    Route::get('/bsc/compare', [\App\Http\Controllers\Api\SystemManagementController::class, 'compareBsc']);
    Route::get('/bsc/periods', [\App\Http\Controllers\Api\SystemManagementController::class, 'periodsBsc']);
    Route::get('/bsc/{orgId}', [\App\Http\Controllers\Api\SystemManagementController::class, 'orgBsc'])->whereNumber('orgId');
    Route::post('/bsc/{orgId}/recalculate', [\App\Http\Controllers\Api\SystemManagementController::class, 'recalculateBsc'])->whereNumber('orgId');

    // Marketing Details & Governance
    Route::match(['get', 'post'], '/projectsdetails/designs', [\App\Http\Controllers\Api\SystemManagementController::class, 'projectDesigns']);
    Route::match(['get', 'post'], '/projectsdetails/marketing', [\App\Http\Controllers\Api\SystemManagementController::class, 'projectMarketing']);
    Route::match(['get', 'post'], '/shopdetails/designs', [\App\Http\Controllers\Api\SystemManagementController::class, 'shopDesigns']);
    Route::match(['get', 'post'], '/shopdetails/marketing', [\App\Http\Controllers\Api\SystemManagementController::class, 'shopMarketing']);
    Route::get('/projectsdetails/{id}/uploads', [\App\Http\Controllers\Api\SystemManagementController::class, 'detailUploads'])->whereNumber('id');
    Route::get('/shopdetails/{id}/uploads', [\App\Http\Controllers\Api\SystemManagementController::class, 'detailUploads'])->whereNumber('id');

    Route::get('/governances/quizs', [\App\Http\Controllers\Api\SystemManagementController::class, 'governanceQuizs']);
    Route::post('/governances/store', [\App\Http\Controllers\Api\SystemManagementController::class, 'storeGovernance']);
    Route::get('/governances/submitted', [\App\Http\Controllers\Api\SystemManagementController::class, 'submittedGovernance']);
    Route::get('/governances/countquizs', [\App\Http\Controllers\Api\SystemManagementController::class, 'countGovernanceQuizs']);

    // Super Admin Organizations & Subscription Modules
    Route::match(['get', 'post'], '/organization/approved', [\App\Http\Controllers\Api\SystemManagementController::class, 'approvedOrganizations']);
    Route::match(['get', 'post'], '/organization/pending', [\App\Http\Controllers\Api\SystemManagementController::class, 'pendingOrganizations']);
    Route::match(['get', 'post'], '/organization/rejected', [\App\Http\Controllers\Api\SystemManagementController::class, 'rejectedOrganizations']);
    Route::get('/organization/{id}', [\App\Http\Controllers\Api\SystemManagementController::class, 'showOrganization'])->whereNumber('id');
    Route::post('/organization/{id}/update/status/approve', fn (\Illuminate\Http\Request $r, int $id) => app(\App\Http\Controllers\Api\SystemManagementController::class)->updateOrgStatus($r, $id, 'approve'))->whereNumber('id');
    Route::post('/organization/{id}/update/status/reject', fn (\Illuminate\Http\Request $r, int $id) => app(\App\Http\Controllers\Api\SystemManagementController::class)->updateOrgStatus($r, $id, 'reject'))->whereNumber('id');
    Route::post('/organization/{id}/update/status', [\App\Http\Controllers\Api\SystemManagementController::class, 'updateOrgStatus'])->whereNumber('id');

    Route::match(['get', 'post'], '/subscription/modules', [\App\Http\Controllers\Api\SystemManagementController::class, 'subscriptionModules']);
    Route::post('/subscription/modules/store', [\App\Http\Controllers\Api\SystemManagementController::class, 'storeSubscriptionModule']);
    Route::match(['get', 'delete'], '/subscription/modules/{id}/delete', [\App\Http\Controllers\Api\SystemManagementController::class, 'destroySubscriptionModule'])->whereNumber('id');
    Route::delete('/subscription/modules/{id}', [\App\Http\Controllers\Api\SystemManagementController::class, 'destroySubscriptionModule'])->whereNumber('id');

    Route::match(['get', 'post'], '/organization/{id}/modules', [\App\Http\Controllers\Api\SystemManagementController::class, 'storeModules'])->whereNumber('id');
    Route::post('/organization/{id}/modules/store', [\App\Http\Controllers\Api\SystemManagementController::class, 'saveStoreModule'])->whereNumber('id');
    Route::match(['get', 'delete'], '/organization/modules/{id}/delete', [\App\Http\Controllers\Api\SystemManagementController::class, 'destroyStoreModule'])->whereNumber('id');

    Route::match(['get', 'post'], '/organization/{id}/requests', [\App\Http\Controllers\Api\SystemManagementController::class, 'storeRequests'])->whereNumber('id');
    Route::post('/organization/{id}/requests/store', [\App\Http\Controllers\Api\SystemManagementController::class, 'saveStoreRequest'])->whereNumber('id');
    Route::match(['get', 'delete'], '/organization/requests/{id}/delete', [\App\Http\Controllers\Api\SystemManagementController::class, 'destroyStoreRequest'])->whereNumber('id');
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

