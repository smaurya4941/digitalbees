import { getPractices } from '@/lib/api/practices';
import { Section } from '@/components/ui/Section';
import { PracticeCard } from '@/components/cards/PracticeCard';
import { SectionHeading } from '@/components/sections/SectionHeading';

export default async function PracticesGrid() {
  const practices = await getPractices().catch(() => []);

  if (practices.length === 0) return null;

  return (
    <Section space="lg">
      <SectionHeading
        title="Seven practices. One accountable partner."
        description="Most partners make you choose: a staffing firm that stops at the resume, or a delivery shop that stops at the project. TeamBees does both, under one roof, so the team that finds your specialists is the same team that can help them ship."
        as="h2"
      />
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {practices.map((practice, index) => (
          <PracticeCard key={practice.id} practice={practice} index={index} />
        ))}
      </div>
    </Section>
  );
}
