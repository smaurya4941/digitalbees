<?php

namespace App\Modules\Technology\Providers;

use App\Modules\Technology\Repositories\Contracts\TechnologyRepository;
use App\Modules\Technology\Repositories\Eloquent\EloquentTechnologyRepository;
use Illuminate\Support\ServiceProvider;

class TechnologyServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        TechnologyRepository::class => EloquentTechnologyRepository::class,
    ];
}
