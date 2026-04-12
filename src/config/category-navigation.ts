/**
 * Primary category navigation — single source of truth for header, mobile menu,
 * and footer "Categories". Must match Supabase `categories.slug` / display names.
 */
export const CATEGORY_NAV_ITEMS = [
  { label: 'Accounting & Bookkeeping', slug: 'accounting-bookkeeping' },
  { label: 'Invoicing', slug: 'invoicing' },
  { label: 'Payroll', slug: 'payroll' },
  { label: 'HR', slug: 'hr' },
  { label: 'Reporting & Business Insights', slug: 'reporting-business-insights' },
  { label: 'VAT & Tax Compliance', slug: 'vat-tax-compliance' },
  { label: 'Comparisons', slug: 'comparisons' },
  { label: 'Small Business', slug: 'small-business' },
] as const;

export type CategoryNavSlug = (typeof CATEGORY_NAV_ITEMS)[number]['slug'];

export type NavLink = { label: string; href: string };

export function categoryHref(slug: string): string {
  return `/category/${slug}`;
}

/** Same labels and URLs as the header category bar — use everywhere categories are listed. */
export function getCategoryNavLinks(): NavLink[] {
  return CATEGORY_NAV_ITEMS.map((item) => ({
    label: item.label,
    href: categoryHref(item.slug),
  }));
}
