"use client";

import { useState } from "react";
import type { Faq } from "@/types/practice";

interface Props {
  faqs: Faq[];
  practiceName: string;
}

/**
 * FAQ accordion — styled for the practice hub (Navy/Gold theme).
 */
export function PracticeFaq({ faqs, practiceName }: Props) {
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null);

  if (faqs.length === 0) return null;

  return (
    <section className="py-10" id="faq">
      <div className="flex items-center gap-2 text-[#C6963A] text-[12px] font-bold mb-1">
        <span className="w-2 h-0.5 bg-[#C6963A] inline-block" />
        FAQ
      </div>
      <h2 className="text-[24px] leading-[32px] font-bold text-[#0B1F3A] mb-8">
        {practiceName} — frequently asked questions
      </h2>

      <div className="flex flex-col gap-3 max-w-3xl">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="overflow-hidden rounded-xl border border-[#c4c6ce]/30 bg-white"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-[16px] font-semibold text-[#0B1F3A]">{faq.question}</span>
                <span
                  className={`material-symbols-outlined text-[20px] text-[#44474d] transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
                >
                  expand_more
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-[14px] leading-[20px] text-[#44474d]">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}