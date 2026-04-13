'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/toast';
import { HTML_IMPORT_LIMITS, isAllowedImportStatus } from '@/lib/import/html-import';
import { extractHtmlFilesFromZip } from '@/lib/import/zip';
import type { HtmlImportQueueItem, PostStatus } from '@/lib/types/database';
import { getAuthors, getCategories } from '../posts/actions';
import { importHtmlArticle } from './actions';

function newId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `job-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function collectHtmlFromInputs(files: FileList | File[]): Promise<{ name: string; html: string }[]> {
  const list = Array.from(files);
  const out: { name: string; html: string }[] = [];
  for (const file of list) {
    const lower = file.name.toLowerCase();
    if (lower.endsWith('.zip')) {
      if (file.size > HTML_IMPORT_LIMITS.maxZipBytes) {
        throw new Error(
          `ZIP “${file.name}” exceeds ${Math.round(HTML_IMPORT_LIMITS.maxZipBytes / (1024 * 1024))} MB.`,
        );
      }
      const buf = await file.arrayBuffer();
      for (const e of extractHtmlFilesFromZip(buf)) {
        if (e.html.length > HTML_IMPORT_LIMITS.maxHtmlCharsPerFile) {
          throw new Error(`Entry “${e.path}” in ${file.name} is too large.`);
        }
        out.push({ name: e.path, html: e.html });
      }
    } else if (lower.endsWith('.html') || lower.endsWith('.htm')) {
      if (file.size > HTML_IMPORT_LIMITS.maxHtmlCharsPerFile) {
        throw new Error(`File “${file.name}” is too large.`);
      }
      out.push({ name: file.name, html: await file.text() });
    }
  }
  return out;
}

function queueFromExtracted(rows: { name: string; html: string }[]): HtmlImportQueueItem[] {
  return rows.map((row) => ({
    id: newId(),
    fileName: row.name,
    html: row.html,
    phase: 'queued' as const,
  }));
}

export default function AdminImportHtmlPage() {
  const { showToast } = useToast();
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [authorId, setAuthorId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<PostStatus>('draft');
  const [queue, setQueue] = useState<HtmlImportQueueItem[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [importing, setImporting] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cats, auths] = await Promise.all([getCategories(), getAuthors()]);
        if (cancelled) return;
        setCategories(cats);
        setAuthors(auths);
        if (auths.length > 0) setAuthorId(auths[0].id);
        if (cats.length > 0) {
          setCategoryId(cats[0].id);
          setSelectedCategories([cats[0].id]);
        }
      } catch {
        showToast({
          variant: 'error',
          title: 'Failed to load data',
          description: 'Unable to load authors or categories.',
        });
      } finally {
        if (!cancelled) setLoadingMeta(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const updateItem = useCallback((id: string, patch: Partial<HtmlImportQueueItem>) => {
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }, []);

  const onFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      const rows = await collectHtmlFromInputs(files);
      if (rows.length > HTML_IMPORT_LIMITS.maxFiles) {
        showToast({
          variant: 'error',
          title: 'Too many files',
          description: `Maximum ${HTML_IMPORT_LIMITS.maxFiles} HTML entries per batch.`,
        });
        return;
      }
      if (rows.length === 0) {
        showToast({
          variant: 'info',
          title: 'No HTML found',
          description: 'Add .html, .htm, or .zip containing HTML files.',
        });
        return;
      }
      setQueue(queueFromExtracted(rows));
    } catch (err) {
      showToast({
        variant: 'error',
        title: 'Could not read files',
        description: err instanceof Error ? err.message : 'Unknown error.',
      });
    } finally {
      setFileInputKey((k) => k + 1);
    }
  };

  const runImport = async (items: HtmlImportQueueItem[]) => {
    if (!authorId || !categoryId) {
      showToast({
        variant: 'error',
        title: 'Missing defaults',
        description: 'Select an author and primary category.',
      });
      return;
    }

    const categoryIds = selectedCategories.length > 0 ? selectedCategories : [categoryId];

    setImporting(true);
    let ok = 0;
    let fail = 0;

    for (const item of items) {
      updateItem(item.id, { phase: 'processing', message: undefined });
      const result = await importHtmlArticle({
        fileName: item.fileName,
        html: item.html,
        author_id: authorId,
        category_id: categoryId,
        category_ids: categoryIds,
        status,
      });

      if (result.success) {
        ok += 1;
        updateItem(item.id, {
          phase: 'success',
          title: result.title,
          slug: result.slug,
          postId: result.postId,
          message: undefined,
        });
      } else {
        fail += 1;
        updateItem(item.id, {
          phase: 'error',
          message: result.message || 'Import failed.',
        });
      }
    }

    setImporting(false);
    showToast({
      variant: fail ? 'info' : 'success',
      title: 'Import finished',
      description: `${ok} saved${fail ? `, ${fail} failed` : ''}.`,
    });
  };

  const handleImportAll = () => {
    const pending = queue.filter((q) => q.phase === 'queued' || q.phase === 'error');
    if (!pending.length) {
      showToast({ variant: 'info', title: 'Nothing to import', description: 'Add files or retry failed rows.' });
      return;
    }
    void runImport(pending);
  };

  const handleRetryFailed = () => {
    const failed = queue.filter((q) => q.phase === 'error');
    if (!failed.length) return;
    const toRun = failed.map((q) => ({ ...q, phase: 'queued' as const, message: undefined }));
    setQueue((prev) =>
      prev.map((q) =>
        q.phase === 'error' ? { ...q, phase: 'queued' as const, message: undefined } : q,
      ),
    );
    void runImport(toRun);
  };

  const clearQueue = () => {
    setQueue([]);
    setFileInputKey((k) => k + 1);
  };

  const inputClass =
    'w-full px-5 py-3.5 bg-white border border-ink/[0.08] rounded-2xl text-[15px] text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/20 focus:ring-4 focus:ring-ink/[0.03] transition-all';
  const labelClass = 'block text-[13px] font-bold text-ink/60 mb-2';
  const cardClass = 'bg-white border border-ink/[0.06] rounded-3xl overflow-hidden';

  const counts = {
    queued: queue.filter((q) => q.phase === 'queued').length,
    processing: queue.filter((q) => q.phase === 'processing').length,
    success: queue.filter((q) => q.phase === 'success').length,
    error: queue.filter((q) => q.phase === 'error').length,
  };

  if (loadingMeta) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ink/10 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[14px] text-ink/40 font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-[13px] text-ink/40 mb-3 font-medium">
            <Link href="/admin/posts" className="hover:text-ink/70 transition-colors">
              Posts
            </Link>
            <span>/</span>
            <span className="text-ink/60">Import HTML</span>
          </nav>
          <h1 className="text-[42px] md:text-[52px] font-heading font-bold text-ink tracking-tight leading-none mb-2">
            Import HTML
          </h1>
          <p className="text-[16px] text-ink/50 font-medium max-w-2xl">
            Upload one or many .html files or a .zip archive. Articles are saved to Supabase one at a time with
            per-file progress.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/posts"
            className="px-5 py-3 text-[14px] font-semibold text-ink/60 bg-white border border-ink/[0.08] rounded-full hover:border-ink/15 hover:bg-ink/[0.02] transition-all duration-200"
          >
            Back to posts
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className={cardClass}>
            <div className="px-6 py-4 border-b border-ink/[0.06]">
              <h2 className="text-[13px] font-bold text-ink/60 uppercase tracking-[0.1em]">Files</h2>
            </div>
            <div className="p-6 space-y-4">
              <label className={labelClass}>Choose .html / .htm / .zip (multiple allowed)</label>
              <input
                key={fileInputKey}
                type="file"
                multiple
                accept=".html,.htm,.zip,application/zip,application/x-zip-compressed"
                onChange={onFilesSelected}
                disabled={importing}
                className="block w-full text-[14px] text-ink/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-[13px] file:font-semibold file:bg-ink/[0.06] file:text-ink hover:file:bg-ink/[0.1]"
              />
              <p className="text-[12px] text-ink/40">
                Up to {HTML_IMPORT_LIMITS.maxFiles} HTML entries per batch. ZIP entries must end in .html or .htm.
              </p>
              {queue.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleImportAll}
                    disabled={importing || (!counts.queued && !counts.error)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground text-[14px] font-bold rounded-full hover:bg-accent-hover shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {importing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Importing…
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Import
                      </>
                    )}
                  </button>
                  {counts.error > 0 && (
                    <button
                      type="button"
                      onClick={handleRetryFailed}
                      disabled={importing}
                      className="px-5 py-3 text-[14px] font-semibold text-ink/70 bg-white border border-ink/[0.08] rounded-full hover:border-ink/15 transition-all disabled:opacity-50"
                    >
                      Retry failed ({counts.error})
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={clearQueue}
                    disabled={importing}
                    className="px-5 py-3 text-[14px] font-semibold text-ink/50 rounded-full hover:bg-ink/[0.04] transition-all disabled:opacity-50"
                  >
                    Clear list
                  </button>
                </div>
              )}
            </div>
          </div>

          {queue.length > 0 && (
            <div className={cardClass}>
              <div className="px-6 py-4 border-b border-ink/[0.06] flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[13px] font-bold text-ink/60 uppercase tracking-[0.1em]">Progress</h2>
                <div className="flex flex-wrap gap-2 text-[12px] text-ink/45 font-medium">
                  <span>queued {counts.queued}</span>
                  <span>·</span>
                  <span>saving {counts.processing}</span>
                  <span>·</span>
                  <span className="text-emerald-600">ok {counts.success}</span>
                  <span>·</span>
                  <span className="text-red-500">failed {counts.error}</span>
                </div>
              </div>
              <ul className="divide-y divide-ink/[0.06] max-h-[480px] overflow-y-auto">
                {queue.map((item) => (
                  <li key={item.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-ink truncate" title={item.fileName}>
                        {item.fileName}
                      </p>
                      {item.title && item.phase === 'success' && (
                        <p className="text-[13px] text-ink/50 mt-1 truncate">{item.title}</p>
                      )}
                      {item.message && item.phase === 'error' && (
                        <p className="text-[13px] text-red-600 mt-1">{item.message}</p>
                      )}
                      {item.slug && item.phase === 'success' && (
                        <p className="text-[12px] text-ink/35 mt-1 font-mono truncate">/{item.slug}</p>
                      )}
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <StatusBadge phase={item.phase} />
                      {item.postId && item.phase === 'success' && (
                        <Link
                          href={`/admin/posts/${item.postId}/edit`}
                          className="text-[12px] font-semibold text-accent-content hover:underline"
                        >
                          Edit
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className={cardClass}>
            <div className="px-6 py-4 border-b border-ink/[0.06]">
              <h2 className="text-[13px] font-bold text-ink/60 uppercase tracking-[0.1em]">Defaults</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Status</label>
                <select
                  value={status}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (isAllowedImportStatus(v)) setStatus(v);
                  }}
                  disabled={importing}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Author</label>
                <select
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                  disabled={importing}
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
                <label className={labelClass}>Categories</label>
                <div className="space-y-2 max-h-48 overflow-y-auto p-4 bg-white border border-ink/[0.08] rounded-2xl">
                  {categories.map((c) => {
                    const isSelected = selectedCategories.includes(c.id);
                    const isPrimary = categoryId === c.id;
                    return (
                      <label
                        key={c.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-ink/[0.02] p-2 rounded-xl transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={importing}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const next = [...selectedCategories, c.id];
                              setSelectedCategories(next);
                              if (!categoryId) setCategoryId(c.id);
                            } else {
                              const next = selectedCategories.filter((id) => id !== c.id);
                              setSelectedCategories(next);
                              if (categoryId === c.id && next.length > 0) setCategoryId(next[0]);
                              else if (next.length === 0) setCategoryId('');
                            }
                          }}
                          className="w-4 h-4 text-accent-content border-ink/20 rounded focus:ring-accent focus:ring-2"
                        />
                        <span className="text-sm font-medium text-ink flex-1">{c.name}</span>
                        {isPrimary && (
                          <span className="text-[10px] font-bold text-accent-content bg-accent/10 px-2 py-0.5 rounded-full">
                            PRIMARY
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
                {selectedCategories.length > 1 && (
                  <div className="mt-3">
                    <label className={labelClass}>Primary category</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      disabled={importing}
                      className={`${inputClass} cursor-pointer`}
                    >
                      {categories
                        .filter((c) => selectedCategories.includes(c.id))
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
                <p className="mt-2 text-[12px] text-ink/40">Used when HTML does not specify a category.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ phase }: { phase: HtmlImportQueueItem['phase'] }) {
  const styles: Record<HtmlImportQueueItem['phase'], string> = {
    queued: 'bg-ink/[0.06] text-ink/55 border-ink/10',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    error: 'bg-red-50 text-red-700 border-red-200',
  };
  const labels: Record<HtmlImportQueueItem['phase'], string> = {
    queued: 'Queued',
    processing: 'Saving',
    success: 'Saved',
    error: 'Failed',
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full border ${styles[phase]}`}
    >
      {labels[phase]}
    </span>
  );
}
