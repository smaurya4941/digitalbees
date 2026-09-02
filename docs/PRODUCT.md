# TeamBees Corp Website

**"Talent + Technology from the same partner."**

TeamBees is a high-end B2B enterprise services platform designed to attract, educate, build trust, and convert business decision-makers. It serves as a digital salesperson for TeamBees' technology, digital transformation, AI, talent, and energy-related capabilities.

## 🐝 The 7 Bees (Core Practices)

1. **Talent Bees**: Skilled technology professionals and talent staffing.
2. **Digital Bees**: Digital transformation and software engineering.
3. **AI Bees**: Artificial intelligence, automation, and AI solutions.
4. **Marketing Bees**: Digital marketing execution and strategy.
5. **Quality Bees**: Quality engineering, QA, and testing.
6. **ServiceNow Bees**: ServiceNow implementations and consulting.
7. **Energy Bees**: Energy-sector technology and trading platforms.

## 🎯 Project Goals & Vision

This platform is built on 5 integrated systems:
- **Marketing Website**: Clearly articulates capabilities and differentiation.
- **SEO Engine**: Scalable, taxonomy-driven architecture designed to support 300+ highly specific landing pages dynamically.
- **Trust Engine**: Surfacing case studies, testimonials, and industry expertise.
- **Lead-Generation Engine**: Optimized conversion flows, forms, and a custom AI Chatbot ("Bee Assistant").
- **Content Platform**: Centralized management for insights, resources, and careers.

**Design Philosophy**: *Confident enterprise, not corporate-generic.* Premium, trustworthy, and modern without being overloaded with gimmicks.

## 🏗️ Technical Architecture

This project uses a scalable **Laravel** foundation built to handle enterprise-level content generation without hardcoding hundreds of views.

- **Stack**: Laravel 11.x, PHP 8.2+, MySQL 8.0+ / MariaDB
- **Frontend**: Laravel Blade components + TailwindCSS (using an atomic design system)
- **Architecture Pattern**: MVC + Service Layer + Repository Pattern
  - **Thin Controllers**: Handle requests and responses only.
  - **Services**: Contain business, CRM, and lead routing logic.
  - **Repositories**: Handle database abstraction and Eloquent queries.
- **Content Modeling**: Relational taxonomy linking Practices, Industries, Regions, Technologies, and Case Studies to dynamic templates.

## 🚀 Key Features

- **Combinatorial Page Generation**: Automatically resolves pages like `Practice × Industry` or `Region × Practice` using shared Blade templates.
- **Integrated CRM Flow**: Form submissions map directly to external CRMs via asynchronous queues.
- **SEO Optimization**: Automated meta tags, schema data, dynamic XML sitemaps, and strict accessibility (WCAG 2.2 AA) adherence.
- **Performance Budget**: Built to pass Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1).
