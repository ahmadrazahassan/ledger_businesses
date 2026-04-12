import Link from 'next/link';
import { PostCardHero } from '@/components/posts/post-card-hero';
import { IconArrowRight } from '@/components/icons';
import type { PostWithRelations } from '@/lib/types/database';

interface CategorySpotlightProps {
  title: string;
  slug: string;
  posts: PostWithRelations[];
  description?: string;
  tagline?: string;
}

export function CategorySpotlight({ title, slug, posts, description, tagline = "Focus" }: CategorySpotlightProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">
              {tagline}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink leading-tight">
            {title}
          </h2>
          {description && (
            <p className="text-[15px] text-ink/55 mt-2 max-w-2xl">
              {description}
            </p>
          )}
        </div>
        <Link 
          href={`/category/${slug}`}
          className="inline-flex items-center gap-2 text-[13px] font-bold text-accent-content hover:text-accent-content/80 transition-colors"
        >
          View all
          <IconArrowRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <div key={post.id} className={i === 0 ? "md:col-span-2 lg:col-span-2 h-full" : "h-full"}>
             <PostCardHero post={post} size={i === 0 ? "large" : "grid"} />
          </div>
        ))}
      </div>
    </div>
  );
}
