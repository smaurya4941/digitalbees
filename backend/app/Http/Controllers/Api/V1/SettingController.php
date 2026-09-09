<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Page\Services\SettingService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Public, cacheable subset of site settings for the Next.js layout
 * (site name, contact details, social links, feature flags).
 */
class SettingController extends ApiController
{
    public function __construct(private readonly SettingService $settings) {}

    public function index(): JsonResponse
    {
        return ApiResponse::item($this->settings->publicValues());
    }
}
