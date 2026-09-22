/**
 * "Skip to main content" (WCAG 2.4.1 Bypass Blocks). Visually hidden until it
 * receives keyboard focus, then pinned top-left above the fixed header.
 * The target (`#main`) must carry `tabIndex={-1}` so focus actually moves.
 */
export default function SkipLink({ targetId = 'main' }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1000] focus:rounded-full focus:bg-brand-navy focus:px-5 focus:py-3 focus:text-button focus:text-ink-inverse focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
}
