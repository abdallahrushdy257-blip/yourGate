<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssemblyMember\StoreAssemblyMemberRequest;
use App\Http\Requests\AssemblyMember\UpdateAssemblyMemberRequest;
use App\Http\Resources\AssemblyMemberResource;
use App\Services\AssemblyMemberService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AssemblyMemberController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected AssemblyMemberService $assemblyMemberService
    ) {}

    /**
     * Display a listing of assembly members.
     * Supports both GET and POST requests (for TableComponent filters).
     */
    public function index(Request $request): JsonResponse
    {
        $members = $this->assemblyMemberService->list($request->all());

        return response()->json(AssemblyMemberResource::collection($members), Response::HTTP_OK);
    }

    /**
     * Display aggregate statistics.
     */
    public function stats(): JsonResponse
    {
        $stats = $this->assemblyMemberService->stats();

        return $this->successResponse($stats, 'تم جلب الإحصائيات بنجاح');
    }

    /**
     * Display the specified member.
     */
    public function show(int $id): JsonResponse
    {
        $member = $this->assemblyMemberService->find($id);

        return response()->json(new AssemblyMemberResource($member), Response::HTTP_OK);
    }

    /**
     * Store a newly created member.
     */
    public function store(StoreAssemblyMemberRequest $request): JsonResponse
    {
        $file = $request->file('upload') ?? $request->file('paper');
        $member = $this->assemblyMemberService->create($request->validated(), $file);

        return response()->json([
            'success' => true,
            'message' => 'تمت إضافة العضو بنجاح',
            'data'    => new AssemblyMemberResource($member),
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified member.
     */
    public function update(UpdateAssemblyMemberRequest $request): JsonResponse
    {
        $file = $request->file('upload') ?? $request->file('paper');
        $id = (int) $request->validated('id');
        $member = $this->assemblyMemberService->update($id, $request->validated(), $file);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث بيانات العضو بنجاح',
            'data'    => new AssemblyMemberResource($member),
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified member.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->assemblyMemberService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف العضو بنجاح',
        ], Response::HTTP_OK);
    }

    /**
     * Dropdown list for committee assignments.
     */
    public function dropdown(): JsonResponse
    {
        $members = $this->assemblyMemberService->list(['perpage' => 0]);

        return response()->json(AssemblyMemberResource::collection($members), Response::HTTP_OK);
    }

    /**
     * Assembly members payments report.
     */
    public function payments(Request $request): JsonResponse
    {
        $members = $this->assemblyMemberService->list($request->all());
        $data = $members->map(function ($m) {
            return [
                'id'            => $m->id,
                'name'          => $m->name,
                'status'        => (int) $m->status,
                'status_string' => $m->status_string,
                'amount'        => (float) ($m->subscription_fees ?? 0),
            ];
        });

        return response()->json($data, Response::HTTP_OK);
    }

    /**
     * Assembly member payment receipts details.
     */
    public function paymentDetails(int $id): JsonResponse
    {
        $member = $this->assemblyMemberService->find($id);
        $data = [
            [
                'id'                      => 1,
                'date'                    => $member->start_subscription_date?->format('Y-m-d') ?? $member->created_at?->format('Y-m-d') ?? now()->format('Y-m-d'),
                'transaction_type_string' => 'سداد اشتراك عضوية',
                'invoicenumber'           => 'SUB-' . str_pad((string) $member->id, 5, '0', STR_PAD_LEFT),
                'amount'                  => (float) ($member->subscription_fees ?? 0),
            ],
        ];

        return response()->json($data, Response::HTTP_OK);
    }
}
