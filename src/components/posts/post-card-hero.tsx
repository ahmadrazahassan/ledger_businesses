import Link from 'next/link';
import { formatDate, formatViews } from '@/lib/utils';
import { IconArrowRight, IconClock, IconEye } from '@/components/icons';
import type { PostWithRelations } from '@/lib/types/database';

interface PostCardHeroProps {
  post: PostWithRelations;
  size?: 'large' | 'medium' | 'grid';
}

export function PostCardHero({ post, size = 'large' }: PostCardHeroProps) {
  const isLarge = size === 'large';
  const isGrid = size === 'grid';

  return (
    <Link href={`/articles/${post.slug}`} className="group block h-full">
      <article className={`relative h-full overflow-hidden rounded-[24px] border border-ink/[0.06] bg-white transition-all duration-300 hover:shadow-elevated hover:-translate-y-1`}>
        {/* Cover image */}
        <div className={`relative w-full bg-warm overflow-hidden ${isLarge ? 'h-60 md:h-80' : isGrid ? 'h-52 md:h-64' : 'h-40'}`}>
          {post.cover_image ? (
            <img 
              src={post.cover_image} 
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            /* Decorative fallback */
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-heading font-black text-ink/[0.025] select-none ${isLarge ? 'text-[120px]' : 'text-[60px]'}`}>LB</span>
            </div>
          )}

          {/* Category chip top-left */}
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-block px-3 py-1 bg-accent text-white text-[10px] font-black rounded-full uppercase tracking-[0.08em]">
              {post.category.name}
            </span>
          </div>

          {/* Hover arrow */}
          <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg">
            <IconArrowRight size={14} />
          </div>
        </div>

        {/* Content */}
        <div className={`${isLarge ? 'p-6 md:p-8' : isGrid ? 'p-6' : 'p-5'}`}>
          <h3 className={`font-heading font-bold text-ink leading-[1.2] mb-2.5 group-hover:text-ink/70 transition-colors ${isLarge ? 'text-xl md:text-[26px]' : isGrid ? 'text-xl' : 'text-[16px]'}`}>
            {post.title}
          </h3>

          {(isLarge || isGrid) && (
            <p className="text-[14px] text-ink/55 leading-relaxed mb-5 line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-2 text-[11px]">
            {/* Author dot */}
            <div className="w-5 h-5 rounded-full bg-accent/30 flex items-center justify-center text-[8px] font-black text-ink/60 shrink-0">
              {post.author.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="font-medium text-ink/60">{post.author.name}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-ink/15" />
            <span className="text-ink/50">{formatDate(post.published_at || post.created_at)}</span>
            {(isLarge || isGrid) && (
              <>
                <span className="w-0.5 h-0.5 rounded-full bg-ink/15" />
                <span className="text-ink/50 flex items-center gap-0.5">
                  <IconClock size={10} />
                  {post.reading_time} min
                </span>
              </>
            )}
            <span className="w-0.5 h-0.5 rounded-full bg-ink/15" />
            <span className="text-ink/50 flex items-center gap-0.5">
              <IconEye size={10} />
              {formatViews(post.view_count)} views
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
