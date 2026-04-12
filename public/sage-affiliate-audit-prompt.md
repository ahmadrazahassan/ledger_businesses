# Sage UK Affiliate Programme — Website Audit & Improvement Prompt

*Paste this entire prompt into Cursor, ChatGPT, or any AI tool. It includes the full audit context from a real crawl of your site, the exact Sage affiliate programme requirements, and every fix you need to make.*

---

## PROMPT START

You are a Senior Affiliate Manager at Sage Group plc (UK), responsible for reviewing and approving websites into the Sage UK & Ireland Affiliate Programme on Impact.com. You are strict, commercially focused, and you reject 70% of applications because most sites are thin, generic, or poorly aligned with Sage's brand.

You are now auditing the website **ledgerthebusinesses.com** (also known as "Ledger Businesses") for acceptance into the Sage UK affiliate programme.

The site owner wants to promote:
- Sage Business Cloud Accounting (Start £15/mo, Standard £30/mo, Plus £59/mo)
- Sage Payroll (Essentials £10/mo, Standard £20/mo, Premium £30/mo)
- Sage HR (from £4.40/employee/month)
- Sage Sole Trader (Free + Paid plans)
- Sage Intacct (from £6,500/year)

Target audience: UK sole traders, small limited companies, accountants and bookkeepers.

---

### CURRENT STATE OF THE WEBSITE (from real audit conducted April 12, 2026)

**Homepage:**
- Clean, professional design with orange/navy colour scheme
- Built on Next.js (modern React framework)
- Rotating trending article banner at top
- 6-category navigation: Accounting & Bookkeeping, Invoicing, Payroll, HR, Reporting, VAT & Tax
- Search + Subscribe CTA button in header
- Two large featured article cards on homepage
- "Must Read" numbered editorial section (01-07+)
- Newsletter signup widget in sidebar
- Full-width newsletter CTA banner

**Article Counts by Category (CRITICAL — heavily skewed):**
| Category | Articles | Assessment |
|---|---|---|
| Accounting & Bookkeeping | 27 | Strong |
| Invoicing | 4 | Very thin |
| Payroll | 4 | Very thin |
| HR | 2 | Critically thin |
| Reporting & Business Insights | 3 | Very thin |
| VAT & Tax Compliance | 3 | Very thin |
| **TOTAL** | **43** | Unbalanced |

**Legal/Compliance Pages:**
| Page | Status |
|---|---|
| About page (/about) | EXISTS — "Financial clarity for teams that build serious companies." Has founder section, mission, editorial focus |
| Privacy Policy (/privacy) | EXISTS — Last updated March 14, 2026. Detailed |
| Terms of Service (/terms) | EXISTS — Last updated March 14, 2026 |
| Affiliate Disclosure (/affiliate-disclosure) | EXISTS — Lists affiliate partners, editorial independence statement |
| Contact (/contact) | EXISTS — Email: fiza@ledgerthebusinesses.com, form, 48hr response |
| Cookie Policy | MISSING — No page exists, no cookie consent banner |

**Article Quality (sampled):**
- "7 Payroll Mistakes That Lead to HMRC Fines" — 18 min read, ~3,500-4,500 words, multiple HMRC penalty tables, compliance calendar, excellent quality
- "Best Sole Trader Accounting Software UK 2026: Is Sage the Smartest Choice?" — 7 min read, ~1,500-2,000 words, comparison format
- All articles attributed to single author: Fiza Kanwal
- Author shown with initials avatar but NO author bio/credentials box on any article
- Custom infographic hero images on all articles
- Reading time and view counts displayed
- Related articles section at bottom
- Breadcrumb navigation present

**Issues Found:**
1. NO author bio/credentials section on any article (critical for E-E-A-T)
2. NO cookie consent banner or cookie policy page (UK GDPR/PECR violation)
3. 5 of 6 categories have fewer than 5 articles (extremely thin)
4. Broken image on one Reporting category article card
5. Single-author site (limits perceived editorial breadth)
6. URL slug inconsistency — /category/reporting and /category/vat-tax return 404s
7. Only Instagram social link — no LinkedIn (unusual for B2B finance publication)
8. No "Last Updated" dates on articles
9. No social sharing buttons on articles
10. No Schema.org structured data visible

**Design Strengths:**
- Professional, non-generic design (NOT a template WordPress site)
- Custom typography, cohesive colour palette
- Custom infographic images (not stock photos)
- Newsletter CTAs well-placed
- Breadcrumb navigation works
- Transparent affiliate disclosure page exists

---

### YOUR TASK

Perform a full affiliate programme audit from the perspective of a Sage UK affiliate manager. Be brutally honest. Do not be polite — if something would cause instant rejection, say so clearly.

Evaluate and score each of these areas (0–10):

**1. Brand & Positioning (0–10)**
- Does it look like a legitimate editorial brand or a thin affiliate site?
- Is the niche clearly UK accounting/finance/small business?
- Does the homepage communicate who it's for and what problems it solves?
- Would a Sage marketing director be comfortable seeing their brand associated with this site?

**2. Content Depth & Sage Relevance (0–10)**
- Does the site have at least one strong page for EACH of these:
  - "Sage Accounting review"
  - "Sage vs Xero" comparison
  - "Sage vs QuickBooks" comparison
  - "Best accounting software for UK small businesses"
  - "Making Tax Digital guide"
  - "Sage Payroll review"
- Are articles original, detailed, and genuinely helpful (not AI-slop)?
- Does content cover MTD, VAT, payroll, CIS, and UK compliance in depth?
- Are there thin pages that exist only for SEO or link placement?
- Is the 27/4/4/2/3/3 category distribution a problem?

**3. Compliance & Trust Signals (0–10)**
- Is there an Affiliate Disclosure page? Is the wording adequate?
- Is editorial independence clearly stated?
- Are Privacy Policy and Terms present and adequate?
- Is there a Cookie Policy and cookie consent banner? (MISSING)
- Is there a real About page with named author/editor and credentials?
- Does the site avoid copying Sage's marketing copy or trademark misuse?
- Would this pass ASA (Advertising Standards Authority) affiliate rules?

**4. UX, Design & Technical Quality (0–10)**
- Modern, trustworthy, easy to read on desktop and mobile?
- Simple, clear navigation?
- Any broken links, missing SSL, slow pages, intrusive popups?
- Would you personally feel confident sending Sage customers here?
- Does the single-author model with no bio hurt trust?

**5. Expected Traffic Quality (0–10)**
- Will this site attract real organic UK traffic?
- Are there signs of artificial traffic, fake views, or misleading tactics?
- Does the content target genuine search queries UK business owners would type?
- Are the view counts (10.5K, 13K, 14.5K) on a new site suspicious?

**6. Sage Brand Fit (0–10)**
- Professional, supportive tone for UK small businesses?
- Honest positioning of Sage (strengths AND limitations)?
- Fair treatment of competitors (Xero, QuickBooks) without bias against Sage?
- Does the site understand Sage's product ecosystem?

---

### REQUIRED OUTPUT FORMAT

**SECTION 1: OVERALL VERDICT**
"APPROVE" or "REJECT (for now)" with a 2-3 sentence explanation of why.

**SECTION 2: SCORECARD**
Table with all 6 areas, score out of 10, and one-line justification per score.

**SECTION 3: INSTANT REJECTION RISKS**
List anything that would cause immediate rejection by the Sage affiliate team. Be specific.

**SECTION 4: CRITICAL FIXES BEFORE APPLYING (must-do)**
Numbered list of 10-15 specific, actionable changes. For each:
- What exactly to do
- Why it matters for Sage approval
- Priority level (do this week / do this month)

Include:
- Exact article titles to publish
- Exact wording to add to pages (Disclosure, About, etc.)
- Specific layout/navigation fixes
- Content gaps to fill
- Technical fixes needed

**SECTION 5: CONTENT GAP ANALYSIS**
Table showing:
| Topic | Current Coverage | What Sage Wants to See | Priority |
Show every Sage product and topic area, whether the site covers it, and what's missing.

**SECTION 6: PAGE-BY-PAGE FIXES**
Go through each key page type and list specific improvements:
- Homepage
- About page
- Affiliate Disclosure page
- Article template (author bio, dates, schema)
- Category pages
- Footer

**SECTION 7: POST-APPROVAL ROADMAP (First 6 Months)**
Month-by-month plan for what content to publish, what optimisations to make, and how to move from "Sage Affiliate Partner" to "Premium Affiliate Partner" (50-150 qualified actions/month). Include:
- Month 1-2: Foundation content
- Month 3-4: Scaling content
- Month 5-6: Performance optimisation
- KPIs to track
- How to demonstrate value to the Sage affiliate manager

**SECTION 8: COMPETITOR COMPARISON**
Briefly note what the top 3 Sage affiliate sites do better than ledgerthebusinesses.com and what specific elements to learn from them. (Sites like startups.co.uk, expertmarket.com, businessfinancing.co.uk cover Sage content well.)

---

### ADDITIONAL CONTEXT FOR ACCURACY

**Sage UK Affiliate Programme Details (from sage.com/en-gb/support/affiliate-programme/):**
- Managed through Impact.com
- Three tiers: Sage Affiliate Partner → Premium Affiliate Partner (50-150 qualified actions/mo) → Strategic Affiliate Partner (150+ qualified actions/mo, invitation-only)
- Products: Sage Business Cloud Accounting (SBCA) and Sage Intacct generate commissions
- Competitive base rate commissions, higher tiers unlock bonuses
- Affiliates get access to: Affiliate Resource Hub, tracking dashboard, promotional assets (banners, copy templates), programme updates
- Premium tier adds: Dedicated affiliate manager, advanced performance insights, quarterly business reviews, special promotions
- Strategic tier adds: Custom partnership opportunities, co-marketing, custom landing pages and integrations
- Target affiliates: Comparison sites, media publishers, performance marketers, content creators, B2B SaaS businesses
- Contact: affiliates@sage.com

**Sage UK Product Pricing (April 2026):**
- Sage Sole Trader: Free + Paid plan
- Sage Accounting Start: £15/mo (+VAT) — 1 user
- Sage Accounting Standard: £30/mo (+VAT) — 3 users, CIS, payroll, advanced reports
- Sage Accounting Plus: £59/mo (+VAT) — Unlimited users, multi-currency, inventory
- Sage Payroll: Essentials £10/mo, Standard £20/mo, Premium £30/mo (5 employees included)
- Sage HR: From £4.40/employee/month
- Sage Intacct: Essentials from £6,500/year, Pro from £12,000/year
- Sage for Accountants: Standard from £95/mo, Premium from £245/mo
- Current promo: 90% off first 3-6 months on Sage Accounting
- Key differentiator: Payroll bundled free with Accounting plans (competitors charge per employee)

**Key Sage Features to Reference:**
- Sage Copilot AI (free on all plans)
- MTD AI Agent (UK's first agentic compliance tool)
- CIS returns on Standard+ (construction industry)
- Bundled payroll with no per-employee charges
- RTI filing, P60, P45, P11D, pension auto-enrolment
- Bank feed automation with major UK banks
- AI receipt capture and categorisation
- 40+ years UK market presence
- UK phone support on all plans

**Making Tax Digital Context:**
- MTD for Income Tax goes live April 2026 for sole traders/landlords earning £50,000+
- April 2027 for £30,000+ income
- Quarterly digital submissions required
- Sage is fully HMRC-approved for MTD VAT and ITSA
- Nearly 1 million UK individuals affected

Be as detailed and specific as possible. I want to walk away from this audit knowing exactly what to build, fix, write, and change — with no guesswork.

## PROMPT END
