import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { IconArrowRight, IconArrowUpRight } from '@/components/icons';
import type { PostWithRelations } from '@/lib/types/database';

interface SponsorMidBannerProps {
  posts: PostWithRelations[];
}

export function SponsorMidBanner({ posts }: SponsorMidBannerProps) {
  const items = posts.slice(0, 3);

  return (
    <div className="w-full py-6">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="rounded-[24px] bg-ink overflow-hidden">
          <div className="px-7 md:px-10 pt-7 md:pt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                  Featured Reads
                </span>
              </div>
              <Link href="/#latest" className="text-[11px] font-semibold text-accent hover:text-accent/70 transition-colors flex items-center gap-1">
                View all <IconArrowRight size={10} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            {items.map((post) => (
              <Link
                key={post.id}
                href={`/articles/${post.slug}`}
                className="group block px-7 md:px-8 py-6 hover:bg-white/[0.03] transition-colors"
              >
                <span className="text-[10px] font-bold text-accent uppercase tracking-[0.08em]">
                  {post.category.name}
                </span>
                <h4 className="text-[15px] font-semibold text-white leading-snug mt-1.5 mb-3 group-hover:text-white/70 transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-white/40">
                  <span>{post.author.name}</span>
                  <span className="w-0.5 h-0.5 rounded-full bg-white/15" />
                  <span>{post.reading_time} min read</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Sponsor strip at bottom */}
          <div className="px-7 md:px-10 py-3 border-t border-white/[0.04] flex items-center justify-between">
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.15em]">
              Sponsored by Ledger Businesses Partners
            </span>
            <a
              href="mailto:advertise@ledgerbusinesses.com"
              className="text-[10px] font-semibold text-accent/50 hover:text-accent transition-colors flex items-center gap-1"
            >
              Advertise <IconArrowUpRight size={9} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
