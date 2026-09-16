<?php

namespace App\Modules\Testimonial\Providers;

use App\Modules\Testimonial\Repositories\Contracts\TestimonialRepository;
use App\Modules\Testimonial\Repositories\Eloquent\EloquentTestimonialRepository;
use Illuminate\Support\ServiceProvider;

class TestimonialServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        TestimonialRepository::class => EloquentTestimonialRepository::class,
    ];
}
