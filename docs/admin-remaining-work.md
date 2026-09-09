# Admin panel — remaining work (handoff)

**Branch:** `feat/admin-production-p0-p1` (15 commits, `5d90f9b`..`424e6b2`)
**State:** backend `php artisan test` → 114 passing · frontend `pnpm build` + `tsc` + `eslint` + `pint` green · dev DB reseeded.
**Full plan:** `C:\Users\ASUS\.claude\plans\explore-admin-section-completely-magical-moth.md`

This doc is the delta: what is **not** done, per phase, with enough detail to pick up cold.

---

## How the codebase is wired now (read this first)

**Backend content-type recipe** (used by Resource, Career, Location this session — copy it):
1. Model `use IsContentEntity` (slug route key, `status` cast, `published()` scope, polymorphic `seo()`) `+ Auditable` `+ SoftDeletes` if the table has it.
2. `Repositories/Contracts/XRepository` + `Repositories/Eloquent/EloquentXRepository`.
3. `Services/XService` (back-office create/update/delete → `NotifyFrontendRevalidate::dispatch([...])`; public list/detail).
4. `Providers/XServiceProvider` with `public array $bindings` — **register in `backend/bootstrap/providers.php`**.
5. `Http/Controllers/Api/V1/Admin/XAdminController` — `use GuardsPublishing, RecordsSlugRedirect`. `index()` uses `App\Support\Http\AdminListQuery::for($request, X::class, [$searchable], [$sortable])->paginate(AdminListQuery::perPage($request))` → `ApiResponse::page($paginator, fn ($m) => (new XAdminResource($m))->resolve(), ['statuses' => ...])`.
6. Public `Http/Controllers/Api/V1/XController` (replace any `ApiResponse::notImplemented` stub).
7. `StoreXRequest` / `UpdateXRequest` (Update ignores own slug on the unique rule).
8. `XAdminResource` + `XPublicResource` (public never leaks drafts/internal columns).
9. Routes in `backend/routes/api/v1.php`: `GET admin/x` + `GET admin/x/{slug}` (`content.update|content.publish`), `POST x` (`content.create`), `PUT|PATCH x/{slug}` (`content.update`), `DELETE x/{slug}` (`content.delete`).
10. Wire into: `ContentStatusController::TYPES`, `SeoController::TYPES` (per-entity SEO panel), `DashboardService::CONTENT_TYPES` (only if status is draft/published/archived), `AppServiceProvider` morph map (`'x' => X::class`), `RecordsSlugRedirect` prefix in the controller `update()`.
11. Feature test mirroring `ResourceAdminTest` / `CareerAdminTest`.

**Frontend content-type recipe:**
- `lib/admin/x.ts` — types + `xQueryKeys {all, list(filters), detail(slug)}` + `listX(filters, signal) → adminApi.getPage<AdminX>('admin/x', {query})`, `getX`, `createX`/`updateX`/`setXStatus`/`deleteX`.
- `app/admin/x/page.tsx` — `<TaxonomyListPage<AdminX>>` config (has `extraQuery` + `toolbarExtra` slots for extra filters; see `resources/page.tsx`, `locations/page.tsx`). Non-standard status (Careers) → bespoke page using `DataTable` + `ListToolbar` (`statusOptions` prop) + `Pagination` + `ConfirmDialog` — see `careers/page.tsx`.
- `app/admin/x/new/page.tsx` (permission-gated wrapper) + `app/admin/x/[slug]/page.tsx` (fetch → `<XForm x={data}/>` + `<SeoPanel type="x" slug={data.slug}/>`).
- `components/admin/XForm.tsx` — RHF + zod + `useMutation` + `useToast`, auto-slug from name/title, 422 → `setError` per field. Copy `ResourceForm.tsx`.
- Nav item in `components/admin/AdminShell.tsx` (`primaryNav` for content, `adminNav` for admin tools; `adminNav` items filter by `permission` via `useAuth().can`).

**Key shared pieces:**
| Thing | Path |
|---|---|
| List query shaping (`?q`/`?status`/`?sort`) | `backend/app/Support/Http/AdminListQuery.php` |
| Pagination envelope | `ApiResponse::page()` in `backend/app/Support/Http/ApiResponse.php` |
| Publish gate / slug-redirect traits | `backend/app/Http/Controllers/Api/V1/Admin/Concerns/` |
| Audit trail | `backend/app/Support/Concerns/Auditable.php` + `App\Support\Models\AuditLog` |
| adminApi client | `frontend/lib/admin/http.ts` — `get` / `getPage` / `getEnvelope` / `post`/`put`/`patch`/`delete`; `{query}` + `FormData` supported |
| List primitives | `frontend/components/admin/{DataTable,Pagination,ListToolbar,ConfirmDialog,TaxonomyListPage}.tsx` |
| Per-entity SEO | `frontend/components/admin/SeoPanel.tsx` ↔ `backend/.../Admin/SeoController.php` |

**Migrations added this session** (all on the branch): `assets` metadata (alt_text/width/height/uploaded_by), `assets.folder`, `users` invitation columns (`invitation_token`/`invitation_sent_at`/`last_login_at`), `locations.slug`.

**Deploy/ops:** a **queue worker** is required (`NotifyFrontendRevalidate` is `ShouldQueue`; run a worker or set `QUEUE_CONNECTION=sync`). Secrets: `FRONTEND_REVALIDATE_URL` + `FRONTEND_REVALIDATE_SECRET` (backend) / `REVALIDATE_SECRET` (frontend), `MEDIA_DISK`, `NEXT_PUBLIC_ADMIN_SESSION_COOKIE` (default `teambees-session`), `MAIL_MAILER` (currently `log` — invites just log), Sanctum stateful domains must include the admin origin.

---

## P0 — 4 items remain (all minor / test-debt)

### P0-a · Frontend test infrastructure  *(biggest P0 gap)*
There are **zero frontend tests**. `package.json` already has `vitest`, `@testing-library/react`, `jsdom`, `msw`.
- Add `vitest.config.ts` (jsdom env, setup file with `@testing-library/jest-dom`).
- Add `"test": "vitest"` script.
- Smoke tests: `AuthProvider.can()` (admin short-circuit, permission array, null user); `adminApi` (envelope unwrap, 419 re-prime+retry, querystring build, `FormData` passthrough); one `*Form.tsx` 422 → field-error mapping; `proxy.ts` cookie gate via `next/experimental/testing/server` `unstable_doesProxyMatch`.

### P0-b · Pages admin: `store` + `destroy`
`PageAdminController` is `index`/`show`/`update` only. Add `store` (create a page: url_path + template + title) and `destroy`. Routes under `admin/pages`. Frontend: "New page" button + delete on `app/admin/pages/`. (Pages are currently seed-only.)

### P0-c · Unify the status-change convention
`frontend/lib/admin/{practices,industries,regions,technologies,case-studies}.ts` `setXStatus()` currently `PUT`s the resource endpoint with `{status}`. The plan wants all status changes through `PATCH /admin/content/{type}/{slug}/status` (that endpoint exists and works). Cosmetic — both paths are permission-gated and tested. Low priority.

### P0-d · Dedicated CRUD authz tests for Industry/Region/Technology/CaseStudy admin controllers
Currently covered indirectly by `PracticeAdminTest` (shared pattern) + `TaxonomyAdminListTest` (list behavior across all 5). Add per-type CRUD tests like `PracticeAdminTest` for completeness.

---

## P1 — done except editor richness + a few extras

**Done:** audit log · granular RBAC + role editor · users (invite/suspend) · dashboard · settings · navigation editor · redirects (+ auto-301 on slug change) · SEO fields + lint · taxonomy pagination/search · list primitives · Resources/Insights · Careers (+ applications) · Offices/Locations · manual revalidation · media folders + usage tracking.

### P1-a · Rich text editing  *(TipTap — needs a lib decision, plan §"decisions" #5)*
Content bodies are plain `<Textarea class="font-mono">`: Resource `body`, Career `description`, Page `sections` JSON.
- Build `components/admin/RichTextEditor.tsx` (TipTap `@tiptap/react` + starter-kit + link + image; **store JSON**, add a renderer on the public Next.js site).
- CDN/deps: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`.
- Wire into `ResourceForm`, `CareerForm`, and (with P2-5) page blocks.

### P1-b · MediaPicker
Images are entered as URL / numeric asset-ID text inputs today (`SeoPanel` `og_image_id`, `CaseStudyForm` `hero_image`, practice/industry `icon`).
- `components/admin/MediaPicker.tsx` — modal over `GET /admin/media` (already paginated + folder-filtered) + inline upload; returns `{id, url}`.
- Replace the ID/URL inputs in `SeoPanel`, `CaseStudyForm`, and any `*_image` field.

### P1-c · RelationPicker + entity-relations editor
`entity_relations` is **seed-only** (`EntityRelationSeeder`). No UI to link practices↔industries↔technologies↔case-studies↔regions.
- Backend: `EntityRelationController` — `GET/PUT /admin/{type}/{slug}/relations` (grouped by `relation_type` ∈ `related|featured|primary|delivered-in|built-with`), `content.update`. Validate target exists + published + vocabulary per subject type. Revalidate both ends.
- Frontend: `components/admin/RelationsPanel.tsx` (one async multi-select per relation type) embedded in each `*Form.tsx` edit page (like `SeoPanel`).
- (This is also P2-6 — same work.)

### P1-d · Practice sub-services CRUD
`Practice.sub_services_count` is read-only; `SubService` model exists, only surfaced via the public practice detail.
- Backend: `SubServiceAdminController` under `POST/PUT/DELETE practices/{practiceSlug}/sub-services/{sub?}`, `SubServiceRequest`, service methods, reorder. `content.*` gated. Route key is scoped (slug unique within practice).
- Frontend: a `SubServiceList` panel inside `PracticeForm` (add / edit / reorder / delete), or nested pages under `app/admin/practices/[slug]/sub-services/`.

### P1-e · FormShell extraction
`PracticeForm`, `IndustryForm`, `RegionForm`, `TechnologyForm`, `CaseStudyForm`, `ResourceForm`, `CareerForm`, `LocationForm`, `PageForm` repeat the RHF + `useMutation` + toast + 422-mapping + auto-slug + cancel/save-bar wiring. Extract `components/admin/FormShell.tsx` + a `useAdminForm` hook + `SlugInput.tsx`.

### P1-f · Media library — remaining upgrades
- **Nested folders** (currently one flat `folder` label). `media_folders` table + `folder_id` FK if you want a tree.
- **Thumbnails / responsive variants** — add `intervention/image`, generate `thumb`/`md` webp on upload, store in `assets.variants` JSON (add column). Dimensions are already captured via `getimagesize`.
- **SVG** is currently rejected outright (acceptable minimum). To allow it, add `enshrined/svg-sanitize` and sanitize on upload.
- **Checksum dedup** — `assets.checksum` (sha256), reject/point-to-existing on duplicate upload.
- **Deeper usage detection** — `MediaService::usages()` only checks `seo_metadata.og_image_id` today. Also scan the polymorphic `media` pivot and content bodies for the asset URL. (Once MediaPicker writes to the `media` pivot this gets easier.)

### P1-g · Smaller extras
- **SEO lint**: add the "duplicate meta_title / slug across published rows" check to `SeoLintService`.
- **Audit coverage**: apply `Auditable` to `User`, `App\Modules\Page\Models\Setting`, `App\Modules\Page\Models\NavigationItem` (currently unaudited; add `'setting'` / `'navigation_item'` / `'user'` to the morph map — `'user'` is already mapped). Redact `password` (the trait already excludes it).
- **Supporting content admin** (from the exploration, never firmly scoped as P1): Testimonials, Team members, Partners, FAQ. Tables exist (`testimonials`, `team_members`, `partners`, `faqs`), no admin. Only do if the content team needs it.

### P1-h · Lead capture is still a STUB  *(important — the Leads inbox has no real data path)*
`LeadController::store` returns a fake payload and never persists. The Leads admin inbox (`/admin/leads`) reads a table only populated by seeders/manually.
- Backend: `StoreLeadRequest` (move inline rules; honeypot `company_website` prohibited), `LeadService::capture()` (persist, resolve `source_page_id`, store `utm`/`ip`), `LeadScoringService::score()`, `App\Integrations\Crm\Jobs\SyncLeadToCrm` (writes `crm_sync_logs`, sets `synced`/`failed`, retry+backoff), a `CrmClient` contract + `NullCrmClient` + one real provider behind `integrations` config.
- Wire `LeadController::store` → capture → score → dispatch job → `202`.
- Admin: add re-sync trigger, notes, assignment to `LeadAdminController` + `app/admin/leads/[id]/page.tsx` (also fix the stale-detail bug there: `onSuccess` invalidates `leadQueryKeys.all` but not `.detail(id)` — patch the detail cache like the other slices do).

---

## P2 — nothing started

`content.review` / `content.approve` permissions were **already added to `RoleSeeder`** in slice 5 (unused) and `reviewer` role holds them.

### P2-1 · Revisions / versioning + rollback
- Migration `content_revisions` (`revisionable_type/id`, `author_id`, `data` JSON snapshot of columns + seo + relations, `summary`, `created_at`). **JSON snapshots**, not shadow tables (plan decision #3).
- `App\Support\Concerns\HasRevisions` — `snapshot()` on every service `update()` (before applying); `revertTo()` replays `data` through the same service `update()`. Retention: keep last N (`config revisions.keep`).
- `GET /admin/{type}/{slug}/revisions`, `GET .../revisions/{id}` (diff vs current), `POST .../revisions/{id}/restore` (`content.update`; publish-affecting restore → `content.publish`). Audit-log the restore.
- Frontend: `components/admin/RevisionHistory.tsx` — drawer/tab on every editor with a field-level + rich-text diff and "Restore".

### P2-2 · Review / approval workflow
- Migration `add_workflow_state_to_content_tables` — `workflow_state enum('draft','in_review','approved','scheduled','published','archived') default 'draft'` **+ `scheduled_for` timestamp** on the 5 taxonomy tables + resources + careers(map) + locations + pages. Backfill from `status`. **Keep `status` as the pure public-visibility flag** (plan decision #4).
- `App\Support\Enums\WorkflowState` + `App\Support\Workflow\WorkflowStateMachine` (transition map + per-transition permission guard). Transitions: `draft→in_review` (`content.update`), `in_review→approved`/`in_review→draft` (`content.approve`/reject), `approved→published` (sets `status=published`, stamps `published_at`, revalidates), `approved→scheduled` (+`scheduled_for`), `published→archived`, `*→draft` (unpublish).
- `App\Support\Concerns\HasWorkflow` trait — `transitionTo()`; writes a `content_reviews` row on review/approve (table exists; add an `action` column).
- `WorkflowController` — `POST /admin/{type}/{slug}/transition {to, notes?}`, `GET /admin/workflow/queue` (everything `in_review`). Fold `updateStatus` + `ContentStatusController` status changes into the state machine (it's currently any→any).
- Frontend: `components/admin/WorkflowBar.tsx` (replaces the `status` `<select>` in every form — `status` becomes read-only), `app/admin/review-queue/page.tsx`. Update every existing admin test (status now via transition).

### P2-3 · Scheduled publishing  *(depends on P2-2)*
- `App\Console\Commands\PublishScheduledContent` — finds `workflow_state=scheduled AND scheduled_for <= now()`, transitions to `published` via the state machine (system actor), revalidates. Register `->everyMinute()`. Needs the scheduler cron running.

### P2-4 · Next.js Draft Mode preview  *(no design exists — build the token exchange)*
1. Admin "Preview" button → `POST /admin/{type}/{slug}/preview-token` (`content.update`) → `{url: "<FRONTEND_URL>/api/preview?token=..."}` where `token` = HMAC of `{type, slug, exp}` signed with `config('frontend.preview.secret')` (mirror the revalidate-secret pattern), ~30 min TTL, shared link (plan decision).
2. **Create** `frontend/app/api/preview/route.ts` — verify HMAC + expiry, `draftMode().enable()`, redirect to the real path. `frontend/app/api/preview/exit/route.ts` — `draftMode().disable()`.
3. Public fetchers (`frontend/lib/api/*.ts`) — when `draftMode().isEnabled`, add `?preview=1` + `cache: 'no-store'`.
4. Backend read controllers (`PracticeController@show` etc.) — accept `?preview=1` **only** with a valid token/authenticated admin; then `->withPreview($request)` on the repo to bypass `published()`.
5. `frontend/components/PreviewBanner.tsx` ("Exit preview"), `noindex` on `/api/preview*`.
- **Verify `draftMode()` in `node_modules/next/dist/docs/`** — this Next version (16.x) differs from training data; `middleware` is now `proxy.ts`.

### P2-5 · Structured content-block editor
`page_sections` is currently raw free-JSON per key (edited as `<Textarea>` in `PageForm`).
- `backend/app/Modules/Page/Blocks/` — `BlockType` enum + per-type schema (Hero, RichText, Stats, Cards, LogoGrid, Steps, Testimonial, ImageText, CaseStudies, CTA, FAQ) + `BlockRegistry`.
- `PageAdminController` — `PUT admin/pages/{id}/sections` validates each block's `content` against its schema, upserts one row per block (use `section_key` for order + type), prunes removed. Add `page_sections.block_type` column.
- Frontend: `components/admin/blocks/` (one editor per type) + `BlockEditor.tsx` host (add-block menu, drag-reorder via `@dnd-kit`, collapse, visibility). Uses `RichTextEditor` + `MediaPicker`.

### P2-6 · Entity-relations editor
Same as **P1-c** above — do it once.

### P2-7 · Remaining content types
Mostly done in P1 (Resources/Careers/Locations). Left: **Practice sub-services** (P1-d), and Career applications need status transitions (`reviewed/shortlisted/rejected/hired`) — currently a read-only list at `/admin/careers/{slug}/applications`.

### P2-8 · Bulk operations
- `DataTable` — add row-selection checkboxes (`components/admin/DataTable.tsx`).
- Backend `BulkActionController` — `POST admin/{type}/bulk {action: publish|archive|delete, ids|slugs}`. Each item through the normal service/state-machine path (permission per item). Chunk + queue for large sets → `202` + poll; sync for < 50. Per-id result report.
- Frontend `BulkActionBar.tsx` (appears when rows selected).

### P2-9 · CSV export
- `ExportController` — `GET admin/{type}/export?<same filters as list>` → streamed CSV (`response()->streamDownload` + `LazyCollection`). Also `admin/leads/export` (`inquiries.manage`), `admin/audit-logs/export`. Large → queue + emailed signed link.
- Frontend: "Export" button on list toolbars (hits the URL with current `searchParams`).

---

## Suggested order for the next session

1. **P1-h lead capture** (real data path — the Leads inbox is currently decorative) + fix the lead-detail cache bug.
2. **P1-a RichTextEditor** + **P1-b MediaPicker** (unblock decent content editing; both feed P2-5).
3. **P1-e FormShell** (pay down the 9× form duplication before adding more).
4. **P2-1 revisions** + **P2-2 workflow** together (the backbone — `content.review`/`content.approve` already seeded).
5. **P2-4 draft-mode preview**.
6. **P1-c / P2-6 relations editor**, **P1-d sub-services**, **P2-5 blocks**.
7. **P2-8 bulk** + **P2-9 export** (cheap once `DataTable` selection exists).
8. **P0-a frontend tests** — ideally sooner, but at minimum before merge.
9. Media polish (P1-f), audit coverage + SEO dup check (P1-g).
