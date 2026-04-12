import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { IconArrowRight, IconClock } from '@/components/icons';
import type { PostWithRelations } from '@/lib/types/database';

interface PostCardProps {
  post: PostWithRelations;
  variant?: 'default' | 'category';
}

/** Apple-style editorial: crisp eyebrow, readable secondary */
const eyebrow =
  'text-[11px] font-semibold uppercase tracking-[0.07em] text-accent-content';
const metaMuted = 'text-[12px] leading-none text-ink/[0.52]';
const excerptStyle = 'text-[14px] leading-[1.55] text-ink/[0.62] sm:text-[15px]';
const focusRing =
  'rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-content/35 focus-visible:ring-offset-2 focus-visible:ring-offset-cream';

const cardShell =
  'overflow-hidden rounded-[22px] border border-ink/[0.08] bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_28px_rgba(30,31,38,0.06)] transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-1 hover:border-ink/[0.11] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04),0_20px_48px_rgba(30,31,38,0.08)]';

export function PostCard({ post, variant = 'default' }: PostCardProps) {
  const isCategory = variant === 'category';

  const imageSizes = isCategory
    ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    : '128px';

  if (isCategory) {
    return (
      <Link href={`/articles/${post.slug}`} className={`group block h-full ${focusRing}`}>
        <article className={`flex h-full flex-col ${cardShell}`}>
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-warm">
            {post.cover_image ? (
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                sizes={imageSizes}
                quality={90}
                className="object-cover transition-transform duration-[650ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.02]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-warm via-warm to-ink/[0.04]">
                <span className="select-none font-heading text-[72px] font-bold text-ink/[0.07] sm:text-[84px]">
                  LB
                </span>
              </div>
            )}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/[0.14] to-transparent"
              aria-hidden
            />
          </div>

          <div className="flex flex-1 flex-col border-t border-ink/[0.06] p-5 sm:p-6">
            <p className={`${eyebrow} mb-2.5`}>{post.category.name}</p>
            <h3 className="mb-2.5 line-clamp-3 font-heading text-[20px] font-bold leading-[1.22] tracking-[-0.028em] text-ink transition-colors duration-300 group-hover:text-ink sm:text-[22px]">
              {post.title}
            </h3>
            <p className={`mb-6 line-clamp-3 ${excerptStyle}`}>{post.excerpt}</p>

            <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-ink/[0.07] pt-4">
              <time className={`${metaMuted} tabular-nums`} dateTime={post.published_at || post.created_at}>
                {formatDate(post.published_at || post.created_at)}
              </time>
              <span className="h-3 w-px bg-ink/18" aria-hidden />
              <span className={`flex items-center gap-1.5 ${metaMuted} tabular-nums`}>
                <IconClock size={12} className="shrink-0 text-ink/40" aria-hidden />
                {post.reading_time} min read
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link
      href={`/articles/${post.slug}`}
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-content/35 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      <article className="flex gap-5 border-b border-ink/[0.07] py-6 transition-colors duration-300 first:pt-0 last:border-b-0 hover:bg-black/[0.02] sm:gap-6 sm:rounded-2xl sm:px-4 sm:py-6 sm:first:pt-4">
        <div className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-2xl bg-warm shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-ink/[0.06] sm:h-[112px] sm:w-[112px]">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt=""
              fill
              sizes={imageSizes}
              quality={90}
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-warm to-ink/[0.03]">
              <span className="font-heading text-[30px] font-bold text-ink/[0.09]">LB</span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 py-0.5">
          <p className={`${eyebrow} mb-1.5`}>{post.category.name}</p>
          <h3 className="mb-1.5 line-clamp-2 font-heading text-[16px] font-bold leading-[1.28] tracking-[-0.024em] text-ink transition-colors duration-300 group-hover:text-ink sm:text-[18px]">
            {post.title}
          </h3>
          <p className={`mb-3 line-clamp-2 text-[13px] leading-relaxed text-ink/[0.58] sm:mb-3.5 sm:text-[14px]`}>
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-ink/[0.52]">
            <span className="font-medium text-ink/[0.62]">{post.author.name}</span>
            <span className="text-ink/28" aria-hidden>
              ·
            </span>
            <time className="tabular-nums" dateTime={post.published_at || post.created_at}>
              {formatDate(post.published_at || post.created_at)}
            </time>
            <span className="hidden text-ink/28 sm:inline" aria-hidden>
              ·
            </span>
            <span className="hidden items-center gap-1 sm:flex">
              <IconClock size={11} className="text-ink/42" aria-hidden />
              {post.reading_time} min
            </span>
          </div>
        </div>

        <div className="hidden shrink-0 self-center sm:flex">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/[0.1] bg-white/80 text-ink/42 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:border-accent-content/25 group-hover:bg-white group-hover:text-accent-content">
            <IconArrowRight size={17} aria-hidden />
          </span>
        </div>
      </article>
    </Link>
  );
}
