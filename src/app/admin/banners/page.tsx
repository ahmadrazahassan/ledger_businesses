'use client';

import { useState } from 'react';
import { banners } from '@/data/seed';
import type { Banner, BannerPlacement } from '@/lib/types/database';

/* ── empty form scaffold ── */
const emptyForm = {
  placement_key: 'leaderboard' as BannerPlacement,
  style_variant: 'default',
  image_url: '',
  link_url: '',
  label: '',
  alt_text: '',
  start_date: '',
  end_date: '',
  active: true,
};

/* ── placement colour map ── */
const placementPill: Record<BannerPlacement, string> = {
  leaderboard: 'bg-purple-50 text-purple-600',
  'inline-card': 'bg-blue-50 text-blue-600',
  sidebar: 'bg-amber-50 text-amber-600',
};

const placementLabel: Record<BannerPlacement, string> = {
  leaderboard: 'Leaderboard',
  'inline-card': 'Inline Card',
  sidebar: 'Sidebar',
};

// Professional banner size specifications
const bannerSpecs: Record<BannerPlacement, { size: string; dimensions: string; description: string }> = {
  leaderboard: {
    size: '728 × 90px',
    dimensions: 'Desktop: 728×90px, Mobile: 320×50px',
    description: 'Top banner across full width, high visibility placement'
  },
  'inline-card': {
    size: '300 × 250px',
    dimensions: 'Standard: 300×250px (Medium Rectangle)',
    description: 'Embedded within content, native ad appearance'
  },
  sidebar: {
    size: '300 × 600px',
    dimensions: 'Standard: 300×600px (Half Page)',
    description: 'Vertical sidebar placement, persistent visibility'
  },
};

const inputClass =
  'w-full bg-[#f8f9fb] border border-ink/[0.08] rounded-xl px-4 py-3 text-[14px] text-ink placeholder:text-ink/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 focus:bg-white transition-all duration-200';

function formatDate(iso: string) {
  if (!iso) return '\u2014';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function truncateUrl(url: string, max = 40) {
  return url.length > max ? url.slice(0, max) + '\u2026' : url;
}

export default function AdminBannersPage() {
  const [bannersList, setBannersList] = useState<Banner[]>(
    banners.map((b) => ({
      ...b,
      alt_text: b.alt_text ?? '',
      impressions: b.impressions ?? 0,
      clicks: b.clicks ?? 0,
      updated_at: b.updated_at ?? b.created_at,
    }))
  );

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setForm({
      placement_key: banner.placement_key,
      style_variant: banner.style_variant,
      image_url: banner.image_url,
      link_url: banner.link_url,
      label: banner.label,
      alt_text: banner.alt_text ?? '',
      start_date: banner.start_date?.slice(0, 10) ?? '',
      end_date: banner.end_date?.slice(0, 10) ?? '',
      active: banner.active,
    });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  const handleSave = () => {
    if (!form.link_url.trim()) return;
    const now = new Date().toISOString();

    if (editingId) {
      setBannersList((prev) =>
        prev.map((b) =>
          b.id === editingId
            ? {
              ...b,
              placement_key: form.placement_key,
              style_variant: form.style_variant || 'default',
              image_url: form.image_url,
              link_url: form.link_url.trim(),
              label: form.label.trim() || 'Sponsor',
              alt_text: form.alt_text,
              start_date: form.start_date ? new Date(form.start_date).toISOString() : b.start_date,
              end_date: form.end_date ? new Date(form.end_date).toISOString() : b.end_date,
              active: form.active,
              updated_at: now,
            }
            : b
        )
      );
    } else {
      const newBanner: Banner = {
        id: `b${Date.now()}`,
        placement_key: form.placement_key,
        style_variant: form.style_variant || 'default',
        image_url: form.image_url,
        link_url: form.link_url.trim(),
        label: form.label.trim() || 'Sponsor',
        alt_text: form.alt_text,
        impressions: 0,
        clicks: 0,
        start_date: form.start_date ? new Date(form.start_date).toISOString() : now,
        end_date: form.end_date ? new Date(form.end_date).toISOString() : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        active: form.active,
        created_at: now,
        updated_at: now,
      };
      setBannersList((prev) => [...prev, newBanner]);
    }
    closeForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this banner?')) return;
    setBannersList((prev) => prev.filter((b) => b.id !== id));
  };

  const patch = (delta: Partial<typeof form>) => setForm({ ...form, ...delta });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink/40">Advertising</span>
          </div>
          <h1 className="text-[28px] md:text-[34px] font-heading font-bold text-ink tracking-tight">Banners</h1>
          <p className="text-[14px] text-ink/50 mt-1">Manage ad placements and sponsorship banners.</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent text-accent-foreground text-[12px] font-bold rounded-full hover:bg-accent-hover shadow-sm transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2.5v7M2.5 6h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          Add Banner
        </button>
      </div>

      {/* Banner Size Guide */}
      <div className="mb-8 p-6 rounded-2xl bg-white border border-ink/[0.06]">
        <div className="flex items-center gap-2 mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-content">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <h3 className="text-[14px] font-bold text-ink">Standard Banner Sizes</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['leaderboard', 'inline-card', 'sidebar'] as BannerPlacement[]).map((placement) => {
            const spec = bannerSpecs[placement];
            return (
              <div key={placement} className="p-4 rounded-xl bg-ink/[0.02] border border-ink/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${placementPill[placement]}`}>
                    {placementLabel[placement]}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-accent-content">{spec.size}</span>
                </div>
                <p className="text-[11px] text-ink/50 leading-relaxed">{spec.description}</p>
                <p className="text-[10px] text-ink/35 mt-2 font-medium">{spec.dimensions}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative w-full max-w-lg mx-4 bg-white border border-ink/[0.08] rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-6 pb-0">
              <h2 className="text-[18px] font-heading font-bold text-ink tracking-tight">
                {editingId ? 'Edit Banner' : 'New Banner'}
              </h2>
              <button onClick={closeForm} className="w-8 h-8 rounded-full bg-ink/[0.04] hover:bg-ink/[0.08] flex items-center justify-center text-ink/40 hover:text-ink/70 transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className="px-6 pt-5 pb-2 space-y-4 max-h-[65vh] overflow-y-auto">
              {/* Placement Selection with Specs */}
              <div>
                <label className="block text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em] mb-2">Banner Placement</label>
                <div className="space-y-2">
                  {(['leaderboard', 'inline-card', 'sidebar'] as BannerPlacement[]).map((placement) => {
                    const spec = bannerSpecs[placement];
                    const isSelected = form.placement_key === placement;
                    return (
                      <label
                        key={placement}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-accent bg-accent/5'
                            : 'border-ink/[0.08] hover:border-ink/15 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="placement"
                          value={placement}
                          checked={isSelected}
                          onChange={(e) => patch({ placement_key: e.target.value as BannerPlacement })}
                          className="mt-1 w-4 h-4 text-accent-content border-ink/20 focus:ring-accent"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[13px] font-bold text-ink">{placementLabel[placement]}</span>
                            <span className="text-[11px] font-mono font-semibold text-accent-content">{spec.size}</span>
                          </div>
                          <p className="text-[11px] text-ink/50 leading-relaxed mb-1">{spec.description}</p>
                          <p className="text-[10px] text-ink/35 font-medium">{spec.dimensions}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em] mb-1.5">Style Variant</label>
                <input type="text" value={form.style_variant} onChange={(e) => patch({ style_variant: e.target.value })} placeholder="default" className={inputClass} />
                <p className="mt-1 text-[10px] text-ink/35">Optional: custom, dark, minimal, etc.</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em] mb-1.5">Banner Image</label>
                <div className="border-2 border-dashed border-ink/[0.08] rounded-xl p-5 text-center hover:border-accent/30 transition-all cursor-pointer group">
                  {form.image_url ? (
                    <div className="space-y-1.5">
                      <p className="text-[12px] text-ink/50 truncate font-medium">{form.image_url}</p>
                      <button type="button" onClick={() => patch({ image_url: '' })} className="text-[11px] font-semibold text-red-500 hover:text-red-600 transition-colors">Remove</button>
                    </div>
                  ) : (
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-ink/[0.04] group-hover:bg-accent/10 flex items-center justify-center mx-auto mb-2 transition-all">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-ink/25 group-hover:text-accent-content transition-colors"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                      </div>
                      <p className="text-[13px] text-ink/40 group-hover:text-ink/60 transition-colors font-medium">Drop an image or click to upload</p>
                      <p className="text-[11px] text-ink/25 mt-0.5">PNG, JPG up to 2 MB</p>
                    </div>
                  )}
                  <input type="text" value={form.image_url} onChange={(e) => patch({ image_url: e.target.value })} placeholder="Or paste image URL…" className="mt-2 w-full bg-transparent border-0 text-center text-[12px] text-ink/40 placeholder:text-ink/25 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em] mb-1.5">Link URL</label>
                <input type="url" value={form.link_url} onChange={(e) => patch({ link_url: e.target.value })} placeholder="https://sponsor.com/campaign" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em] mb-1.5">Label</label>
                  <input type="text" value={form.label} onChange={(e) => patch({ label: e.target.value })} placeholder="Sponsor" className={inputClass} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em] mb-1.5">Alt Text</label>
                  <input type="text" value={form.alt_text} onChange={(e) => patch({ alt_text: e.target.value })} placeholder="Descriptive text…" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em] mb-1.5">Start Date</label>
                  <input type="date" value={form.start_date} onChange={(e) => patch({ start_date: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-ink/45 uppercase tracking-[0.08em] mb-1.5">End Date</label>
                  <input type="date" value={form.end_date} onChange={(e) => patch({ end_date: e.target.value })} className={inputClass} />
                </div>
              </div>

              {/* Active toggle */}
              <label className="flex items-center justify-between py-2 cursor-pointer select-none">
                <div>
                  <p className="text-[13px] font-semibold text-ink">Active</p>
                  <p className="text-[11px] text-ink/40 mt-0.5">Banner will be displayed on the site</p>
                </div>
                <span className="relative">
                  <input type="checkbox" checked={form.active} onChange={() => patch({ active: !form.active })} className="peer sr-only" />
                  <span className={`block w-11 h-6 rounded-full transition-colors ${form.active ? 'bg-accent' : 'bg-ink/10'}`} />
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${form.active ? 'translate-x-5' : 'translate-x-0'}`} />
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 px-6 py-5 border-t border-ink/[0.06] mt-1">
              <button onClick={closeForm} className="px-5 py-2.5 text-[12px] font-semibold text-ink/50 hover:text-ink/70 rounded-full transition-all">Cancel</button>
              <button onClick={handleSave} className="px-6 py-2.5 bg-accent text-accent-foreground text-[12px] font-bold rounded-full hover:bg-accent-hover shadow-sm transition-all">
                {editingId ? 'Save Changes' : 'Add Banner'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner cards */}
      {bannersList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl bg-white border border-ink/[0.06]">
          <div className="w-14 h-14 rounded-2xl bg-ink/[0.04] flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/25" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /></svg>
          </div>
          <p className="text-[14px] text-ink/50 mb-1 font-medium">No banners yet</p>
          <p className="text-[12px] text-ink/35 mb-5">Create your first ad placement.</p>
          <button onClick={openAdd} className="px-5 py-2.5 bg-accent text-accent-foreground text-[12px] font-bold rounded-full hover:bg-accent-hover shadow-sm transition-all">
            Create Banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {bannersList.map((banner) => (
              <div
                key={banner.id}
                className="bg-white border border-ink/10 rounded-3xl p-6 flex flex-col hover:shadow-lg hover:border-ink/20 transition-all duration-200 shadow-sm"
              >
                {/* Top pills */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex px-3.5 py-1.5 text-[12px] font-bold rounded-full border ${
                      placementPill[banner.placement_key] ?? 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    {placementLabel[banner.placement_key] ?? banner.placement_key}
                  </span>
                  <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-[12px] font-bold rounded-full border ${banner.active
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${banner.active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                    {banner.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Link + label */}
                <p className="text-[13px] text-ink/60 truncate leading-relaxed font-medium">
                  {truncateUrl(banner.link_url)}
                </p>
                {banner.label && (
                  <p className="text-[12px] text-ink/40 mt-1 mb-4 font-medium">{banner.label}</p>
                )}
                {!banner.label && <div className="mb-4" />}

                {/* Date range */}
                <div className="mb-5">
                  <p className="text-[12px] font-bold text-ink/50 uppercase tracking-wider mb-2">Date Range</p>
                  <p className="text-[13px] text-ink/60 leading-relaxed font-medium">
                    {formatDate(banner.start_date)}
                    <span className="mx-2 text-ink/30">&mdash;</span>
                    {formatDate(banner.end_date)}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex gap-8 mb-5">
                  <div>
                    <p className="text-[12px] font-bold text-ink/50 uppercase tracking-wider mb-2">Impressions</p>
                    <p className="text-[20px] font-bold text-ink tracking-tight tabular-nums">
                      {(banner.impressions ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-ink/50 uppercase tracking-wider mb-2">Clicks</p>
                    <p className="text-[20px] font-bold text-ink tracking-tight tabular-nums">
                      {(banner.clicks ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-5 pt-4 mt-auto border-t border-ink/10">
                  <button onClick={() => openEdit(banner)} className="text-[13px] font-semibold text-ink/50 hover:text-ink transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(banner.id)} className="text-[13px] font-semibold text-ink/50 hover:text-red-500 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
          ))}
        </div>
      )}
    </div>
  );
}
