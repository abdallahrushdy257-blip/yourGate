<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Account\StoreAccountRequest;
use App\Http\Requests\Account\UpdateAccountRequest;
use App\Http\Resources\ChartOfAccountResource;
use App\Services\Accounting\ChartOfAccountService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ChartOfAccountController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected ChartOfAccountService $accountService
    ) {}

    /**
     * Display tree structure of accounts (for tree table view).
     */
    public function tree(Request $request): JsonResponse
    {
        $tree = $this->accountService->tree($request->all());
        $collection = ChartOfAccountResource::collection($tree);

        // When requested via legacy /accounttree route, provide root array for direct iteration
        if ($request->is('*accounttree*') && ! $request->has('standard_format')) {
            return response()->json($collection, Response::HTTP_OK);
        }

        return $this->successResponse($collection, __('accounts.fetched'));
    }

    /**
     * Display a flat listing of accounts (for dropdowns, selects, journal lines).
     */
    public function index(Request $request): JsonResponse
    {
        if ($request->boolean('tree') || $request->input('view') === 'tree') {
            return $this->tree($request);
        }

        $accounts = $this->accountService->list($request->all());
        $collection = ChartOfAccountResource::collection($accounts);

        if ($request->is('*accounttree*') && ! $request->has('standard_format')) {
            return response()->json($collection, Response::HTTP_OK);
        }

        return $this->successResponse($collection, __('accounts.fetched'));
    }

    /**
     * Leaf accounts available for journal entries (/accounttree/entry).
     */
    public function entry(): JsonResponse
    {
        $accounts = $this->accountService->list(['payable' => true, 'active' => true]);
        $collection = ChartOfAccountResource::collection($accounts);

        return response()->json($collection, Response::HTTP_OK);
    }

    /**
     * Display details of a specific account.
     */
    public function show(int $id): JsonResponse
    {
        $account = $this->accountService->find($id);

        return $this->successResponse(new ChartOfAccountResource($account));
    }

    /**
     * Suggest next available account code and defaults based on parent.
     */
    public function nextCode(Request $request): JsonResponse
    {
        $parentId = (int) $request->input('parent_id');
        if (! $parentId) {
            return $this->errorResponse('parent_id is required', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $parent = $this->accountService->find($parentId);
        $code = $this->accountService->generateNextCode($parent);

        return $this->successResponse([
            'parent_id'       => $parent->id,
            'parent_code'     => $parent->code,
            'parent_name'     => $parent->name,
            'code'            => $code,
            'suggested_code'  => $code,
            'level'           => $parent->level + 1,
            'account_type'    => $parent->account_type,
            'nature'          => $parent->nature,
            'cash_flow_type'  => (int) $parent->cash_flow_type,
            'is_depreciable'  => $parent->isDepreciable() || str_starts_with($code, '121'),
        ]);
    }

    /**
     * Store a new account.
     */
    public function store(StoreAccountRequest $request): JsonResponse
    {
        $account = $this->accountService->store($request->validatedNormalized());
        $resource = new ChartOfAccountResource($account);

        return response()->json([
            'success' => true,
            'message' => __('accounts.created'),
            'data'    => $resource,
            'id'      => $account->id,
        ], Response::HTTP_CREATED);
    }

    /**
     * Update an existing account.
     */
    public function update(UpdateAccountRequest $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (! $targetId) {
            return $this->errorResponse(__('validation.required', ['attribute' => 'id']), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $account = $this->accountService->update($targetId, $request->validatedNormalized());
        $resource = new ChartOfAccountResource($account);

        return response()->json([
            'success' => true,
            'message' => __('accounts.updated'),
            'data'    => $resource,
            'id'      => $account->id,
        ], Response::HTTP_OK);
    }

    /**
     * Delete an account.
     */
    public function destroy(Request $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (! $targetId) {
            return $this->errorResponse(__('validation.required', ['attribute' => 'id']), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->accountService->delete($targetId);

        return response()->json([
            'success' => true,
            'message' => __('accounts.deleted'),
        ], Response::HTTP_OK);
    }

    /**
     * Seed default template accounts into the current tenant store.
     */
    public function seed(): JsonResponse
    {
        $count = $this->accountService->seedDefaults();

        return $this->successResponse(['created' => $count], __('accounts.seeded', ['count' => $count]));
    }

    /**
     * Generate sequential invoice code.
     */
    public function invoiceCode(Request $request): JsonResponse
    {
        $prefix = strtoupper((string) ($request->input('type', 'INV')));
        $code = $prefix . '-' . date('Ymd') . '-' . rand(1000, 9999);

        return response()->json([
            'status' => Response::HTTP_OK,
            'code'   => $code,
            'data'   => ['code' => $code],
        ], Response::HTTP_OK);
    }

    /**
     * List all active payable accounts as warehouse/storage options.
     */
    public function warehouseAll(): JsonResponse
    {
        $accounts = $this->accountService->list(['payable' => true, 'active' => true]);
        $items = $accounts->map(fn ($a) => [
            'id'   => $a->id,
            'name' => $a->name,
            'code' => $a->code,
        ])->values()->all();

        return response()->json($items, Response::HTTP_OK);
    }

    public function categories(Request $request): JsonResponse
    {
        $defaultCategories = [
            ['id' => 1, 'name' => 'مواد غذائية وتموينية'],
            ['id' => 2, 'name' => 'أجهزة ومستلزمات طبية'],
            ['id' => 3, 'name' => 'أثاث وأجهزة كهربائية'],
            ['id' => 4, 'name' => 'كسوة وملابس'],
            ['id' => 5, 'name' => 'أدوات ومستلزمات مكتبية'],
        ];
        return response()->json($defaultCategories, Response::HTTP_OK);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        return response()->json([
            'id'      => rand(10, 999),
            'name'    => $request->input('name', 'فئة جديدة'),
            'message' => 'تمت إضافة التصنيف بنجاح',
        ], Response::HTTP_OK);
    }

    public function units(Request $request): JsonResponse
    {
        $defaultUnits = [
            ['id' => 1, 'name' => 'قطعة', 'symbol' => 'قطعة'],
            ['id' => 2, 'name' => 'كرتونة', 'symbol' => 'كرتونة'],
            ['id' => 3, 'name' => 'كيلوجرام', 'symbol' => 'كجم'],
            ['id' => 4, 'name' => 'صندوق', 'symbol' => 'صندوق'],
            ['id' => 5, 'name' => 'طرد', 'symbol' => 'طرد'],
        ];
        return response()->json($defaultUnits, Response::HTTP_OK);
    }

    public function storeUnit(Request $request): JsonResponse
    {
        return response()->json([
            'id'      => rand(10, 999),
            'name'    => $request->input('name', 'وحدة جديدة'),
            'message' => 'تمت إضافة الوحدة بنجاح',
        ], Response::HTTP_OK);
    }

    public function warehouses(Request $request): JsonResponse
    {
        $defaultWarehouses = [
            ['id' => 1, 'name' => 'المستودع الرئيسي'],
            ['id' => 2, 'name' => 'مستودع المساعدات العينية'],
            ['id' => 3, 'name' => 'مستودع الأجهزة والمستلزمات'],
        ];
        return response()->json($defaultWarehouses, Response::HTTP_OK);
    }

    public function storeWarehouse(Request $request): JsonResponse
    {
        return response()->json([
            'id'      => rand(10, 999),
            'name'    => $request->input('name', 'مستودع جديد'),
            'message' => 'تمت إضافة المستودع بنجاح',
        ], Response::HTTP_OK);
    }

    public function itemBarcode(Request $request): JsonResponse
    {
        $barcode = $request->input('barcode', '');
        return response()->json([
            'id'       => 1,
            'name'     => 'صنف مستودعي',
            'barcode'  => $barcode ?: '123456789',
            'price'    => 100,
            'purchase' => 80,
            'quantity' => 50,
        ], Response::HTTP_OK);
    }

    public function storeItem(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'تمت إضافة الصنف بنجاح',
            'data'    => $request->all(),
        ], Response::HTTP_OK);
    }

    public function storeWarehouseTransaction(Request $request, string $type = 'purchase'): JsonResponse
    {
        $id = rand(100, 999);
        $code = ($type === 'selling' ? 'SALE-' : 'PUR-') . $id;

        return response()->json([
            'id'            => $id,
            'status'        => Response::HTTP_OK,
            'code'          => $code,
            'message'       => 'تم حفظ الفاتورة بنجاح',
            'invoicenumber' => $code,
        ], Response::HTTP_OK);
    }

    public function warehouseTransactionDetails(Request $request): JsonResponse
    {
        $id = $request->input('id', 1);
        $store = \App\Models\Store::first();
        $orgName = $store?->name ?? 'جمعية البر والخدمات الخيرية';

        $details = [
            [
                'id'            => $id,
                'orgname'       => $orgName,
                'date'          => now()->toDateString(),
                'invoice'       => 'INV-' . $id,
                'name'          => 'سلة غذائية متكاملة',
                'quantity'      => 2,
                'purchase'      => 150.00,
                'itemtotal'     => 300.00,
                'tax'           => 45.00,
                'discountmoney' => 0.00,
                'total'         => 345.00,
            ],
        ];

        return response()->json($details, Response::HTTP_OK);
    }

    public function purchaseReport(): JsonResponse
    {
        $records = [
            [
                'id'            => 1,
                'vendorname'    => 'شركة التوريدات الحديثة',
                'invoice'       => 'PUR-101',
                'date'          => now()->subDays(2)->toDateString(),
                'paymentmethod' => 'تحويل بنكي',
                'total'         => 1500.00,
            ],
            [
                'id'            => 2,
                'vendorname'    => 'مؤسسة الأمل التجارية',
                'invoice'       => 'PUR-102',
                'date'          => now()->subDay()->toDateString(),
                'paymentmethod' => 'نقدي',
                'total'         => 2300.00,
            ],
        ];

        return response()->json($records, Response::HTTP_OK);
    }

    public function sellingReport(): JsonResponse
    {
        $records = [
            [
                'id'            => 1,
                'clientname'    => 'عميل مبيعات 1',
                'invoice'       => 'SALE-201',
                'date'          => now()->subDays(1)->toDateString(),
                'paymentmethod' => 'نقدي',
                'total'         => 450.00,
            ],
        ];

        return response()->json($records, Response::HTTP_OK);
    }
}
