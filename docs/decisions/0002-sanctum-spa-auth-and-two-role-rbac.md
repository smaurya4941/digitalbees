# 2. Sanctum SPA authentication + two-role RBAC

Date: 2026-09-04
Status: Accepted

## Context

The back-office (a section of the Next.js app under `/admin`) needs authenticated
access to the Laravel API. The public website has no accounts — visitors read
content and contact the company by email/phone.

Options considered: stateless JWT in `localStorage`, Sanctum API tokens, and
Sanctum SPA (stateful cookie) authentication.

## Decision

**Authentication — Laravel Sanctum, SPA mode.** The admin app and the API share a
site, so we use `statefulApi()` + an encrypted, HTTP-only session cookie. The
browser never stores a token, which removes the main XSS token-theft vector.
`localStorage` JWT was explicitly rejected.

**Authorization — `spatie/laravel-permission`, two roles.** `admin` and `staff`.
All real granularity lives in *permissions* (`content.create`, `content.publish`,
`content.delete`, `users.manage`, …). `admin` short-circuits every check via
`Gate::before`. Route access is enforced by `permission:` middleware; the write
endpoints sit on the same URLs as the public reads (no `/admin/` path prefix) so
access is a function of permission, not URL shape.

Accounts carry a `status` (`active` / `invited` / `suspended`); the `active`
middleware ends the session of a disabled user on their next request.

## Consequences

- CORS `supports_credentials`, `SANCTUM_STATEFUL_DOMAINS`, `SESSION_DOMAIN` and
  `SESSION_SAME_SITE` must be configured consistently per environment. Documented
  in `.env.example`.
- "Staff can edit blogs but not publish them" is a permission-assignment change
  in `RoleSeeder`, not a code change.
- A third role (e.g. `seo-manager`) is additive: new role + permission subset.
- Machine-to-machine access later can still use Sanctum tokens (`HasApiTokens`
  is retained on the `User` model) without reworking authorization.
