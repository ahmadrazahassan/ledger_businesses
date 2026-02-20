import Link from 'next/link';
import { IconArrowRight } from '@/components/icons';
import type { Category } from '@/lib/types/database';

interface TopicGridProps {
  categories: Category[];
}

export function TopicGrid({ categories }: TopicGridProps) {
  // Split into two rows for a staggered layout
  const firstRow = categories.slice(0, 4);
  const secondRow = categories.slice(4, 8);

  return (
    <div className="space-y-0">
      {/* First row — large items */}
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {firstRow.map((cat) => (
          <TopicItem key={cat.id} category={cat} />
        ))}
      </div>
      {/* Second row */}
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {secondRow.map((cat) => (
          <TopicItem key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}

function TopicItem({ category }: { category: Category }) {
  return (
    <Link href={`/category/${category.slug}`} className="group block">
      <div className="relative py-6 px-5 border-b border-r border-ink/[0.05] transition-colors duration-200 hover:bg-accent/[0.04]">
        {/* Category name — large */}
        <h3 className="text-[18px] md:text-[22px] font-heading font-bold text-ink leading-tight group-hover:text-ink/60 transition-colors duration-200">
          {category.name}
        </h3>

        {/* Article count — green */}
        <span className="text-[11px] font-bold text-accent mt-1 block">
          {category.post_count} articles
        </span>

        {/* Description */}
        <p className="text-[11px] text-ink/50 leading-relaxed mt-2 line-clamp-1 max-w-[200px]">
          {category.description}
        </p>

        {/* Hover arrow — slides in from right */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
          <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
            <IconArrowRight size={12} className="text-ink" />
          </div>
        </div>
      </div>
    </Link>
  );
}
