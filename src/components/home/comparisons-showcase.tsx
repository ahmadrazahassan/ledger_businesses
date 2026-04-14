import Link from 'next/link';
import { PostCardHero } from '@/components/posts/post-card-hero';
import { IconArrowRight } from '@/components/icons';
import type { PostWithRelations } from '@/lib/types/database';

/** Same section chrome as {@link CategorySpotlight}; only the card grid layout differs (lead + two-column grid). */
export function ComparisonsShowcase({ posts }: { posts: PostWithRelations[] }) {
  if (!posts?.length) return null;

  const [lead, ...others] = posts;

  return (
    <div className="py-8" aria-labelledby="comparisons-heading">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">Compare</span>
          </div>
          <h2
            id="comparisons-heading"
            className="text-3xl font-heading font-bold leading-tight text-ink md:text-4xl"
          >
            Comparisons
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] text-ink/55">
            Side-by-side reviews and buyer guides — see trade-offs, pricing context, and UK compliance fit before you
            shortlist.
          </p>
        </div>
        <Link
          href="/category/comparisons"
          className="inline-flex items-center gap-2 text-[13px] font-bold text-accent-content transition-colors hover:text-accent-content/80"
        >
          View all
          <IconArrowRight size={12} />
        </Link>
      </div>

      <div className="space-y-5 md:space-y-6">
        <PostCardHero post={lead} size="large" />

        {others.length > 0 && (
          <div
            className={`grid gap-6 md:gap-7 lg:gap-8 ${
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
  );
}
