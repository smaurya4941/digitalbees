<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Governance\Services\DashboardService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Back-office dashboard aggregates. Available to any authenticated, active
 * account — there is no dashboard-specific permission.
 */
class DashboardController extends ApiController
{
    public function __construct(private readonly DashboardService $dashboard) {}

    public function show(): JsonResponse
    {
        return ApiResponse::item($this->dashboard->snapshot());
    }
}
