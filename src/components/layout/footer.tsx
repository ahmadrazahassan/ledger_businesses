import Link from 'next/link';
import { LogoFull } from '@/components/brand/logo-full';
import { IconMapPin } from '@/components/icons';
import { FooterNewsletter } from '@/components/layout/footer-newsletter';
import { FooterNavLink } from '@/components/layout/footer-nav-link';
import { getCategoryNavLinks } from '@/config/category-navigation';

const INSTAGRAM_HREF = 'https://www.instagram.com/fiza_rana_42';

const companyLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Methodology', href: '/methodology' },
] as const;

const legalLinks = [
  { label: 'Privacy policy', href: '/privacy' },
  { label: 'Terms of use', href: '/terms' },
  { label: 'Affiliate disclosure', href: '/affiliate-disclosure' },
] as const;

const categoryLinks = getCategoryNavLinks();

function SocialInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

const colHeading = 'mb-5 text-[15px] font-bold tracking-[-0.02em] text-white';

function NavColumn({
  title,
  links,
  ariaLabel,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
  ariaLabel: string;
}) {
  return (
    <nav aria-label={ariaLabel} className="min-w-0">
      <h3 className={colHeading}>{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <FooterNavLink href={link.href}>{link.label}</FooterNavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#121212] text-white">
      <div className="mx-auto max-w-[min(1480px,calc(100vw-2.5rem))] px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
        <div className="flex flex-col gap-16 lg:flex-row lg:justify-between lg:gap-12 xl:gap-20">
          {/* Left — editorial + newsletter (Investa-style) */}
          <div className="max-w-lg shrink-0 lg:max-w-[440px]">
            <Link href="/" className="inline-block">
              <LogoFull variant="light" />
            </Link>

            <p className="mt-6 text-[14px] leading-relaxed text-white/55">
              Independent UK editorial on accounting software, payroll, and tax compliance — written for finance
              teams and business owners.
            </p>
            <p className="mt-5 text-[12px] leading-relaxed text-white/40">
              Your email is never sold. See our{' '}
              <Link href="/privacy" className="text-white/55 underline underline-offset-2 hover:text-white/80">
                privacy policy
              </Link>
              .
            </p>

            <div className="mt-6 flex items-start gap-2.5 text-[13px] leading-snug text-white/65">
              <IconMapPin size={18} className="mt-0.5 shrink-0 text-white/45" aria-hidden />
              <span>Birmingham, United Kingdom</span>
            </div>

            <div className="mt-4">
              <a
                href={INSTAGRAM_HREF}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ledger Businesses on Instagram"
                className="inline-flex rounded-lg p-1.5 -m-1.5 text-white/75 transition-colors hover:bg-white/[0.06] hover:text-accent"
              >
                <SocialInstagram />
              </a>
            </div>

            <div className="mt-10 border-t border-white/[0.08] pt-10">
              <FooterNewsletter variant="investa" />
            </div>
          </div>

          {/* Right — Company · Legal · Categories */}
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3 lg:gap-8 xl:gap-12">
            <NavColumn title="Company" links={companyLinks} ariaLabel="Company" />
            <NavColumn title="Legal" links={legalLinks} ariaLabel="Legal" />
            <div className="sm:col-span-2 lg:col-span-1">
              <NavColumn title="Categories" links={categoryLinks} ariaLabel="Categories" />
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-white/[0.08] pt-10 md:flex-row md:items-center md:justify-between">
          <p className="text-[13px] text-white/45">© {year} Ledger Businesses. All rights reserved.</p>
          <p className="text-[13px] text-white/40">Birmingham, UK — Editorial content</p>
        </div>
      </div>
    </footer>
  );
}
