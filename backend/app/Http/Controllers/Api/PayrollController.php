<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payroll\StorePayrollRequest;
use App\Http\Resources\PayrollResource;
use App\Services\PayrollService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PayrollController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected PayrollService $payrollService
    ) {}

    /**
     * Display a listing of payrolls.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->filled('perpage') 
            ? (int) $request->input('perpage') 
            : ($request->filled('per_page') ? (int) $request->input('per_page') : null);

        $results = $this->payrollService->list($request->all(), $perPage);

        if ($perPage && method_exists($results, 'items')) {
            return response()->json([
                'success'      => true,
                'data'         => PayrollResource::collection($results->items()),
                'current_page' => $results->currentPage(),
                'per_page'     => $results->perPage(),
                'total'        => $results->total(),
                'last_page'    => $results->lastPage(),
            ], Response::HTTP_OK);
        }

        $collection = PayrollResource::collection($results);

        return response()->json([
            'success' => true,
            'data'    => $collection,
            'total'   => count($results),
        ], Response::HTTP_OK);
    }

    /**
     * Store or update a payroll record.
     */
    public function store(StorePayrollRequest $request): JsonResponse
    {
        $payroll = $this->payrollService->store($request->validated());

        return $this->createdResponse(
            new PayrollResource($payroll->load('employee')),
            __('Payroll recorded successfully')
        );
    }

    /**
     * Show a payroll record.
     */
    public function show(int $id): JsonResponse
    {
        $payroll = $this->payrollService->find($id);

        return $this->successResponse(
            new PayrollResource($payroll),
            __('Payroll retrieved successfully')
        );
    }

    /**
     * Calculate/generate payroll for a specific month and year.
     */
    public function calculate(Request $request): JsonResponse
    {
        $year = (int) ($request->input('year') ?: date('Y'));
        $month = (int) ($request->input('month') ?: date('m'));

        $count = $this->payrollService->calculateForPeriod($year, $month);

        return $this->successResponse(
            ['count' => $count, 'year' => $year, 'month' => $month],
            __('Payroll calculated successfully for :count employees', ['count' => $count])
        );
    }

    /**
     * Get voucher receipt details for a payroll record.
     */
    public function voucher(int $id): JsonResponse
    {
        $payroll = $this->payrollService->find($id);

        $voucherData = [
            'voucher_number'   => 'PAY-' . str_pad((string) $payroll->id, 6, '0', STR_PAD_LEFT),
            'employee_name'    => $payroll->employee?->name ?? 'غير محدد',
            'employee_id'      => $payroll->employee_id,
            'job_title'        => $payroll->employee?->jobtitle?->name ?? 'موظف',
            'national_id'      => $payroll->employee?->nationalid ?? '',
            'iban'             => $payroll->employee?->iban ?? '',
            'period'           => $payroll->year . '-' . str_pad((string) $payroll->month, 2, '0', STR_PAD_LEFT),
            'basic_salary'     => (float) $payroll->basic_salary,
            'allowances'       => (float) $payroll->allowance,
            'additions'        => (float) $payroll->additions,
            'deductions'       => (float) $payroll->deductions,
            'absence'          => (float) $payroll->absence,
            'investigations'   => (float) $payroll->investigations,
            'social_insurance' => (float) $payroll->social_insurance,
            'net_salary'       => (float) $payroll->net_salary,
            'payment_date'     => $payroll->payment_date ? $payroll->payment_date->format('Y-m-d') : date('Y-m-d'),
            'status'           => $payroll->status,
        ];

        return $this->successResponse(
            $voucherData,
            __('Payroll voucher retrieved successfully')
        );
    }

    /**
     * Delete payroll record.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->payrollService->delete($id);

        return $this->successResponse(
            null,
            __('Payroll record deleted successfully')
        );
    }
}
