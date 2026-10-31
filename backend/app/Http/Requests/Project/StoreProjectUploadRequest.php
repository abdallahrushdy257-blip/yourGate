<?php

namespace App\Http\Requests\Project;

use App\Http\Requests\BaseApiRequest;

class StoreProjectUploadRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id'    => ['required', 'integer', 'exists:projects,id'],
            'description'   => ['nullable'],
            'description.*' => ['nullable', 'string', 'max:1000'],
            'upload'        => ['nullable'],
            'upload.*'      => ['nullable', 'file', 'max:51200'],
            'uploads'       => ['nullable'],
            'uploads.*'     => ['nullable', 'file', 'max:51200'],
            'files'         => ['nullable'],
            'files.*'       => ['nullable', 'file', 'max:51200'],
            'attachments'   => ['nullable'],
            'attachments.*' => ['nullable', 'file', 'max:51200'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $hasFiles = $this->hasFile('upload')
                     || $this->hasFile('uploads')
                     || $this->hasFile('files')
                     || $this->hasFile('attachments');

            if (!$hasFiles) {
                $validator->errors()->add('upload', 'يرجى تحديد ملف واحد على الأقل للرفع.');
            }
        });
    }
}
