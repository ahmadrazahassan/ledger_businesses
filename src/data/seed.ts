// ── Ledger Businesses — Seed Data ──
// Realistic demo content for rendering the homepage. No lorem ipsum.

import type { Author, Category, PostWithRelations, Banner } from '@/lib/types/database';

export const authors: Author[] = [
  {
    id: 'a1',
    name: 'Fiza Kanwal',
    slug: 'fiza-kanwal',
    bio: 'Senior editor covering enterprise technology, AI, B2B strategy, and the future of work. Passionate about making complex business concepts accessible to decision-makers.',
    avatar_url: '/avatars/fiza.jpg',
    email: null,
    twitter: 'fizakanwal',
    linkedin: 'fizakanwal',
    website: null,
    is_active: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
];

// Helper to build inline author for posts
const inlineAuthor: Author = {
  id: 'a1',
  name: 'Fiza Kanwal',
  slug: 'fiza-kanwal',
  bio: '',
  avatar_url: '/avatars/fiza.jpg',
  email: null,
  twitter: 'fizakanwal',
  linkedin: 'fizakanwal',
  website: null,
  is_active: true,
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
};

export const categories: Category[] = [
  { id: 'c1', name: 'Accounting & Bookkeeping', slug: 'accounting-bookkeeping', description: 'Accounting & Bookkeeping related articles', color: '#2563eb', icon: null, sort_order: 1, post_count: 0, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'c2', name: 'Invoicing', slug: 'invoicing', description: 'Invoicing related articles', color: '#7c3aed', icon: null, sort_order: 2, post_count: 0, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'c3', name: 'Payroll', slug: 'payroll', description: 'Payroll related articles', color: '#059669', icon: null, sort_order: 3, post_count: 0, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'c4', name: 'HR', slug: 'hr', description: 'HR related articles', color: '#dc2626', icon: null, sort_order: 4, post_count: 0, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'c5', name: 'Reporting & Business Insights', slug: 'reporting-business-insights', description: 'Reporting & Business Insights related articles', color: '#0891b2', icon: null, sort_order: 5, post_count: 0, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'c6', name: 'VAT & Tax Compliance', slug: 'vat-tax-compliance', description: 'VAT & Tax Compliance related articles', color: '#ea580c', icon: null, sort_order: 6, post_count: 0, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'c7', name: 'Comparisons', slug: 'comparisons', description: 'Software comparisons and side-by-side buying guides for UK businesses.', color: '#52525b', icon: null, sort_order: 7, post_count: 0, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'c8', name: 'Small Business', slug: 'small-business', description: 'Guides and software advice for UK small businesses and sole traders.', color: '#0f766e', icon: null, sort_order: 8, post_count: 0, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

// Helper to get inline category by id
function inlineCat(id: string): Category {
  return categories.find((c) => c.id === id) ?? { ...categories[0], id };
}

export const posts: PostWithRelations[] = [
  {
    id: 'p1',
    title: 'Sage Business Cloud Accounting Review (2026): Best for UK Sole Traders?',
    slug: 'sage-accounting-review-uk',
    excerpt: 'An in-depth, hands-on review of Sage Business Cloud Accounting for UK businesses. We test bank feeds, invoicing, VAT returns, and Making Tax Digital compliance.',
    content_html: '<p>If you run a small business in the UK, you know that keeping HMRC happy while managing cash flow is a constant balancing act...</p>',
    content_text: 'If you run a small business in the UK, you know that keeping HMRC happy while managing cash flow is a constant balancing act...',
    cover_image: '',
    author_id: 'a1',
    category_id: 'c1',
    tags: ['Sage', 'Accounting', 'Review', 'UK', 'Software'],
    status: 'published',
    published_at: '2026-02-05T09:00:00Z',
    created_at: '2026-02-03T14:00:00Z',
    updated_at: '2026-02-05T09:00:00Z',
    reading_time: 15,
    featured_rank: 1,
    view_count: 12400,
    like_count: 1775,
    canonical_url: null,
    seo_title: 'Sage Accounting Review 2026: UK Small Business Guide',
    seo_description: 'Honest hands-on review of Sage Business Cloud Accounting. Pricing, pros, cons, and MTD compliance for UK limited companies and sole traders.',
    og_image: '',
    author: inlineAuthor,
    category: inlineCat('c1'),
  },
  {
    id: 'p2',
    title: 'Sage vs Xero: Which is Better for UK Limited Companies?',
    slug: 'sage-vs-xero-uk-comparison',
    excerpt: 'We compare Sage and Xero side-by-side. From payroll integrations to inventory management, find out which software is right for your UK business.',
    content_html: '<p>Choosing between Sage and Xero is one of the most common decisions UK founders face when setting up their finance stack...</p>',
    content_text: 'Choosing between Sage and Xero is one of the most common decisions UK founders face when setting up their finance stack...',
    cover_image: '',
    author_id: 'a1',
    category_id: 'c1',
    tags: ['Sage', 'Xero', 'Comparison', 'UK', 'Accounting'],
    status: 'published',
    published_at: '2026-02-04T08:00:00Z',
    created_at: '2026-02-02T10:00:00Z',
    updated_at: '2026-02-04T08:00:00Z',
    reading_time: 12,
    featured_rank: 2,
    view_count: 9300,
    like_count: 1225,
    canonical_url: null,
    seo_title: 'Sage vs Xero (2026): The Ultimate UK Comparison',
    seo_description: 'Sage or Xero? We break down pricing, features, payroll, and HMRC integrations to help UK limited companies decide.',
    og_image: '',
    author: inlineAuthor,
    category: inlineCat('c1'),
  },
  {
    id: 'p3',
    title: 'Making Tax Digital (MTD) for ITSA: What Sole Traders Need to Know',
    slug: 'making-tax-digital-itsa-guide-uk',
    excerpt: 'HMRC is expanding Making Tax Digital to Income Tax Self Assessment (ITSA). Learn the deadlines, software requirements, and how to prepare.',
    content_html: '<p>Making Tax Digital (MTD) has already transformed VAT reporting, and now it’s coming for Income Tax...</p>',
    content_text: 'Making Tax Digital (MTD) has already transformed VAT reporting, and now it’s coming for Income Tax...',
    cover_image: '',
    author_id: 'a1',
    category_id: 'c6',
    tags: ['MTD', 'HMRC', 'Tax', 'UK', 'Sole Trader'],
    status: 'published',
    published_at: '2026-02-03T07:00:00Z',
    created_at: '2026-02-01T09:00:00Z',
    updated_at: '2026-02-03T07:00:00Z',
    reading_time: 10,
    featured_rank: 3,
    view_count: 8100,
    like_count: 950,
    canonical_url: null,
    seo_title: 'MTD for ITSA Guide 2026 | UK Making Tax Digital',
    seo_description: 'Everything UK sole traders need to know about Making Tax Digital for ITSA, including HMRC deadlines and Sage software solutions.',
    og_image: '',
    author: inlineAuthor,
    category: inlineCat('c6'),
  },
  {
    id: 'p4',
    title: 'How to Run Your First UK Payroll: A Step-by-Step Guide',
    slug: 'how-to-run-first-uk-payroll',
    excerpt: 'Hiring your first employee? This guide covers PAYE registration, pension auto-enrolment, and choosing the right payroll software.',
    content_html: '<p>Running payroll for the first time in the UK can be daunting. From understanding National Insurance to setting up a workplace pension...</p>',
    content_text: 'Running payroll for the first time in the UK can be daunting. From understanding National Insurance to setting up a workplace pension...',
    cover_image: '',
    author_id: 'a1',
    category_id: 'c3',
    tags: ['Payroll', 'PAYE', 'UK', 'HR', 'Guide'],
    status: 'published',
    published_at: '2026-02-02T10:00:00Z',
    created_at: '2026-01-30T11:00:00Z',
    updated_at: '2026-02-02T10:00:00Z',
    reading_time: 9,
    featured_rank: 4,
    view_count: 7500,
    like_count: 820,
    canonical_url: null,
    seo_title: 'How to Run Your First UK Payroll (2026 Guide)',
    seo_description: 'A step-by-step guide to running UK payroll for the first time. Covers PAYE, pensions, HMRC reporting, and payroll software.',
    og_image: '',
    author: inlineAuthor,
    category: inlineCat('c3'),
  },
  {
    id: 'p5',
    title: 'Best Invoicing Software for UK Freelancers',
    slug: 'best-invoicing-software-uk-freelancers',
    excerpt: 'Stop using Word documents for invoices. We review the best UK invoicing tools that help you get paid faster and track late payments.',
    content_html: '<p>Cash flow is the lifeblood of any freelance business. If your invoicing process involves manually updating a template...</p>',
    content_text: 'Cash flow is the lifeblood of any freelance business. If your invoicing process involves manually updating a template...',
    cover_image: '',
    author_id: 'a1',
    category_id: 'c2',
    tags: ['Invoicing', 'UK', 'Freelance', 'Software', 'Reviews'],
    status: 'published',
    published_at: '2026-02-01T09:00:00Z',
    created_at: '2026-01-28T14:00:00Z',
    updated_at: '2026-02-01T09:00:00Z',
    reading_time: 7,
    featured_rank: null,
    view_count: 5200,
    like_count: 610,
    canonical_url: null,
    seo_title: 'Best Invoicing Software for UK Freelancers in 2026',
    seo_description: 'Compare the best UK invoicing software for freelancers and sole traders. Get paid faster with automated reminders and online payments.',
    og_image: '',
    author: inlineAuthor,
    category: inlineCat('c2'),
  }
];

export const banners: Banner[] = [];

// ── Helper to get seed data for the homepage ──
export function getFeaturedPosts(): PostWithRelations[] {
  return posts.filter((p) => p.featured_rank !== null).sort((a, b) => (a.featured_rank ?? 99) - (b.featured_rank ?? 99));
}

export function getLatestPosts(): PostWithRelations[] {
  return [...posts].sort((a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime());
}

export function getTrendingPosts(): PostWithRelations[] {
  return posts.slice(0, 8);
}

export function getEditorPicks(): PostWithRelations[] {
  return [posts[3], posts[5], posts[8], posts[11]];
}

export function getBannerByPlacement(placement: string): Banner | undefined {
  return banners.find((b) => b.placement_key === placement && b.active);
}
