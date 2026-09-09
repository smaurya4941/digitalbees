<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Page\Http\Requests\UpdateNavigationRequest;
use App\Modules\Page\Models\NavigationMenu;
use App\Modules\Page\Services\NavigationAdminService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Navigation menu editing. Gated by `permission:navigation.update`.
 */
class NavigationAdminController extends ApiController
{
    public function __construct(private readonly NavigationAdminService $navigation) {}

    public function index(): JsonResponse
    {
        return ApiResponse::collection($this->navigation->all());
    }

    public function update(UpdateNavigationRequest $request, string $menu): JsonResponse
    {
        $model = NavigationMenu::query()->where('key_name', $menu)->first()
            ?? throw new NotFoundHttpException("Navigation menu [{$menu}] not found.");

        $this->navigation->sync($model, $request->validated('items'));

        return ApiResponse::collection($this->navigation->all());
    }
}
