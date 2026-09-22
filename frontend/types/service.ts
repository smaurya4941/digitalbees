import type { SeoBlock } from './seo';

export type ServiceClusterCategory =
  | 'core'
  | 'developer'
  | 'specialized'
  | 'industry'
  | 'location'
  | 'commercial'
  | 'comparison';

export interface ServicePillar {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  seo?: SeoBlock;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: { text: string; href: string };
    secondaryCta: { text: string; href: string };
  };
  stats: Array<{ value: string; label: string }>;
  clusterCategories: Array<{
    id: ServiceClusterCategory;
    title: string;
    description: string;
    items: Array<{
      name: string;
      slug: string;
      description: string;
      icon?: string;
      badge?: string;
    }>;
  }>;
}

export interface ServiceHiringModel {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  bestFor: string;
}

export interface ServiceComparisonRow {
  criteria: string;
  traditional: string;
  dedicated: string;
}

export interface ServiceProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceClusterPage {
  slug: string;
  pillarSlug: string;
  category: ServiceClusterCategory;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroHeadline: string;
  heroContent: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  seo?: SeoBlock;
  whyPoints: {
    title: string;
    description: string;
    points: Array<{ title: string; description: string; icon?: string }>;
  };
  hiringModels?: ServiceHiringModel[];
  comparisonTable?: {
    title: string;
    subtitle: string;
    headers: [string, string, string];
    rows: ServiceComparisonRow[];
  };
  processSteps: ServiceProcessStep[];
  benefits: Array<{ title: string; description: string; metric?: string }>;
  technologies: string[];
  relatedRoles: Array<{ name: string; slug: string }>;
  industries?: Array<{ name: string; slug: string }>;
  locations?: Array<{ name: string; slug: string }>;
  faqs: ServiceFaq[];
  cta: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonHref: string;
  };
}
