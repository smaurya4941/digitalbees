import type { PracticeDetail } from "@/types/practice";

interface Props { practice: PracticeDetail }

/**
 * Delivery process — connected-step workflow matching Stitch Section 5.
 * Gold-ringed step badges with horizontal connector on desktop.
 */
export function PracticeProcess({ practice }: Props) {
  const steps = practice.how_we_work ?? [];
  if (steps.length === 0) return null;

  return (
    <section className="py-10 bg-[#f2f3f9] rounded-2xl px-8 md:px-12" id="how-we-work">
      <div className="flex items-center gap-2 text-[#C6963A] text-[12px] font-bold mb-1">
        <span className="w-2 h-0.5 bg-[#C6963A] inline-block" />
        DELIVERY FRAMEWORK
      </div>
      <h2 className="text-[24px] leading-[32px] md:text-[32px] md:leading-[40px] font-bold text-[#0B1F3A] mb-8">
        A delivery model built for enterprise scale
      </h2>

      <ol className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, idx) => (
          <li key={step.step} className="relative flex gap-4 lg:flex-col lg:gap-3">
            <div className="relative flex flex-col items-center">
              <span className="grid w-10 h-10 shrink-0 place-items-center rounded-full border-2 border-[#C6963A] bg-white text-[14px] font-bold text-[#0B1F3A] z-10">
                {String(step.step).padStart(2, "0")}
              </span>
              {idx < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-10 left-1/2 hidden h-[calc(100%+2rem)] w-px -translate-x-1/2 bg-[#e7e8ee] lg:block lg:top-5 lg:left-[calc(50%+1.25rem)] lg:h-px lg:w-[calc(100%+2rem)] lg:translate-x-0"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1 pb-2 lg:pb-0">
              <h3 className="text-[16px] leading-[22px] font-bold text-[#0B1F3A]">{step.title}</h3>
              <p className="text-[14px] leading-[20px] text-[#44474d]">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}