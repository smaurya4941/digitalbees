<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Lead\Http\Requests\UpdateLeadStatusRequest;
use App\Modules\Lead\Http\Resources\LeadAdminResource;
use App\Modules\Lead\Services\LeadAdminService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadAdminController extends ApiController
{
    public function __construct(private readonly LeadAdminService $leads) {}

    /** GET /api/v1/admin/leads */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status']);
        $perPage = (int) $request->query('per_page', 15);

        return ApiResponse::page(
            $this->leads->listPaginated($filters, $perPage),
            fn ($lead) => (new LeadAdminResource($lead))->resolve(),
            ['statuses' => ['new', 'synced', 'failed', 'duplicate']],
        );
    }

    /** GET /api/v1/admin/leads/{id} */
    public function show(int $id): JsonResponse
    {
        return ApiResponse::item(
            new LeadAdminResource($this->leads->findById($id))
        );
    }

    /** PATCH /api/v1/admin/leads/{id}/status */
    public function updateStatus(UpdateLeadStatusRequest $request, int $id): JsonResponse
    {
        $lead = $this->leads->findById($id);
        $status = $request->validated('status');

        $lead = $this->leads->updateStatus($lead, $status);

        return ApiResponse::item(new LeadAdminResource($lead));
    }
}
