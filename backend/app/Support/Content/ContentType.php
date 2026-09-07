<?php

namespace App\Support\Content;

use App\Modules\Career\Models\JobPosting;
use App\Modules\CaseStudy\Models\CaseStudy;
use App\Modules\Industry\Models\Industry;
use App\Modules\Practice\Models\Practice;
use App\Modules\Region\Models\Location;
use App\Modules\Region\Models\Region;
use App\Modules\Resource\Models\Resource;
use App\Modules\Technology\Models\Technology;
use Illuminate\Database\Eloquent\Model;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The single map from a public URL segment (`practices`, `case-studies`, …) to
 * the model behind it, its public path prefix and a human label.
 *
 * Cross-cutting back-office features (revisions, workflow, bulk actions, export)
 * resolve content types through here instead of each keeping its own copy.
 * All eight entries are slug-keyed and use {@see \App\Support\Concerns\IsContentEntity}.
 */
final class ContentType
{
    /**
     * type => [model class, public path prefix, singular label]
     *
     * @var array<string, array{0: class-string<Model>, 1: string, 2: string}>
     */
    public const REGISTRY = [
        'practices' => [Practice::class, '/practices', 'Practice'],
        'industries' => [Industry::class, '/industries', 'Industry'],
        'regions' => [Region::class, '/regions', 'Region'],
        'technologies' => [Technology::class, '/technologies', 'Technology'],
        'case-studies' => [CaseStudy::class, '/case-studies', 'Case study'],
        'resources' => [Resource::class, '/resources', 'Resource'],
        'careers' => [JobPosting::class, '/careers', 'Job posting'],
        'locations' => [Location::class, '/locations', 'Office'],
    ];

    /** @return list<string> */
    public static function keys(): array
    {
        return array_keys(self::REGISTRY);
    }

    public static function exists(string $type): bool
    {
        return isset(self::REGISTRY[$type]);
    }

    /** @return class-string<Model> */
    public static function modelClass(string $type): string
    {
        return self::REGISTRY[$type][0]
            ?? throw new NotFoundHttpException("Unknown content type [{$type}].");
    }

    public static function prefix(string $type): string
    {
        return self::entry($type)[1];
    }

    public static function label(string $type): string
    {
        return self::entry($type)[2];
    }

    public static function resolve(string $type, string $slug): Model
    {
        $class = self::modelClass($type);

        return $class::query()->where('slug', $slug)->first()
            ?? throw new NotFoundHttpException("[{$type}/{$slug}] not found.");
    }

    /** The URL segment for a model instance, or null if it isn't a registered content type. */
    public static function keyFor(Model $model): ?string
    {
        foreach (self::REGISTRY as $type => [$class]) {
            if ($model instanceof $class) {
                return $type;
            }
        }

        return null;
    }

    /**
     * Cache tags to purge on the frontend after this entity changes.
     *
     * @return list<string>
     */
    public static function revalidationTags(string $type, string $slug): array
    {
        return [$type, "{$type}:{$slug}"];
    }

    /** @return array{0: class-string<Model>, 1: string, 2: string} */
    private static function entry(string $type): array
    {
        return self::REGISTRY[$type]
            ?? throw new NotFoundHttpException("Unknown content type [{$type}].");
    }
}
