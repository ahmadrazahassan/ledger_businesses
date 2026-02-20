'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';
import { ImageUpload } from '@/components/admin/image-upload';
import { RichEditor } from '@/components/admin/rich-editor';
import { createPost, getAuthors, getCategories } from '../actions';
import type { PostStatus } from '@/lib/types/database';

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<PostStatus>('draft');
  const [publishDate, setPublishDate] = useState('');
  const [featuredRank, setFeaturedRank] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Data from Supabase
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);

  // Load categories and authors
  useEffect(() => {
    async function loadData() {
      const [categoriesData, authorsData] = await Promise.all([
        getCategories(),
        getAuthors(),
      ]);
      setCategories(categoriesData);
      setAuthors(authorsData);
      if (authorsData.length > 0) {
        setAuthorId(authorsData[0].id);
      }
    }
    loadData();
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugManual) setSlug(slugify(value));
  };

  const handleSave = async () => {
    setError(null);
    setLoading(true);

    try {
      // Validation
      if (!title.trim()) {
        setError('Title is required');
        setLoading(false);
        return;
      }
      if (!categoryId) {
        setError('Please select a category');
        setLoading(false);
        return;
      }
      if (!contentHtml.trim()) {
        setError('Content is required');
        setLoading(false);
        return;
      }

      // Prepare data
      const postData = {
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        excerpt: excerpt.trim(),
        content_html: contentHtml,
        content_text: contentHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
        cover_image: coverImage,
        author_id: authorId,
        category_id: categoryId,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        status,
        published_at: publishDate || null,
        featured_rank: featuredRank ? parseInt(featuredRank) : null,
        seo_title: seoTitle.trim() || title.trim(),
        seo_description: seoDescription.trim() || excerpt.trim(),
        og_image: coverImage,
      };

      const result = await createPost(postData);

      if (result.success) {
        router.push('/admin/posts');
        router.refresh();
      } else {
        setError(result.error || 'Failed to create post');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-5 py-3.5 bg-white border border-ink/[0.08] rounded-2xl text-[15px] text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/20 focus:ring-4 focus:ring-ink/[0.03] transition-all';
  const labelClass = 'block text-[13px] font-bold text-ink/60 mb-2';
  const cardClass = 'bg-white border border-ink/[0.06] rounded-3xl overflow-hidden';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-[13px] text-ink/40 mb-3 font-medium">
            <Link href="/admin/posts" className="hover:text-ink/70 transition-colors">Posts</Link>
            <span>/</span>
            <span className="text-ink/60">New</span>
          </nav>
          <h1 className="text-[42px] md:text-[52px] font-heading font-bold text-ink tracking-tight leading-none">
            New Post
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="px-5 py-3 text-[14px] font-semibold text-ink/60 bg-white border border-ink/[0.08] rounded-full hover:border-ink/15 hover:bg-ink/[0.02] transition-all duration-200"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-white text-[14px] font-bold rounded-full hover:brightness-110 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Publish
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-[14px] font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className={cardClass}>
            <div className="p-6">
              <label className={labelClass}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title..."
                className={`${inputClass} text-[18px] font-semibold`}
              />
            </div>
          </div>

          {/* Slug */}
          <div className={cardClass}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <label className={`${labelClass} mb-0`}>URL Slug</label>
                <button
                  type="button"
                  onClick={() => setSlugManual(!slugManual)}
                  className="text-[12px] font-semibold text-accent hover:text-accent/80 transition-colors"
                >
                  {slugManual ? 'Auto-generate' : 'Edit manually'}
                </button>
              </div>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlugManual(true);
                  setSlug(e.target.value);
                }}
                disabled={!slugManual}
                placeholder="post-url-slug"
                className={`${inputClass} font-mono text-ink/60 disabled:opacity-50 disabled:cursor-not-allowed`}
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className={cardClass}>
            <div className="p-6">
              <label className={labelClass}>Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the article..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {/* Rich Editor */}
          <div className={cardClass}>
            <div className="p-6">
              <label className={labelClass}>Content</label>
              <RichEditor
                value={contentHtml}
                onChange={setContentHtml}
                placeholder="Write your article content here..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className={cardClass}>
            <div className="px-6 py-4 border-b border-ink/[0.06]">
              <h3 className="text-[13px] font-bold text-ink/60 uppercase tracking-[0.1em]">Publish</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PostStatus)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              {(status === 'published' || status === 'scheduled') && (
                <div>
                  <label className={labelClass}>Publish Date</label>
                  <input
                    type="datetime-local"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}
              <div>
                <label className={labelClass}>Featured Rank (optional)</label>
                <input
                  type="number"
                  value={featuredRank}
                  onChange={(e) => setFeaturedRank(e.target.value)}
                  placeholder="Leave empty for none"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className={cardClass}>
            <div className="px-6 py-4 border-b border-ink/[0.06]">
              <h3 className="text-[13px] font-bold text-ink/60 uppercase tracking-[0.1em]">Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Author</label>
                <select
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="AI, Enterprise, Strategy"
                  className={inputClass}
                />
                <p className="mt-2 text-[12px] text-ink/40">Separate tags with commas</p>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className={cardClass}>
            <div className="px-6 py-4 border-b border-ink/[0.06]">
              <h3 className="text-[13px] font-bold text-ink/60 uppercase tracking-[0.1em]">Cover Image</h3>
            </div>
            <div className="p-6">
              <ImageUpload
                value={coverImage}
                onChange={setCoverImage}
                bucket="covers"
                folder="posts"
                label="Upload Cover Image"
                aspectRatio="16/9"
                maxSizeMB={5}
              />
            </div>
          </div>

          {/* SEO */}
          <div className={cardClass}>
            <div className="px-6 py-4 border-b border-ink/[0.06]">
              <h3 className="text-[13px] font-bold text-ink/60 uppercase tracking-[0.1em]">SEO</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Meta Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || 'Meta title'}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Meta Description</label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder={excerpt || 'Meta description'}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
