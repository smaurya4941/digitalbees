import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { serverEnv } from '@/config/environment';

/**
 * On-demand cache invalidation. The Laravel backend calls this after content
 * changes (App\Jobs\NotifyFrontendRevalidate) with:
 *
 *   POST /api/revalidate
 *   x-revalidate-secret: <REVALIDATE_SECRET>
 *   { "tags": ["practices", "practice:ai-bees"], "paths": ["/practices"] }
 */
export async function POST(request: Request): Promise<NextResponse> {
  const secret = serverEnv().REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json({ error: 'Revalidation is not configured.' }, { status: 503 });
  }

  if (request.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json({ error: 'Invalid secret.' }, { status: 401 });
  }

  let body: { tags?: unknown; paths?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const tags = toStringArray(body.tags);
  const paths = toStringArray(body.paths);

  if (tags.length === 0 && paths.length === 0) {
    return NextResponse.json({ error: 'Provide `tags` and/or `paths`.' }, { status: 422 });
  }

  // Next 16: revalidateTag requires a cache-life profile; `{ expire: 0 }`
  // purges immediately, which is what an editor "publish" wants.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  for (const path of paths) revalidatePath(path);

  return NextResponse.json({ revalidated: true, tags, paths, at: Date.now() });
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
}
