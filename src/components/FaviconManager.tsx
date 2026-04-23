'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { portfolioStore } from '@/lib/portfolioStore';

export default function FaviconManager() {
  const { settings } = useSyncExternalStore(
    portfolioStore.subscribe,
    portfolioStore.getSnapshot,
    portfolioStore.getServerSnapshot
  );

  useEffect(() => {
    if (!settings.faviconUrl) return;
    
    // Find all icon links
    const links = document.querySelectorAll("link[rel*='icon']");
    
    if (links.length > 0) {
      links.forEach((link: any) => {
        link.href = settings.faviconUrl;
      });
    } else {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = settings.faviconUrl;
      document.head.appendChild(link);
    }

    // Update document title if siteName changes
    if (settings.siteName) {
      document.title = `${settings.siteName} | Cinematic Portfolio`;
    }
  }, [settings.faviconUrl, settings.siteName]);

  return null;
}
