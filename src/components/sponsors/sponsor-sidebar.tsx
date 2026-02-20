import { IconArrowUpRight } from '@/components/icons';

export function SponsorSidebar() {
  return (
    <a
      href="https://example.com/sponsor"
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group block relative rounded-[22px] bg-white border border-ink/[0.06] overflow-hidden transition-all duration-300 hover:shadow-card hover:border-accent/15"
    >
      {/* Green top accent */}
      <div className="h-1 bg-accent" />

      <div className="p-5">
        <div className="w-full h-40 bg-warm rounded-xl mb-4 flex items-center justify-center">
          <span className="text-ink/[0.06] text-[13px] font-medium">300 x 250</span>
        </div>

        <p className="text-[13px] font-semibold text-ink/60 mb-1">
          Premium enterprise solutions
        </p>
        <p className="text-[11px] text-ink/50 leading-relaxed mb-4">
          Reach the leaders who shape strategy.
        </p>

        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-accent group-hover:text-ink transition-colors duration-300">
          Learn more
          <IconArrowUpRight size={11} />
        </div>
      </div>

      <span className="absolute top-4 right-4 text-[8px] font-bold text-ink/10 uppercase tracking-[0.15em]">
        Sponsor
      </span>
    </a>
  );
}
