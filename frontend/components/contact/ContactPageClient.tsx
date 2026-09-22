'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PersonaRouter, { type PersonaKey } from './PersonaRouter';
import ContactFormPanel from './ContactFormPanel';
import ExistingClientShortcut from './ExistingClientShortcut';

interface ContactPageClientProps {
  defaultPersona?: PersonaKey;
  defaultPractice?: string;
  defaultRegion?: string;
}

export default function ContactPageClient({
  defaultPersona = 'hire',
  defaultPractice = 'ai-bees',
  defaultRegion = 'india',
}: ContactPageClientProps) {
  const searchParams = useSearchParams();
  const [activePersona, setActivePersona] = useState<PersonaKey>(defaultPersona);

  // Sync with URL query parameters if present (e.g., ?persona=delivery, ?topic=leadership)
  useEffect(() => {
    const personaParam = searchParams.get('persona') as PersonaKey | null;
    const topicParam = searchParams.get('topic');

    if (personaParam && ['hire', 'delivery', 'partner', 'press'].includes(personaParam)) {
      setActivePersona(personaParam);
    } else if (topicParam === 'leadership' || topicParam === 'consultation') {
      setActivePersona('delivery');
    } else if (topicParam === 'hire' || topicParam === 'staffing') {
      setActivePersona('hire');
    }
  }, [searchParams]);

  const practiceParam = searchParams.get('practice') || defaultPractice;
  const regionParam = searchParams.get('region') || defaultRegion;

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        {/* Step 1: Persona Router */}
        <PersonaRouter
          activePersona={activePersona}
          onSelectPersona={(key) => setActivePersona(key)}
        />

        {/* Step 2: Dynamic Form Panel with Lead Dispatch */}
        <ContactFormPanel
          key={`${activePersona}-${practiceParam}-${regionParam}`}
          activePersona={activePersona}
          initialPractice={practiceParam}
          initialRegion={regionParam}
        />

        {/* Step 3: Existing Client Shortcut (visually distinct, high-contrast) */}
        <div className="mt-14">
          <ExistingClientShortcut />
        </div>
      </div>
    </section>
  );
}
