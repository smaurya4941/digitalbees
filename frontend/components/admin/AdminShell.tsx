'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  ChevronsUpDown,
  Cpu,
  FileText,
  Globe2,
  Hexagon,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Mail,
  Settings,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuth } from './providers';

type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  soon?: boolean;
};

const primaryNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Practices', href: '/admin/practices', icon: Sparkles },
  { label: 'Industries', href: '/admin/industries', icon: Building2 },
  { label: 'Regions', href: '/admin/regions', icon: Globe2 },
  { label: 'Technologies', href: '/admin/technologies', icon: Cpu },
  { label: 'Case Studies', href: '/admin/case-studies', icon: FileText },
  { label: 'Media', href: '/admin/media', icon: ImageIcon },
];

const adminNav: NavItem[] = [
  { label: 'Inbox / CRM', href: '/admin/leads', icon: Mail },
  { label: 'Settings', href: '/admin/settings', icon: Settings, soon: true },
];

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active =
    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

  const content = (
    <>
      <item.icon
        className={cn('size-4.5 shrink-0', active ? 'text-brand-gold' : 'text-white/55')}
        aria-hidden
      />
      <span className="flex-1">{item.label}</span>
      {item.soon && (
        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/50">
          Soon
        </span>
      )}
    </>
  );

  const classes = cn(
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
    active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white',
    item.soon && 'cursor-not-allowed opacity-55 hover:bg-transparent hover:text-white/70',
  );

  if (item.soon) {
    return (
      <span className={classes} aria-disabled>
        {content}
      </span>
    );
  }

  return (
    <Link href={item.href} onClick={onNavigate} className={classes}>
      {content}
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, isAdmin } = useAuth();

  return (
    <div className="flex h-full flex-col bg-brand-navy-deep">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="grid size-8 place-items-center rounded-lg bg-brand-gold text-brand-navy-deep">
          <Hexagon className="size-4.5" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">Digital Bees</p>
          <p className="text-[11px] text-white/45">Content Studio</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/35">
          Content
        </p>
        {primaryNav.map((item) => (
          <NavLink key={item.href} item={item} onNavigate={onNavigate} />
        ))}

        {isAdmin && (
          <>
            <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-white/35">
              Administration
            </p>
            {adminNav.map((item) => (
              <NavLink key={item.href} item={item} onNavigate={onNavigate} />
            ))}
          </>
        )}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-semibold text-white">
            {user?.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium text-white">{user?.name}</p>
            <p className="truncate text-[11px] capitalize text-white/45">{user?.role} · {user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-canvas-sunken">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden">
            <motion.div
              className="fixed inset-0 z-40 bg-brand-navy-deep/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-64"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-hairline bg-white/80 px-4 backdrop-blur-md sm:px-6">
          <button
            className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-neutral-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </button>

          <div className="flex-1" />

          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2.5 rounded-xl border border-hairline bg-white px-2.5 py-1.5 text-sm hover:border-hairline-strong"
            >
              <span className="grid size-7 place-items-center rounded-full bg-brand-navy text-xs font-semibold text-white">
                {user?.name?.charAt(0).toUpperCase() ?? '?'}
              </span>
              <span className="hidden font-medium text-ink sm:block">{user?.name}</span>
              <ChevronsUpDown className="size-4 text-ink-subtle" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.14 }}
                    className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-xl border border-hairline bg-white p-1.5 shadow-lg"
                  >
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-medium text-ink">{user?.name}</p>
                      <p className="truncate text-xs text-ink-subtle">{user?.email}</p>
                      <span className="mt-1.5 inline-block rounded-md bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium capitalize text-ink-muted">
                        {user?.role}
                      </span>
                    </div>
                    <div className="my-1 h-px bg-hairline" />
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        void signOut();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-neutral-100 hover:text-danger"
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
