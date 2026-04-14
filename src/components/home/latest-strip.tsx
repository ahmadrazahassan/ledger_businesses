import Link from 'next/link';
import type { PostWithRelations } from '@/lib/types/database';

interface LatestStripProps {
  posts: PostWithRelations[];
  /** Section label above the list */
  eyebrow?: string;
}

/** Numbered quick links to recent posts — editorial, not sponsorship. */
export function LatestStrip({ posts, eyebrow = 'Recently published' }: LatestStripProps) {
  const items = posts.slice(0, 4);

  return (
    <div className="w-full border-y border-ink/[0.06]">
      <div className="mx-auto max-w-[min(1480px,calc(100vw-2.5rem))] px-5 md:px-10 py-5">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">{eyebrow}</span>
          <div className="flex-1 h-px bg-ink/[0.04]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          {items.map((post, i) => (
            <Link key={post.id} href={`/articles/${post.slug}`} className="group flex items-start gap-3">
              <span className="shrink-0 text-[22px] font-heading font-black text-accent-content leading-none mt-0.5 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-accent-content uppercase tracking-[0.08em]">
                  {post.category.name}
                </span>
                <h4 className="text-[13px] font-semibold text-ink leading-snug mt-0.5 group-hover:text-ink/60 transition-colors line-clamp-2">
                  {post.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
