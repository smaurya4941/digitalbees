<?php

namespace App\Modules\Lead\Repositories\Contracts;

use App\Modules\Lead\Models\Lead;
use Illuminate\Pagination\LengthAwarePaginator;

interface LeadRepository
{
    /**
     * Get paginated leads for admin dashboard.
     */
    public function getPaginatedForAdmin(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    /**
     * Find lead by ID.
     */
    public function findById(int $id): ?Lead;

    /**
     * Update lead status.
     */
    public function updateStatus(Lead $lead, string $status): Lead;
}
