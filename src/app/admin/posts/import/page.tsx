'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { slugify } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import type { BulkImportRow, BulkImportResult } from '@/lib/types/database';

export default function BulkImportPage() {
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<BulkImportResult[]>([]);
  const [step, setStep] = useState<'upload' | 'review' | 'done'>('upload');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.name.endsWith('.json')) setFile(dropped);
  }, []);

  const handleParse = useCallback(async () => {
    if (!file) return;
    try {
      const text = await file.text();
      const rows: BulkImportRow[] = JSON.parse(text);
      const seen = new Set<string>();
      const validated: BulkImportResult[] = rows.map((row) => {
        const rowSlug = row.slug || slugify(row.title);
        if (!row.title || !row.content_html) {
          return { row, status: 'error', message: 'Missing required fields (title, content_html)' };
        }
        if (seen.has(rowSlug)) {
          return { row: { ...row, slug: rowSlug }, status: 'duplicate', message: `Duplicate slug: ${rowSlug}` };
        }
        seen.add(rowSlug);
        return { row: { ...row, slug: rowSlug }, status: 'valid' };
      });
      setResults(validated);
      setStep('review');
      showToast({
        variant: 'success',
        title: 'File parsed',
        description: `${validated.length} rows are ready for review.`,
      });
    } catch {
      showToast({
        variant: 'error',
        title: 'Invalid JSON file',
        description: 'Upload a valid JSON array to continue.',
      });
    }
  }, [file, showToast]);

  const handleImport = () => {
    setStep('done');
    showToast({
      variant: 'success',
      title: 'Import complete',
      description: `${validCount} posts imported successfully.`,
    });
  };

  const validCount = results.filter((r) => r.status === 'valid').length;
  const duplicateCount = results.filter((r) => r.status === 'duplicate').length;
  const errorCount = results.filter((r) => r.status === 'error').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-[12px] text-ink/40 mb-2 font-medium">
          <Link href="/admin/posts" className="hover:text-ink/70 transition-colors">Posts</Link>
          <span className="text-ink/15">/</span>
          <span className="text-ink/60">Bulk Import</span>
        </nav>
        <h1 className="text-[28px] md:text-[34px] font-heading font-bold text-ink tracking-tight">
          Bulk Import
        </h1>
        <p className="text-[14px] text-ink/50 mt-1">Upload a JSON file to import multiple posts at once.</p>
      </div>

      {/* ── Upload Step ── */}
      {step === 'upload' && (
        <div className="max-w-2xl">
          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed px-8 py-14 text-center transition-all duration-200 ${isDragging ? 'border-accent/40 bg-accent/[0.02]' : 'border-ink/[0.08] bg-white'
              }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-ink/[0.04] flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ink/25">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-ink mb-1">Drop your JSON file here</p>
            <p className="text-[13px] text-ink/40 mb-5 font-medium">or click to browse from your computer</p>

            <label className="inline-flex items-center px-5 py-2.5 rounded-full bg-ink/[0.05] text-[12px] font-semibold text-ink cursor-pointer hover:bg-ink/[0.08] border border-ink/10 transition-all">
              Choose File
              <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
            </label>

            {file && (
              <p className="text-[13px] text-ink/50 mt-4 font-medium">
                Selected: <span className="font-semibold text-ink">{file.name}</span>
              </p>
            )}
          </div>

          {file && (
            <div className="flex items-center justify-end mt-4">
              <button onClick={handleParse} className="px-6 py-2.5 rounded-full bg-accent text-white text-[12px] font-bold hover:brightness-110 shadow-sm transition-all">
                Parse &amp; Review
              </button>
            </div>
          )}

          {/* JSON Format Example */}
          <div className="mt-8 rounded-2xl border border-ink/[0.06] bg-white overflow-hidden">
            <div className="px-5 py-3.5 border-b border-ink/[0.05]">
              <p className="text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em]">Expected JSON Format</p>
            </div>
            <pre className="px-5 py-4 text-[12px] leading-relaxed text-ink/55 font-mono overflow-x-auto">{`[
  {
    "title": "Article Title",
    "excerpt": "Brief summary...",
    "content_html": "<p>Full article HTML</p>",
    "category_slug": "ai",
    "tags": ["AI", "Enterprise"],
    "status": "draft"
  }
]`}</pre>
          </div>
        </div>
      )}

      {/* ── Review Step ── */}
      {step === 'review' && (
        <div>
          {/* Summary Pills */}
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {validCount} valid
            </span>
            {duplicateCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {duplicateCount} duplicate
              </span>
            )}
            {errorCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold rounded-full bg-red-50 text-red-600 border border-red-200">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {errorCount} error
              </span>
            )}
          </div>

          {/* Review Table */}
          <div className="rounded-2xl border border-ink/[0.06] bg-white overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-ink/[0.06] bg-ink/[0.015]">
                    <th className="text-left px-5 py-3.5 text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em]">Title</th>
                    <th className="text-left px-5 py-3.5 text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em]">Slug</th>
                    <th className="text-left px-5 py-3.5 text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em]">Category</th>
                    <th className="text-left px-5 py-3.5 text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="border-b border-ink/[0.04] last:border-b-0 hover:bg-ink/[0.02] transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-ink/85">{r.row.title}</td>
                      <td className="px-5 py-3.5 text-ink/40 font-mono text-[11px]">{r.row.slug}</td>
                      <td className="px-5 py-3.5 text-ink/50 font-medium">{r.row.category_slug}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full border ${r.status === 'valid'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : r.status === 'duplicate'
                              ? 'bg-amber-50 text-amber-600 border-amber-200'
                              : 'bg-red-50 text-red-600 border-red-200'
                          }`}>
                          {r.status}
                        </span>
                        {r.message && <p className="text-[11px] text-ink/35 mt-1">{r.message}</p>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setStep('upload'); setResults([]); setFile(null); }}
              className="px-5 py-2.5 text-[12px] font-semibold text-ink/50 hover:text-ink/70 rounded-full transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={validCount === 0}
              className="px-6 py-2.5 rounded-full bg-accent text-white text-[12px] font-bold hover:brightness-110 shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Import {validCount} posts
            </button>
          </div>
        </div>
      )}

      {/* ── Done Step ── */}
      {step === 'done' && (
        <div className="max-w-md">
          <div className="rounded-2xl border border-ink/[0.06] bg-white p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <p className="text-[18px] font-heading font-bold text-ink mb-1">Import complete</p>
            <p className="text-[13px] text-ink/50 font-medium mb-6">
              {validCount} posts have been imported successfully.
            </p>
            <Link href="/admin/posts" className="inline-flex px-6 py-2.5 rounded-full bg-accent text-white text-[12px] font-bold hover:brightness-110 shadow-sm transition-all">
              View Posts
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
