<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Jobs\NotifyFrontendRevalidate;
use App\Modules\CaseStudy\Models\CaseStudy;
use App\Modules\Industry\Models\Industry;
use App\Modules\Practice\Models\Practice;
use App\Modules\Region\Models\Region;
use App\Modules\Seo\Http\Requests\SeoRequest;
use App\Modules\Seo\Services\SeoLintService;
use App\Modules\Seo\Services\SeoService;
use App\Modules\Technology\Models\Technology;
use App\Support\Enums\ContentStatus;
use App\Support\Http\ApiResponse;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Per-entity SEO metadata + a site-wide lint report.
 *
 * Reads are open to content editors (`content.update`), writes need
 * `seo.update` (the seo-manager role holds only that).
 */
class SeoController extends ApiController
{
    /** @var array<string, array{0: class-string<Model>, 1: string}> */
    private const TYPES = [
        'practices' => [Practice::class, '/practices'],
        'industries' => [Industry::class, '/industries'],
        'regions' => [Region::class, '/regions'],
        'technologies' => [Technology::class, '/technologies'],
        'case-studies' => [CaseStudy::class, '/case-studies'],
    ];

    public function __construct(
        private readonly SeoService $seo,
        private readonly SeoLintService $lint,
    ) {}

    public function show(string $type, string $slug): JsonResponse
    {
        $model = $this->resolve($type, $slug);

        return ApiResponse::item([
            'seo' => $this->seo->present($model->seo()->first()),
            'warnings' => $this->lint->lint($model),
        ]);
    }

    public function update(SeoRequest $request, string $type, string $slug): JsonResponse
    {
        $model = $this->resolve($type, $slug);

        $seo = $this->seo->sync($model, $request->validated());
        NotifyFrontendRevalidate::dispatch([$type, "{$type}:{$slug}"]);

        $model->setRelation('seo', $seo);

        return ApiResponse::item([
            'seo' => $this->seo->present($seo),
            'warnings' => $this->lint->lint($model),
        ]);
    }

    /** GET /api/v1/admin/seo/issues — published entities with lint warnings. */
    public function issues(): JsonResponse
    {
        $rows = [];

        foreach (self::TYPES as $type => [$class, $prefix]) {
            $class::query()
                ->where('status', ContentStatus::Published->value)
                ->with('seo')
                ->get()
                ->each(function (Model $model) use (&$rows, $type, $prefix): void {
                    $warnings = $this->lint->lint($model);

                    if ($warnings !== []) {
                        $rows[] = [
                            'type' => $type,
                            'slug' => $model->slug,
                            'title' => $model->name ?? $model->title ?? $model->slug,
                            'href' => "{$prefix}/{$model->slug}",
                            'warnings' => $warnings,
                        ];
                    }
                });
        }

        return ApiResponse::collection($rows, ['types' => array_keys(self::TYPES)]);
    }

    private function resolve(string $type, string $slug): Model
    {
        $class = self::TYPES[$type][0] ?? throw new NotFoundHttpException("Unknown content type [{$type}].");

        return $class::query()->where('slug', $slug)->first()
            ?? throw new NotFoundHttpException("[{$type}/{$slug}] not found.");
    }
}
