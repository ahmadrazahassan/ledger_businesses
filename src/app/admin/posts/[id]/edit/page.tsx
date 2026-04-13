'use client';

import { useState, useRef, useCallback, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { slugify, formatDate } from '@/lib/utils';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useToast } from '@/components/ui/toast';
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
          <Link href="/admin/posts" className="px-5 py-2 bg-accent text-accent-foreground text-[12px] font-bold rounded-full hover:bg-accent-hover">
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
  const { showToast } = useToast();
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
  const [coverImageUrlInput, setCoverImageUrlInput] = useState('');
  const [coverDragOver, setCoverDragOver] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [featuredRank, setFeaturedRank] = useState<string>(
    post.featured_rank != null ? String(post.featured_rank) : ''
  );
  const [isDragging, setIsDragging] = useState(false);
  const [pointerMenu, setPointerMenu] = useState<{ clientX: number; clientY: number } | null>(null);
  const [editorUploading, setEditorUploading] = useState(false);
  const [showEditorImageUrl, setShowEditorImageUrl] = useState(false);
  const [editorImageUrl, setEditorImageUrl] = useState('');
  const [blockType, setBlockType] = useState('p');

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const editorInitialized = useRef(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);

  useEffect(() => {
    document.execCommand('styleWithCSS', false, 'true');
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [authorsData, categoriesData] = await Promise.all([
        getAuthors(),
        getCategories(),
      ]);
      setAuthors(authorsData);
      setCategories(categoriesData);
    } catch {
      showToast({
        variant: 'error',
        title: 'Failed to load form data',
        description: 'Unable to load authors or categories.',
      });
    }
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

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    selectionRef.current = sel.getRangeAt(0).cloneRange();
  }, []);

  const focusAndRestoreSelection = useCallback(() => {
    const ed = editorRef.current;
    if (!ed) return;
    ed.focus();
    const sel = window.getSelection();
    if (sel && selectionRef.current) {
      sel.removeAllRanges();
      sel.addRange(selectionRef.current);
    }
  }, []);

  const runCommand = useCallback(
    (command: string, value?: string) => {
      focusAndRestoreSelection();
      document.execCommand(command, false, value);
      saveSelection();
      syncEditorContent();
    },
    [focusAndRestoreSelection, saveSelection, syncEditorContent]
  );

  const openPointerMenu = useCallback(
    (clientX: number, clientY: number) => {
      saveSelection();
      const pad = 8;
      const w = 280;
      const h = 280;
      let x = clientX;
      let y = clientY;
      if (x + w > window.innerWidth - pad) x = window.innerWidth - w - pad;
      if (y + h > window.innerHeight - pad) y = window.innerHeight - h - pad;
      x = Math.max(pad, x);
      y = Math.max(pad, y);
      setPointerMenu({ clientX: x, clientY: y });
    },
    [saveSelection]
  );

  useEffect(() => {
    if (!pointerMenu) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node)) return;
      setPointerMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPointerMenu(null);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [pointerMenu]);

  const insertImageAtCursor = useCallback((src: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const sel = window.getSelection();
    if (sel && selectionRef.current) {
      try {
        sel.removeAllRanges();
        sel.addRange(selectionRef.current.cloneRange());
      } catch {
        /* invalid stored range */
      }
    }
    const selection = window.getSelection();
    const img = document.createElement('img');
    img.src = src;
    img.className = 'max-w-full rounded-xl my-3';
    img.style.maxHeight = '400px';
    const wrapper = document.createElement('div');
    wrapper.className = 'my-2';
    wrapper.appendChild(img);
    if (!selection || selection.rangeCount === 0) {
      editor.appendChild(wrapper);
      syncEditorContent();
      setPointerMenu(null);
      return;
    }
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(wrapper);
    const newRange = document.createRange();
    newRange.setStartAfter(wrapper);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
    syncEditorContent();
    setPointerMenu(null);
  }, [syncEditorContent]);

  const processImageFile = useCallback(async (file: File) => {
    setEditorUploading(true);
    try {
      const result = await uploadToCloudinary(file, { folder: 'posts' });
      if (!result.success || !result.url) {
        showToast({
          variant: 'error',
          title: 'Image upload failed',
          description: result.error || 'Please try another image file.',
        });
        return;
      }
      insertImageAtCursor(result.url);
    } finally {
      setEditorUploading(false);
    }
  }, [insertImageAtCursor, showToast]);

  const handlePaste = useCallback(async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const clipboardFiles = e.clipboardData?.files;
    if (clipboardFiles && clipboardFiles.length > 0) {
      const imageFile = Array.from(clipboardFiles).find((file) => file.type.startsWith('image/'));
      if (imageFile) {
        e.preventDefault();
        await processImageFile(imageFile);
        return;
      }
    }

    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) await processImageFile(file);
        return;
      }
    }

    const html = e.clipboardData?.getData('text/html');
    if (html) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const pastedImage = doc.querySelector('img');
      if (pastedImage?.src) {
        e.preventDefault();
        insertImageAtCursor(pastedImage.src);
        return;
      }
    }
  }, [processImageFile, insertImageAtCursor]);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) await processImageFile(files[i]);
    }
  }, [processImageFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) void processImageFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEditorInput = () => syncEditorContent();
  const handleHtmlChange = (value: string) => setContentHtml(value);

  const applyBlockType = (value: string) => {
    setBlockType(value);
    runCommand('formatBlock', value);
    setPointerMenu(null);
  };

  const handleEditorContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    openPointerMenu(e.clientX, e.clientY);
  };

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.shiftKey) {
      window.requestAnimationFrame(() => {
        openPointerMenu(e.clientX, e.clientY);
      });
    }
  };

  const handleEditorImageUrlInsert = () => {
    const v = editorImageUrl.trim();
    if (!v) return;
    insertImageAtCursor(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    setEditorImageUrl('');
    setShowEditorImageUrl(false);
    setPointerMenu(null);
  };

  useEffect(() => {
    if (activeTab === 'write' && editorRef.current && editorInitialized.current) {
      editorRef.current.innerHTML = contentHtml;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleCoverUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;

    setCoverUploading(true);
    try {
      const result = await uploadToCloudinary(file, { folder: 'covers/posts', maxSizeMB: 20 });
      if (result.success && result.url) {
        setCoverImage(result.url);
        showToast({
          variant: 'success',
          title: 'Cover uploaded',
          description: 'Cover image was uploaded successfully.',
        });
      } else {
        showToast({
          variant: 'error',
          title: 'Cover upload failed',
          description: result.error || 'Please try another image file.',
        });
      }
    } finally {
      setCoverUploading(false);
    }
  }, [showToast]);

  const handleCoverDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setCoverDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;

      setCoverUploading(true);
      try {
        const result = await uploadToCloudinary(file, { folder: 'covers/posts', maxSizeMB: 20 });
        if (result.success && result.url) {
          setCoverImage(result.url);
          showToast({
            variant: 'success',
            title: 'Cover uploaded',
            description: 'Cover image was uploaded successfully.',
          });
        } else {
          showToast({
            variant: 'error',
            title: 'Cover upload failed',
            description: result.error || 'Please try another image file.',
          });
        }
      } finally {
        setCoverUploading(false);
      }
    },
    [showToast]
  );

  const applyCoverImageUrl = useCallback(() => {
    const value = coverImageUrlInput.trim();
    if (!value) {
      showToast({
        variant: 'error',
        title: 'Image URL is required',
        description: 'Paste a valid image URL to continue.',
      });
      return;
    }

    const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      const parsed = new URL(normalized);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('invalid-protocol');
      }
      setCoverImage(normalized);
      setCoverImageUrlInput('');
      showToast({
        variant: 'success',
        title: 'Cover image updated',
        description: 'Cover image has been set from URL.',
      });
    } catch {
      showToast({
        variant: 'error',
        title: 'Invalid image URL',
        description: 'Use a full public image URL starting with http or https.',
      });
    }
  }, [coverImageUrlInput, showToast]);

  const handleSave = async () => {
    if (!title.trim()) {
      showToast({
        variant: 'error',
        title: 'Title is required',
        description: 'Add a title before updating this post.',
      });
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
      showToast({
        variant: 'success',
        title: 'Post updated',
        description: 'Changes have been saved successfully.',
      });
      router.push('/admin/posts');
    } else {
      showToast({
        variant: 'error',
        title: 'Update failed',
        description: result.error || 'Unable to update this post.',
      });
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      const result = await deletePost(post.id);
      if (result.success) {
        showToast({
          variant: 'success',
          title: 'Post deleted',
          description: 'The post has been removed successfully.',
        });
        router.push('/admin/posts');
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
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-accent text-accent-foreground text-[12px] font-bold rounded-full hover:bg-accent-hover shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
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
                <button type="button" onClick={() => setSlugManual(!slugManual)} className="text-[10px] font-bold text-accent-content hover:underline">
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
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
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
                  <p className="text-[11px] text-ink/40">
                    Right-click or Shift+click for quick actions. Formatting bar stays at the bottom while you scroll.
                  </p>
                )}
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

              {activeTab === 'write' && (
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleEditorInput}
                  onBlur={saveSelection}
                  onMouseUp={saveSelection}
                  onKeyUp={saveSelection}
                  onPaste={handlePaste}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onContextMenu={handleEditorContextMenu}
                  onClick={handleEditorClick}
                  className={`w-full min-h-[320px] px-4 py-3.5 bg-[#f8f9fb] border rounded-xl text-[14px] text-ink leading-relaxed focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 focus:bg-white transition-all duration-200 prose prose-sm max-w-none ${isDragging ? 'border-accent border-2 bg-accent/[0.02]' : 'border-ink/[0.08]'
                    }`}
                  data-placeholder="Write your article content here..."
                  style={{ minHeight: '320px', paddingBottom: '5rem' }}
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
                <p className="mt-2 text-[11px] text-ink/35">Paste or drag images into the article anytime.</p>
              )}
            </div>
          </div>

          {pointerMenu && activeTab === 'write' && (
            <div
              ref={menuRef}
              className="fixed z-[100] w-[min(18rem,calc(100vw-1rem))] rounded-2xl border border-ink/[0.12] bg-white py-2 shadow-xl"
              style={{ left: pointerMenu.clientX, top: pointerMenu.clientY }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-ink/40">Quick actions</p>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-ink rounded-lg hover:bg-ink/[0.06]"
                onClick={() => {
                  fileInputRef.current?.click();
                  setPointerMenu(null);
                }}
                disabled={editorUploading}
              >
                <span className="font-mono text-[11px] text-ink/50">IMG</span>
                Upload image (Cloudinary)
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-ink rounded-lg hover:bg-ink/[0.06]"
                onClick={() => {
                  const url = window.prompt('Image URL');
                  if (url?.trim()) insertImageAtCursor(url.trim());
                  setPointerMenu(null);
                }}
              >
                Image from URL
              </button>
              <div className="my-1 border-t border-ink/[0.06]" />
              <button type="button" className="flex w-full px-3 py-2 text-left text-[13px] text-ink rounded-lg hover:bg-ink/[0.06]" onClick={() => { runCommand('bold'); setPointerMenu(null); }}>
                Bold
              </button>
              <button type="button" className="flex w-full px-3 py-2 text-left text-[13px] text-ink rounded-lg hover:bg-ink/[0.06]" onClick={() => { runCommand('italic'); setPointerMenu(null); }}>
                Italic
              </button>
              <button type="button" className="flex w-full px-3 py-2 text-left text-[13px] text-ink rounded-lg hover:bg-ink/[0.06]" onClick={() => applyBlockType('h2')}>
                Heading 2
              </button>
              <button type="button" className="flex w-full px-3 py-2 text-left text-[13px] text-ink rounded-lg hover:bg-ink/[0.06]" onClick={() => applyBlockType('h3')}>
                Heading 3
              </button>
              <button type="button" className="flex w-full px-3 py-2 text-left text-[13px] text-ink rounded-lg hover:bg-ink/[0.06]" onClick={() => { runCommand('insertUnorderedList'); setPointerMenu(null); }}>
                Bullet list
              </button>
              <button
                type="button"
                className="flex w-full px-3 py-2 text-left text-[13px] text-ink rounded-lg hover:bg-ink/[0.06]"
                onClick={() => {
                  const enteredUrl = window.prompt('Link URL');
                  if (!enteredUrl) return;
                  const safeUrl = /^https?:\/\//i.test(enteredUrl) ? enteredUrl : `https://${enteredUrl}`;
                  runCommand('createLink', safeUrl);
                  setPointerMenu(null);
                }}
              >
                Add link
              </button>
            </div>
          )}

          {activeTab === 'write' && (
            <div
              className="fixed bottom-0 left-0 right-0 z-[90] border-t border-ink/[0.08] bg-white/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
              style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
            >
              <div className="mx-auto max-w-4xl px-2 py-2">
                {showEditorImageUrl && (
                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      value={editorImageUrl}
                      onChange={(e) => setEditorImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="h-10 flex-1 rounded-xl border border-ink/[0.1] px-3 text-[13px] text-ink focus:border-ink/25 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleEditorImageUrlInsert}
                      className="h-10 shrink-0 rounded-xl bg-ink px-4 text-[12px] font-semibold text-white hover:opacity-90"
                    >
                      Insert image
                    </button>
                  </div>
                )}
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  <select
                    value={blockType}
                    onChange={(e) => applyBlockType(e.target.value)}
                    onMouseDown={(e) => e.preventDefault()}
                    className="h-11 shrink-0 min-w-[6.5rem] rounded-xl border border-ink/[0.1] bg-white px-2 text-[11px] font-semibold text-ink focus:outline-none"
                  >
                    <option value="p">Paragraph</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                    <option value="blockquote">Quote</option>
                  </select>
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand('bold')} className="flex h-11 min-w-[3.5rem] shrink-0 flex-col items-center justify-center rounded-xl border border-ink/[0.08] bg-white px-2 text-[10px] font-medium text-ink/65 hover:border-ink/20 hover:text-ink">
                    <span className="text-[13px] font-bold">B</span>
                  </button>
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand('italic')} className="flex h-11 min-w-[3.5rem] shrink-0 flex-col items-center justify-center rounded-xl border border-ink/[0.08] bg-white px-2 text-[10px] font-medium text-ink/65 hover:border-ink/20 hover:text-ink">
                    <span className="text-[13px] italic">I</span>
                  </button>
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand('underline')} className="flex h-11 min-w-[3.5rem] shrink-0 flex-col items-center justify-center rounded-xl border border-ink/[0.08] bg-white px-2 text-[10px] font-medium text-ink/65 hover:border-ink/20 hover:text-ink">
                    <span className="text-[12px] underline">U</span>
                  </button>
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand('insertUnorderedList')} className="flex h-11 min-w-[3.5rem] shrink-0 flex-col items-center justify-center rounded-xl border border-ink/[0.08] bg-white px-2 text-[10px] font-medium text-ink/65 hover:border-ink/20 hover:text-ink">
                    • List
                  </button>
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand('insertOrderedList')} className="flex h-11 min-w-[3.5rem] shrink-0 flex-col items-center justify-center rounded-xl border border-ink/[0.08] bg-white px-2 text-[10px] font-medium text-ink/65 hover:border-ink/20 hover:text-ink">
                    1. List
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={editorUploading}
                    className="flex h-11 min-w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-xl border border-ink/[0.08] bg-white px-2 text-[10px] font-medium text-ink/65 hover:border-ink/20 hover:text-ink disabled:opacity-50"
                  >
                    {editorUploading ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink/20 border-t-ink" /> : 'Upload'}
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowEditorImageUrl((p) => !p)}
                    className="flex h-11 min-w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-xl border border-ink/[0.08] bg-white px-2 text-[10px] font-medium text-ink/65 hover:border-ink/20 hover:text-ink"
                  >
                    Image URL
                  </button>
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand('removeFormat')} className="flex h-11 min-w-[3.5rem] shrink-0 flex-col items-center justify-center rounded-xl border border-ink/[0.08] bg-white px-2 text-[10px] font-medium text-ink/65 hover:border-ink/20 hover:text-ink">
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
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
                          className="w-4 h-4 text-accent-content border-ink/20 rounded focus:ring-accent focus:ring-2"
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-ink group-hover:text-accent-content transition-colors">
                            {category.name}
                          </span>
                          {isPrimary && (
                            <span className="px-2 py-0.5 text-[10px] font-bold text-accent-content bg-accent/10 rounded-full">
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
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
                disabled={coverUploading}
              />
              {coverImage ? (
                <div className="space-y-3">
                  <div className="relative group rounded-xl overflow-hidden">
                    <img src={coverImage} alt="Cover" className="w-full h-36 object-cover" />
                    <button type="button" onClick={() => setCoverImage('')} className="absolute top-2 right-2 px-3 py-1 bg-white/95 text-ink text-[11px] font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={coverImageUrlInput}
                      onChange={(e) => setCoverImageUrlInput(e.target.value)}
                      placeholder="https://example.com/cover.jpg"
                      className="flex-1 px-3.5 py-2.5 bg-white border border-ink/[0.08] rounded-full text-[12px] text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/20 focus:ring-4 focus:ring-ink/[0.03] transition-all"
                    />
                    <button
                      type="button"
                      onClick={applyCoverImageUrl}
                      className="px-4 py-2.5 rounded-full bg-white border border-ink/[0.1] text-[12px] font-semibold text-ink/65 hover:text-ink hover:border-ink/20 transition-all"
                    >
                      Use URL
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div
                    onClick={() => !coverUploading && coverInputRef.current?.click()}
                    onDragOver={(e) => {
                      if (coverUploading) return;
                      e.preventDefault();
                      setCoverDragOver(true);
                    }}
                    onDragLeave={() => setCoverDragOver(false)}
                    onDrop={
                      coverUploading
                        ? (e) => {
                            e.preventDefault();
                          }
                        : handleCoverDrop
                    }
                    className={`w-full h-28 rounded-xl border-2 border-dashed flex items-center justify-center transition-all duration-200 ${
                      coverUploading
                        ? 'border-ink/[0.06] bg-ink/[0.02] cursor-wait'
                        : `cursor-pointer ${coverDragOver ? 'border-accent/40 bg-accent/[0.02]' : 'border-ink/[0.08] hover:border-accent/30'}`
                    }`}
                  >
                    <div className="text-center">
                      {coverUploading ? (
                        <>
                          <div className="w-8 h-8 border-2 border-ink/15 border-t-accent rounded-full animate-spin mx-auto mb-2" />
                          <span className="text-[12px] text-ink/45 font-medium">Uploading cover...</span>
                        </>
                      ) : (
                        <>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-ink/20 mx-auto mb-1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                          <span className="text-[12px] text-ink/35 font-medium">Drop image or click</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={coverImageUrlInput}
                      onChange={(e) => setCoverImageUrlInput(e.target.value)}
                      placeholder="https://example.com/cover.jpg"
                      className="flex-1 px-3.5 py-2.5 bg-white border border-ink/[0.08] rounded-full text-[12px] text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/20 focus:ring-4 focus:ring-ink/[0.03] transition-all"
                    />
                    <button
                      type="button"
                      onClick={applyCoverImageUrl}
                      className="px-4 py-2.5 rounded-full bg-white border border-ink/[0.1] text-[12px] font-semibold text-ink/65 hover:text-ink hover:border-ink/20 transition-all"
                    >
                      Use URL
                    </button>
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
