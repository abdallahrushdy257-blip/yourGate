<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Accounting\StoreJournalEntryRequest;
use App\Http\Requests\Accounting\UpdateJournalEntryRequest;
use App\Http\Resources\Accounting\JournalEntryResource;
use App\Services\Accounting\JournalEntryService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AccountingEntryController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected JournalEntryService $entryService
    ) {}

    /**
     * Display a listing of journal entries (used by /transactions & /accounting-entries).
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->all();
        $entries = $this->entryService->list($filters);

        $resource = JournalEntryResource::collection($entries);

        // When requested by TableComponent via /transactions, provide direct collection / paginated data
        if ($request->is('*transactions*') && ! $request->has('standard_format')) {
            return response()->json($resource, Response::HTTP_OK);
        }

        return $this->successResponse($resource, 'تم جلب القيود المحاسبية بنجاح.');
    }

    /**
     * Store a new journal entry.
     */
    public function store(StoreJournalEntryRequest $request): JsonResponse
    {
        $entry = $this->entryService->store($request->validatedNormalized());
        $resource = new JournalEntryResource($entry);

        return response()->json([
            'status'  => Response::HTTP_OK,
            'success' => true,
            'message' => 'تم إنشاء القيد المحاسبي بنجاح.',
            'data'    => $resource,
            'id'      => $entry->id,
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified journal entry.
     */
    public function show(int $id): JsonResponse
    {
        $entry = $this->entryService->find($id);
        $resource = new JournalEntryResource($entry);

        // Direct object response for AccountingEntryView.js
        return response()->json($resource, Response::HTTP_OK);
    }

    /**
     * Update an existing journal entry.
     */
    public function update(UpdateJournalEntryRequest $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? (int) $request->input('id');
        if (! $targetId) {
            return $this->errorResponse('معرف القيد مطلوب للتعديل.', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $entry = $this->entryService->update($targetId, $request->validatedNormalized());
        $resource = new JournalEntryResource($entry);

        return response()->json([
            'status'  => Response::HTTP_OK,
            'success' => true,
            'message' => 'تم تعديل القيد المحاسبي بنجاح.',
            'data'    => $resource,
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified journal entry.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->entryService->delete($id);

        return response()->json([
            'status'  => Response::HTTP_OK,
            'success' => true,
            'message' => 'تم حذف القيد المحاسبي بنجاح.',
        ], Response::HTTP_OK);
    }
}
