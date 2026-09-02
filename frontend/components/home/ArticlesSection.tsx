import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ArticlesSection() {
  return (
    <section className="py-24 bg-surface-container-lowest px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-gold-muted font-label-sm text-label-sm uppercase tracking-wider mb-4">ARTICLES & INSIGHTS</span>
            <h2 className="font-headline-xl text-headline-xl text-navy-deep">
              A Showcase Of <span className="font-bold">Stunning Digital Transformation</span> Stories
            </h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <ScrollReveal delay={0.1}>
            <div className="bg-surface border border-outline-variant/30 rounded-xl overflow-hidden group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 h-full">
              <div className="relative h-64">
                <Image
                  alt="Blog 1"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl_icAf-uTkn3Xd0R8MXVMQGFpvA_85-w-rST5eGcTYlPywo1b343SRGsX2kmLL8sQrPvescorcOr00jpB1gH3QpR8KM3CslvWn3c3G_ETTBv2Tbsq0JIthJ9k-8o4dLAPfb_SaRVpyzNq6P91qIdUlAOa4WBWU7eTsPazP04k8g8M2rA1y4_pPviL3GVdW7ENXjaQ_SHB2V1y3aUkd2AsdWpVoHA4Iz5p7rxoq5BMMLIxOnIHGe0Kdle4_0RUkaitrKdQC7HSudM"
                  fill
                />
                <div className="absolute -bottom-4 right-6 bg-white w-16 h-16 flex flex-col items-center justify-center rounded shadow-md z-10 group-hover:bg-gold-muted group-hover:text-white transition-colors duration-300">
                  <span className="font-bold text-primary group-hover:text-white transition-colors duration-300 leading-none text-lg">12</span>
                  <span className="text-xs text-on-surface-variant group-hover:text-white transition-colors duration-300 uppercase tracking-wider">Jul</span>
                </div>
              </div>
              <div className="p-8 pt-10">
                <div className="text-xs text-on-surface-variant uppercase tracking-wider mb-3">By Admin / 1 Comment</div>
                <h3 className="font-title-md text-xl font-bold text-primary mb-4 group-hover:text-gold-muted transition-colors">The Future of Enterprise AI Integration</h3>
                <Link className="text-secondary-fixed font-semibold hover:text-primary transition-colors flex items-center gap-1 text-sm uppercase tracking-wider" href="#">
                  Read More <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
          {/* Card 2 */}
          <ScrollReveal delay={0.2}>
            <div className="bg-surface border border-outline-variant/30 rounded-xl overflow-hidden group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 h-full">
              <div className="relative h-64">
                <Image
                  alt="Blog 2"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIYv125ouaV0xMQ6j-ERg93M32KwtxSPiUkI9vn-E2w4nzQSefLc0Nh4W5WuTJlu8_-iuYXM1wHSrB7BGfJWrV6r136_1UEATWy5vLQVEznvrN9o5DCez-3kTac2_yJDro_0n8SZGdnFPcLRe-BK_rq015BT_6y9xXQexOEAau0NwcJgU5GBeKhxuRH-eJzCN6Fj2nQv50AykosTnTBkvp753oa9sxVl4vXt3-rS5A43VFaO0in1YqRMF4NzP0cou35QBvNGG635o"
                  fill
                />
                <div className="absolute -bottom-4 right-6 bg-white w-16 h-16 flex flex-col items-center justify-center rounded shadow-md z-10 group-hover:bg-gold-muted group-hover:text-white transition-colors duration-300">
                  <span className="font-bold text-primary group-hover:text-white transition-colors duration-300 leading-none text-lg">15</span>
                  <span className="text-xs text-on-surface-variant group-hover:text-white transition-colors duration-300 uppercase tracking-wider">Jul</span>
                </div>
              </div>
              <div className="p-8 pt-10">
                <div className="text-xs text-on-surface-variant uppercase tracking-wider mb-3">By Admin / 3 Comments</div>
                <h3 className="font-title-md text-xl font-bold text-primary mb-4 group-hover:text-gold-muted transition-colors">Scaling Global Networks Efficiently</h3>
                <Link className="text-secondary-fixed font-semibold hover:text-primary transition-colors flex items-center gap-1 text-sm uppercase tracking-wider" href="#">
                  Read More <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
          {/* Card 3 */}
          <ScrollReveal delay={0.3}>
            <div className="bg-surface border border-outline-variant/30 rounded-xl overflow-hidden group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 h-full">
              <div className="relative h-64">
                <Image
                  alt="Blog 3"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5gjBEdFFa_gR9448xmZj5vnq2IaOJ9yjEA3H8YyM7R8Ru7u7JkYo3h_78k9yLyr9k13YKQmVAfcw1LBJuFzToCJQLaqsOyfLyQsZkE-q3hWon-uzHoCbByOHil2KtrXSogXwnMkp421pIXjAGT5NPgtpz1jGe2pBuwh0u490KNJnOvcthbLTOOreXjggHOSEUTrUlAU2PB0aXAG1hVRgV2aMx5V_0zABWnqUwG026DAvzmPLNtmEmVpMSrCc8lQ895oSGwq3-JtE"
                  fill
                />
                <div className="absolute -bottom-4 right-6 bg-white w-16 h-16 flex flex-col items-center justify-center rounded shadow-md z-10 group-hover:bg-gold-muted group-hover:text-white transition-colors duration-300">
                  <span className="font-bold text-primary group-hover:text-white transition-colors duration-300 leading-none text-lg">20</span>
                  <span className="text-xs text-on-surface-variant group-hover:text-white transition-colors duration-300 uppercase tracking-wider">Jul</span>
                </div>
              </div>
              <div className="p-8 pt-10">
                <div className="text-xs text-on-surface-variant uppercase tracking-wider mb-3">By Admin / 0 Comments</div>
                <h3 className="font-title-md text-xl font-bold text-primary mb-4 group-hover:text-gold-muted transition-colors">Building the Next Generation of Labs</h3>
                <Link className="text-secondary-fixed font-semibold hover:text-primary transition-colors flex items-center gap-1 text-sm uppercase tracking-wider" href="#">
                  Read More <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
