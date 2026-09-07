<?php

use App\Http\Controllers\Api\V1\Admin\AuditLogController;
use App\Http\Controllers\Api\V1\Admin\CareerAdminController;
use App\Http\Controllers\Api\V1\Admin\CaseStudyAdminController;
use App\Http\Controllers\Api\V1\Admin\ContentStatusController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\IndustryAdminController;
use App\Http\Controllers\Api\V1\Admin\LeadAdminController;
use App\Http\Controllers\Api\V1\Admin\LocationAdminController;
use App\Http\Controllers\Api\V1\Admin\MediaAdminController;
use App\Http\Controllers\Api\V1\Admin\NavigationAdminController;
use App\Http\Controllers\Api\V1\Admin\PageAdminController;
use App\Http\Controllers\Api\V1\Admin\PracticeAdminController;
use App\Http\Controllers\Api\V1\Admin\RedirectAdminController;
use App\Http\Controllers\Api\V1\Admin\RegionAdminController;
use App\Http\Controllers\Api\V1\Admin\ResourceAdminController;
use App\Http\Controllers\Api\V1\Admin\RevalidationController;
use App\Http\Controllers\Api\V1\Admin\RevisionController;
use App\Http\Controllers\Api\V1\Admin\RoleAdminController;
use App\Http\Controllers\Api\V1\Admin\SeoController;
use App\Http\Controllers\Api\V1\Admin\SettingAdminController;
use App\Http\Controllers\Api\V1\Admin\TechnologyAdminController;
use App\Http\Controllers\Api\V1\Admin\UserAdminController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CareerController;
use App\Http\Controllers\Api\V1\CaseStudyController;
use App\Http\Controllers\Api\V1\ChatbotController;
use App\Http\Controllers\Api\V1\IndustryController;
use App\Http\Controllers\Api\V1\InsightController;
use App\Http\Controllers\Api\V1\InvitationController;
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
use App\Http\Controllers\Api\V1\SettingController;
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
Route::get('settings', [SettingController::class, 'index'])->name('settings');
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

// Account invitations — the opaque token is the credential (no session).
Route::get('invitations/{token}', [InvitationController::class, 'show'])->name('invitations.show');
Route::post('invitations/accept', [InvitationController::class, 'accept'])
    ->middleware('throttle:auth')
    ->name('invitations.accept');

Route::middleware(['auth:sanctum', 'active'])->group(function (): void {
    Route::get('user', [AuthController::class, 'me'])->name('user');
    Route::post('logout', [AuthController::class, 'logout'])->name('logout');
});

// --- Back-office (authenticated + permission-gated) --------------------------
// Writes live on the same resource URLs as the public reads — no /admin/ prefix
// in the path; access is decided by permission, not by URL shape.
Route::middleware(['auth:sanctum', 'active'])->group(function (): void {
    // Dashboard — any authenticated, active account.
    Route::get('admin/dashboard', [DashboardController::class, 'show'])->name('admin.dashboard');

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

    // Resource / Insight CRUD (one table; resource_type=blog is "Insights")
    Route::get('admin/resources', [ResourceAdminController::class, 'index'])
        ->middleware('permission:content.update|content.publish')
        ->name('admin.resources.index');
    Route::get('admin/resources/{slug}', [ResourceAdminController::class, 'show'])
        ->middleware('permission:content.update|content.publish')
        ->name('admin.resources.show');
    Route::post('resources', [ResourceAdminController::class, 'store'])
        ->middleware('permission:content.create')
        ->name('resources.store');
    Route::match(['put', 'patch'], 'resources/{slug}', [ResourceAdminController::class, 'update'])
        ->middleware('permission:content.update')
        ->name('resources.update');
    Route::delete('resources/{slug}', [ResourceAdminController::class, 'destroy'])
        ->middleware('permission:content.delete')
        ->name('resources.destroy');

    // Offices / locations
    Route::get('admin/locations', [LocationAdminController::class, 'index'])
        ->middleware('permission:content.update|content.publish')
        ->name('admin.locations.index');
    Route::get('admin/locations/{slug}', [LocationAdminController::class, 'show'])
        ->middleware('permission:content.update|content.publish')
        ->name('admin.locations.show');
    Route::post('locations', [LocationAdminController::class, 'store'])
        ->middleware('permission:content.create')
        ->name('locations.store');
    Route::match(['put', 'patch'], 'locations/{slug}', [LocationAdminController::class, 'update'])
        ->middleware('permission:content.update')
        ->name('locations.update');
    Route::delete('locations/{slug}', [LocationAdminController::class, 'destroy'])
        ->middleware('permission:content.delete')
        ->name('locations.destroy');

    // Manual cache revalidation
    Route::post('admin/revalidate', [RevalidationController::class, 'store'])
        ->middleware('permission:content.publish')
        ->name('admin.revalidate');

    // Job postings (careers)
    Route::get('admin/careers', [CareerAdminController::class, 'index'])
        ->middleware('permission:content.update|content.publish')
        ->name('admin.careers.index');
    Route::get('admin/careers/{slug}', [CareerAdminController::class, 'show'])
        ->middleware('permission:content.update|content.publish')
        ->name('admin.careers.show');
    Route::get('admin/careers/{slug}/applications', [CareerAdminController::class, 'applications'])
        ->middleware('permission:inquiries.view')
        ->name('admin.careers.applications');
    Route::post('careers', [CareerAdminController::class, 'store'])
        ->middleware('permission:content.create')
        ->name('careers.store');
    Route::match(['put', 'patch'], 'careers/{slug}', [CareerAdminController::class, 'update'])
        ->middleware('permission:content.update')
        ->name('careers.update');
    Route::delete('careers/{slug}', [CareerAdminController::class, 'destroy'])
        ->middleware('permission:content.delete')
        ->name('careers.destroy');

    // Cross-taxonomy publish lifecycle (industries, regions, technologies, case-studies, practices).
    Route::get('admin/content/{type}', [ContentStatusController::class, 'index'])
        ->middleware('permission:content.update|content.publish')
        ->name('admin.content.index');
    Route::patch('admin/content/{type}/{slug}/status', [ContentStatusController::class, 'update'])
        ->middleware('permission:content.publish')
        ->name('admin.content.status');

    // Version history + rollback (P2-1) — any registered slug-keyed content type.
    Route::prefix('admin/{type}/{slug}/revisions')
        ->whereIn('type', App\Support\Content\ContentType::keys())
        ->group(function (): void {
            Route::get('/', [RevisionController::class, 'index'])
                ->middleware('permission:content.update')
                ->name('admin.revisions.index');
            Route::get('{revision}', [RevisionController::class, 'show'])
                ->middleware('permission:content.update')
                ->name('admin.revisions.show');
            Route::post('{revision}/restore', [RevisionController::class, 'restore'])
                ->middleware('permission:content.update')
                ->name('admin.revisions.restore');
        });

    // CRM / Leads — reading is `inquiries.view`; mutating status/export is `inquiries.manage`.
    Route::get('admin/leads', [LeadAdminController::class, 'index'])
        ->middleware('permission:inquiries.view')
        ->name('admin.leads.index');
    Route::get('admin/leads/{id}', [LeadAdminController::class, 'show'])
        ->middleware('permission:inquiries.view')
        ->name('admin.leads.show');
    Route::patch('admin/leads/{id}/status', [LeadAdminController::class, 'updateStatus'])
        ->middleware('permission:inquiries.manage')
        ->name('admin.leads.updateStatus');

    // Media Library
    Route::get('admin/media', [MediaAdminController::class, 'index'])
        ->middleware('permission:media.upload|media.delete')
        ->name('admin.media.index');
    Route::get('admin/media/{id}', [MediaAdminController::class, 'show'])
        ->middleware('permission:media.upload|media.delete')
        ->name('admin.media.show');
    Route::post('admin/media', [MediaAdminController::class, 'store'])
        ->middleware('permission:media.upload')
        ->name('admin.media.store');
    Route::match(['put', 'patch'], 'admin/media/{id}', [MediaAdminController::class, 'update'])
        ->middleware('permission:media.upload')
        ->name('admin.media.update');
    Route::delete('admin/media/{id}', [MediaAdminController::class, 'destroy'])
        ->middleware('permission:media.delete')
        ->name('admin.media.destroy');

    // Activity / audit log (read-only)
    Route::get('admin/audit-logs', [AuditLogController::class, 'index'])
        ->middleware('permission:audit.view')
        ->name('admin.audit-logs.index');

    // Staff accounts
    Route::get('admin/users', [UserAdminController::class, 'index'])
        ->middleware('permission:users.manage')->name('admin.users.index');
    Route::post('admin/users', [UserAdminController::class, 'store'])
        ->middleware('permission:users.manage')->name('admin.users.store');
    Route::get('admin/users/{id}', [UserAdminController::class, 'show'])
        ->middleware('permission:users.manage')->name('admin.users.show');
    Route::match(['put', 'patch'], 'admin/users/{id}', [UserAdminController::class, 'update'])
        ->middleware('permission:users.manage')->name('admin.users.update');
    Route::post('admin/users/{id}/resend-invite', [UserAdminController::class, 'resendInvite'])
        ->middleware('permission:users.manage')->name('admin.users.resend-invite');
    Route::post('admin/users/{id}/suspend', [UserAdminController::class, 'suspend'])
        ->middleware('permission:users.manage')->name('admin.users.suspend');
    Route::post('admin/users/{id}/reactivate', [UserAdminController::class, 'reactivate'])
        ->middleware('permission:users.manage')->name('admin.users.reactivate');
    Route::delete('admin/users/{id}', [UserAdminController::class, 'destroy'])
        ->middleware('permission:users.manage')->name('admin.users.destroy');

    // SEO metadata + site-wide lint
    Route::get('admin/seo/issues', [SeoController::class, 'issues'])
        ->middleware('permission:seo.update')->name('admin.seo.issues');
    Route::get('admin/seo/{type}/{slug}', [SeoController::class, 'show'])
        ->middleware('permission:content.update|seo.update')->name('admin.seo.show');
    Route::match(['put', 'patch'], 'admin/seo/{type}/{slug}', [SeoController::class, 'update'])
        ->middleware('permission:seo.update')->name('admin.seo.update');

    // Navigation menus
    Route::get('admin/navigation', [NavigationAdminController::class, 'index'])
        ->middleware('permission:navigation.update')->name('admin.navigation.index');
    Route::match(['put', 'patch'], 'admin/navigation/{menu}', [NavigationAdminController::class, 'update'])
        ->middleware('permission:navigation.update')->name('admin.navigation.update');

    // Site settings
    Route::get('admin/settings', [SettingAdminController::class, 'index'])
        ->middleware('permission:settings.manage')->name('admin.settings.index');
    Route::match(['put', 'patch'], 'admin/settings', [SettingAdminController::class, 'update'])
        ->middleware('permission:settings.manage')->name('admin.settings.update');

    // Redirects
    Route::get('admin/redirects', [RedirectAdminController::class, 'index'])
        ->middleware('permission:settings.manage')->name('admin.redirects.index');
    Route::post('admin/redirects', [RedirectAdminController::class, 'store'])
        ->middleware('permission:settings.manage')->name('admin.redirects.store');
    Route::match(['put', 'patch'], 'admin/redirects/{id}', [RedirectAdminController::class, 'update'])
        ->middleware('permission:settings.manage')->name('admin.redirects.update');
    Route::delete('admin/redirects/{id}', [RedirectAdminController::class, 'destroy'])
        ->middleware('permission:settings.manage')->name('admin.redirects.destroy');

    // Roles & permissions
    Route::get('admin/roles', [RoleAdminController::class, 'index'])
        ->middleware('permission:roles.manage')->name('admin.roles.index');
    Route::post('admin/roles', [RoleAdminController::class, 'store'])
        ->middleware('permission:roles.manage')->name('admin.roles.store');
    Route::get('admin/roles/{id}', [RoleAdminController::class, 'show'])
        ->middleware('permission:roles.manage')->name('admin.roles.show');
    Route::match(['put', 'patch'], 'admin/roles/{id}', [RoleAdminController::class, 'update'])
        ->middleware('permission:roles.manage')->name('admin.roles.update');
    Route::delete('admin/roles/{id}', [RoleAdminController::class, 'destroy'])
        ->middleware('permission:roles.manage')->name('admin.roles.destroy');

    // Pages Library — editor-only resource; no public read, so it stays under admin/.
    Route::get('admin/pages', [PageAdminController::class, 'index'])
        ->middleware('permission:content.update')
        ->name('admin.pages.index');
    Route::get('admin/pages/{id}', [PageAdminController::class, 'show'])
        ->middleware('permission:content.update')
        ->name('admin.pages.show');
    Route::match(['put', 'patch'], 'admin/pages/{id}', [PageAdminController::class, 'update'])
        ->middleware('permission:content.update')
        ->name('admin.pages.update');
});

// --- Conversion / write (throttled) -------------------------------------------
Route::middleware('throttle:leads')->group(function (): void {
    Route::post('leads', [LeadController::class, 'store'])->name('leads.store');
    Route::post('newsletter', [NewsletterController::class, 'store'])->name('newsletter.store');
    Route::post('careers/{career}/apply', [CareerController::class, 'apply'])->name('careers.apply');
    Route::post('chatbot/message', [ChatbotController::class, 'message'])->name('chatbot.message');
});
