import { routes } from './routes';
import { siteConfig } from './site';

/**
 * Navigation trees — mirrors the seeded `navigation_menus` / `navigation_items`
 * (see docs/architecture/information-architecture.md §6). Static for now;
 * swap for `GET /api/v1/navigation` once that endpoint lands. Shapes match the
 * API response so the switch is a data-source change only.
 */

export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type NavGroup = {
  label: string;
  links: NavLink[];
};

const practiceLinks: NavLink[] = [
  { label: 'Talent Bees', href: routes.practice('talent-bees') },
  { label: 'Digital Bees', href: routes.practice('digital-bees') },
  { label: 'AI Bees', href: routes.practice('ai-bees') },
  { label: 'Marketing Bees', href: routes.practice('marketing-bees') },
  { label: 'Quality Bees', href: routes.practice('quality-bees') },
  { label: 'ServiceNow Bees', href: routes.practice('servicenow-bees') },
  { label: 'Energy Bees', href: routes.practice('energy-bees') },
];

export const headerNav: NavLink[] = [
  { label: 'Home', href: routes.home() },
  { label: 'About Us', href: routes.about() },
  { label: 'Services', href: routes.practices() },
  { label: 'How We Work', href: '/how-we-work' },
  { label: 'Contact Us', href: routes.contact() },
];

/** The one mega menu (Practices). Other header items are plain links for v1. */
export const practicesMegaMenu = {
  links: practiceLinks,
  viewAll: { label: 'View all practices', href: routes.practices() } satisfies NavLink,
};

export const footerNav: NavGroup[] = [
  {
    label: 'Explore',
    links: [
      { label: 'Industries', href: routes.industries() },
      { label: 'Technologies', href: routes.technologies() },
      { label: 'Regions', href: routes.regions() },
      { label: 'Case Studies', href: routes.caseStudies() },
      { label: 'Locations', href: routes.locations() },
    ],
  },
  {
    label: 'Company',
    links: [
      { label: 'About', href: routes.about() },
      { label: 'Careers', href: routes.careers() },
      { label: 'Insights', href: routes.insights() },
      { label: 'Privacy', href: routes.privacy() },
      { label: 'Terms', href: routes.terms() },
    ],
  },
  {
    label: 'Practices',
    links: practiceLinks.slice(0, 5),
  },
  {
    label: 'Connect',
    links: [
      { label: 'Contact', href: routes.contact() },
      { label: 'LinkedIn', href: siteConfig.social.linkedin, external: true },
      { label: 'X / Twitter', href: siteConfig.social.x, external: true },
    ],
  },
];
