import Link from 'next/link';
import { IconArrowUpRight } from '@/components/icons';
import { LogoFull } from '@/components/brand/logo-full';

const footerNav = {
  explore: [
    { label: 'Latest', href: '/#latest' },
    { label: 'Trending', href: '/#trending' },
    { label: 'Topics', href: '/#topics' },
    { label: 'Guides', href: '/#deep-dive' },
    { label: 'Search', href: '/search' },
  ],
  topics: [
    { label: 'Business', href: '/category/business' },
    { label: 'AI', href: '/category/ai' },
    { label: 'Startups', href: '/category/startups' },
    { label: 'Software', href: '/category/software' },
    { label: 'Funding', href: '/category/funding' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="px-4 md:px-8 pb-4 md:pb-8">
      {/* Main footer card — rounded */}
      <div className="mx-auto max-w-[1400px] bg-ink text-white rounded-[28px] md:rounded-[36px] overflow-hidden">

        {/* CTA Banner — green strip */}
        <div className="bg-accent px-8 md:px-14 py-8 md:py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div>
              <h3 className="text-xl md:text-2xl font-heading font-bold text-white leading-tight mb-1">
                Want to reach 50K+ decision-makers?
              </h3>
              <p className="text-[14px] text-white/60">
                Premium placements for enterprise brands. No programmatic ads.
              </p>
            </div>
            <a
              href="mailto:advertise@ledgerbusinesses.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-accent text-[13px] font-semibold rounded-full hover:bg-ink/90 transition-all shrink-0"
            >
              Advertise with us
              <IconArrowUpRight size={13} />
            </a>
          </div>
        </div>

        {/* Footer content */}
        <div className="px-8 md:px-14 pt-14 pb-8">
          {/* Brand + nav grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
            {/* Brand — spans 2 cols on md */}
            <div className="col-span-2">
              <div className="mb-5">
                <LogoFull variant="light" />
              </div>
              <p className="text-[13px] text-white/45 leading-relaxed max-w-[280px] mb-6">
                The authority in business intelligence. Premium editorial coverage for those who lead.
              </p>
              {/* Social row — simple text links */}
              <div className="flex items-center gap-4">
                <a href="#" className="text-[12px] text-white/40 hover:text-accent transition-colors font-medium">Twitter</a>
                <span className="w-px h-3 bg-white/10" />
                <a href="#" className="text-[12px] text-white/40 hover:text-accent transition-colors font-medium">LinkedIn</a>
                <span className="w-px h-3 bg-white/10" />
                <a href="#" className="text-[12px] text-white/40 hover:text-accent transition-colors font-medium">RSS</a>
              </div>
            </div>

            {/* Explore */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 mb-5">
                Explore
              </h4>
              <ul className="space-y-2.5">
                {footerNav.explore.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-white/50 hover:text-accent transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Topics */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 mb-5">
                Topics
              </h4>
              <ul className="space-y-2.5">
                {footerNav.topics.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-white/50 hover:text-accent transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 mb-5">
                Company
              </h4>
              <ul className="space-y-2.5">
                {footerNav.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-white/50 hover:text-accent transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/[0.06]">
            <p className="text-[11px] text-white/30">
              &copy; {new Date().getFullYear()} Ledger Businesses. All rights reserved.
            </p>
            <p className="text-[11px] text-white/30">
              Built with conviction, not compromise.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
