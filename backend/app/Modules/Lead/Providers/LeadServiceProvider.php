<?php

namespace App\Modules\Lead\Providers;

use App\Modules\Lead\Repositories\Contracts\LeadRepository;
use App\Modules\Lead\Repositories\Eloquent\EloquentLeadRepository;
use Illuminate\Support\ServiceProvider;

class LeadServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            LeadRepository::class,
            EloquentLeadRepository::class
        );
    }
}
