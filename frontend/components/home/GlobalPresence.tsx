import { getRegions } from '@/lib/api/regions';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';

export default async function GlobalPresence() {
  const regions = await getRegions().catch(() => []);

  return (
    <Section space="lg" tone="canvas">
      <SectionHeading
        title="Local enough to matter, global enough to scale."
        description="Compliance doesn't work the same way in London as it does in Dubai. Our regional teams know the difference — IR35 in the UK, Emiratization in the UAE, GDPR across Europe — so you don't have to become an expert in six different regulatory regimes just to hire well."
        as="h2"
        className="mb-12"
      />
      
      {regions.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {regions.map((region) => (
            <Card key={region.id} href={region.href} interactive>
              <CardBody className="p-4 sm:p-6">
                <CardTitle className="mb-2 text-h4">{region.name}</CardTitle>
                <p className="text-xs text-ink-muted">
                  {region.summary || 'View compliance details'}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}
