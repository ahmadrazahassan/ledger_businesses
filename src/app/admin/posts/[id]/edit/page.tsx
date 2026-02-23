'use client';

import { useState, useRef, useCallback, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { slugify, formatDate } from '@/lib/utils';
import { getPost, getAuthors, getCategories, updatePost, deletePost } from '../../actions';
import type { PostStatus } from '@/lib/types/database';

type EditorTab = 'write' | 'html' | 'preview';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { id } = use(params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    const data = await getPost(id);
    if (data) {
      setPost(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ink/10 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[14px] text-ink/40 font-medium">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-[24px] font-bold text-ink mb-2">Post not found</h2>
          <p className="text-[14px] text-ink/50 mb-6">The post you're looking for doesn't exist.</p>
          <Link href="/admin/posts" className="px-5 py-2 bg-accent text-white text-[12px] font-bold rounded-full hover:brightness-110">
            Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return <EditPostEditor post={post} />;
}

function EditPostEditor({ post }: { post: any }) {
  const router = useRouter();
  const [authors, setAuthors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [slugManual, setSlugManual] = useState(true);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [contentHtml, setContentHtml] = useState(post.content_html);
  const [categoryId, setCategoryId] = useState(post.category_id);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(post.category_ids || [post.category_id]);
  const [authorId, setAuthorId] = useState(post.author_id);
  const [tags, setTags] = useState(post.tags.join(', '));
  const [status, setStatus] = useState<PostStatus>(post.status);
  const [publishDate, setPublishDate] = useState(
    post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : ''
  );
  const [seoTitle, setSeoTitle] = useState(post.seo_title);
  const [seoDescription, setSeoDescription] = useState(post.seo_description);
  const [ogImage, setOgImage] = useState(post.og_image);
  const [activeTab, setActiveTab] = useState<EditorTab>('write');
  const [coverImage, setCoverImage] = useState(post.cover_image);
  const [coverDragOver, setCoverDragOver] = useState(false);
  const [featuredRank, setFeaturedRank] = useState<string>(
    post.featured_rank != null ? String(post.featured_rank) : ''
  );
  const [isDragging, setIsDragging] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const editorInitialized = useRef(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [authorsData, categoriesData] = await Promise.all([
      getAuthors(),
      getCategories(),
    ]);
    setAuthors(authorsData);
    setCategories(categoriesData);
  };

  useEffect(() => {
    if (editorRef.current && !editorInitialized.current) {
      editorRef.current.innerHTML = contentHtml;
      editorInitialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugManual) setSlug(slugify(value));
  };

  const syncEditorContent = useCallback(() => {
    if (editorRef.current) setContentHtml(editorRef.current.innerHTML);
  }, []);

  const insertImageAtCursor = useCallback((src: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const img = document.createElement('img');
    img.src = src;
    img.className = 'max-w-full rounded-xl my-3';
    img.style.maxHeight = '400px';
    const wrapper = document.createElement('div');
    wrapper.className = 'my-2';
    wrapper.appendChild(img);
    range.insertNode(wrapper);
    const newRange = document.createRange();
    newRange.setStartAfter(wrapper);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
    syncEditorContent();
  }, [syncEditorContent]);

  const processImageFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    insertImageAtCursor(url);
  }, [insertImageAtCursor]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) processImageFile(file);
        return;
      }
    }
  }, [processImageFile]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) processImageFile(files[i]);
    }
  }, [processImageFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  const handleInsertImageClick = () => fileInputRef.current?.click();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) processImageFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEditorInput = () => syncEditorContent();
  const handleHtmlChange = (value: string) => setContentHtml(value);

  useEffect(() => {
    if (activeTab === 'write' && editorRef.current && editorInitialized.current) {
      editorRef.current.innerHTML = contentHtml;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleCoverUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverImage(url);
    e.target.value = '';
  }, []);

  const handleCoverDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setCoverDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setCoverImage(url);
    }
  }, []);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    setSaving(true);
    const result = await updatePost(post.id, {
      title,
      slug,
      excerpt,
      content_html: contentHtml,
      content_text: '',
      cover_image: coverImage,
      author_id: authorId,
      category_id: categoryId,
      category_ids: selectedCategories.length > 0 ? selectedCategories : [categoryId],
      tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      status,
      published_at: publishDate || null,
      featured_rank: featuredRank ? parseInt(featuredRank) : null,
      seo_title: seoTitle,
      seo_description: seoDescription,
      og_image: ogImage,
    });

    setSaving(false);

    if (result.success) {
      alert('Post updated successfully!');
      router.push('/admin/posts');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      const result = await deletePost(post.id);
      if (result.success) {
        router.push('/admin/posts');
      } else {
        alert(`Error: ${result.error}`);
      }
    }
  };

  const inputClass = 'w-full px-4 py-3 bg-[#f8f9fb] border border-ink/[0.08] rounded-xl text-[14px] text-ink placeholder:text-ink/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 focus:bg-white transition-all duration-200';
  const labelClass = 'block text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em] mb-1.5';
  const cardClass = 'bg-white border border-ink/[0.06] rounded-2xl overflow-hidden';

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <nav className="flex items-center gap-2 text-[12px] text-ink/40 mb-2 font-medium">
            <Link href="/admin/posts" className="hover:text-ink/70 transition-colors duration-200">Posts</Link>
            <span className="text-ink/15">/</span>
            <span className="text-ink/60">Edit</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] md:text-[34px] font-heading font-bold text-ink tracking-tight">Edit Post</h1>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full border ${post.status === 'published'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : post.status === 'scheduled'
                  ? 'bg-amber-50 text-amber-600 border-amber-200'
                  : 'bg-ink/[0.04] text-ink/50 border-ink/10'
              }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${post.status === 'published' ? 'bg-emerald-500' : post.status === 'scheduled' ? 'bg-amber-500' : 'bg-ink/30'
                }`} />
              {post.status}
            </span>
          </div>
          {post.published_at && (
            <p className="text-[12px] text-ink/40 mt-1 font-medium">
              Published {formatDate(post.published_at)} · {post.reading_time} min read
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/articles/${post.slug}`} className="px-4 py-2 text-[12px] font-semibold text-ink/50 border border-ink/10 rounded-full hover:text-ink hover:border-ink/20 hover:bg-white transition-all duration-200">
            View live ↗
          </Link>
          <button onClick={handleDelete} className="px-4 py-2 text-[12px] font-semibold text-red-500 border border-red-200 rounded-full hover:bg-red-50 hover:border-red-300 transition-all duration-200">
            Delete
          </button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-accent text-white text-[12px] font-bold rounded-full hover:brightness-110 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Content area (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <div className={cardClass}>
            <div className="p-5">
              <label className={labelClass}>Title</label>
              <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Article title" className={`${inputClass} text-base font-semibold`} />
            </div>
          </div>

          {/* Slug */}
          <div className={cardClass}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className={`${labelClass} mb-0`}>Slug</label>
                <button type="button" onClick={() => setSlugManual(!slugManual)} className="text-[10px] font-bold text-accent hover:underline">
                  {slugManual ? 'Auto-generate' : 'Edit manually'}
                </button>
              </div>
              <input type="text" value={slug} onChange={(e) => { setSlugManual(true); setSlug(e.target.value); }} disabled={!slugManual} className={`${inputClass} font-mono text-ink/50 disabled:opacity-40 disabled:cursor-not-allowed`} />
            </div>
          </div>

          {/* Excerpt */}
          <div className={cardClass}>
            <div className="p-5">
              <label className={labelClass}>Excerpt</label>
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief summary of the article..." rows={3} className={`${inputClass} resize-none`} />
            </div>
          </div>

          {/* Editor */}
          <div className={cardClass}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 p-1 bg-ink/[0.03] rounded-xl border border-ink/[0.06]">
                  {(['write', 'html', 'preview'] as EditorTab[]).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 text-[12px] font-semibold capitalize rounded-lg transition-all duration-200 ${activeTab === tab ? 'bg-ink text-white shadow-sm' : 'text-ink/45 hover:text-ink/70 hover:bg-white/60'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                {activeTab === 'write' && (
                  <button type="button" onClick={handleInsertImageClick} className="px-3 py-1.5 text-[12px] font-semibold text-ink/50 border border-ink/[0.08] rounded-lg hover:border-ink/15 hover:text-ink/70 transition-all duration-200">
                    Insert Image
                  </button>
                )}
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

              {activeTab === 'write' && (
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleEditorInput}
                  onPaste={handlePaste}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`w-full min-h-[320px] px-4 py-3.5 bg-[#f8f9fb] border rounded-xl text-[14px] text-ink leading-relaxed focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 focus:bg-white transition-all duration-200 prose prose-sm max-w-none ${isDragging ? 'border-accent border-2 bg-accent/[0.02]' : 'border-ink/[0.08]'
                    }`}
                  data-placeholder="Write your article content here..."
                  style={{ minHeight: '320px' }}
                />
              )}

              {activeTab === 'html' && (
                <textarea value={contentHtml} onChange={(e) => handleHtmlChange(e.target.value)} placeholder="<p>Paste or write HTML here...</p>" rows={16} className={`${inputClass} font-mono leading-relaxed resize-y min-h-[320px]`} />
              )}

              {activeTab === 'preview' && (
                <div className="w-full min-h-[320px] px-4 py-4 bg-[#f8f9fb] border border-ink/[0.08] rounded-xl">
                  {contentHtml ? (
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
                  ) : (
                    <p className="text-[13px] text-ink/30 font-medium">No content to preview.</p>
                  )}
                </div>
              )}

              {activeTab === 'write' && (
                <p className="mt-2 text-[11px] text-ink/35">Paste, drag, or insert images anywhere in the content.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-4">
          {/* Publish Settings */}
          <div className={cardClass}>
            <div className="px-5 py-3.5 border-b border-ink/[0.05]">
              <h3 className="text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em]">Publish</h3>
            </div>
            <div className="p-5 space-y-3.5">
              <div>
                <label className="block text-[12px] text-ink/55 mb-1.5 font-semibold">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as PostStatus)} className={`${inputClass} cursor-pointer`}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              {(status === 'published' || status === 'scheduled') && (
                <div>
                  <label className="block text-[12px] text-ink/55 mb-1.5 font-semibold">Publish Date</label>
                  <input type="datetime-local" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className={inputClass} />
                </div>
              )}
              <div>
                <label className="block text-[12px] text-ink/55 mb-1.5 font-semibold">Featured Rank</label>
                <input type="number" value={featuredRank} onChange={(e) => setFeaturedRank(e.target.value)} placeholder="Leave empty for none" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className={cardClass}>
            <div className="px-5 py-3.5 border-b border-ink/[0.05]">
              <h3 className="text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em]">Details</h3>
            </div>
            <div className="p-5 space-y-3.5">
              <div>
                <label className="block text-[12px] text-ink/55 mb-1.5 font-semibold">Categories (Select Multiple)</label>
                <div className="space-y-2 max-h-64 overflow-y-auto p-3 bg-white border border-ink/[0.08] rounded-xl">
                  {categories.map((category) => {
                    const isSelected = selectedCategories.includes(category.id);
                    const isPrimary = categoryId === category.id;
                    
                    return (
                      <label 
                        key={category.id} 
                        className="flex items-center gap-3 cursor-pointer hover:bg-ink/[0.02] p-2 rounded-lg transition-colors group"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const newSelected = [...selectedCategories, category.id];
                              setSelectedCategories(newSelected);
                              if (!categoryId) {
                                setCategoryId(category.id);
                              }
                            } else {
                              const newSelected = selectedCategories.filter(id => id !== category.id);
                              setSelectedCategories(newSelected);
                              if (categoryId === category.id && newSelected.length > 0) {
                                setCategoryId(newSelected[0]);
                              } else if (newSelected.length === 0) {
                                setCategoryId('');
                              }
                            }
                          }}
                          className="w-4 h-4 text-accent border-ink/20 rounded focus:ring-accent focus:ring-2"
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-ink group-hover:text-accent transition-colors">
                            {category.name}
                          </span>
                          {isPrimary && (
                            <span className="px-2 py-0.5 text-[10px] font-bold text-accent bg-accent/10 rounded-full">
                              PRIMARY
                            </span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
              
              {selectedCategories.length > 1 && (
                <div>
                  <label className="block text-[12px] text-ink/55 mb-1.5 font-semibold">Primary Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {categories
                      .filter(c => selectedCategories.includes(c.id))
                      .map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                  <p className="mt-1 text-[11px] text-ink/35">Used for URL structure</p>
                </div>
              )}
              
              <div>
                <label className="block text-[12px] text-ink/55 mb-1.5 font-semibold">Author</label>
                <select value={authorId} onChange={(e) => setAuthorId(e.target.value)} className={`${inputClass} cursor-pointer`}>
                  {authors.map((a) => (<option key={a.id} value={a.id}>{a.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] text-ink/55 mb-1.5 font-semibold">Tags (comma separated)</label>
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="AI, Enterprise, Strategy" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className={cardClass}>
            <div className="px-5 py-3.5 border-b border-ink/[0.05]">
              <h3 className="text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em]">Cover Image</h3>
            </div>
            <div className="p-5">
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              {coverImage ? (
                <div className="relative group rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverImage} alt="Cover" className="w-full h-36 object-cover" />
                  <button type="button" onClick={() => setCoverImage('')} className="absolute top-2 right-2 px-3 py-1 bg-white/95 text-ink text-[11px] font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    Remove
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => coverInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setCoverDragOver(true); }}
                  onDragLeave={() => setCoverDragOver(false)}
                  onDrop={handleCoverDrop}
                  className={`w-full h-28 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all duration-200 ${coverDragOver ? 'border-accent/40 bg-accent/[0.02]' : 'border-ink/[0.08] hover:border-accent/30'
                    }`}
                >
                  <div className="text-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-ink/20 mx-auto mb-1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                    <span className="text-[12px] text-ink/35 font-medium">Drop image or click</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className={cardClass}>
            <div className="px-5 py-3.5 border-b border-ink/[0.05]">
              <h3 className="text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em]">SEO</h3>
            </div>
            <div className="p-5 space-y-3.5">
              <div>
                <label className="block text-[12px] text-ink/55 mb-1.5 font-semibold">Meta Title</label>
                <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder={title || 'Meta title'} className={inputClass} />
              </div>
              <div>
                <label className="block text-[12px] text-ink/55 mb-1.5 font-semibold">Meta Description</label>
                <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder={excerpt || 'Meta description'} rows={3} className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className="block text-[12px] text-ink/55 mb-1.5 font-semibold">OG Image URL</label>
                <input type="text" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://example.com/og-image.png" className={inputClass} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
