<?php

use App\Http\Controllers\Api\V1\Admin\ContentStatusController;
use App\Http\Controllers\Api\V1\Admin\IndustryAdminController;
use App\Http\Controllers\Api\V1\Admin\PracticeAdminController;
use App\Http\Controllers\Api\V1\Admin\LeadAdminController;
use App\Http\Controllers\Api\V1\Admin\RegionAdminController;
use App\Http\Controllers\Api\V1\Admin\TechnologyAdminController;
use App\Http\Controllers\Api\V1\Admin\CaseStudyAdminController;
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

// --- Auth (Sanctum SPA — stateful, HTTP-only cookie) -------------------------
// The XSRF-TOKEN cookie is issued by GET /sanctum/csrf-cookie (registered by
// Sanctum, outside this /v1 group).
Route::post('login', [AuthController::class, 'login'])
    ->middleware('throttle:auth')
    ->name('login');

Route::middleware(['auth:sanctum', 'active'])->group(function (): void {
    Route::get('user', [AuthController::class, 'me'])->name('user');
    Route::post('logout', [AuthController::class, 'logout'])->name('logout');
});

// --- Back-office (authenticated + permission-gated) --------------------------
// Writes live on the same resource URLs as the public reads — no /admin/ prefix
// in the path; access is decided by permission, not by URL shape.
Route::middleware(['auth:sanctum', 'active'])->group(function (): void {
    // Practice CRUD — reference implementation for every content type.
    Route::get('admin/practices', [PracticeAdminController::class, 'index'])
        ->middleware('permission:content.update|content.publish')
        ->name('admin.practices.index');
    Route::get('admin/practices/{slug}', [PracticeAdminController::class, 'show'])
        ->middleware('permission:content.update|content.publish')
        ->name('admin.practices.show');
    Route::post('practices', [PracticeAdminController::class, 'store'])
        ->middleware('permission:content.create')
        ->name('practices.store');
    Route::match(['put', 'patch'], 'practices/{slug}', [PracticeAdminController::class, 'update'])
        ->middleware('permission:content.update')
        ->name('practices.update');
    Route::delete('practices/{slug}', [PracticeAdminController::class, 'destroy'])
        ->middleware('permission:content.delete')
        ->name('practices.destroy');

    // Industry CRUD
    Route::get('admin/industries', [IndustryAdminController::class, 'index'])
        ->middleware('permission:content.update|content.publish')
        ->name('admin.industries.index');
    Route::get('admin/industries/{slug}', [IndustryAdminController::class, 'show'])
        ->middleware('permission:content.update|content.publish')
        ->name('admin.industries.show');
    Route::post('industries', [IndustryAdminController::class, 'store'])
        ->middleware('permission:content.create')
        ->name('industries.store');
    Route::match(['put', 'patch'], 'industries/{slug}', [IndustryAdminController::class, 'update'])
        ->middleware('permission:content.update')
        ->name('industries.update');
    Route::delete('industries/{slug}', [IndustryAdminController::class, 'destroy'])
        ->middleware('permission:content.delete')
        ->name('industries.destroy');

    // Region CRUD
    Route::get('admin/regions', [RegionAdminController::class, 'index'])
        ->middleware('permission:content.update|content.publish')
        ->name('admin.regions.index');
    Route::get('admin/regions/{slug}', [RegionAdminController::class, 'show'])
        ->middleware('permission:content.update|content.publish')
        ->name('admin.regions.show');
    Route::post('regions', [RegionAdminController::class, 'store'])
        ->middleware('permission:content.create')
        ->name('regions.store');
    Route::match(['put', 'patch'], 'regions/{slug}', [RegionAdminController::class, 'update'])
        ->middleware('permission:content.update')
        ->name('regions.update');
    Route::delete('regions/{slug}', [RegionAdminController::class, 'destroy'])
        ->middleware('permission:content.delete')
        ->name('regions.destroy');

    // Technology CRUD
    Route::get('admin/technologies', [TechnologyAdminController::class, 'index'])
        ->middleware('permission:content.update|content.publish')
        ->name('admin.technologies.index');
    Route::get('admin/technologies/{slug}', [TechnologyAdminController::class, 'show'])
        ->middleware('permission:content.update|content.publish')
        ->name('admin.technologies.show');
    Route::post('technologies', [TechnologyAdminController::class, 'store'])
        ->middleware('permission:content.create')
        ->name('technologies.store');
    Route::match(['put', 'patch'], 'technologies/{slug}', [TechnologyAdminController::class, 'update'])
        ->middleware('permission:content.update')
        ->name('technologies.update');
    Route::delete('technologies/{slug}', [TechnologyAdminController::class, 'destroy'])
        ->middleware('permission:content.delete')
        ->name('technologies.destroy');

    // Case Study CRUD
    Route::get('admin/case-studies', [CaseStudyAdminController::class, 'index'])
        ->middleware('permission:content.update|content.publish')
        ->name('admin.case-studies.index');
    Route::get('admin/case-studies/{slug}', [CaseStudyAdminController::class, 'show'])
        ->middleware('permission:content.update|content.publish')
        ->name('admin.case-studies.show');
    Route::post('case-studies', [CaseStudyAdminController::class, 'store'])
        ->middleware('permission:content.create')
        ->name('case-studies.store');
    Route::match(['put', 'patch'], 'case-studies/{slug}', [CaseStudyAdminController::class, 'update'])
        ->middleware('permission:content.update')
        ->name('case-studies.update');
    Route::delete('case-studies/{slug}', [CaseStudyAdminController::class, 'destroy'])
        ->middleware('permission:content.delete')
        ->name('case-studies.destroy');

    // Cross-taxonomy publish lifecycle (industries, regions, technologies, case-studies, practices).
    Route::get('admin/content/{type}', [ContentStatusController::class, 'index'])
        ->middleware('permission:content.update|content.publish')
        ->name('admin.content.index');
    Route::patch('admin/content/{type}/{slug}/status', [ContentStatusController::class, 'update'])
        ->middleware('permission:content.publish')
        ->name('admin.content.status');

    // CRM / Leads
    Route::get('admin/leads', [LeadAdminController::class, 'index'])
        ->middleware('permission:content.update') // Proxying for CRM view
        ->name('admin.leads.index');
    Route::get('admin/leads/{id}', [LeadAdminController::class, 'show'])
        ->middleware('permission:content.update')
        ->name('admin.leads.show');
    Route::patch('admin/leads/{id}/status', [LeadAdminController::class, 'updateStatus'])
        ->middleware('permission:content.update')
        ->name('admin.leads.updateStatus');
});

// --- Conversion / write (throttled) -------------------------------------------
Route::middleware('throttle:leads')->group(function (): void {
    Route::post('leads', [LeadController::class, 'store'])->name('leads.store');
    Route::post('newsletter', [NewsletterController::class, 'store'])->name('newsletter.store');
    Route::post('careers/{career}/apply', [CareerController::class, 'apply'])->name('careers.apply');
    Route::post('chatbot/message', [ChatbotController::class, 'message'])->name('chatbot.message');
});
