const TRUST_ITEMS = [
  '5–7 DAY RESOURCE TURNAROUND',
  '2 BUSINESS DAYS TYPICAL SHORTLIST',
  '78% AVG PROCESSING-TIME REDUCTION',
  '99.9% UPTIME SLA',
  'SOC2 TYPE II & ISO 27001 AUDITED',
  'IR35 & W2/C2C COMPLIANT HUBS',
];

export default function ReniusTrustStrip() {
  return (
    <div className="w-full bg-[#0B1F3A] text-white py-3.5 overflow-hidden border-t border-b border-[#0B1F3A]/20">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(4)].map((_, groupIndex) => (
          <div key={groupIndex} className="flex items-center shrink-0">
            {TRUST_ITEMS.map((text, idx) => (
              <div key={idx} className="flex items-center mx-6">
                <span className="font-mono text-xs font-bold tracking-widest uppercase text-white/90">
                  {text}
                </span>
                <span className="ml-6 text-[#C6963A] text-xs font-bold">✦</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
