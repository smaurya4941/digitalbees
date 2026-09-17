"use client";

import { useEffect, useRef, useState } from "react";

interface NavItem {
  id: string;
  label: string;
}

interface Props {
  items: NavItem[];
  practiceName: string;
}

/**
 * Sticky left-rail sub-navigation for Practice Hub pages.
 * Highlights the active section as user scrolls. Matches the
 * Stitch practice-hub-template.html sticky sidebar spec.
 */
export function PracticeSubNav({ items, practiceName }: Props) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sectionEls = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (sectionEls.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -50% 0px", threshold: [0, 0.25, 0.5] }
    );

    sectionEls.forEach((el) => observerRef.current!.observe(el));
    return () => observerRef.current?.disconnect();
  }, [items]);

  return (
    <aside className="hidden lg:block w-[220px] shrink-0">
      <div className="sticky top-[88px] flex flex-col gap-1">
        <p className="text-[11px] font-bold text-[#44474d] tracking-widest uppercase mb-3 pl-4">
          {practiceName}
        </p>
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block pl-4 py-2 text-[14px] font-medium border-l-2 transition-all duration-150 ${
              activeId === item.id
                ? "border-[#C6963A] text-[#C6963A] font-semibold"
                : "border-transparent text-[#44474d] hover:text-[#0B1F3A] hover:border-[#C6963A]/40"
            }`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </aside>
  );
}