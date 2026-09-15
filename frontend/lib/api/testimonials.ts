import 'server-only';
import type { Testimonial } from '@/types/testimonial';
import { apiList } from './client';
import { cacheTags } from './tags';
import { rethrowUnlessBuild } from './build-fallback';

/** Published testimonials, optionally scoped to a `related_type` tag (e.g. `home`, `careers`). */
export async function getTestimonials(relatedType?: string): Promise<Testimonial[]> {
  try {
    const { data } = await apiList<Testimonial>('testimonials', {
      query: relatedType ? { related_type: relatedType } : undefined,
      tags: [cacheTags.testimonials],
    });
    return data;
  } catch (error) {
    return rethrowUnlessBuild(error, [] as Testimonial[]);
  }
}
