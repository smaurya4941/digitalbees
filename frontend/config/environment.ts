import { z } from 'zod';

/**
 * Runtime environment contract. Parsed once, at module load, so a
 * misconfigured deploy fails fast instead of 500-ing on the first request.
 *
 * - Server-only vars have no NEXT_PUBLIC_ prefix and must never be imported
 *   into a Client Component.
 * - NEXT_PUBLIC_* vars are inlined into the browser bundle at build time.
 */
const serverSchema = z.object({
  /** Base URL of the Laravel API, reached host-to-host during SSR/ISR. */
  API_BASE_URL: z.string().url().default('http://localhost:8000/api/v1'),
  /** Shared secret the Laravel backend sends to POST /api/revalidate. */
  REVALIDATE_SECRET: z.string().min(1).optional(),
  /** Secret that unlocks Draft Mode via /api/draft?secret=... */
  DRAFT_SECRET: z.string().min(1).optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const clientSchema = z.object({
  /** Canonical public origin, e.g. https://www.teambees.com (no trailing slash). */
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  /** API base the browser calls directly (search, form posts). */
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default('http://localhost:8000/api/v1'),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
});

function parse<T extends z.ZodTypeAny>(schema: T, source: Record<string, unknown>): z.infer<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  return result.data;
}

// `process.env` access must be static-string keyed so Next can inline NEXT_PUBLIC_*.
export const clientEnv = parse(clientSchema, {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
});

/**
 * Server env. Guarded so an accidental client import throws instead of
 * silently shipping `undefined`.
 */
export function serverEnv() {
  if (typeof window !== 'undefined') {
    throw new Error('serverEnv() was called in the browser. Use clientEnv instead.');
  }
  return parse(serverSchema, {
    API_BASE_URL: process.env.API_BASE_URL,
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
    DRAFT_SECRET: process.env.DRAFT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  });
}
