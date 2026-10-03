import 'server-only';
import type { Testimonial } from '@/types/testimonial';
import { apiList } from './client';
import { cacheTags } from './tags';
import { rethrowUnlessBuild } from './build-fallback';

/**
 * Published testimonials, optionally scoped to a `related_type` tag (e.g. `home`,
 * `careers`) and, with `relatedId`, to one entity (e.g. a case study's id).
 */
export async function getTestimonials(relatedType?: string, relatedId?: number): Promise<Testimonial[]> {
  try {
    const query: Record<string, string> = {};
    if (relatedType) query.related_type = relatedType;
    if (relatedType && relatedId) query.related_id = String(relatedId);

    const { data } = await apiList<Testimonial>('testimonials', {
      query: Object.keys(query).length > 0 ? query : undefined,
      tags: [cacheTags.testimonials],
    });
    return data;
  } catch (error) {
    return rethrowUnlessBuild(error, [] as Testimonial[]);
  }
}
