<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Testimonial\Http\Resources\TestimonialResource;
use App\Modules\Testimonial\Models\Testimonial;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Public testimonials feed (blueprint §10.1/§10.2): `GET /testimonials`
 * (homepage's generic set) or `GET /testimonials?related_type=practice`
 * (tagged to a specific entity type).
 */
class TestimonialController extends ApiController
{
    public function index(Request $request): JsonResponse
    {
        $relatedType = $request->string('related_type')->toString();

        $testimonials = Testimonial::query()
            ->published()
            ->ordered()
            ->when($relatedType !== '', fn ($q) => $q->for($relatedType))
            ->get();

        return ApiResponse::collection(TestimonialResource::collection($testimonials)->resolve());
    }
}
