<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Page\Http\Requests\UpdateSettingsRequest;
use App\Modules\Page\Services\SettingService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Site-wide settings. Gated by `permission:settings.manage`.
 */
class SettingAdminController extends ApiController
{
    public function __construct(private readonly SettingService $settings) {}

    public function index(): JsonResponse
    {
        return ApiResponse::item($this->settings->adminView());
    }

    public function update(UpdateSettingsRequest $request): JsonResponse
    {
        $this->settings->bulkUpdate($request->validated('values'));

        return ApiResponse::item($this->settings->adminView());
    }
}
