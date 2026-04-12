'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function FooterNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`block text-[14px] leading-snug transition-colors ${
        active ? 'font-medium text-accent' : 'font-normal text-white/50 hover:text-accent'
      }`}
    >
      {children}
    </Link>
  );
}
