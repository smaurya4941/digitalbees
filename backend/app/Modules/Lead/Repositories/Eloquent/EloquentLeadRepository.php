<?php

namespace App\Modules\Lead\Repositories\Eloquent;

use App\Modules\Lead\Models\Lead;
use App\Modules\Lead\Repositories\Contracts\LeadRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class EloquentLeadRepository implements LeadRepository
{
    public function getPaginatedForAdmin(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Lead::query()->latest();

        if (isset($filters['status']) && $filters['status']) {
            $query->where('status', $filters['status']);
        }

        return $query->paginate($perPage);
    }

    public function findById(int $id): ?Lead
    {
        return Lead::query()->find($id);
    }

    public function updateStatus(Lead $lead, string $status): Lead
    {
        $lead->update(['status' => $status]);
        return $lead;
    }
}
