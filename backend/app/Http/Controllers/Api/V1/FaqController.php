<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Faq\Http\Resources\FaqResource;
use App\Modules\Faq\Models\Faq;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Public general FAQs: `GET /faqs` — published FAQs not attached to a practice
 * or sub-service (those ship inside their parent's payload instead). Feeds the
 * services hub's FAQ block.
 */
class FaqController extends ApiController
{
    public function index(): JsonResponse
    {
        $faqs = Faq::query()
            ->published()
            ->ordered()
            ->whereNull('faqable_type')
            ->get();

        return ApiResponse::collection(FaqResource::collection($faqs)->resolve());
    }
}
