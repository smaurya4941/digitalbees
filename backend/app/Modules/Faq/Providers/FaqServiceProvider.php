<?php

namespace App\Modules\Faq\Providers;

use App\Modules\Faq\Repositories\Contracts\FaqRepository;
use App\Modules\Faq\Repositories\Eloquent\EloquentFaqRepository;
use Illuminate\Support\ServiceProvider;

class FaqServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        FaqRepository::class => EloquentFaqRepository::class,
    ];
}
