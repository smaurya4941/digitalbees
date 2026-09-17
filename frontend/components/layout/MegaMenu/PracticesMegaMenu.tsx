import Link from 'next/link';

interface PracticeItem {
  name: string;
  slug: string;
  category: string;
  icon: string;
  color: string;
  badge?: string;
  sla: string;
  subServices: { label: string; href: string }[];
}

const PRACTICES: PracticeItem[] = [
  {
    name: 'Talent Bees',
    slug: 'talent-bees',
    category: 'Core Talent',
    icon: 'groups',
    color: '#4A6FA1',
    sla: '48h candidate submittal',
    subServices: [
      { label: 'IT Staffing', href: '/practices/talent-bees/it-staffing' },
      { label: 'Non-IT Staffing', href: '/practices/talent-bees/non-it-staffing' },
      { label: 'Executive Search', href: '/practices/talent-bees/executive-search' },
      { label: 'Contract Staffing', href: '/practices/talent-bees/contract-staffing' },
      { label: 'Staff Augmentation', href: '/practices/talent-bees/staff-augmentation' },
      { label: 'RPO & MSP Programs', href: '/practices/talent-bees/rpo' },
    ],
  },
  {
    name: 'Digital Bees',
    slug: 'digital-bees',
    category: 'Engineering',
    icon: 'developer_mode',
    color: '#3F8FA5',
    sla: 'Cloud-native architecture',
    subServices: [
      { label: 'Software Development', href: '/practices/digital-bees/software-development' },
      { label: 'Digital Transformation', href: '/practices/digital-bees/digital-transformation' },
      { label: 'Cloud Engineering', href: '/practices/digital-bees/cloud-engineering' },
      { label: 'DevOps & SRE', href: '/practices/digital-bees/devops' },
      { label: 'Product Engineering', href: '/practices/digital-bees/product-engineering' },
      { label: 'Data Engineering', href: '/practices/digital-bees/data-engineering' },
    ],
  },
  {
    name: 'AI Bees',
    slug: 'ai-bees',
    category: 'GenAI & Agents',
    icon: 'smart_toy',
    color: '#6B4FA1',
    badge: 'CORE POD',
    sla: 'Production Swarm topology',
    subServices: [
      { label: 'AI Agents & Swarms', href: '/practices/ai-bees/ai-agents' },
      { label: 'Generative AI', href: '/practices/ai-bees/generative-ai' },
      { label: 'LLM Development', href: '/practices/ai-bees/llm-development' },
      { label: 'AI Automation', href: '/practices/ai-bees/ai-automation' },
      { label: 'AI Consulting & ROI', href: '/practices/ai-bees/ai-consulting' },
      { label: 'Enterprise AI Integration', href: '/practices/ai-bees/ai-integration' },
    ],
  },
  {
    name: 'Marketing Bees',
    slug: 'marketing-bees',
    category: 'Growth',
    icon: 'campaign',
    color: '#B8862B',
    sla: 'Multi-channel ROI',
    subServices: [
      { label: 'Marketing Staff Aug', href: '/practices/marketing-bees/staff-augmentation' },
      { label: 'Social Media Ops', href: '/practices/marketing-bees/social-media' },
      { label: 'Technical SEO', href: '/practices/marketing-bees/technical-seo' },
      { label: 'PPC & Paid Acquisition', href: '/practices/marketing-bees/ppc' },
      { label: 'Content Marketing', href: '/practices/marketing-bees/content-marketing' },
      { label: 'HubSpot & Marketo', href: '/practices/marketing-bees/marketing-automation' },
    ],
  },
  {
    name: 'Quality Bees',
    slug: 'quality-bees',
    category: 'Assurance',
    icon: 'verified',
    color: '#4A8F6B',
    sla: 'Zero defect tolerance',
    subServices: [
      { label: 'Manual Testing', href: '/practices/quality-bees/manual-testing' },
      { label: 'Automation Testing', href: '/practices/quality-bees/automation-testing' },
      { label: 'Performance & Load', href: '/practices/quality-bees/performance-testing' },
      { label: 'Security Testing', href: '/practices/quality-bees/security-testing' },
      { label: 'AI System Testing', href: '/practices/quality-bees/ai-testing' },
      { label: 'CI/CD Quality Gates', href: '/practices/quality-bees/ci-cd-quality' },
    ],
  },
  {
    name: 'ServiceNow Bees',
    slug: 'servicenow-bees',
    category: 'Enterprise Suite',
    icon: 'terminal',
    color: '#2E6B4F',
    sla: 'Certified implementation',
    subServices: [
      { label: 'Consulting & Audit', href: '/practices/servicenow-bees/consulting' },
      { label: 'ITSM & ITOM Dev', href: '/practices/servicenow-bees/itsm-itom' },
      { label: 'Full Implementation', href: '/practices/servicenow-bees/implementation' },
      { label: 'Managed Support', href: '/practices/servicenow-bees/managed-support' },
      { label: 'Certified Staffing', href: '/practices/servicenow-bees/staffing' },
      { label: 'CMDB Health Checks', href: '/practices/servicenow-bees/cmdb' },
    ],
  },
  {
    name: 'Energy Bees',
    slug: 'energy-bees',
    category: 'CTRM Trading',
    icon: 'bolt',
    color: '#8A5A2E',
    sla: 'Commodities & Trading',
    subServices: [
      { label: 'Openlink Endur', href: '/practices/energy-bees/endur' },
      { label: 'Allegro CTRM', href: '/practices/energy-bees/allegro' },
      { label: 'RightAngle Systems', href: '/practices/energy-bees/rightangle' },
      { label: 'TriplePoint Services', href: '/practices/energy-bees/triplepoint' },
      { label: 'Energy Trading Advisory', href: '/practices/energy-bees/trading-advisory' },
      { label: 'Risk & Settlement Ops', href: '/practices/energy-bees/risk-settlement' },
    ],
  },
];

interface Props {
  onClose: () => void;
}

export function PracticesMegaMenu({ onClose }: Props) {
  return (
    <div className="w-full bg-[#0B1F3A]/98 backdrop-blur-xl border-b border-[#C6963A]/30 shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-white">
      {/* Top sub-header strip */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-3 bg-[#071527]/80 border-b border-white/10 flex flex-wrap items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[#C6963A] font-semibold uppercase tracking-wider text-[11px]">
            // Practice Architecture
          </span>
          <span className="text-white/30 hidden sm:inline">|</span>
          <span className="text-white/70 hidden sm:inline">
            Specialized pods engineered to sit inside enterprise runtimes
          </span>
        </div>
        <Link
          href="/practices"
          onClick={onClose}
          className="text-[#C6963A] hover:text-[#E9D9AE] font-mono text-[11px] flex items-center gap-1 font-medium transition"
        >
          <span>Explore Swarm Architecture Framework</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>

      {/* Main 7 columns + 1 spotlight card */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-5">
        {PRACTICES.map((p) => {
          const isAI = p.slug === 'ai-bees';
          return (
            <div
              key={p.slug}
              className={`space-y-3 p-3.5 rounded-xl transition-all group flex flex-col justify-between ${
                isAI
                  ? 'bg-[#6B4FA1]/10 border border-[#6B4FA1]/40 hover:border-[#6B4FA1] relative shadow-sm'
                  : 'bg-white/[0.02] border border-white/5 hover:border-[#C6963A]/40'
              }`}
            >
              <div>
                {p.badge && (
                  <span className="absolute -top-2 right-2 px-1.5 py-0.5 bg-[#6B4FA1] text-white text-[9px] font-mono font-bold rounded shadow-sm">
                    {p.badge}
                  </span>
                )}
                <Link
                  href={`/practices/${p.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-2 border-b border-white/10 pb-2.5 group/header"
                >
                  <div
                    className="w-7 h-7 rounded flex items-center justify-center font-bold shrink-0 transition-transform group-hover/header:scale-105"
                    style={{ backgroundColor: `${p.color}25`, color: p.color }}
                  >
                    <span className="material-symbols-outlined text-[17px]">{p.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <h4
                      className="font-bold text-[13px] text-white transition truncate group-hover/header:text-[#C6963A]"
                    >
                      {p.name}
                    </h4>
                    <span
                      className="text-[10px] font-mono uppercase tracking-wider block"
                      style={{ color: p.color }}
                    >
                      {p.category}
                    </span>
                  </div>
                </Link>

                <ul className="mt-2.5 space-y-1 text-[12px] text-white/80">
                  {p.subServices.map((sub) => (
                    <li key={sub.label}>
                      <Link
                        href={`/practices/${p.slug}`}
                        onClick={onClose}
                        className="hover:text-[#C6963A] transition block py-0.5 leading-snug truncate"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="pt-2 text-[10px] font-mono border-t border-white/5 truncate"
                style={{ color: isAI ? '#d8b4fe' : 'rgba(255,255,255,0.4)' }}
              >
                {p.sla}
              </div>
            </div>
          );
        })}

        {/* 8. Spotlight Card: Featured Case Study */}
        <div className="rounded-xl p-4 bg-gradient-to-b from-[#132B4F] to-[#071527] border border-[#C6963A]/40 flex flex-col justify-between shadow-lg relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#C6963A]/10 rounded-full blur-xl pointer-events-none" />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#C6963A] uppercase tracking-wider">
                Featured Story
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono bg-[#C6963A]/20 text-[#C6963A] rounded border border-[#C6963A]/30">
                AI + FinTech
              </span>
            </div>
            <h5 className="font-bold text-white text-[13px] leading-snug group-hover:text-[#C6963A] transition">
              Divo Multi-Agent CRM Orchestration
            </h5>
            <p className="text-[11px] text-white/70 leading-relaxed">
              Deployed autonomous agent pods connecting core ledger streams to customer CRM with zero leakage.
            </p>

            <div className="pt-2 pb-1 border-y border-white/10">
              <div className="text-xl font-black text-[#C6963A] font-mono tracking-tight">40% FASTER</div>
              <div className="text-[10px] text-white/50 font-medium">Task execution (45–60 mins saved/user/day)</div>
            </div>
          </div>

          <div className="pt-3">
            <Link
              href="/case-studies"
              onClick={onClose}
              className="text-xs font-bold text-[#C6963A] hover:text-white flex items-center justify-between group-hover:translate-x-1 transition-transform"
            >
              <span>Read case study</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Strip */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-3 bg-[#071527] border-t border-white/10 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-4 text-white/60 font-mono text-[11px]">
          <span>SOC2 Type II Certified</span>
          <span>•</span>
          <span>ISO 27001 Compliant</span>
          <span>•</span>
          <span className="hidden sm:inline">100% Dedicated Delivery Teams</span>
        </div>
        <Link
          href="/practices"
          onClick={onClose}
          className="font-bold text-[#C6963A] hover:text-white transition flex items-center gap-1.5"
        >
          <span>View all 7 Practices &amp; Pod Specs</span>
          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
