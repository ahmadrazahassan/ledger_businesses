import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { IconArrowRight, IconClock } from '@/components/icons';
import type { PostWithRelations } from '@/lib/types/database';

interface PostCardHeroProps {
  post: PostWithRelations;
  size?: 'large' | 'medium' | 'grid';
  priority?: boolean;
}

const eyebrow =
  'text-[11px] font-semibold uppercase tracking-[0.07em] text-accent-content';
const metaStyle = 'text-[12px] text-ink/[0.52]';
const focusRing =
  'rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-content/35 focus-visible:ring-offset-2 focus-visible:ring-offset-cream';

const cardShellBase =
  'relative flex flex-col overflow-hidden rounded-[22px] border border-ink/[0.08] bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_28px_rgba(30,31,38,0.06)] transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-1 hover:border-ink/[0.11] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04),0_20px_48px_rgba(30,31,38,0.08)]';

/** Medium / grid: fill grid cells. Large: content-height only — avoids empty flex gap above meta row. */
const cardShell = `${cardShellBase} h-full`;

export function PostCardHero({ post, size = 'large', priority = false }: PostCardHeroProps) {
  const isLarge = size === 'large';
  const isGrid = size === 'grid';

  const imageSizes = isLarge
    ? '(max-width: 1024px) 100vw, 66vw'
    : isGrid
      ? '(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 680px'
      : '(max-width: 1024px) 100vw, 33vw';

  /** Large hero: taller image region so covers read clearly; object-cover fills the frame. */
  const imageAreaClass = isLarge
    ? 'relative w-full overflow-hidden bg-warm h-[296px] sm:h-[336px] md:h-[392px] lg:h-[min(432px,41vw)]'
    : isGrid
      ? 'relative w-full overflow-hidden bg-warm h-[204px] md:h-[244px]'
      : 'relative w-full overflow-hidden bg-warm h-[168px]';

  return (
    <Link
      href={`/articles/${post.slug}`}
      className={`group block ${isLarge ? 'h-auto min-h-0' : 'h-full min-h-0'} ${focusRing}`}
    >
      <article className={isLarge ? cardShellBase : cardShell}>
        <div className={imageAreaClass}>
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes={imageSizes}
              quality={90}
              priority={priority}
              className="object-cover transition-transform duration-[650ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-warm via-warm to-ink/[0.04]">
              <span
                className={`select-none font-heading font-bold text-ink/[0.07] ${isLarge ? 'text-[96px] md:text-[116px]' : 'text-[58px]'}`}
              >
                LB
              </span>
            </div>
          )}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/[0.16] to-transparent"
            aria-hidden
          />
        </div>

        <div
          className={`flex flex-col border-t border-ink/[0.06] ${isLarge ? 'p-6 md:p-7' : isGrid ? 'flex-1 p-6' : 'flex-1 p-5'}`}
        >
          <p className={`${eyebrow} mb-2.5 md:mb-3`}>{post.category.name}</p>

          <h3
            className={`font-heading font-bold tracking-[-0.028em] text-ink transition-colors duration-300 group-hover:text-ink ${
              isLarge
                ? 'text-[21px] leading-[1.2] md:text-[26px] md:leading-[1.15]'
                : isGrid
                  ? 'text-lg leading-[1.25] md:text-[20px]'
                  : 'text-[16px] leading-[1.3] md:text-[17px]'
            } mb-2`}
          >
            {post.title}
          </h3>

          {(isLarge || isGrid) && (
            <p className="mb-5 line-clamp-2 text-[14px] leading-[1.55] text-ink/[0.62] md:text-[15px]">{post.excerpt}</p>
          )}

          <div
            className={`flex flex-wrap items-center justify-between gap-3 border-t border-ink/[0.07] pt-4 ${isLarge ? 'mt-0' : 'mt-auto'}`}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <time className={`${metaStyle} tabular-nums`} dateTime={post.published_at || post.created_at}>
                {formatDate(post.published_at || post.created_at)}
              </time>
              <span className="hidden h-3 w-px bg-ink/18 sm:block" aria-hidden />
              <span className={`flex items-center gap-1.5 ${metaStyle} tabular-nums`}>
                <IconClock size={12} className="shrink-0 text-ink/40" aria-hidden />
                {post.reading_time} min read
              </span>
            </div>
            <span className="flex items-center gap-1 text-[13px] font-semibold text-accent-content transition-[gap] duration-300 ease-out group-hover:gap-1.5">
              <span className="max-sm:hidden">Read</span>
              <IconArrowRight size={15} className="shrink-0" aria-hidden />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
