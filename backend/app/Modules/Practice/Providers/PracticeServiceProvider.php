<?php

namespace App\Modules\Practice\Providers;

use App\Modules\Practice\Repositories\Contracts\PracticeRepository;
use App\Modules\Practice\Repositories\Eloquent\EloquentPracticeRepository;
use Illuminate\Support\ServiceProvider;

class PracticeServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        PracticeRepository::class => EloquentPracticeRepository::class,
    ];
}
