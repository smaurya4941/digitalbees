import Image from 'next/image';
import type { FunctionalLeader } from '@/types/leadership';

interface LeadershipCardProps {
  leader: FunctionalLeader;
}

export default function LeadershipCard({ leader }: LeadershipCardProps) {
  // Generate initials for avatar fallback
  const initials = leader.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="rounded-2xl bg-white dark:bg-white/5 border border-hairline hover:border-brand-gold/50 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md group relative overflow-hidden">
      <div>
        {/* Top Header: Avatar + Functional Tags + LinkedIn */}
        <div className="flex items-start justify-between gap-4 mb-5">
          {/* Avatar with fallback */}
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-brand-navy/5 dark:bg-white/10 border-2 border-hairline group-hover:border-brand-gold/60 transition-colors shrink-0">
            {leader.photo_url ? (
              <Image
                src={leader.photo_url}
                alt={leader.name}
                fill
                sizes="(max-width: 640px) 64px, 72px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono font-bold text-lg text-brand-navy dark:text-brand-gold">
                {initials}
              </div>
            )}
          </div>

          {/* Functional Tags */}
          <div className="flex flex-wrap gap-1.5 justify-end">
            {leader.functional_tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded bg-brand-navy/5 dark:bg-white/10 text-brand-navy dark:text-brand-gold border border-brand-gold/25 font-mono text-[10px] font-semibold tracking-wider uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Name & Title */}
        <div className="mb-3">
          <h3 className="text-xl sm:text-2xl font-bold text-ink tracking-tight group-hover:text-brand-navy dark:group-hover:text-brand-gold transition-colors">
            {leader.name}
          </h3>
          <p className="text-sm font-semibold text-brand-gold mt-1 leading-snug">
            {leader.title}
          </p>
        </div>

        {/* Narrative Bio */}
        <p className="text-sm text-ink-muted leading-relaxed mb-5">
          {leader.bio}
        </p>
      </div>

      {/* Footer / Pedigree & LinkedIn */}
      <div className="pt-4 border-t border-hairline flex items-center justify-between gap-3 text-xs font-mono">
        {leader.pedigree ? (
          <span className="text-ink-muted truncate font-medium">
            {leader.pedigree}
          </span>
        ) : (
          <span className="text-ink-muted">
            {leader.practice_name || leader.region_name || 'TeamBees Executive'}
          </span>
        )}

        {leader.linkedin_url ? (
          <a
            href={leader.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${leader.name} on LinkedIn`}
            className="w-8 h-8 rounded-lg bg-surface-ivory dark:bg-white/10 hover:bg-brand-gold hover:text-brand-navy text-ink transition-colors flex items-center justify-center shrink-0 border border-hairline"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.6a1.66 1.66 0 0 0-1.66 1.66c0 .92.75 1.67 1.66 1.67a1.66 1.66 0 0 0 0-3.33z" />
            </svg>
          </a>
        ) : (
          <span className="text-[11px] text-ink-muted">TeamBees Verified</span>
        )}
      </div>
    </div>
  );
}
