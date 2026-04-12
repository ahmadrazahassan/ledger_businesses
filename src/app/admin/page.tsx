import Link from 'next/link';
import { formatViews } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';

async function getDashboardStats() {
  const supabase = await createClient();

  const [postsResult, categoriesResult, bannersResult] = await Promise.all([
    supabase.from('posts').select('id, status, view_count', { count: 'exact' }),
    supabase.from('categories').select('id', { count: 'exact' }).eq('is_active', true),
    supabase.from('banners').select('id', { count: 'exact' }).eq('is_active', true),
  ]);

  const totalPosts = postsResult.count || 0;
  const publishedPosts = postsResult.data?.filter((p) => p.status === 'published').length || 0;
  const totalViews = postsResult.data?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0;
  const totalCategories = categoriesResult.count || 0;
  const activeBanners = bannersResult.count || 0;

  return {
    totalPosts,
    publishedPosts,
    totalCategories,
    activeBanners,
    totalViews,
  };
}

const quickActions = [
  {
    label: 'New Post',
    href: '/admin/posts/new',
    desc: 'Create a new article',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
  {
    label: 'Manage Categories',
    href: '/admin/categories',
    desc: 'Add or edit topics',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    label: 'Manage Banners',
    href: '/admin/banners',
    desc: 'Configure ad placements',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
      </svg>
    ),
  },
  {
    label: 'Import content',
    href: '/admin/posts/import',
    desc: 'HTML or JSON as drafts',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
];

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    { label: 'Total Posts', value: String(stats.totalPosts), href: '/admin/posts', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { label: 'Published', value: String(stats.publishedPosts), href: '/admin/posts', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: 'Categories', value: String(stats.totalCategories), href: '/admin/categories', color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { label: 'Active Banners', value: String(stats.activeBanners), href: '/admin/banners', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  ];
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-[42px] md:text-[52px] font-heading font-bold text-ink tracking-tight leading-none mb-3">
          Dashboard
        </h1>
        <p className="text-[16px] text-ink/50 font-medium">
          Welcome back. Here's what's happening with your content.
        </p>
      </div>

      {/* Stats Grid - Framer Style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group relative p-6 rounded-3xl bg-white border border-ink/[0.06] hover:border-ink/10 hover:shadow-lg hover:shadow-ink/[0.04] transition-all duration-300"
          >
            <div className="space-y-3">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl border ${stat.color}`}>
                <span className="text-[20px] font-bold">{stat.value}</span>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-ink/60">{stat.label}</p>
              </div>
            </div>
            
            {/* Hover Arrow */}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink/20">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-8 rounded-3xl bg-ink text-white">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[13px] font-bold text-white/40 uppercase tracking-[0.1em] mb-2">Total Views</p>
              <p className="text-[36px] font-heading font-bold tracking-tight">{formatViews(stats.totalViews)}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>
          <p className="text-[13px] text-white/40">Across all published posts</p>
        </div>

        <div className="p-8 rounded-3xl bg-accent text-accent-foreground">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[13px] font-bold text-white/50 uppercase tracking-[0.1em] mb-2">Engagement</p>
              <p className="text-[36px] font-heading font-bold tracking-tight">0</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </div>
          </div>
          <p className="text-[13px] text-white/50">Likes across all posts</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-[20px] font-heading font-bold text-ink mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group p-6 rounded-3xl bg-white border border-ink/[0.06] hover:border-ink/10 hover:shadow-lg hover:shadow-ink/[0.04] transition-all duration-300"
            >
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-2xl bg-ink/[0.04] group-hover:bg-accent/10 flex items-center justify-center text-ink/40 group-hover:text-accent-content transition-all duration-300">
                  {action.icon}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-ink mb-1">{action.label}</p>
                  <p className="text-[13px] text-ink/40">{action.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Empty State for Posts */}
      {stats.totalPosts === 0 && (
        <div className="p-12 rounded-3xl bg-white border border-ink/[0.06] text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-ink/[0.04] flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink/30">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h3 className="text-[20px] font-heading font-bold text-ink mb-2">No posts yet</h3>
            <p className="text-[14px] text-ink/50 mb-6">
              Get started by creating your first article
            </p>
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
          </div>
        </div>
      )}
    </div>
  );
}
