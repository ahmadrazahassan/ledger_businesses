'use client';

import { useState, useMemo } from 'react';
import { PostCard } from '@/components/posts/post-card';
import { PostFilters } from '@/components/posts/post-filters';
import { SponsorInlineCard } from '@/components/sponsors/sponsor-inline-card';
import { IconArrowRight } from '@/components/icons';
import type { PostWithRelations, Category } from '@/lib/types/database';

interface LatestArticlesProps {
  posts: PostWithRelations[];
  categories: Category[];
}

export function LatestArticles({ posts, categories }: LatestArticlesProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState('latest');
  const [showCount, setShowCount] = useState(8);

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

      <div>
        {visible.map((post, index) => (
          <div key={post.id}>
            <PostCard post={post} />
            {(index + 1) % 4 === 0 && index < visible.length - 1 && (
              <SponsorInlineCard />
            )}
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
        <div className="pt-8 text-center">
          <button
            onClick={() => setShowCount((c) => c + 6)}
            className="inline-flex items-center gap-2 pl-6 pr-4 py-2.5 bg-accent text-white text-[13px] font-bold rounded-full hover:bg-accent/85 transition-all"
          >
            Load more
            <span className="w-5 h-5 rounded-full bg-ink/10 flex items-center justify-center">
              <IconArrowRight size={11} />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
