<?php

namespace App\Services;

use App\Models\MinuteSheet;
use App\Models\MinuteSheetAttendee;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MinuteSheetService
{
    /**
     * Get list of minute sheets with search and date filters.
     */
    public function list(array $filters = []): Collection
    {
        $query = MinuteSheet::query()
            ->with(['attendees.assemblyMember', 'attendees.committee'])
            ->latest('date');

        if (! empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('note', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['searchfrom'])) {
            $query->whereDate('date', '>=', $filters['searchfrom']);
        }

        if (! empty($filters['searchto'])) {
            $query->whereDate('date', '<=', $filters['searchto']);
        }

        if (isset($filters['type']) && $filters['type'] !== '' && $filters['type'] !== null) {
            $query->where('type', (int) $filters['type']);
        }

        if (isset($filters['reason']) && $filters['reason'] !== '' && $filters['reason'] !== null) {
            $query->where('reason', (int) $filters['reason']);
        }

        $page = max(1, (int) ($filters['page'] ?? 1));
        $perPage = (int) ($filters['perpage'] ?? $filters['per_page'] ?? 10);

        if ($perPage > 0) {
            $query->skip(($page - 1) * $perPage)->take($perPage);
        }

        return $query->get();
    }

    /**
     * Get statistical summaries.
     */
    public function stats(): array
    {
        return [
            'total_minutes'    => MinuteSheet::count(),
            'assembly_minutes' => MinuteSheet::where('type', 1)->count(),
            'board_minutes'    => MinuteSheet::where('type', 2)->count(),
        ];
    }

    /**
     * Find a minute sheet by ID.
     */
    public function find(int $id): MinuteSheet
    {
        return MinuteSheet::with(['attendees.assemblyMember', 'attendees.committee'])->findOrFail($id);
    }

    /**
     * Create a new minute sheet with attendees and uploaded document.
     */
    public function create(array $data, ?UploadedFile $file = null): MinuteSheet
    {
        return DB::transaction(function () use ($data, $file) {
            $uploadPath = null;
            if ($file && $file->isValid()) {
                $uploadPath = $file->store('minutesheets', 'public');
            }

            $minute = MinuteSheet::create([
                'title'  => $data['title'],
                'date'   => $data['date'] ?? now()->toDateString(),
                'type'   => isset($data['type']) && $data['type'] !== '' ? (int) $data['type'] : null,
                'reason' => isset($data['reason']) && $data['reason'] !== '' ? (int) $data['reason'] : null,
                'note'   => $data['note'] ?? null,
                'upload' => $uploadPath,
            ]);

            $this->syncAttendees($minute, $data);

            return $minute->fresh(['attendees.assemblyMember', 'attendees.committee']);
        });
    }

    /**
     * Update an existing minute sheet.
     */
    public function update(int $id, array $data, ?UploadedFile $file = null): MinuteSheet
    {
        return DB::transaction(function () use ($id, $data, $file) {
            $minute = $this->find($id);

            $updatePayload = [];
            if (isset($data['title'])) {
                $updatePayload['title'] = $data['title'];
            }
            if (array_key_exists('date', $data)) {
                $updatePayload['date'] = $data['date'];
            }
            if (array_key_exists('type', $data)) {
                $updatePayload['type'] = $data['type'] !== '' && $data['type'] !== null ? (int) $data['type'] : null;
            }
            if (array_key_exists('reason', $data)) {
                $updatePayload['reason'] = $data['reason'] !== '' && $data['reason'] !== null ? (int) $data['reason'] : null;
            }
            if (array_key_exists('note', $data)) {
                $updatePayload['note'] = $data['note'];
            }

            if ($file && $file->isValid()) {
                if ($minute->upload && Storage::disk('public')->exists($minute->upload)) {
                    Storage::disk('public')->delete($minute->upload);
                }
                $updatePayload['upload'] = $file->store('minutesheets', 'public');
            }

            if (! empty($updatePayload)) {
                $minute->update($updatePayload);
            }

            if (isset($data['attendees']) || isset($data['committee'])) {
                $minute->attendees()->delete();
                $this->syncAttendees($minute, $data);
            }

            return $minute->fresh(['attendees.assemblyMember', 'attendees.committee']);
        });
    }

    /**
     * Delete a minute sheet.
     */
    public function delete(int $id): bool
    {
        $minute = $this->find($id);

        if ($minute->upload && Storage::disk('public')->exists($minute->upload)) {
            Storage::disk('public')->delete($minute->upload);
        }

        return (bool) $minute->delete();
    }

    /**
     * Helper to sync attendees and committees.
     */
    protected function syncAttendees(MinuteSheet $minute, array $data): void
    {
        $attendeesList = $data['attendees'] ?? [];
        $committeesList = $data['committee'] ?? [];

        $maxCount = max(count($attendeesList), count($committeesList));

        for ($i = 0; $i < $maxCount; $i++) {
            $memberVal = $attendeesList[$i] ?? null;
            $commVal = $committeesList[$i] ?? null;

            $memberId = is_array($memberVal)
                ? ($memberVal['value'] ?? $memberVal['member'] ?? $memberVal['id'] ?? null)
                : $memberVal;

            $committeeId = is_array($commVal)
                ? ($commVal['value'] ?? $commVal['committee'] ?? $commVal['id'] ?? null)
                : $commVal;

            if ($memberId || $committeeId) {
                $minute->attendees()->create([
                    'assembly_member_id' => $memberId ? (int) $memberId : null,
                    'committee_id'       => $committeeId ? (int) $committeeId : null,
                ]);
            }
        }
    }
}
