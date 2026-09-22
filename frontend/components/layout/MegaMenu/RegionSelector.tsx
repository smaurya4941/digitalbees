'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

interface RegionOption {
  label: string;
  flag: string;
  code: string;
  currency: string;
}

const REGION_OPTIONS: RegionOption[] = [
  { label: 'US / Global', flag: '🇺🇸', code: 'US', currency: 'USD' },
  { label: 'United Kingdom', flag: '🇬🇧', code: 'UK', currency: 'GBP' },
  { label: 'Europe (EU)', flag: '🇪🇺', code: 'EU', currency: 'EUR' },
  { label: 'APAC / Singapore', flag: '🇸🇬', code: 'SG', currency: 'SGD' },
  { label: 'Middle East / UAE', flag: '🇦🇪', code: 'AE', currency: 'AED' },
  { label: 'India Delivery Hub', flag: '🇮🇳', code: 'IN', currency: 'INR' },
];

export function RegionSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(REGION_OPTIONS[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 hover:border-[#C6963A]/50 hover:bg-white/[0.08] transition-all text-xs font-medium text-white/90 hover:text-white backdrop-blur-xs"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select Region"
      >
        <Globe className="h-3.5 w-3.5 text-[#C6963A]" />
        <span>{selected.label}</span>
        <ChevronDown
          className={`h-3 w-3 text-white/50 transition-transform duration-200 ${
            open ? 'rotate-180 text-[#C6963A]' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#0B1F3A] border border-[#C6963A]/30 shadow-2xl p-2 z-50 text-white backdrop-blur-xl">
          <div className="px-2 py-1 text-[10px] font-mono text-[#C6963A] uppercase tracking-wider font-semibold border-b border-white/10 mb-1">
            Regional Preference
          </div>
          <div className="space-y-0.5">
            {REGION_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                type="button"
                onClick={() => {
                  setSelected(opt);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition text-left ${
                  selected.code === opt.code
                    ? 'bg-[#C6963A]/20 text-[#C6963A] font-semibold'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{opt.flag}</span>
                  <span>{opt.label}</span>
                </span>
                <span className="text-[10px] font-mono text-white/70">{opt.currency}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
