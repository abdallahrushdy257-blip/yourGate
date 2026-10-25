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
    Route::match(['get', 'post'], '/humancasevendor/act', [VendorController::class, 'index']);
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
});

// Notifications Endpoints (Public/Optional Auth)
Route::get('/notify', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
Route::get('/notify/{id}', [\App\Http\Controllers\Api\NotificationController::class, 'show']);
