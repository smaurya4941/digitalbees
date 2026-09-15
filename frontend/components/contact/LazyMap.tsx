'use client';

import dynamic from 'next/dynamic';
import type { MapOffice } from '@/components/contact/Map';

/**
 * Client boundary for the Leaflet map. Leaflet touches `window` at import
 * time, so it must never render on the server — and `ssr: false` is only
 * allowed inside a Client Component. Server pages import this wrapper.
 */
const Map = dynamic(() => import('@/components/contact/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full min-h-[400px] w-full animate-pulse rounded-[2rem] bg-canvas-sunken" />
  ),
});

export function LazyMap({ offices }: { offices?: MapOffice[] }) {
  return <Map offices={offices} />;
}
