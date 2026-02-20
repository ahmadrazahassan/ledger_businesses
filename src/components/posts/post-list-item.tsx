import Link from 'next/link';
import { formatDate, formatViews } from '@/lib/utils';
import { IconArrowRight, IconClock, IconEye } from '@/components/icons';
import type { PostWithRelations } from '@/lib/types/database';

interface PostListItemProps {
  post: PostWithRelations;
}

export function PostListItem({ post }: PostListItemProps) {
  return (
    <Link href={`/articles/${post.slug}`} className="group block">
      <article className="flex items-center justify-between gap-6 py-5 border-b border-ink/6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-[11px] font-semibold text-ink/50 uppercase tracking-wide">
              {post.category.name}
            </span>
            <span className="text-gray-light text-[11px]">&middot;</span>
            <span className="text-[11px] text-gray flex items-center gap-1">
              <IconClock size={10} />
              {post.reading_time} min read
            </span>
            <span className="text-gray-light text-[11px]">&middot;</span>
            <span className="text-[11px] text-gray flex items-center gap-1">
              <IconEye size={10} />
              {formatViews(post.view_count)} views
            </span>
          </div>
          <h4 className="text-base font-bold text-ink leading-snug group-hover:text-ink/70 transition-colors">
            {post.title}
          </h4>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-gray">
            <span>{post.author.name}</span>
            <span className="text-gray-light">&middot;</span>
            <span>{formatDate(post.published_at || post.created_at)}</span>
          </div>
        </div>
        <div className="shrink-0 text-ink/50 group-hover:text-ink/70 transition-colors group-hover:translate-x-0.5 transition-transform">
          <IconArrowRight size={18} />
        </div>
      </article>
    </Link>
  );
}
