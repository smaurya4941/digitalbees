<?php

namespace App\Modules\Career\Providers;

use App\Modules\Career\Repositories\Contracts\CareerRepository;
use App\Modules\Career\Repositories\Eloquent\EloquentCareerRepository;
use Illuminate\Support\ServiceProvider;

class CareerServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        CareerRepository::class => EloquentCareerRepository::class,
    ];
}
