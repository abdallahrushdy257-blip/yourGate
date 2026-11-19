<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Accounting\BalanceSheetService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BalanceSheetController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected BalanceSheetService $balanceSheetService
    ) {}

    /**
     * Get balance sheet data (/generalbudget, /balancesheet, /reports/balancesheet).
     */
    public function index(Request $request): JsonResponse
    {
        $asOfDate = $request->input('date') ?? $request->input('as_of_date') ?? null;
        $data = $this->balanceSheetService->getBalanceSheet($asOfDate);

        // Include debt and credit directly at the root of data for seamless compatibility with legacy BalanceSheet.js
        return response()->json([
            'status'            => Response::HTTP_OK,
            'success'           => true,
            'message'           => 'تم استخراج قائمة المركز المالي بنجاح.',
            'as_of_date'        => $data['as_of_date'],
            'organization_name' => $data['organization_name'],
            'debt'              => $data['debt'],
            'credit'            => $data['credit'],
            'totals'            => $data['totals'],
            'data'              => $data,
        ], Response::HTTP_OK);
    }

    /**
     * Get Income / Activities Statement (/incomestatement, /reports/incomestatement).
     */
    public function incomeStatement(Request $request): JsonResponse
    {
        $asOfDate = $request->input('date') ?? $request->input('as_of_date') ?? null;
        $data = $this->balanceSheetService->getIncomeStatement($asOfDate);

        return response()->json([
            'status'            => Response::HTTP_OK,
            'success'           => true,
            'message'           => 'تم استخراج قائمة الأنشطة بنجاح.',
            'as_of_date'        => $data['as_of_date'],
            'organization_name' => $data['organization_name'],
            'revenues'          => $data['revenues'],
            'expenses'          => $data['expenses'],
            'total_revenues'    => $data['total_revenues'],
            'total_expenses'    => $data['total_expenses'],
            'net_surplus'       => $data['net_surplus'],
            'summary'           => [
                'total_revenues' => $data['total_revenues'],
                'total_expenses' => $data['total_expenses'],
                'net_income'     => $data['net_surplus'],
                'net_surplus'    => $data['net_surplus'],
            ],
            'data'              => $data,
        ], Response::HTTP_OK);
    }
}
