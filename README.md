# Ledger Businesses

**Production domain:** [ledgerthebusinesses.co.uk](https://ledgerthebusinesses.co.uk) · **Contact:** fiza.kanwal@ledgerthebusinesses.co.uk

**The authority in business intelligence.**

A premium, modern editorial platform for publishing long-form articles about Business, AI, Startups, B2B, Software, GPTs, Funding, and more. Built with a luxury design system — no gradients, no gimmicks, just confident editorial craft.

---

## Tech Stack

| Layer        | Technology                                         |
| ------------ | -------------------------------------------------- |
| Framework    | [Next.js 16](https://nextjs.org) (App Router)      |
| Language     | TypeScript 5 (strict)                              |
| Styling      | Tailwind CSS v4 (CSS-first `@theme` tokens)        |
| Components   | shadcn/ui (customized to brand palette)            |
| Backend      | [Supabase](https://supabase.com) (DB + Auth + Storage) |
| Fonts        | DM Sans + DM Mono via `next/font/google`           |
| Deployment   | Vercel (recommended)                               |

---

## Features

### Public Site
- **10-section homepage** — hero editorial feature, partner strip, topic grid, latest articles feed, trending list, deep dive module, newsletter block, sponsor placements, and premium footer
- **Article detail pages** — full editorial layout with breadcrumbs, related posts, tag navigation, and newsletter CTA
- **Category listing pages** — filtered post feeds per topic
- **Search** — full-text search with suggested keywords and category browsing
- **SEO** — dynamic metadata, Open Graph images (`/api/og`), `sitemap.ts`, `robots.ts`, clean slugs

### Admin Panel (`/admin`)
- **Dashboard** — stats overview, quick actions, recently published posts
- **Post editor** — Write / HTML / Preview tabs, slug auto-generation, category & tag selection, cover image upload, SEO fields, publish scheduling
- **Bulk import** — JSON file upload with duplicate detection and review table
- **Categories CRUD** — add, view, delete categories
- **Banner management** — configure leaderboard, inline, and sidebar ad placements
- **Auth guard** — Supabase Auth with cookie-based sessions, middleware protection

### Design System
- **Accent color**: `#05ce78` (emerald green)
- **Background**: `#f0e7dd` (warm cream)
- **Typography**: DM Sans (body) + DM Mono (code/numbers)
- **No gradients** — anywhere. Flat, confident, editorial aesthetic.
- **Custom SVG logo** — geometric "L" monogram with accent dot, full lockup + symbol variants
- **Custom SVG icons** — arrows, search, close, chevrons, calendar, clock, mail (no icon libraries)

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage (10 sections)
│   ├── articles/[slug]/page.tsx    # Article detail
│   ├── category/[slug]/page.tsx    # Category listing
│   ├── search/page.tsx             # Search results
│   ├── admin/                      # Admin panel
│   │   ├── layout.tsx              # Admin layout
│   │   ├── page.tsx                # Dashboard
│   │   ├── posts/                  # Posts CRUD + editor + import
│   │   ├── categories/page.tsx     # Categories CRUD
│   │   └── banners/page.tsx        # Banner management
│   ├── auth/                       # Login + callback
│   ├── api/og/route.tsx            # Dynamic OG image generation
│   ├── api/search/route.ts         # Search API
│   ├── sitemap.ts                  # Dynamic sitemap
│   └── robots.ts                   # Robots config
├── components/
│   ├── brand/                      # Logo variants (SVG)
│   ├── layout/                     # Header, Footer, Announcement, SectionWrapper
│   ├── posts/                      # PostCard variants, filters
│   ├── sponsors/                   # Ad placement components
│   ├── icons.tsx                   # Custom SVG icons
│   ├── newsletter-card.tsx         # Newsletter subscription
│   ├── topic-grid.tsx              # Topic categories grid
│   ├── trending-list.tsx           # Trending/editor's picks
│   ├── deep-dive-module.tsx        # Guide of the week
│   ├── partner-strip.tsx           # Trusted-by marquee
│   └── search-input.tsx            # Search input component
├── lib/
│   ├── supabase/                   # Client, server, middleware
│   ├── queries/                    # Posts, categories, banners, authors
│   ├── types/database.ts           # TypeScript DB types
│   ├── storage.ts                  # Supabase Storage helpers
│   └── utils.ts                    # Slug generation, date formatting, etc.
├── data/
│   └── seed.ts                     # Realistic demo content (14 posts, 8 categories)
└── styles/
    └── globals.css                 # Tailwind v4 @theme tokens + design system
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Canonical site URL (metadata, sitemap, OG). Use your live domain:
NEXT_PUBLIC_SITE_URL=https://ledgerthebusinesses.co.uk

# Cloudinary (admin image uploads)
# Production: keep the API secret on the server only — use CLOUDINARY_URL (from the Cloudinary console).
# The app requests a short-lived signature from /api/cloudinary/sign (requires a logged-in admin).
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME

# Must match the cloud name in CLOUDINARY_URL (used by next-cloudinary for delivery URLs / CldImage).
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Optional: unsigned upload preset for local dev if you do not set CLOUDINARY_URL
# NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset_name
```

> The app runs with demo seed data without Supabase. Connect Supabase when ready for production.

> **Do not** expose `CLOUDINARY_URL`, `CLOUDINARY_API_SECRET`, or the API secret in `NEXT_PUBLIC_*` variables. If a secret is ever committed or shared, rotate it in the Cloudinary dashboard.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### 4. Build for production

```bash
npm run build
npm run start
```

---

## Key Routes

| Route                        | Description                     |
| ---------------------------- | ------------------------------- |
| `/`                          | Homepage                        |
| `/articles/[slug]`           | Article detail page             |
| `/category/[slug]`           | Category listing                |
| `/search?q=keyword`          | Search results                  |
| `/auth/login`                | Admin login                     |
| `/admin`                     | Admin dashboard                 |
| `/admin/posts`               | Posts list                      |
| `/admin/posts/new`           | Post editor                     |
| `/admin/posts/[id]/edit`     | Edit post                       |
| `/admin/posts/import`        | Bulk JSON import                |
| `/admin/categories`          | Categories management           |
| `/admin/banners`             | Banner placement management     |

---

## Design Tokens

Defined in `src/app/globals.css` via Tailwind v4 `@theme inline`:

```
Accent:      #05ce78    (emerald green — CTAs, highlights, active states)
Ink:         #1e1f26    (near-black — text, borders, dark backgrounds)
Cream:       #f0e7dd    (warm cream — global background)
Card:        #faf6f2    (off-white — card surfaces)
Gray:        #808080    (secondary text)
```

---

## License

Private project. All rights reserved.
