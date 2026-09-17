import Link from "next/link";
import type { PracticeDetail } from "@/types/practice";

interface Props { practice: PracticeDetail }

const SERVICE_ICONS = [
  "smart_toy", "auto_awesome", "memory", "alt_route",
  "schema", "cable", "hub", "dataset",
];

/**
 * Sub-service card grid — Stitch Section 3 pattern.
 * Navy icon background, gold hover border, arrow link.
 */
export function PracticeServiceGrid({ practice }: Props) {
  if (!practice.services || practice.services.length === 0) return null;

  return (
    <section className="space-y-6 py-10" id="services">
      <div>
        <div className="flex items-center gap-2 text-[#C6963A] text-[12px] font-bold mb-1">
          <span className="w-2 h-0.5 bg-[#C6963A] inline-block" />
          CAPABILITY ARCHITECTURE
        </div>
        <h2 className="text-[24px] leading-[32px] md:text-[32px] md:leading-[40px] font-bold text-[#0B1F3A]">
          Core Capabilities &amp; Sub-Services
        </h2>
        <p className="text-[16px] leading-[24px] text-[#44474d] mt-1">
          Comprehensive delivery across every layer of the {practice.name} stack. Explore dedicated sub-services:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {practice.services.map((service, idx) => (
          <div
            key={service.id}
            className="bg-[#FDFDFD] p-6 rounded-xl border border-[#c4c6ce]/40 hover:border-[#C6963A] transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded bg-[#071527] text-[#C6963A] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[22px]">
                  {SERVICE_ICONS[idx % SERVICE_ICONS.length]}
                </span>
              </div>
              <h3 className="text-[20px] leading-[28px] font-bold text-[#0B1F3A] group-hover:text-[#C6963A] transition-colors">
                {service.name}
              </h3>
              {service.summary && (
                <p className="text-[14px] leading-[20px] text-[#44474d] mt-2">
                  {service.summary}
                </p>
              )}
            </div>
            <Link
              href={service.href ?? `/practices/${practice.slug}/${service.slug}`}
              className="mt-6 inline-flex items-center gap-1 text-[12px] font-bold text-[#0B1F3A] hover:text-[#C6963A] transition-colors"
            >
              Explore {service.name}
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}