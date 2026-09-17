import type { PracticeDetail } from "@/types/practice";

interface Props { practice: PracticeDetail }

/**
 * Tech stack section — pill-tag grid for technologies + framework stack table.
 * Matches Stitch practice hub Section 6 pattern.
 */
export function PracticeTechStack({ practice }: Props) {
  const technologies = practice.technologies ?? [];
  const frameworkStack = practice.framework_stack ?? [];

  if (technologies.length === 0 && frameworkStack.length === 0) return null;

  return (
    <section className="py-10" id="tech-stack">
      <div className="flex items-center gap-2 text-[#C6963A] text-[12px] font-bold mb-1">
        <span className="w-2 h-0.5 bg-[#C6963A] inline-block" />
        TECHNOLOGY STACK
      </div>
      <h2 className="text-[24px] leading-[32px] font-bold text-[#0B1F3A] mb-6">
        Platforms and tools we build on
      </h2>

      {/* Tech pill tags */}
      {technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {technologies.map((tech) => (
            <span
              key={tech.id}
              className="px-3 py-1.5 rounded-lg bg-[#f2f3f9] border border-[#c4c6ce]/30 text-[14px] font-medium text-[#0B1F3A] hover:border-[#C6963A]/50 transition-colors"
            >
              {tech.name}
            </span>
          ))}
        </div>
      )}

      {/* Framework stack table */}
      {frameworkStack.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-[#c4c6ce]/30">
          <table className="min-w-full text-[14px]">
            <thead>
              <tr className="bg-[#0B1F3A] text-white">
                <th className="text-left px-5 py-3 font-semibold text-[12px] uppercase tracking-wider text-[#C6963A]">
                  Category
                </th>
                <th className="text-left px-5 py-3 font-semibold text-[12px] uppercase tracking-wider text-[#C6963A]">
                  Tools &amp; Frameworks
                </th>
              </tr>
            </thead>
            <tbody>
              {frameworkStack.map((row, idx) => (
                <tr
                  key={row.category}
                  className={idx % 2 === 0 ? "bg-white" : "bg-[#f8f9ff]"}
                >
                  <td className="px-5 py-3 font-semibold text-[#0B1F3A]">{row.category}</td>
                  <td className="px-5 py-3 text-[#44474d]">{row.tools.join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}