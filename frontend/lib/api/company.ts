import 'server-only';
import type { ClientLogo, CompanyMilestone, Partner, TeamMember } from '@/types/company';
import { apiList } from './client';
import { cacheTags } from './tags';
import { rethrowUnlessBuild } from './build-fallback';

/** Published leadership bios (blueprint §26.1) — empty until entered via the admin CMS. */
export async function getLeadership(): Promise<TeamMember[]> {
  try {
    const { data } = await apiList<TeamMember>('company/leadership', { tags: [cacheTags.company] });
    return data;
  } catch (error) {
    return rethrowUnlessBuild(error, [] as TeamMember[]);
  }
}

/** Published technology/alliance/certification partners — empty until entered via the admin CMS. */
export async function getPartnerships(): Promise<Partner[]> {
  try {
    const { data } = await apiList<Partner>('company/partnerships', { tags: [cacheTags.company] });
    return data;
  } catch (error) {
    return rethrowUnlessBuild(error, [] as Partner[]);
  }
}

/**
 * The client logo wall. `null` when the backend is unreachable, so callers can
 * tell "no logos published" (`[]`) from "couldn't ask" and fall back only then.
 */
export async function getClientLogos(): Promise<ClientLogo[] | null> {
  try {
    const { data } = await apiList<ClientLogo>('company/client-logos', { tags: [cacheTags.company] });
    return data;
  } catch {
    return null;
  }
}

/** The "Our Story" timeline. */
export async function getCompanyMilestones(): Promise<CompanyMilestone[]> {
  try {
    const { data } = await apiList<CompanyMilestone>('company/our-story', { tags: [cacheTags.company] });
    return data;
  } catch (error) {
    return rethrowUnlessBuild(error, [] as CompanyMilestone[]);
  }
}
