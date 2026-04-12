'use client';

import { usePathname } from 'next/navigation';
import { SiteAssistant } from '@/components/ai/site-assistant';

/**
 * Renders the floating assistant everywhere except the admin area.
 */
export function ConditionalSiteAssistant() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <SiteAssistant />;
}
