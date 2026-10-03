import Link from 'next/link';
import type { TechnologySummary } from '@/types/content';

type CaseStudyTechStackProps = {
  technologies: TechnologySummary[];
};

/** Technologies linked to this case study in the admin. Omitted when none are linked. */
export function CaseStudyTechStack({ technologies }: CaseStudyTechStackProps) {
  if (technologies.length === 0) return null;

  return (
    <section className="py-14 bg-[#071324] border-b border-white/10 text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xs font-mono text-[#C6963A] uppercase tracking-widest mb-6 font-bold">
          Technology stack
        </h2>
        <ul className="flex flex-wrap gap-3">
          {technologies.map((tech) => (
            <li key={tech.slug}>
              <Link
                href={tech.href}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-[#C6963A]/50 transition-colors rounded-lg font-mono text-sm font-medium text-white/90"
              >
                {tech.name}
                <span className="material-symbols-outlined text-[16px] text-[#C6963A]" aria-hidden>
                  arrow_outward
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
