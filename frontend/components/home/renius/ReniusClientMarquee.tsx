import { ClientLogoSvg } from '@/components/brand/ClientLogoSvgs';

const CLIENT_NAMES = [
  'stryker',
  'tata',
  'bt',
  'vocera',
  'questlabs',
  'willware',
  'anantasystems',
  'ananttam',
  'menhood',
  'resmera',
  'squire',
];

export default function ReniusClientMarquee() {
  return (
    <section className="py-16 bg-white border-b border-[#CBDFF2] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 mb-8 text-center">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
          Trusted by Fortune 500 Leaders &amp; Rapid-Growth Technology Scaleups
        </span>
      </div>

      {/* Looping Horizontal Client Logo Marquee */}
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(3)].map((_, groupIdx) => (
          <div key={groupIdx} className="flex items-center shrink-0 gap-14 px-7">
            {CLIENT_NAMES.map((name) => (
              <div
                key={name}
                className="flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all text-[#0B1F3A]"
              >
                <ClientLogoSvg name={name} className="h-7 w-auto max-w-[130px]" />
              </div>
            ))}
            <div className="font-mono text-xs font-bold text-[#9E6D18] bg-[#EAF2FB] px-3 py-1.5 rounded-full border border-[#CBDFF2] shrink-0">
              + Many More
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
