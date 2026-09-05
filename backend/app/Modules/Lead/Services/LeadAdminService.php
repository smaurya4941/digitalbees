<?php

namespace App\Modules\Lead\Services;

use App\Modules\Lead\Models\Lead;
use App\Modules\Lead\Repositories\Contracts\LeadRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class LeadAdminService
{
    public function __construct(
        private readonly LeadRepository $leads
    ) {}

    public function listPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->leads->getPaginatedForAdmin($filters, $perPage);
    }

    public function findById(int $id): Lead
    {
        return $this->leads->findById($id)
            ?? throw new NotFoundHttpException("Lead [{$id}] not found.");
    }

    public function updateStatus(Lead $lead, string $status): Lead
    {
        return $this->leads->updateStatus($lead, $status);
    }
}
