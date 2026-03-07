import Link from 'next/link';
import { formatDate, formatViews } from '@/lib/utils';
import { IconArrowRight, IconClock, IconEye } from '@/components/icons';
import type { PostWithRelations } from '@/lib/types/database';

interface PostCardProps {
  post: PostWithRelations;
  variant?: 'default' | 'category';
}

export function PostCard({ post, variant = 'default' }: PostCardProps) {
  const isCategory = variant === 'category';

  return (
    <Link href={`/articles/${post.slug}`} className="group block">
      <article className={`${isCategory ? 'rounded-[26px] border border-ink/[0.06] bg-white p-4 sm:p-5 shadow-sm hover:shadow-lg hover:shadow-ink/[0.04] hover:-translate-y-0.5 duration-300' : 'flex gap-5 py-5 border-b border-ink/[0.05] transition-all'}`}>
        {/* Thumbnail */}
        <div className={`${isCategory ? 'w-full h-52 sm:h-64 md:h-72 rounded-3xl mb-4' : 'shrink-0 w-24 h-24 sm:w-32 sm:h-28 rounded-2xl'} bg-warm overflow-hidden relative`}>
          {post.cover_image ? (
            <img 
              src={post.cover_image} 
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-heading font-black text-ink/[0.03] select-none ${isCategory ? 'text-[84px]' : 'text-[32px]'}`}>LB</span>
            </div>
          )}
          {/* Hover arrow */}
          <div className="absolute inset-0 flex items-center justify-center bg-accent/0 group-hover:bg-accent/70 transition-all duration-300">
            <span className={`${isCategory ? 'w-10 h-10' : 'w-7 h-7'} rounded-full bg-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100`}>
              <IconArrowRight size={isCategory ? 14 : 11} className="text-accent" />
            </span>
          </div>
        </div>

        {/* Content */}
        <div className={`${isCategory ? 'min-w-0' : 'flex-1 min-w-0'}`}>
          <span className={`${isCategory ? 'px-3 py-1 rounded-full text-[11px]' : 'px-2 py-0.5 rounded-md text-[10px]'} inline-block bg-accent/20 text-accent font-bold uppercase tracking-wide mb-2`}>
            {post.category.name}
          </span>

          <h3 className={`${isCategory ? 'text-[20px] sm:text-[24px] leading-[1.22] mb-2 line-clamp-3' : 'text-[15px] sm:text-[17px] leading-snug mb-1 line-clamp-2'} font-bold text-ink group-hover:text-ink/60 transition-colors`}>
            {post.title}
          </h3>

          <p className={`${isCategory ? 'text-[14px] sm:text-[15px] mb-4 line-clamp-3 block' : 'text-[13px] mb-2.5 hidden sm:block line-clamp-1'} text-ink/55 leading-relaxed`}>
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className={`${isCategory ? 'text-[12px]' : 'text-[11px]'} flex items-center gap-2`}>
            <div className="w-4 h-4 rounded-full bg-accent/25 flex items-center justify-center text-[7px] font-black text-ink/50 shrink-0">
              {post.author.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="font-medium text-ink/60">{post.author.name}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-ink/10" />
            <span className="text-ink/50">{formatDate(post.published_at || post.created_at)}</span>
            <span className={`w-0.5 h-0.5 rounded-full bg-ink/10 ${isCategory ? 'block' : 'hidden sm:block'}`} />
            <span className={`text-ink/50 items-center gap-0.5 ${isCategory ? 'flex' : 'hidden sm:flex'}`}>
              <IconClock size={10} />
              {post.reading_time} min
            </span>
            <span className={`w-0.5 h-0.5 rounded-full bg-ink/10 ${isCategory ? 'block' : 'hidden sm:block'}`} />
            <span className={`text-ink/50 items-center gap-0.5 ${isCategory ? 'flex' : 'hidden sm:flex'}`}>
              <IconEye size={10} />
              {formatViews(post.view_count)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
