<?php

namespace App\Modules\Industry\Providers;

use App\Modules\Industry\Repositories\Contracts\IndustryRepository;
use App\Modules\Industry\Repositories\Eloquent\EloquentIndustryRepository;
use Illuminate\Support\ServiceProvider;

class IndustryServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        IndustryRepository::class => EloquentIndustryRepository::class,
    ];
}
