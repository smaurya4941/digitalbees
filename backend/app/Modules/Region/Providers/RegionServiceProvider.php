<?php

namespace App\Modules\Region\Providers;

use App\Modules\Region\Repositories\Contracts\RegionRepository;
use App\Modules\Region\Repositories\Eloquent\EloquentRegionRepository;
use Illuminate\Support\ServiceProvider;

class RegionServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        RegionRepository::class => EloquentRegionRepository::class,
    ];
}
