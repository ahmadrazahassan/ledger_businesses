import Link from 'next/link';
import { formatDate, formatViews } from '@/lib/utils';
import { IconEye } from '@/components/icons';
import type { PostWithRelations } from '@/lib/types/database';

interface PostCardCompactProps {
  post: PostWithRelations;
  rank?: number;
}

export function PostCardCompact({ post, rank }: PostCardCompactProps) {
  return (
    <Link href={`/articles/${post.slug}`} className="group block">
      <article className="flex items-start gap-4 py-3.5 border-b border-ink/[0.04] last:border-b-0">
        {/* Rank — green accent */}
        {rank !== undefined && (
          <span className="shrink-0 text-[28px] font-heading font-black text-accent leading-none pt-0.5 w-7 text-right tabular-nums">
            {String(rank).padStart(2, '0')}
          </span>
        )}

        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold text-accent uppercase tracking-[0.1em]">
            {post.category.name}
          </span>
          <h4 className="text-[13px] font-bold text-ink leading-snug mt-0.5 group-hover:text-ink/60 transition-colors line-clamp-2">
            {post.title}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-[10px] text-ink/50">
            <span>{post.author.name}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-ink/10" />
            <span>{formatDate(post.published_at || post.created_at)}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-ink/10" />
            <span className="flex items-center gap-0.5">
              <IconEye size={9} />
              {formatViews(post.view_count)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
