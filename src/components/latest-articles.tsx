'use client';

import { useState, useMemo } from 'react';
import { PostCardHero } from '@/components/posts/post-card-hero';
import { PostFilters } from '@/components/posts/post-filters';
import { IconArrowRight } from '@/components/icons';
import type { PostWithRelations, Category } from '@/lib/types/database';

interface LatestArticlesProps {
  posts: PostWithRelations[];
  categories: Category[];
}

export function LatestArticles({ posts, categories }: LatestArticlesProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState('latest');
  const [showCount, setShowCount] = useState(12);

  const filtered = useMemo(() => {
    let result = [...posts];
    if (activeCategory) {
      result = result.filter((p) => p.category.slug === activeCategory);
    }
    result.sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime();
      const dateB = new Date(b.published_at || b.created_at).getTime();
      return activeSort === 'oldest' ? dateA - dateB : dateB - dateA;
    });
    return result;
  }, [posts, activeCategory, activeSort]);

  const visible = filtered.slice(0, showCount);
  const hasMore = showCount < filtered.length;

  return (
    <div>
      <PostFilters
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activeSort={activeSort}
        onSortChange={setActiveSort}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7 lg:gap-8">
        {visible.map((post) => (
          <div key={post.id} className="h-full">
            <PostCardHero post={post} size="grid" />
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-[15px] font-semibold text-ink/60 mb-1">No articles found</p>
          <p className="text-[13px] text-ink/50">Try adjusting your filters.</p>
        </div>
      )}

      {hasMore && (
        <div className="pt-12 text-center">
          <button
            onClick={() => setShowCount((c) => c + 12)}
            className="inline-flex items-center gap-2 pl-8 pr-6 py-3.5 bg-accent text-accent-foreground text-[14px] font-semibold rounded-full transition-colors hover:bg-accent-hover shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Load more articles
            <span className="w-6 h-6 rounded-full bg-ink/10 flex items-center justify-center">
              <IconArrowRight size={12} />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
