import { IconArrowUpRight } from '@/components/icons';

export function SponsorInlineCard() {
  return (
    <a
      href="https://example.com/sponsor"
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group block relative my-3 py-4 px-5 rounded-2xl bg-accent/[0.06] border border-accent/15 transition-all duration-300 hover:bg-accent/[0.12] hover:border-accent/25"
    >
      <div className="flex items-center gap-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
          <span className="text-ink/50 text-[10px] font-black">AD</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-ink/60">
            Scale your B2B pipeline with precision
          </p>
          <p className="text-[11px] text-ink/50">Ledger Businesses Partners</p>
        </div>
        <div className="shrink-0 w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-ink/50 group-hover:bg-accent group-hover:text-ink transition-all duration-300">
          <IconArrowUpRight size={12} />
        </div>
      </div>
      <span className="absolute top-2 right-3 text-[8px] font-bold text-ink/10 uppercase tracking-[0.15em]">
        Sponsor
      </span>
    </a>
  );
}
