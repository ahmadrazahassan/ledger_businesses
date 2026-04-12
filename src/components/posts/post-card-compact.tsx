import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { PostWithRelations } from '@/lib/types/database';

interface PostCardCompactProps {
  post: PostWithRelations;
  rank?: number;
}

const eyebrow =
  'text-[11px] font-semibold uppercase tracking-[0.07em] text-accent-content';

export function PostCardCompact({ post, rank }: PostCardCompactProps) {
  return (
    <Link
      href={`/articles/${post.slug}`}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-content/35 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      <article className="relative flex items-start gap-4 border-b border-ink/[0.06] py-4 transition-colors duration-300 last:border-b-0 hover:bg-black/[0.02] sm:gap-5 sm:rounded-xl sm:px-3 sm:py-4">
        {rank !== undefined && (
          <span className="w-9 shrink-0 pt-0.5 text-right font-heading text-[24px] font-bold tabular-nums leading-none text-ink/[0.18] transition-colors duration-300 group-hover:text-accent-content/90 sm:w-10 sm:text-[28px]">
            {String(rank).padStart(2, '0')}
          </span>
        )}

        <div className="min-w-0 flex-1 border-l-[3px] border-transparent pl-3 transition-colors duration-300 group-hover:border-accent-content/85 sm:pl-4">
          <p className={eyebrow}>{post.category.name}</p>
          <h4 className="mt-1.5 line-clamp-2 font-heading text-[15px] font-bold leading-[1.3] tracking-[-0.022em] text-ink transition-colors duration-300 group-hover:text-ink sm:text-[16px]">
            {post.title}
          </h4>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-2 text-[12px] tabular-nums text-ink/[0.52]">
            <span className="font-medium text-ink/[0.62]">{post.author.name}</span>
            <span className="text-ink/28" aria-hidden>
              ·
            </span>
            <time dateTime={post.published_at || post.created_at}>
              {formatDate(post.published_at || post.created_at)}
            </time>
          </div>
        </div>
      </article>
    </Link>
  );
}
