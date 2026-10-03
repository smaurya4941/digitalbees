import Image from 'next/image';
import { ClientLogoSvg } from '@/components/brand/ClientLogoSvgs';
import type { ClientLogo } from '@/types/company';

/**
 * Used only when the logo API is unreachable — mirrors `CompanySeeder`
 * (the decks' "Client Portfolio" slides).
 */
const FALLBACK_LOGOS: Pick<ClientLogo, 'name' | 'logo_url'>[] = [
  { name: 'TeamBees', logo_url: '/brand/clients/teambees.png' },
  ...[
    'Stryker', 'Tata', 'Vocera', 'BT', 'Ananta Systems', 'QuestLabs',
    'WillWare', 'Menhood', 'Ananttam', 'Squire Technologies', 'Resmera Solutions',
  ].map((name) => ({ name, logo_url: null })),
];

function LogoMark({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (logoUrl) {
    // `unoptimized`: editors may point at any host, which `images.remotePatterns`
    // can't anticipate; logos are small enough not to need resizing.
    return (
      <Image
        src={logoUrl}
        alt={name}
        width={28}
        height={28}
        unoptimized
        className="h-7 w-auto max-w-[130px] object-contain"
      />
    );
  }

  return <ClientLogoSvg name={name} className="h-7 w-auto max-w-[130px]" />;
}

/**
 * Client logo wall (blueprint §10.1). Admin-managed via `client_logos`:
 * a logo with an uploaded image renders it, otherwise the mark is drawn from
 * the SVG set by name. `null` means the API couldn't be reached.
 */
export default function ReniusClientMarquee({ logos }: { logos: ClientLogo[] | null }) {
  const items = (logos ?? FALLBACK_LOGOS).map((l) => ({ name: l.name, logoUrl: l.logo_url }));

  if (items.length === 0) {
    return null;
  }

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
          // Copies 2 and 3 exist only to make the loop seamless.
          <div key={groupIdx} className="flex items-center shrink-0 gap-14 px-7" aria-hidden={groupIdx > 0 || undefined}>
            {items.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all text-[#0B1F3A]"
              >
                <LogoMark name={item.name} logoUrl={item.logoUrl} />
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
