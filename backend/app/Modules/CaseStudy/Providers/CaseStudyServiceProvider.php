<?php

namespace App\Modules\CaseStudy\Providers;

use App\Modules\CaseStudy\Repositories\Contracts\CaseStudyRepository;
use App\Modules\CaseStudy\Repositories\Eloquent\EloquentCaseStudyRepository;
use Illuminate\Support\ServiceProvider;

class CaseStudyServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        CaseStudyRepository::class => EloquentCaseStudyRepository::class,
    ];
}
