'use client';

import { useSyncExternalStore } from 'react';
import { portfolioStore } from '@/lib/portfolioStore';

export default function StructuredData() {
  const { settings } = useSyncExternalStore(
    portfolioStore.subscribe,
    portfolioStore.getSnapshot,
    portfolioStore.getServerSnapshot
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Binaya Adhikari',
    jobTitle: 'Cinematic Video Editor & Storyteller',
    url: 'https://binaya-cinematics.vercel.app',
    sameAs: [
      settings.instagram || '',
      settings.youtube || '',
      // Add more social links here
    ].filter(Boolean),
    description: settings.heroDescription || 'Elite cinematic video editing and storytelling portfolio.',
    image: '/og-image.jpg',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
