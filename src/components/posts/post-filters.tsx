'use client';

import type { Category } from '@/lib/types/database';

interface PostFiltersProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
  activeSort: string;
  onSortChange: (sort: string) => void;
}

export function PostFilters({
  categories,
  activeCategory,
  onCategoryChange,
  activeSort,
  onSortChange,
}: PostFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* Category pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-3.5 py-1.5 text-[11px] font-bold rounded-full transition-all duration-200 ${activeCategory === null
            ? 'bg-accent text-white'
            : 'bg-ink/[0.03] text-ink/55 hover:bg-ink/[0.06] hover:text-ink/70'
            }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onCategoryChange(cat.slug === activeCategory ? null : cat.slug)}
            className={`px-3.5 py-1.5 text-[11px] font-bold rounded-full transition-all duration-200 ${activeCategory === cat.slug
              ? 'bg-accent text-white'
              : 'bg-ink/[0.03] text-ink/55 hover:bg-ink/[0.06] hover:text-ink/70'
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sort */}
      <select
        value={activeSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-1.5 bg-white border border-ink/[0.06] rounded-full text-[11px] font-medium text-ink/60 cursor-pointer focus:outline-none focus:border-accent"
        suppressHydrationWarning
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
}
