import { PostCardCompact } from '@/components/posts/post-card-compact';
import type { PostWithRelations } from '@/lib/types/database';

interface TrendingListProps {
  posts: PostWithRelations[];
  title: string;
  showRank?: boolean;
}

export function TrendingList({ posts, title, showRank = false }: TrendingListProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/50">
          {title}
        </h3>
      </div>
      <div>
        {posts.map((post, index) => (
          <PostCardCompact
            key={post.id}
            post={post}
            rank={showRank ? index + 1 : undefined}
          />
        ))}
      </div>
    </div>
  );
}
