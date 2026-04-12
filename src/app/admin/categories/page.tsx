'use client';

import { useState } from 'react';
import { slugify } from '@/lib/utils';
import { categories as seedCategories } from '@/data/seed';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  post_count: number;
  created_at: string;
}

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<Category[]>(
    seedCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      post_count: c.post_count,
      created_at: c.created_at,
    }))
  );

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const resetForm = () => {
    setFormName('');
    setFormSlug('');
    setFormDesc('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    if (!formName.trim()) return;
    const newCat: Category = {
      id: `c${Date.now()}`,
      name: formName.trim(),
      slug: formSlug.trim() || slugify(formName),
      description: formDesc.trim(),
      post_count: 0,
      created_at: new Date().toISOString(),
    };
    setCats([...cats, newCat]);
    resetForm();
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDesc(cat.description);
    setShowForm(true);
  };

  const handleUpdate = () => {
    if (!editingId || !formName.trim()) return;
    setCats(
      cats.map((c) =>
        c.id === editingId
          ? { ...c, name: formName.trim(), slug: formSlug.trim() || slugify(formName), description: formDesc.trim() }
          : c
      )
    );
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this category?')) return;
    setCats(cats.filter((c) => c.id !== id));
  };

  const inputClass =
    'w-full bg-[#f8f9fb] border border-ink/[0.08] rounded-xl px-4 py-3 text-[14px] text-ink placeholder:text-ink/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 focus:bg-white transition-all duration-200';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink/40">Taxonomy</span>
          </div>
          <h1 className="text-[28px] md:text-[34px] font-heading font-bold text-ink tracking-tight">Categories</h1>
          <p className="text-[14px] text-ink/50 mt-1">{cats.length} categories</p>
        </div>
        <button
          onClick={() => {
            if (showForm && !editingId) {
              resetForm();
            } else {
              resetForm();
              setShowForm(true);
            }
          }}
          className={`inline-flex items-center gap-1.5 px-5 py-2.5 text-[12px] font-bold rounded-full transition-all shadow-sm ${showForm && !editingId
              ? 'text-ink/60 border border-ink/10 hover:border-ink/20 bg-white'
              : 'bg-accent text-accent-foreground hover:bg-accent-hover'
            }`}
        >
          {showForm && !editingId ? (
            'Cancel'
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2.5v7M2.5 6h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              Add Category
            </>
          )}
        </button>
      </div>

      {/* Modal Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-white border border-ink/[0.08] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden mx-4">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-0">
              <h2 className="text-[18px] font-heading font-bold text-ink tracking-tight">
                {editingId ? 'Edit Category' : 'New Category'}
              </h2>
              <button onClick={resetForm} className="w-8 h-8 rounded-full bg-ink/[0.04] hover:bg-ink/[0.08] flex items-center justify-center text-ink/40 hover:text-ink/70 transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 pt-5 pb-2 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em] mb-1.5">Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (!editingId) setFormSlug(slugify(e.target.value));
                  }}
                  placeholder="Category name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em] mb-1.5">Slug</label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="auto-generated-from-name"
                  className={`${inputClass} font-mono`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em] mb-1.5">Description</label>
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Short description"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-5 mt-1">
              <button onClick={resetForm} className="px-5 py-2.5 text-[12px] font-semibold text-ink/50 hover:text-ink/70 rounded-full transition-all">
                Cancel
              </button>
              <button
                onClick={editingId ? handleUpdate : handleAdd}
                className="px-6 py-2.5 bg-accent text-accent-foreground text-[12px] font-bold rounded-full hover:bg-accent-hover shadow-sm transition-all"
              >
                {editingId ? 'Update' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category list */}
      <div className="rounded-2xl bg-white border border-ink/[0.06] overflow-hidden divide-y divide-ink/[0.05]">
        {cats.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between px-5 py-4 hover:bg-accent/[0.015] transition-colors duration-150 group"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <span className="text-[14px] font-heading font-bold text-accent-content">{cat.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <p className="text-[14px] font-semibold text-ink truncate">{cat.name}</p>
                  <span className="text-[10px] font-bold text-accent-content bg-accent/8 px-2 py-0.5 rounded-md border border-accent/15 shrink-0">
                    {cat.post_count} posts
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-mono text-ink/35">/{cat.slug}</span>
                  {cat.description && (
                    <>
                      <span className="text-ink/15">·</span>
                      <span className="text-[11px] text-ink/40 truncate">{cat.description}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => handleEdit(cat)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-ink/50 hover:text-accent-content hover:bg-accent/5 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-ink/50 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {cats.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-xl bg-ink/[0.04] flex items-center justify-center mx-auto mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-ink/25">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
              </svg>
            </div>
            <p className="text-[14px] text-ink/50 mb-1 font-medium">No categories yet</p>
            <p className="text-[12px] text-ink/35">Click &quot;Add Category&quot; to create your first one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
