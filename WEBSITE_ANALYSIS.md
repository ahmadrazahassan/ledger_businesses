# Website Analysis — ledgerthebusinesses

> **Date**: 2026-02-20
> **Previous Brand**: Sovereign Ink
> **New Brand**: ledgerthebusinesses
> **Purpose**: Full audit of consistency, layout, colors, typography, structure, and branding across the entire codebase.

---

## 1. Tech Stack

| Layer        | Technology                                      |
| ------------ | ----------------------------------------------- |
| Framework    | Next.js 16 (App Router)                         |
| Language     | TypeScript 5 (strict)                           |
| Styling      | Tailwind CSS v4 (`@theme inline` tokens)        |
| Components   | shadcn/ui (customized)                          |
| Backend      | Supabase (DB + Auth + Storage)                  |
| Fonts        | DM Sans + DM Mono via `next/font/google`        |

---

## 2. Color Palette (Design Tokens)

Defined in `src/app/globals.css` via `@theme inline`:

| Token                | Value                        | Usage                          |
| -------------------- | ---------------------------- | ------------------------------ |
| `--color-accent`     | `#05ce78` (emerald green)    | CTAs, highlights, active state |
| `--color-ink`        | `#1e1f26` (near-black)       | Text, borders, dark bg         |
| `--color-cream`      | `#f0e7dd` (warm cream)       | Global background              |
| `--color-warm`       | `#e8ded4`                    | Secondary background           |
| `--color-card`       | `#faf6f2` (off-white)        | Card surfaces                  |
| `--color-gray`       | `#808080`                    | Secondary text                 |
| `--color-gray-light` | `#bfbfbf`                    | Tertiary text/dividers         |
| `--color-background` | `#f0e7dd`                    | Body background                |
| `--color-foreground` | `#1e1f26`                    | Body text                      |
| `--color-border`     | `rgba(30,31,38,0.08)`        | Borders                        |
| `--color-ring`       | `#05ce78`                    | Focus rings                    |
| `--color-destructive`| `#dc2626`                    | Error states                   |

### Color Consistency Notes:
- ✅ Accent green (`#05ce78`) used consistently across CTAs, pills, badges, dots, focus rings
- ✅ Ink (`#1e1f26`) consistently used for text and dark backgrounds (footer, header pill nav, mobile menu, admin)
- ✅ Cream (`#f0e7dd`) is the global body background
- ✅ Card color (`#faf6f2`) used for form inputs and cards
- ⚠️ `favicon.svg` uses `#ffe4db` for background and `#cafc4f` for accent dot — **INCONSISTENT** with the main palette (`#f0e7dd` + `#05ce78`)
- ⚠️ OG image (`api/og/route.tsx`) uses `#ffe4db` as background — **INCONSISTENT** with `#f0e7dd`
- ⚠️ Admin layout uses hardcoded `#f0f2f5` as background — intentionally different from main site

---

## 3. Typography

| Token          | Font                            | Usage          |
| -------------- | ------------------------------- | -------------- |
| `--font-heading` | DM Sans, system-ui, sans-serif | Headings       |
| `--font-body`    | DM Sans, system-ui, sans-serif | Body text      |
| `--font-sans`    | DM Sans, system-ui, sans-serif | General sans   |
| `--font-mono`    | DM Mono, ui-monospace          | Numbers/code   |

### Typography Consistency Notes:
- ✅ DM Sans imported with weights 300-800
- ✅ DM Mono imported with weights 400, 500
- ✅ Heading elements have `letter-spacing: -0.03em` and `font-bold` applied globally
- ✅ Font sizes use a consistent scale: 9px, 10px, 11px, 13px, 14px, 15px, 17px, 22px, 26px, 28px, 34px, 36px, 40px, 44px
- ✅ `font-heading` and `font-body` are both DM Sans (unified font family)

---

## 4. Border Radius Tokens

| Token          | Value  |
| -------------- | ------ |
| `--radius-sm`  | 8px    |
| `--radius-md`  | 10px   |
| `--radius-lg`  | 14px   |
| `--radius-xl`  | 18px   |
| `--radius-2xl` | 22px   |
| `--radius-3xl` | 28px   |
| `--radius-4xl` | 36px   |

### Radius Consistency Notes:
- ✅ Cards use `rounded-[24px]` or `rounded-2xl` (22px) — mostly consistent
- ✅ Buttons/pills use `rounded-full` — consistent
- ✅ Footer uses `rounded-[28px]` (mobile) and `rounded-[36px]` (desktop) — consistent with tokens
- ⚠️ Some hardcoded values like `rounded-[22px]`, `rounded-[24px]` instead of using token classes

---

## 5. Shadow Tokens

| Token              | Value                                                    |
| ------------------ | -------------------------------------------------------- |
| `--shadow-subtle`  | `0 1px 2px rgba(30,31,38,0.03)`                         |
| `--shadow-card`    | `0 1px 4px rgba(30,31,38,0.03), 0 6px 16px ...`         |
| `--shadow-elevated`| `0 2px 8px rgba(30,31,38,0.04), 0 12px 32px ...`        |

- ✅ `shadow-elevated` used on hover for hero cards
- ✅ `shadow-card` used on sponsor sidebar hover

---

## 6. Animations

| Animation        | Duration/Timing              | Usage                    |
| ---------------- | ---------------------------- | ------------------------ |
| `skeleton-pulse` | 2s ease-in-out infinite      | Loading skeletons        |
| `animate-marquee`| 30s linear infinite          | Partner strip scroll     |
| `animate-float`  | 3s ease-in-out infinite      | Floating elements        |

- ✅ Marquee pauses on hover
- ✅ Transitions consistently use `duration-200` or `duration-300`
- ✅ Mobile menu uses `duration-500` for larger transitions, `duration-300` for links

---

## 7. Layout Structure

### Max Width: `max-w-[1400px]` — used consistently across:
- Header
- SectionWrapper
- SponsorLeaderboard
- SponsorMidBanner
- PartnerStrip

### Padding: `px-5 md:px-10` — used in most sections (via SectionWrapper)
- Header uses `px-4 md:px-8` — **slightly different** but acceptable for tighter header

### Admin Max Width: `max-w-[1360px]` — separate from public site

---

## 8. Component Architecture

### Layout Components (`src/components/layout/`)
| Component            | File                      | Notes                |
| -------------------- | ------------------------- | -------------------- |
| Header               | `header.tsx`              | Sticky, dark nav pill, mobile overlay |
| Footer               | `footer.tsx`              | Dark card w/ green CTA strip |
| AnnouncementStrip    | `announcement-strip.tsx`  | Green bar, auto-rotating |
| SectionWrapper       | `section-wrapper.tsx`     | Responsive wrapper utility |

### Brand Components (`src/components/brand/`)
| Component   | File              | Notes                                    |
| ----------- | ----------------- | ---------------------------------------- |
| LogoFull    | `logo-full.tsx`   | Symbol + "Sovereign" + "Ink" text        |
| LogoSymbol  | `logo-symbol.tsx` | SVG geometric "S" monogram with accent dot |

### Post Components (`src/components/posts/`)
| Component        | File                  | Notes                          |
| ---------------- | --------------------- | ------------------------------ |
| PostCardHero     | `post-card-hero.tsx`  | Large/medium hero cards        |
| PostCard         | `post-card.tsx`       | Standard article card          |
| PostCardCompact  | `post-card-compact.tsx` | Compact list item            |
| PostFilters      | `post-filters.tsx`    | Category pills + sort dropdown |
| PostListItem     | `post-list-item.tsx`  | Minimal list row               |

### Sponsor Components (`src/components/sponsors/`)
| Component            | File                      | Notes                    |
| -------------------- | ------------------------- | ------------------------ |
| SponsorLeaderboard   | `sponsor-leaderboard.tsx` | Must-Read banner (4 posts) |
| SponsorMidBanner     | `sponsor-mid-banner.tsx`  | Dark featured reads (3 posts) |
| SponsorInlineCard    | `sponsor-inline-card.tsx` | In-feed ad card          |
| SponsorSidebar       | `sponsor-sidebar.tsx`     | Sidebar 300x250 ad slot  |

### Other Components
| Component        | File                     | Notes                        |
| ---------------- | ------------------------ | ---------------------------- |
| TopicGrid        | `topic-grid.tsx`         | 2-row category grid          |
| LatestArticles   | `latest-articles.tsx`    | Filtered article feed        |
| TrendingList     | `trending-list.tsx`      | Ranked/unranked post list    |
| DeepDiveModule   | `deep-dive-module.tsx`   | Guide spotlight with chapters |
| NewsletterCard   | `newsletter-card.tsx`    | Green CTA subscription card  |
| PartnerStrip     | `partner-strip.tsx`      | Marquee partner logos        |
| SearchInput      | `search-input.tsx`       | Search form input            |
| Icons            | `icons.tsx`              | 10 custom SVG icons          |

---

## 9. Pages/Routes

| Route                    | Page File                          | Notes                        |
| ------------------------ | ---------------------------------- | ---------------------------- |
| `/`                      | `app/page.tsx`                     | 10-section homepage          |
| `/articles/[slug]`       | `app/articles/[slug]/page.tsx`     | Article detail               |
| `/category/[slug]`       | `app/category/[slug]/page.tsx`     | Category listing             |
| `/search`                | `app/search/page.tsx`              | Search page                  |
| `/auth/login`            | `app/auth/login/page.tsx`          | Admin login                  |
| `/admin`                 | `app/admin/page.tsx`               | Admin dashboard              |
| `/admin/posts`           | `app/admin/posts/page.tsx`         | Posts list                   |
| `/admin/posts/new`       | `app/admin/posts/new/page.tsx`     | New post editor              |
| `/admin/posts/[id]/edit` | `app/admin/posts/[id]/edit/page.tsx` | Edit post                  |
| `/admin/posts/import`    | `app/admin/posts/import/page.tsx`  | Bulk import                  |
| `/admin/categories`      | `app/admin/categories/page.tsx`    | Categories CRUD              |
| `/admin/banners`         | `app/admin/banners/page.tsx`       | Banner management            |

---

## 10. Categories (from `seed.ts`)

| ID   | Name         | Slug          | Post Count |
| ---- | ------------ | ------------- | ---------- |
| c1   | Business     | business      | 24         |
| c2   | AI           | ai            | 31         |
| c3   | Startups     | startups      | 18         |
| c4   | B2B          | b2b           | 15         |
| c5   | Software     | software      | 22         |
| c6   | GPTs         | gpts          | 12         |
| c7   | Case Studies | case-studies  | 9          |
| c8   | Funding      | funding       | 14         |

---

## 11. Header Navigation (Current)

```ts
const navLinks = [
  { label: 'Topics', href: '/#topics' },
  { label: 'Latest', href: '/#latest' },
  { label: 'Trending', href: '/#trending' },
  { label: 'Guides', href: '/#deep-dive' },
  { label: 'About', href: '/about' },
];
```

**Plan**: Replace with category-based navigation links using some of the 8 categories above.

---

## 12. All "Sovereign Ink" Branding Locations (TO BE REPLACED)

### Files with "Sovereign Ink" brand text:

| File | Line(s) | Content |
| ---- | ------- | ------- |
| `app/layout.tsx` | 21, 22, 36, 40, 41, 48 | Title, template, authors, OG |
| `app/sitemap.ts` | 5 | `sovereignink.com` fallback URL |
| `app/robots.ts` | 4 | `sovereignink.com` fallback URL |
| `app/search/page.tsx` | 13 | Search page description |
| `app/category/[slug]/page.tsx` | 31, 34 | Category page metadata |
| `app/auth/login/page.tsx` | 90, 93, 133, 191 | Login brand + email placeholder |
| `app/api/og/route.tsx` | 8, 42, 53 | OG image brand text |
| `app/admin/layout.tsx` | 34, 35 | Admin header brand |
| `app/page.tsx` | 108 | Email link `sovereignink.com` |
| `components/brand/logo-full.tsx` | 9, 12 | "Sovereign" + "Ink" text |
| `components/brand/logo-symbol.tsx` | 10 | SVG aria-label |
| `components/layout/header.tsx` | 166 | Mobile CTA "Subscribe to Sovereign Ink" |
| `components/layout/footer.tsx` | 46, 65, 68, 137 | Email, brand text, copyright |
| `components/sponsors/sponsor-mid-banner.tsx` | 56, 59 | Sponsor text + email |
| `components/sponsors/sponsor-inline-card.tsx` | 19 | Sponsor name |
| `components/icons.tsx` | 1 | Comment |
| `data/seed.ts` | 1 | Comment |
| `lib/types/database.ts` | 1 | Comment |
| `lib/supabase/admin.ts` | 1 | Comment |
| `README.md` | 1, 3, etc. | Numerous references |

### Decorative "SI" monogram references:
- `post-card-hero.tsx` line 21: `SI` watermark text
- `post-card.tsx` line 17: `SI` watermark text
- `api/og/route.tsx` line 42: `SI` logo mark text

---

## 13. Consistency Issues Found

1. **Favicon colors mismatch**: `#ffe4db` bg + `#cafc4f` accent vs actual theme `#f0e7dd` + `#05ce78`
2. **OG image background**: Uses `#ffe4db` instead of `#f0e7dd`
3. **Header padding** (`px-4 md:px-8`) differs slightly from other sections (`px-5 md:px-10`)
4. **Admin bg color** is hardcoded `#f0f2f5` (cool gray) vs warm cream — this is intentional for visual separation
5. **"SI" decorative text** in hero cards and OG image needs updating to new brand initials
6. **Logo SVG** renders an "S" letterform — needs to be updated for new brand
7. **Email addresses** reference `sovereignink.com` domain
8. **Fallback URLs** in `sitemap.ts` and `robots.ts` reference `sovereignink.com`

---

## 14. Rebranding Plan: Sovereign Ink → ledgerthebusinesses

### Step 1: Header Navigation
Replace generic nav links with category-based navigation using categories from seed data.

### Step 2: Brand Text Replacement
Replace ALL instances of "Sovereign Ink", "Sovereign", "Ink" (brand context), and "sovereignink" domain references with "ledgerthebusinesses".

### Step 3: Logo Components
Update `logo-full.tsx` to display "ledgerthebusinesses" as a single brand name.
Update `logo-symbol.tsx` to reflect new brand (change "S" letterform, update aria-label).

### Step 4: Decorative Elements
Update "SI" watermarks in post cards and OG images to "LTB" or similar.

### Step 5: Domain & Email
Update all email references from `@sovereignink.com` to `@ledgerthebusinesses.com`.
Update fallback URLs from `sovereignink.com` to `ledgerthebusinesses.com`.

### Step 6: README & Comments
Update README.md and all code comments referencing old brand.
