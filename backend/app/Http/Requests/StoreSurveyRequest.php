<?php

namespace App\Http\Requests;

class StoreSurveyRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [
            'satisfaction_score' => ['nullable', 'integer', 'min:1', 'max:5'],
            'nps_score'          => ['nullable', 'integer', 'min:0', 'max:10'],
            'notes'              => ['nullable', 'string', 'max:2000'],
            'period'             => ['nullable', 'string', 'max:50'],
            'humancase_id'       => ['nullable', 'integer'],
        ];
    }
}
