import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { IconArrowRight, IconClock } from '@/components/icons';
import type { PostWithRelations } from '@/lib/types/database';

interface PostListItemProps {
  post: PostWithRelations;
}

const eyebrow =
  'text-[11px] font-semibold uppercase tracking-[0.07em] text-accent-content';

export function PostListItem({ post }: PostListItemProps) {
  return (
    <Link
      href={`/articles/${post.slug}`}
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-content/35 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      <article className="flex items-center justify-between gap-5 rounded-2xl border-b border-ink/[0.07] py-6 transition-colors duration-300 last:border-b-0 hover:bg-black/[0.02] sm:gap-6 sm:px-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={eyebrow}>{post.category.name}</span>
            <span className="text-ink/30" aria-hidden>
              ·
            </span>
            <span className="flex items-center gap-1 text-[12px] font-medium tabular-nums tracking-normal text-ink/[0.52]">
              <IconClock size={12} className="shrink-0 text-ink/40" aria-hidden />
              {post.reading_time} min read
            </span>
          </div>
          <h4 className="font-heading text-[16px] font-bold leading-[1.3] tracking-[-0.024em] text-ink transition-colors duration-300 group-hover:text-ink sm:text-[17px]">
            {post.title}
          </h4>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 text-[13px] text-ink/[0.55]">
            <span className="font-medium text-ink/[0.62]">{post.author.name}</span>
            <span className="text-ink/28" aria-hidden>
              ·
            </span>
            <time className="tabular-nums" dateTime={post.published_at || post.created_at}>
              {formatDate(post.published_at || post.created_at)}
            </time>
          </div>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/[0.1] bg-white/90 text-ink/42 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:border-accent-content/25 group-hover:bg-white group-hover:text-accent-content sm:h-12 sm:w-12">
          <IconArrowRight size={18} aria-hidden />
        </div>
      </article>
    </Link>
  );
}
