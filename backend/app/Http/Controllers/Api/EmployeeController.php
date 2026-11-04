<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Http\Requests\Employee\UpdateEmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Services\EmployeeService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EmployeeController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected EmployeeService $employeeService
    ) {}

    /**
     * Display a listing of employees (supports TableComponent, pagination, and selects).
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->filled('perpage') 
            ? (int) $request->input('perpage') 
            : ($request->filled('per_page') ? (int) $request->input('per_page') : null);

        $employees = $this->employeeService->list($request->all(), $perPage);

        if ($perPage && method_exists($employees, 'items')) {
            return response()->json([
                'success'      => true,
                'data'         => EmployeeResource::collection($employees->items()),
                'current_page' => $employees->currentPage(),
                'per_page'     => $employees->perPage(),
                'total'        => $employees->total(),
                'last_page'    => $employees->lastPage(),
            ], Response::HTTP_OK);
        }

        $collection = EmployeeResource::collection($employees);

        if ($request->has('page') || $request->has('search')) {
            return response()->json([
                'success' => true,
                'data'    => $collection,
                'total'   => count($employees),
            ], Response::HTTP_OK);
        }

        return response()->json($collection, Response::HTTP_OK);
    }

    /**
     * Display a specific employee.
     */
    public function show(int $id): JsonResponse
    {
        $employee = $this->employeeService->find($id);
        $res = (new EmployeeResource($employee))->resolve();

        return response()->json(array_merge([
            'success' => true,
            'data'    => $res,
        ], $res), Response::HTTP_OK);
    }

    /**
     * Store a new employee.
     */
    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $employee = $this->employeeService->store($request->validated());
        $res = (new EmployeeResource($employee))->resolve();

        return response()->json(array_merge([
            'success' => true,
            'message' => 'تم إضافة الموظف بنجاح',
            'data'    => $res,
            'id'      => $employee->id,
        ], $res), Response::HTTP_CREATED);
    }

    /**
     * Update an existing employee.
     */
    public function update(UpdateEmployeeRequest $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id') ?? (int) $request->input('employees_id');
        if (!$targetId) {
            return response()->json([
                'success' => false,
                'message' => 'معرّف الموظف مطلوب للتحديث',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $employee = $this->employeeService->update($targetId, $request->validated());
        $res = (new EmployeeResource($employee))->resolve();

        return response()->json(array_merge([
            'success' => true,
            'message' => 'تم تحديث بيانات الموظف بنجاح',
            'data'    => $res,
            'id'      => $employee->id,
        ], $res), Response::HTTP_OK);
    }

    /**
     * Delete an employee.
     */
    public function destroy(Request $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (!$targetId) {
            return response()->json([
                'success' => false,
                'message' => 'معرّف الموظف مطلوب للحذف',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->employeeService->delete($targetId);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف الموظف بنجاح',
        ], Response::HTTP_OK);
    }

    /**
     * Store salary for an employee (legacy step 2 endpoint).
     */
    public function storeSalary(Request $request): JsonResponse
    {
        $empId = (int) ($request->input('employees_id') ?? $request->input('id') ?? $request->input('emp_id') ?? $request->input('employee_id'));
        if (!$empId) {
            return response()->json([
                'success' => false,
                'message' => 'معرف الموظف غير محدد',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $employee = $this->employeeService->update($empId, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'تم حفظ بيانات الراتب بنجاح',
            'data'    => new EmployeeResource($employee),
        ], Response::HTTP_OK);
    }
}
