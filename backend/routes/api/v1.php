<?php

use App\Http\Controllers\Api\V1\Admin\ContentStatusController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CareerController;
use App\Http\Controllers\Api\V1\CaseStudyController;
use App\Http\Controllers\Api\V1\ChatbotController;
use App\Http\Controllers\Api\V1\IndustryController;
use App\Http\Controllers\Api\V1\InsightController;
use App\Http\Controllers\Api\V1\LeadController;
use App\Http\Controllers\Api\V1\LocationController;
use App\Http\Controllers\Api\V1\NavigationController;
use App\Http\Controllers\Api\V1\NewsletterController;
use App\Http\Controllers\Api\V1\PageController;
use App\Http\Controllers\Api\V1\PracticeController;
use App\Http\Controllers\Api\V1\RedirectController;
use App\Http\Controllers\Api\V1\RegionController;
use App\Http\Controllers\Api\V1\ResourceController;
use App\Http\Controllers\Api\V1\SearchController;
use App\Http\Controllers\Api\V1\SitemapController;
use App\Http\Controllers\Api\V1\TechnologyController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API v1
|--------------------------------------------------------------------------
| Read endpoints are public and cacheable. Write endpoints (leads, newsletter,
| applications, chatbot) are rate-limited. Slugs are the public identifiers.
*/

// --- Site chrome -----------------------------------------------------------
Route::get('navigation', [NavigationController::class, 'index'])->name('navigation');
Route::get('redirects', [RedirectController::class, 'index'])->name('redirects');
Route::get('sitemap', [SitemapController::class, 'index'])->name('sitemap');
Route::get('pages/resolve', [PageController::class, 'resolve'])->name('pages.resolve');

// --- Taxonomy / content (read) ------------------------------------------------
Route::get('practices', [PracticeController::class, 'index'])->name('practices.index');
Route::get('practices/{practice}', [PracticeController::class, 'show'])->name('practices.show');
Route::get('practices/{practice}/sub-services/{subService}', [PracticeController::class, 'subService'])->name('practices.sub-services.show');

Route::get('industries', [IndustryController::class, 'index'])->name('industries.index');
Route::get('industries/{industry}', [IndustryController::class, 'show'])->name('industries.show');

Route::get('regions', [RegionController::class, 'index'])->name('regions.index');
Route::get('regions/{region}', [RegionController::class, 'show'])->name('regions.show');

Route::get('technologies', [TechnologyController::class, 'index'])->name('technologies.index');
Route::get('technologies/{technology}', [TechnologyController::class, 'show'])->name('technologies.show');

Route::get('case-studies', [CaseStudyController::class, 'index'])->name('case-studies.index');
Route::get('case-studies/{caseStudy}', [CaseStudyController::class, 'show'])->name('case-studies.show');

Route::get('resources', [ResourceController::class, 'index'])->name('resources.index');
Route::get('resources/{resource}', [ResourceController::class, 'show'])->name('resources.show');

Route::get('insights', [InsightController::class, 'index'])->name('insights.index');
Route::get('insights/{insight}', [InsightController::class, 'show'])->name('insights.show');

Route::get('careers', [CareerController::class, 'index'])->name('careers.index');
Route::get('careers/{career}', [CareerController::class, 'show'])->name('careers.show');

Route::get('locations', [LocationController::class, 'index'])->name('locations.index');
Route::get('locations/{location}', [LocationController::class, 'show'])->name('locations.show');

// --- Search --------------------------------------------------------------------
Route::get('search', [SearchController::class, 'index'])->name('search');

// --- Auth (CMS / admin token auth) -------------------------------------------
Route::post('auth/login', [AuthController::class, 'login'])->middleware('throttle:leads')->name('auth.login');
Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('auth/me', [AuthController::class, 'me'])->name('auth.me');
    Route::post('auth/logout', [AuthController::class, 'logout'])->name('auth.logout');
});

// --- Admin (authenticated + role-gated) --------------------------------------
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth:sanctum', 'role:Super Admin,Admin,Editor,Reviewer'])
    ->group(function (): void {
        Route::get('{type}', [ContentStatusController::class, 'index'])->name('content.index');
        Route::patch('{type}/{slug}/status', [ContentStatusController::class, 'update'])
            ->middleware('role:Super Admin,Admin,Reviewer')
            ->name('content.status');
    });

// --- Conversion / write (throttled) -------------------------------------------
Route::middleware('throttle:leads')->group(function (): void {
    Route::post('leads', [LeadController::class, 'store'])->name('leads.store');
    Route::post('newsletter', [NewsletterController::class, 'store'])->name('newsletter.store');
    Route::post('careers/{career}/apply', [CareerController::class, 'apply'])->name('careers.apply');
    Route::post('chatbot/message', [ChatbotController::class, 'message'])->name('chatbot.message');
});
