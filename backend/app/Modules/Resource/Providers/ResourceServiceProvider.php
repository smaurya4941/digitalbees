<?php

namespace App\Modules\Resource\Providers;

use App\Modules\Resource\Repositories\Contracts\ResourceRepository;
use App\Modules\Resource\Repositories\Eloquent\EloquentResourceRepository;
use Illuminate\Support\ServiceProvider;

class ResourceServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        ResourceRepository::class => EloquentResourceRepository::class,
    ];
}
