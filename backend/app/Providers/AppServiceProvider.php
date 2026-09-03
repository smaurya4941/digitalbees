<?php

namespace App\Providers;

use App\Models\User;
use App\Modules\CaseStudy\Models\CaseStudy;
use App\Modules\Industry\Models\Industry;
use App\Modules\Practice\Models\Practice;
use App\Modules\Practice\Models\SubService;
use App\Modules\Region\Models\Location;
use App\Modules\Region\Models\Region;
use App\Modules\Technology\Models\Technology;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Stable, short polymorphic type keys stored in `*_type` columns
        // (entity_relations, seo_metadata, media, …). Never store FQCNs.
        Relation::enforceMorphMap([
            'practice' => Practice::class,
            'sub_service' => SubService::class,
            'industry' => Industry::class,
            'region' => Region::class,
            'technology' => Technology::class,
            'case_study' => CaseStudy::class,
            'location' => Location::class,
            'user' => User::class,
        ]);
    }
}
