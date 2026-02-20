import Link from 'next/link';
import { formatDate, formatViews } from '@/lib/utils';
import { IconArrowRight, IconClock, IconEye } from '@/components/icons';
import type { PostWithRelations } from '@/lib/types/database';

interface PostCardProps {
  post: PostWithRelations;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/articles/${post.slug}`} className="group block">
      <article className="flex gap-5 py-5 border-b border-ink/[0.05] transition-all">
        {/* Thumbnail */}
        <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-28 rounded-2xl bg-warm overflow-hidden relative">
          {post.cover_image ? (
            <img 
              src={post.cover_image} 
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-heading font-black text-ink/[0.03] text-[32px] select-none">LB</span>
            </div>
          )}
          {/* Hover arrow */}
          <div className="absolute inset-0 flex items-center justify-center bg-accent/0 group-hover:bg-accent/70 transition-all duration-300">
            <span className="w-7 h-7 rounded-full bg-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
              <IconArrowRight size={11} className="text-accent" />
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <span className="inline-block px-2 py-0.5 bg-accent/20 text-accent text-[10px] font-bold rounded-md uppercase tracking-wide mb-2">
            {post.category.name}
          </span>

          <h3 className="text-[15px] sm:text-[17px] font-bold text-ink leading-snug mb-1 group-hover:text-ink/60 transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-[13px] text-ink/55 leading-relaxed mb-2.5 hidden sm:block line-clamp-1">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-2 text-[11px]">
            <div className="w-4 h-4 rounded-full bg-accent/25 flex items-center justify-center text-[7px] font-black text-ink/50 shrink-0">
              {post.author.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="font-medium text-ink/60">{post.author.name}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-ink/10" />
            <span className="text-ink/50">{formatDate(post.published_at || post.created_at)}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-ink/10 hidden sm:block" />
            <span className="text-ink/50 items-center gap-0.5 hidden sm:flex">
              <IconClock size={10} />
              {post.reading_time} min
            </span>
            <span className="w-0.5 h-0.5 rounded-full bg-ink/10 hidden sm:block" />
            <span className="text-ink/50 items-center gap-0.5 hidden sm:flex">
              <IconEye size={10} />
              {formatViews(post.view_count)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
