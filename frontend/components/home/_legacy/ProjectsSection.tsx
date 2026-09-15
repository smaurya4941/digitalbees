import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ProjectsSection() {
  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <ScrollReveal>
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-gold-muted font-label-sm text-label-sm uppercase tracking-widest mb-4">
            <span className="material-symbols-outlined text-sm">home</span>
            <span>Our Projects</span>
          </div>
          <h2 className="font-headline-xl text-headline-xl text-primary">
            Basement To <span className="font-bold">Beautiful – Finished Basement</span> Project
          </h2>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Project Card 1 */}
        <ScrollReveal delay={0.1}>
          <div className="bg-surface-container-low rounded-[2rem] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden min-h-[350px] md:min-h-[400px] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 h-full group">
            <div className="text-on-surface-variant font-medium text-sm">Under Construction</div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[120px] font-bold text-outline-variant/20 group-hover:text-outline-variant/30 transition-colors duration-300">01</span>
            </div>
            <div className="flex justify-between items-end relative z-10">
              <h3 className="font-title-md text-title-md text-primary font-bold">Greenview Apartments</h3>
              <div className="w-12 h-12 bg-secondary-fixed/30 rounded-full flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                <span className="material-symbols-outlined">north_east</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
        {/* Project Card 2 (Featured) */}
        <ScrollReveal delay={0.2}>
          <div className="relative rounded-[2rem] p-8 md:p-12 flex flex-col justify-between overflow-hidden min-h-[350px] md:min-h-[400px] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 h-full group cursor-pointer">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIePKkkHNKVqVxirZWVnzjBamhHfRZaUwRWiqvw7k3Rg4_Rc7lYC0nHk_RW7G_iVL9_R6n46ZXSY1aGHaVgxs9yKLMMX9_8DPR1sdGSmLjLsCPfJfLiM1vdwyCiPeT5ODsvhPtHT_DrDGS1MqnMZGVxph8rWNtI0xrAVBvdekoriEYzstNr8TYXJxnV17FbRG1sR6uhEtCYzZSCoxKnovzF3Db7PBw8o2DTD0w0vKgHwALdF5fia5nyVTXjRLIssbxXQ"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Premier Office Tower"
              fill
            />
            <div className="absolute inset-0 bg-navy-deep/40 group-hover:bg-navy-deep/50 transition-colors duration-500"></div>
            <div className="relative z-10">
              <span className="bg-gold-muted text-on-primary text-[10px] font-bold uppercase px-3 py-1 rounded-full">Completed</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[120px] font-bold text-white/10 group-hover:text-white/20 transition-colors duration-500">02</span>
            </div>
            <div className="flex justify-between items-end relative z-10">
              <h3 className="font-title-md text-title-md text-white font-bold">Premier Office Tower</h3>
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-gold-muted transition-all duration-300">
                <span className="material-symbols-outlined">north_east</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
        {/* Project Card 3 */}
        <ScrollReveal delay={0.3}>
          <div className="bg-surface-container-low rounded-[2rem] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden min-h-[350px] md:min-h-[400px] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 h-full group">
            <div className="text-on-surface-variant font-medium text-sm">Under Construction</div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[120px] font-bold text-outline-variant/20 group-hover:text-outline-variant/30 transition-colors duration-300">03</span>
            </div>
            <div className="flex justify-between items-end relative z-10">
              <h3 className="font-title-md text-title-md text-primary font-bold">Urban Height Residence</h3>
              <div className="w-12 h-12 bg-secondary-fixed/30 rounded-full flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                <span className="material-symbols-outlined">north_east</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
