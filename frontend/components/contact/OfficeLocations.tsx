import { MapPin, Clock, Globe2, ExternalLink } from 'lucide-react';

interface OfficeHub {
  city: string;
  country: string;
  role: string;
  address: string;
  isVerifiedAddress: boolean;
  timezone: string;
  hours: string;
  mapLink?: string;
  specialization: string;
}

const GLOBAL_HUBS: OfficeHub[] = [
  {
    city: 'Gurugram',
    country: 'India',
    role: 'Global Center of Excellence & ODC',
    address: '337-338, Block-B3, Spaze i-Tech Park, Sector 49, Gurugram, HR 122018',
    isVerifiedAddress: true,
    timezone: 'IST (UTC+5:30)',
    hours: 'Mon–Fri: 9:00 AM – 7:00 PM IST · 24/7 NOC',
    mapLink: 'https://maps.google.com/?q=Spaze+i-Tech+Park+Gurugram',
    specialization: 'Core Delivery Pods, ServiceNow CoE & AI Research Lab',
  },
  {
    city: 'Chicago',
    country: 'United States',
    role: 'US Delivery & Corporate Headquarters',
    address: '200 E 75th Street, Chicago, IL 60619',
    isVerifiedAddress: true,
    timezone: 'CST (UTC-6)',
    hours: 'Mon–Fri: 8:30 AM – 6:00 PM CST',
    mapLink: 'https://maps.google.com/?q=200+E+75th+Street+Chicago+IL',
    specialization: 'Client Governance, Onshore Advisory & North American Accounts',
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    role: 'APAC Financial Node & Regional Hub',
    address: 'Marina Bay Financial District (Regional Concierge Desk)',
    isVerifiedAddress: false,
    timezone: 'SGT (UTC+8)',
    hours: 'Mon–Fri: 9:00 AM – 6:00 PM SGT',
    specialization: 'FinTech Architecture, Cross-Border Compliance & ASEAN Pods',
  },
  {
    city: 'Dubai',
    country: 'United Arab Emirates',
    role: 'Middle East & Energy Hub',
    address: 'DIFC Financial Free Zone (Regional Concierge Desk)',
    isVerifiedAddress: false,
    timezone: 'GST (UTC+4)',
    hours: 'Mon–Fri: 9:00 AM – 6:00 PM GST',
    specialization: 'Commodities Trading, CTRM Advisory & Sovereign Solutions',
  },
];

export default function OfficeLocations() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-label-sm font-semibold uppercase tracking-wider text-brand-gold-deep">
              <Globe2 className="h-3.5 w-3.5" />
              Global Footprint
            </div>
            <h2 className="mt-3 text-headline-xl font-bold text-[#0B1F3A]">
              Our Regional Delivery Hubs
            </h2>
            <p className="mt-2 text-body-md text-ink-muted max-w-2xl">
              TeamBees operates across four strategic regions, providing localized governance with distributed 24/7 global delivery capacity.
            </p>
          </div>

          <div className="mt-4 md:mt-0 text-xs text-ink-muted">
            Corporate General: <span className="font-semibold text-[#0B1F3A]">info@teambeescorp.com</span>
          </div>
        </div>

        {/* 4 Hubs Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GLOBAL_HUBS.map((hub) => (
            <div
              key={hub.city}
              className="flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-brand-navy hover:shadow-md"
            >
              <div>
                {/* Header with status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-brand-navy">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-title-md font-bold text-[#0B1F3A] leading-tight">
                        {hub.city}
                      </h3>
                      <span className="text-xs text-ink-muted">{hub.country}</span>
                    </div>
                  </div>

                  {hub.isVerifiedAddress ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Physical CoE
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      Active Market
                    </span>
                  )}
                </div>

                {/* Role */}
                <div className="mt-4 border-t border-neutral-100 pt-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-gold-deep">
                    {hub.role}
                  </div>
                  <p className="mt-2 text-body-sm text-ink-muted leading-snug">
                    {hub.address}
                  </p>
                </div>

                {/* Specialization */}
                <div className="mt-4 rounded-xl bg-[#F8F9FF] p-3 text-xs text-ink-muted">
                  <span className="font-semibold text-[#0B1F3A] block mb-0.5">Specialization:</span>
                  {hub.specialization}
                </div>
              </div>

              {/* Operating details footer */}
              <div className="mt-6 border-t border-neutral-100 pt-3 text-xs text-ink-muted">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-brand-gold-deep" />
                    Timezone:
                  </span>
                  <span className="font-mono font-medium text-[#0B1F3A]">{hub.timezone}</span>
                </div>

                {hub.mapLink ? (
                  <a
                    href={hub.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-brand-navy hover:text-brand-gold-deep mt-2"
                  >
                    View on Google Maps <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-ink-subtle italic mt-2 block">
                    Concierge meeting arrangements via Chicago / India desk
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
