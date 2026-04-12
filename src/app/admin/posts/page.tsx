'use client';

import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import { getPosts, deletePost } from './actions';

function AdminPostsPageInner() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const s = searchParams.get('status');
    if (s === 'draft' || s === 'published') setStatusFilter(s);
  }, [searchParams]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const data = await getPosts();
    setPosts(data);
    setLoading(false);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const result = await deletePost(id);
      if (result.success) {
        await loadPosts();
        showToast({
          variant: 'success',
          title: 'Post deleted',
          description: 'The post has been removed successfully.',
        });
      } else {
        showToast({
          variant: 'error',
          title: 'Delete failed',
          description: result.error || 'Unable to delete this post.',
        });
      }
      return;
    }
    showToast({
      variant: 'info',
      title: 'Delete cancelled',
      description: 'No changes were made.',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ink/10 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[14px] text-ink/40 font-medium">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[42px] md:text-[52px] font-heading font-bold text-ink tracking-tight leading-none mb-2">
            Posts
          </h1>
          <p className="text-[16px] text-ink/50 font-medium">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts/import"
            className="px-5 py-3 text-[14px] font-semibold text-ink/60 bg-white border border-ink/[0.08] rounded-full hover:border-ink/15 hover:bg-ink/[0.02] transition-all duration-200"
          >
            Import
          </Link>
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground text-[14px] font-bold rounded-full hover:bg-accent-hover shadow-sm hover:shadow-md transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Post
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <div className="relative">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-ink/[0.08] rounded-full text-[14px] text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/20 focus:ring-4 focus:ring-ink/[0.03] transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white border border-ink/[0.08] rounded-full p-1.5">
          {['all', 'published', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-5 py-2 text-[13px] font-semibold capitalize rounded-full transition-all duration-200 ${
                statusFilter === status
                  ? 'bg-ink text-white'
                  : 'text-ink/50 hover:text-ink/80'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List or Empty State */}
      {filteredPosts.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white border border-ink/[0.06] text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-ink/[0.04] flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink/30">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
            </div>
            <h3 className="text-[24px] font-heading font-bold text-ink mb-3">
              {searchQuery ? 'No posts found' : 'No posts yet'}
            </h3>
            <p className="text-[15px] text-ink/50 mb-8">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first article'}
            </p>
            {!searchQuery && (
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground text-[14px] font-bold rounded-full hover:bg-accent-hover shadow-sm hover:shadow-md transition-all duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create First Post
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="group p-6 rounded-3xl bg-white border border-ink/[0.06] hover:border-ink/10 hover:shadow-lg hover:shadow-ink/[0.04] transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full border ${
                        post.status === 'published'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : post.status === 'draft'
                          ? 'bg-ink/[0.04] text-ink/50 border-ink/10'
                          : 'bg-blue-50 text-blue-600 border-blue-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          post.status === 'published'
                            ? 'bg-emerald-500'
                            : post.status === 'draft'
                            ? 'bg-ink/30'
                            : 'bg-blue-500'
                        }`}
                      />
                      {post.status}
                    </span>
                    <span className="text-[13px] text-ink/40 font-medium">
                      {formatDate(post.published_at || post.created_at)}
                    </span>
                  </div>
                  <Link href={`/admin/posts/${post.id}/edit`}>
                    <h3 className="text-[18px] font-bold text-ink group-hover:text-accent-content transition-colors mb-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-[14px] text-ink/50 line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-[13px] text-ink/40">
                    <span className="inline-flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {post.view_count} views
                    </span>
                    <span>·</span>
                    <span>{post.reading_time} min read</span>
                    <span>·</span>
                    <span className="px-2.5 py-0.5 bg-accent/10 text-accent-content rounded-full font-semibold">
                      {post.category.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="px-4 py-2 text-[13px] font-semibold text-ink/60 bg-white border border-ink/[0.08] rounded-full hover:border-ink/15 hover:text-ink transition-all duration-200"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-4 py-2 text-[13px] font-semibold text-red-500 bg-white border border-red-200 rounded-full hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPostsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-ink/10 border-t-accent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminPostsPageInner />
    </Suspense>
  );
}
