import { PostCardHero } from '@/components/posts/post-card-hero';
import { EditorialArrowLink } from '@/components/ui/editorial-cta';
import type { PostWithRelations } from '@/lib/types/database';

/** Homepage-only: flagship layout for the Comparisons category (editorial / buyer-guide positioning). */
export function ComparisonsShowcase({ posts }: { posts: PostWithRelations[] }) {
  if (!posts?.length) return null;

  const [lead, ...others] = posts;

  return (
    <section
      className="relative overflow-hidden rounded-[28px] border border-ink/[0.09] bg-gradient-to-br from-white via-white to-cream/80 shadow-[0_2px_24px_rgba(30,31,38,0.06)]"
      aria-labelledby="comparisons-heading"
    >
      {/* Top band — distinct from standard topic strips */}
      <div className="flex flex-col gap-4 border-b border-ink/[0.06] bg-ink/[0.03] px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8 md:py-5">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="hidden h-8 w-px bg-ink/20 sm:block"
            aria-hidden
          />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/45">
              Software comparisons
            </p>
            <p className="mt-0.5 text-[13px] font-medium text-ink/55">
              Independent head-to-head reviews and buyer guides for UK finance teams
            </p>
          </div>
        </div>
        <VsBadge />
      </div>

      <div className="grid gap-10 p-6 md:gap-12 md:p-8 lg:grid-cols-12 lg:gap-14 lg:p-10">
        {/* Intro column — editorial, not a card grid */}
        <div className="flex flex-col justify-between gap-8 lg:col-span-4">
          <div>
            <h2
              id="comparisons-heading"
              className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-heading font-bold leading-[1.08] tracking-[-0.035em] text-ink"
            >
              Comparisons
            </h2>
            <p className="mt-4 text-[15px] leading-[1.65] text-ink/55 md:text-[16px]">
              Side-by-side analysis of accounting and payroll platforms — structured so you can see trade-offs,
              pricing context, and fit for UK compliance before you shortlist vendors.
            </p>
          </div>
          <div className="border-t border-ink/[0.07] pt-6">
            <EditorialArrowLink href="/category/comparisons" className="gap-3">
              Browse all comparisons
            </EditorialArrowLink>
          </div>
        </div>

        {/* Cards — asymmetric: one hero + supporting grid */}
        <div className="lg:col-span-8">
          <div className="space-y-5 md:space-y-6">
            <PostCardHero post={lead} size="large" />

            {others.length > 0 && (
              <div
                className={`grid gap-5 md:gap-6 ${
                  others.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
                }`}
              >
                {others.map((post, idx) => (
                  <div
                    key={post.id}
                    className={
                      others.length === 3 && idx === 2 ? 'sm:col-span-2 sm:flex sm:justify-center' : ''
                    }
                  >
                    <div className={others.length === 3 && idx === 2 ? 'w-full max-w-xl sm:max-w-2xl' : 'w-full'}>
                      <PostCardHero post={post} size="grid" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function VsBadge() {
  return (
    <div
      className="flex shrink-0 items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 shadow-sm"
      aria-hidden
    >
      <span className="text-[11px] font-bold tabular-nums text-ink/35">A</span>
      <span className="rounded-md bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
        vs
      </span>
      <span className="text-[11px] font-bold tabular-nums text-ink/35">B</span>
    </div>
  );
}
