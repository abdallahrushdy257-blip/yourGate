<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobTitleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'title'            => $this->title,
            'name'             => $this->title,
            'description'      => $this->description,
            'note'             => $this->note,
            'workdayspermonth' => (int) $this->workdayspermonth,
            'workhoursperday'  => (int) $this->workhoursperday,
            'days'             => (int) $this->workdayspermonth,
            'hours'            => (int) $this->workhoursperday,
            'parent_id'        => $this->parent_id,
            'mangerjobtitle'   => $this->parent_id,
            'parent'           => $this->parent ? [
                'id'    => $this->parent->id,
                'title' => $this->parent->title,
                'name'  => $this->parent->title,
            ] : null,
            'created_at'       => $this->created_at ? $this->created_at->format('Y-m-d') : null,
        ];
    }
}
