import 'server-only';
import type { Faq } from '@/types/practice';
import { apiList } from './client';
import { cacheTags } from './tags';
import { rethrowUnlessBuild } from './build-fallback';

/** Published general FAQs (not attached to a practice or sub-service), admin order. */
export async function getGeneralFaqs(): Promise<Faq[]> {
  try {
    const { data } = await apiList<Faq>('faqs', { tags: [cacheTags.faqs] });
    return data ?? [];
  } catch (error) {
    return rethrowUnlessBuild(error, [] as Faq[]);
  }
}
