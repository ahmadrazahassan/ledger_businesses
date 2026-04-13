'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { slugify } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import type { ImportPostInput, ImportRowResult } from '@/lib/types/database';
import { parseHtmlToArticle } from '@/lib/import-html';

export type ImportOptionAuthor = { id: string; name: string };
export type ImportOptionCategory = { id: string; name: string; slug: string };

type Phase = 'source' | 'context' | 'review' | 'done';
type SourceMode = 'json' | 'html-single' | 'html-multi';

function buildRowsFromJson(text: string): ImportPostInput[] {
  const rows = JSON.parse(text) as unknown;
  if (!Array.isArray(rows)) throw new Error('JSON must be an array of post objects');
  return rows.map((r: Record<string, unknown>) => ({
    title: String(r.title ?? ''),
    slug: r.slug != null ? String(r.slug) : undefined,
    excerpt: r.excerpt != null ? String(r.excerpt) : undefined,
    content_html: String(r.content_html ?? ''),
    category_slug: r.category_slug != null ? String(r.category_slug) : undefined,
    tags: Array.isArray(r.tags) ? (r.tags as unknown[]).map(String) : [],
    cover_image: r.cover_image != null ? String(r.cover_image) : undefined,
    seo_title: r.seo_title != null ? String(r.seo_title) : undefined,
    seo_description: r.seo_description != null ? String(r.seo_description) : undefined,
  }));
}

const steps: { id: Phase; label: string }[] = [
  { id: 'source', label: 'Source' },
  { id: 'context', label: 'Author & category' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Complete' },
];

const MAX_SINGLE_ROW_BYTES = 700_000;

type Props = {
  initialAuthors: ImportOptionAuthor[];
  initialCategories: ImportOptionCategory[];
  serverLoadError?: string | null;
};

export function ImportPostsForm({ initialAuthors, initialCategories, serverLoadError }: Props) {
  const { showToast } = useToast();

  const [phase, setPhase] = useState<Phase>('source');
  const [sourceMode, setSourceMode] = useState<SourceMode>('json');
  const [isDragging, setIsDragging] = useState(false);

  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [singleHtmlText, setSingleHtmlText] = useState('');
  const [singleHtmlFile, setSingleHtmlFile] = useState<File | null>(null);
  const [multiHtmlFiles, setMultiHtmlFiles] = useState<File[]>([]);

  const [parsedRows, setParsedRows] = useState<ImportPostInput[]>([]);
  const [authors] = useState<ImportOptionAuthor[]>(() => initialAuthors.map((a) => ({ ...a })));
  const [categories] = useState<ImportOptionCategory[]>(() => initialCategories.map((c) => ({ ...c })));
  const [authorId, setAuthorId] = useState(() => initialAuthors[0]?.id ?? '');
  const [defaultCategoryId, setDefaultCategoryId] = useState(() => initialCategories[0]?.id ?? '');

  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportRowResult[]>([]);
  const [createdPostIds, setCreatedPostIds] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);

  const parseSourceIntoRows = useCallback(async (): Promise<ImportPostInput[]> => {
    if (sourceMode === 'json') {
      if (!jsonFile) throw new Error('Choose a JSON file');
      const text = await jsonFile.text();
      return buildRowsFromJson(text);
    }
    if (sourceMode === 'html-single') {
      let html = singleHtmlText.trim();
      if (singleHtmlFile) html = await singleHtmlFile.text();
      if (!html.trim()) throw new Error('Paste HTML or choose an .html file');
      const { title, content_html } = parseHtmlToArticle(html, singleHtmlFile?.name);
      return [{ title, content_html }];
    }
    if (sourceMode === 'html-multi') {
      if (multiHtmlFiles.length === 0) throw new Error('Choose one or more .html files');
      const out: ImportPostInput[] = [];
      for (const file of multiHtmlFiles) {
        const html = await file.text();
        const { title, content_html } = parseHtmlToArticle(html, file.name);
        out.push({ title, content_html });
      }
      return out;
    }
    return [];
  }, [sourceMode, jsonFile, singleHtmlText, singleHtmlFile, multiHtmlFiles]);

  const handleContinueFromSource = async () => {
    try {
      const rows = await parseSourceIntoRows();
      const valid = rows.filter((r) => r.title.trim() && r.content_html.trim());
      if (valid.length === 0) {
        showToast({
          variant: 'error',
          title: 'Nothing to import',
          description: 'Add at least one article with a title and HTML content.',
        });
        return;
      }
      setParsedRows(valid);
      setPhase('context');
      showToast({ variant: 'success', title: 'Ready', description: `${valid.length} article(s) parsed.` });
    } catch (e) {
      showToast({
        variant: 'error',
        title: 'Could not parse',
        description: e instanceof Error ? e.message : 'Invalid input',
      });
    }
  };

  const handleContinueFromContext = () => {
    if (!authorId || !defaultCategoryId) {
      showToast({
        variant: 'error',
        title: 'Required',
        description: 'Select an author and a default category.',
      });
      return;
    }
    setPhase('review');
  };

  const handleRunImport = async () => {
    setImporting(true);
    try {
      const results: ImportRowResult[] = [];
      for (let rowIndex = 0; rowIndex < parsedRows.length; rowIndex++) {
        const row = parsedRows[rowIndex];
        const payload = {
          row,
          rowIndex,
          authorId,
          defaultCategoryId,
        };
        const payloadBytes = new Blob([JSON.stringify(payload)]).size;

        if (payloadBytes > MAX_SINGLE_ROW_BYTES) {
          results.push({
            rowIndex,
            title: row.title || '(untitled)',
            slug: row.slug || slugify(row.title || 'post'),
            status: 'error',
            message: `Article payload too large (${Math.ceil(payloadBytes / 1024)}KB). Split or simplify this file.`,
          });
          continue;
        }

        try {
          const res = await fetch('/api/admin/posts/import-row', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          const body = (await res.json().catch(() => null)) as
            | { result?: ImportRowResult; error?: string }
            | null;

          if (!res.ok || !body?.result) {
            results.push({
              rowIndex,
              title: row.title || '(untitled)',
              slug: row.slug || slugify(row.title || 'post'),
              status: 'error',
              message: body?.error || `Import request failed (${res.status})`,
            });
            continue;
          }

          results.push(body.result);
        } catch (e) {
          results.push({
            rowIndex,
            title: row.title || '(untitled)',
            slug: row.slug || slugify(row.title || 'post'),
            status: 'error',
            message: e instanceof Error ? e.message : 'Network or server error',
          });
        }
      }
      setImportResults(results);
      const ids = results.filter((r) => r.status === 'created' && r.postId).map((r) => r.postId!);
      setCreatedPostIds(ids);
      setPhase('done');
      const created = results.filter((r) => r.status === 'created').length;
      showToast({
        variant: 'success',
        title: 'Import finished',
        description: `${created} saved as drafts.`,
      });
    } catch (e) {
      showToast({
        variant: 'error',
        title: 'Import failed',
        description: e instanceof Error ? e.message : 'Unexpected error',
      });
    } finally {
      setImporting(false);
    }
  };

  const handlePublishAll = async () => {
    if (createdPostIds.length === 0) return;
    setPublishing(true);
    try {
      const response = await fetch('/api/admin/posts/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: createdPostIds }),
      });
      const res = (await response.json().catch(() => null)) as
        | { success?: boolean; published?: number; error?: string }
        | null;
      if (response.ok && res?.success) {
        showToast({
          variant: 'success',
          title: 'Published',
          description: `${res.published ?? 0} article(s) are now live.`,
        });
        setCreatedPostIds([]);
      } else {
        showToast({
          variant: 'error',
          title: 'Publish failed',
          description: res?.error || `Publish request failed (${response.status})`,
        });
      }
    } finally {
      setPublishing(false);
    }
  };

  const resetFlow = () => {
    setPhase('source');
    setParsedRows([]);
    setImportResults([]);
    setCreatedPostIds([]);
    setJsonFile(null);
    setSingleHtmlText('');
    setSingleHtmlFile(null);
    setMultiHtmlFiles([]);
  };

  const stepIndex = steps.findIndex((s) => s.id === phase);
  const createdCount = importResults.filter((r) => r.status === 'created').length;
  const skippedCount = importResults.filter((r) => r.status === 'skipped').length;
  const errorCount = importResults.filter((r) => r.status === 'error').length;

  const contextDisabled = authors.length === 0 || categories.length === 0;

  return (
    <div className="space-y-10">
      {serverLoadError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
          Server note: {serverLoadError}
        </div>
      )}

      {/* Page header */}
      <div>
        <nav className="flex items-center gap-2 text-[12px] text-ink/40 mb-3 font-medium">
          <Link href="/admin" className="hover:text-ink/70 transition-colors">
            Admin
          </Link>
          <span className="text-ink/15">/</span>
          <Link href="/admin/posts" className="hover:text-ink/70 transition-colors">
            Posts
          </Link>
          <span className="text-ink/15">/</span>
          <span className="text-ink/60">Import</span>
        </nav>
        <h1 className="text-[34px] md:text-[42px] font-heading font-bold text-ink tracking-tight leading-none">
          Import articles
        </h1>
        <p className="text-[15px] text-ink/50 mt-2 max-w-2xl">
          Upload JSON or HTML. Everything is saved as <strong className="text-ink/70">drafts</strong> first. You can publish
          in one step when done, or edit from Posts.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <span
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-[12px] font-bold ${
                phase === s.id
                  ? 'bg-ink text-white'
                  : i < stepIndex
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-ink/[0.06] text-ink/35'
              }`}
            >
              {i < stepIndex ? '✓' : i + 1}
            </span>
            <span className={`text-[13px] font-semibold ${phase === s.id ? 'text-ink' : 'text-ink/40'}`}>{s.label}</span>
            {i < steps.length - 1 && <span className="text-ink/15 mx-1 hidden sm:inline">→</span>}
          </div>
        ))}
      </div>

      {/* SOURCE */}
      {phase === 'source' && (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="inline-flex p-1 bg-white rounded-2xl border border-ink/[0.08] shadow-subtle">
              {(
                [
                  ['json', 'JSON'],
                  ['html-single', 'HTML (one)'],
                  ['html-multi', 'HTML (bulk)'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSourceMode(id)}
                  className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                    sourceMode === id ? 'bg-ink text-white shadow-sm' : 'text-ink/50 hover:text-ink/80'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {sourceMode === 'json' && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const f = e.dataTransfer.files[0];
                  if (f?.name.endsWith('.json')) setJsonFile(f);
                }}
                className={`rounded-3xl border-2 border-dashed px-8 py-12 text-center transition-all ${
                  isDragging ? 'border-accent/40 bg-accent/[0.03]' : 'border-ink/[0.08] bg-white'
                }`}
              >
                <p className="text-[15px] font-semibold text-ink mb-2">JSON array of posts</p>
                <label className="inline-flex items-center px-5 py-2.5 rounded-full bg-ink/[0.05] text-[13px] font-semibold text-ink cursor-pointer hover:bg-ink/[0.08] border border-ink/10">
                  Choose file
                  <input
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setJsonFile(f);
                    }}
                  />
                </label>
                {jsonFile && <p className="text-[13px] text-ink/50 mt-3">Selected: {jsonFile.name}</p>}
              </div>
            )}

            {sourceMode === 'html-single' && (
              <div className="space-y-4">
                <textarea
                  value={singleHtmlText}
                  onChange={(e) => setSingleHtmlText(e.target.value)}
                  placeholder="Paste full HTML here, or use a file below…"
                  rows={14}
                  className="w-full rounded-2xl border border-ink/[0.08] bg-white px-4 py-3 text-[13px] text-ink placeholder:text-ink/30 focus:outline-none focus:ring-4 focus:ring-ink/[0.04] font-mono leading-relaxed"
                />
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-ink/[0.08] text-[13px] font-semibold cursor-pointer hover:bg-ink/[0.02]">
                    Upload .html
                    <input
                      type="file"
                      accept=".html,.htm,text/html"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        setSingleHtmlFile(f ?? null);
                      }}
                    />
                  </label>
                  {singleHtmlFile && <span className="text-[13px] text-ink/50">{singleHtmlFile.name}</span>}
                </div>
              </div>
            )}

            {sourceMode === 'html-multi' && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const list = Array.from(e.dataTransfer.files).filter((f) => /\.html?$/i.test(f.name));
                  if (list.length) setMultiHtmlFiles(list);
                }}
                className={`rounded-3xl border-2 border-dashed px-8 py-12 text-center transition-all ${
                  isDragging ? 'border-accent/40 bg-accent/[0.03]' : 'border-ink/[0.08] bg-white'
                }`}
              >
                <p className="text-[15px] font-semibold text-ink mb-2">One article per file</p>
                <label className="inline-flex items-center px-5 py-2.5 rounded-full bg-ink/[0.05] text-[13px] font-semibold text-ink cursor-pointer hover:bg-ink/[0.08] border border-ink/10">
                  Choose HTML files
                  <input
                    type="file"
                    accept=".html,.htm,text/html"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const list = Array.from(e.target.files || []);
                      if (list.length) setMultiHtmlFiles(list);
                    }}
                  />
                </label>
                {multiHtmlFiles.length > 0 && (
                  <ul className="text-left max-w-md mx-auto mt-4 text-[13px] text-ink/55 space-y-1">
                    {multiHtmlFiles.map((f) => (
                      <li key={f.name} className="font-mono truncate">
                        {f.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleContinueFromSource}
                className="px-8 py-3 rounded-full bg-accent text-accent-foreground text-[14px] font-bold hover:bg-accent-hover shadow-sm transition-all"
              >
                Continue
              </button>
            </div>
          </div>

          <aside className="rounded-3xl border border-ink/[0.06] bg-white p-6 h-fit">
            <p className="text-[11px] font-bold text-ink/45 uppercase tracking-[0.1em] mb-3">JSON shape</p>
            <pre className="text-[11px] leading-relaxed text-ink/55 font-mono overflow-x-auto whitespace-pre-wrap">{`[
  {
    "title": "Title",
    "content_html": "<p>…</p>",
    "excerpt": "optional",
    "slug": "optional",
    "category_slug": "optional",
    "tags": ["tag"]
  }
]`}</pre>
            <p className="text-[12px] text-ink/40 mt-4">
              Status in files is ignored; imports are always <strong>drafts</strong>.
            </p>
          </aside>
        </div>
      )}

      {/* CONTEXT */}
      {phase === 'context' && (
        <div className="max-w-xl space-y-6">
          {contextDisabled && (
            <div className="rounded-2xl border border-ink/[0.08] bg-white px-4 py-3 text-[13px] text-ink/60">
              No authors or categories found. Add at least one active author and category in Supabase, then refresh this page.
            </div>
          )}
          <div className="rounded-3xl border border-ink/[0.06] bg-white p-8 space-y-6">
            <div>
              <label className="block text-[12px] font-bold text-ink/45 uppercase tracking-[0.08em] mb-2">Author</label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                disabled={authors.length === 0}
                className="w-full rounded-xl border border-ink/[0.08] bg-cream/50 px-4 py-3 text-[14px] text-ink focus:outline-none focus:ring-4 focus:ring-ink/[0.04] disabled:opacity-50"
              >
                <option value="">Select author</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-ink/45 uppercase tracking-[0.08em] mb-2">
                Default category
              </label>
              <p className="text-[12px] text-ink/40 mb-2">
                Used when <code className="font-mono">category_slug</code> is missing or unknown.
              </p>
              <select
                value={defaultCategoryId}
                onChange={(e) => setDefaultCategoryId(e.target.value)}
                disabled={categories.length === 0}
                className="w-full rounded-xl border border-ink/[0.08] bg-cream/50 px-4 py-3 text-[14px] text-ink focus:outline-none focus:ring-4 focus:ring-ink/[0.04] disabled:opacity-50"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.slug})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={() => setPhase('source')} className="text-[14px] font-semibold text-ink/50 hover:text-ink">
              Back
            </button>
            <button
              type="button"
              onClick={handleContinueFromContext}
              disabled={contextDisabled}
              className="px-8 py-3 rounded-full bg-accent text-accent-foreground text-[14px] font-bold hover:bg-accent-hover shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Review {parsedRows.length} article(s)
            </button>
          </div>
        </div>
      )}

      {/* REVIEW */}
      {phase === 'review' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-ink/[0.06] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-ink/[0.06] bg-ink/[0.015]">
                    <th className="text-left px-5 py-3.5 text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em]">Title</th>
                    <th className="text-left px-5 py-3.5 text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em]">Slug (base)</th>
                    <th className="text-left px-5 py-3.5 text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em]">Category slug</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.map((r, i) => (
                    <tr key={i} className="border-b border-ink/[0.04] last:border-0">
                      <td className="px-5 py-3.5 font-semibold text-ink max-w-[240px] truncate">{r.title}</td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-ink/45">{r.slug || slugify(r.title)}</td>
                      <td className="px-5 py-3.5 text-ink/50">{r.category_slug || '— (default)'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={() => setPhase('context')} className="text-[14px] font-semibold text-ink/50 hover:text-ink">
              Back
            </button>
            <button
              type="button"
              disabled={importing}
              onClick={handleRunImport}
              className="px-8 py-3 rounded-full bg-accent text-accent-foreground text-[14px] font-bold hover:bg-accent-hover shadow-sm disabled:opacity-50"
            >
              {importing ? 'Importing…' : `Import ${parsedRows.length} as drafts`}
            </button>
          </div>
        </div>
      )}

      {/* DONE */}
      {phase === 'done' && (
        <div className="max-w-lg space-y-8">
          <div className="rounded-3xl border border-ink/[0.06] bg-white p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="text-[22px] font-heading font-bold text-ink mb-2">Import complete</h2>
            <p className="text-[14px] text-ink/50 mb-6">
              Created <strong className="text-ink">{createdCount}</strong>
              {skippedCount > 0 && (
                <>
                  {' '}
                  · Skipped <strong className="text-ink">{skippedCount}</strong>
                </>
              )}
              {errorCount > 0 && (
                <>
                  {' '}
                  · Errors <strong className="text-red-600">{errorCount}</strong>
                </>
              )}
            </p>
            {importResults.some((r) => r.status === 'error' || r.message) && (
              <ul className="text-left text-[12px] text-ink/45 mb-6 max-h-40 overflow-y-auto space-y-1">
                {importResults.map((r, i) =>
                  r.message ? (
                    <li key={i}>
                      <span className="font-semibold text-ink/70">{r.title}</span>: {r.message}
                    </li>
                  ) : null
                )}
              </ul>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {createdPostIds.length > 0 && (
                <button
                  type="button"
                  disabled={publishing}
                  onClick={handlePublishAll}
                  className="px-6 py-3 rounded-full bg-ink text-white text-[14px] font-bold hover:bg-ink/90 disabled:opacity-50"
                >
                  {publishing ? 'Publishing…' : `Publish all (${createdPostIds.length})`}
                </button>
              )}
              <Link
                href="/admin/posts?status=draft"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-ink/[0.1] text-[14px] font-semibold text-ink hover:bg-ink/[0.03]"
              >
                View drafts in Posts
              </Link>
              <button
                type="button"
                onClick={resetFlow}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-[14px] font-semibold text-accent-content hover:underline"
              >
                Import more
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
