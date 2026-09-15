import { ProofBar } from '@/components/sections/ProofBar';

export default function ProofBarSection() {
  return (
    <ProofBar
      heading="Global scale, specialist depth"
      points={[
        { value: "6", label: "regions: USA, UK, Europe, Canada, Australia, UAE, with local compliance teams." },
        { value: "7", label: "specialist practices, from staffing to AI and energy trading platforms." },
        { value: "1,000+", label: "specialists placed across banking, healthcare, energy, SaaS, and retail." },
        { value: "40%", label: "average reduction in time-to-hire for clients using our staff augmentation model." }
      ]}
    />
  );
}
