import 'server-only';
import { parse } from 'node-html-parser';
import DOMPurify from 'isomorphic-dompurify';

export interface ParsedHtmlArticle {
  title: string;
  excerpt: string;
  content_html: string;
  tags: string[];
  seo_title: string;
  seo_description: string;
  cover_image: string;
}

function cleanText(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function buildExcerptFromPlainText(fullText: string, title: string): string {
  if (!fullText.trim()) return '';
  const withoutTitle = title ? fullText.replace(title, '').trim() : fullText;
  const text = withoutTitle || fullText;
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const summary = sentences.slice(0, 2).join(' ');
  const candidate = summary || sentences[0] || text;
  if (!candidate) return '';
  return candidate.length > 220 ? `${candidate.slice(0, 217).trimEnd()}...` : candidate;
}

/**
 * Parse and sanitize HTML for post import (server-side only).
 */
export function parseHtmlForImport(rawHtml: string): ParsedHtmlArticle {
  const root = parse(rawHtml, { lowerCaseTagName: true });

  const h1 = cleanText(root.querySelector('h1')?.text ?? '');
  const ogTitle = cleanText(root.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '');
  const titleTag = cleanText(root.querySelector('title')?.text ?? '');
  const title = h1 || ogTitle || titleTag;

  const descMeta = root.querySelector('meta[name="description"]')?.getAttribute('content');
  const ogDesc = root.querySelector('meta[property="og:description"]')?.getAttribute('content');

  const contentRoot =
    root.querySelector('article') || root.querySelector('main') || root.querySelector('body') || root;

  let excerpt = cleanText(descMeta ?? ogDesc ?? '');
  if (!excerpt) {
    const firstP = contentRoot.querySelector('p');
    excerpt = cleanText(firstP?.text ?? '');
  }

  const plainForExcerpt = cleanText(contentRoot.text);
  if (!excerpt && plainForExcerpt) {
    excerpt = buildExcerptFromPlainText(plainForExcerpt, title);
  }

  const metaKeywords = root.querySelector('meta[name="keywords"]')?.getAttribute('content');
  const tags = metaKeywords
    ? metaKeywords
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const ogImage = root.querySelector('meta[property="og:image"]')?.getAttribute('content')?.trim() ?? '';
  const innerHtml = contentRoot.innerHTML;
  let sanitized: string;
  try {
    sanitized = DOMPurify.sanitize(innerHtml, { USE_PROFILES: { html: true } });
  } catch (e) {
    console.error('[parseHtmlForImport] DOMPurify.sanitize failed, using raw inner HTML:', e);
    sanitized = innerHtml;
  }

  const seo_title = (ogTitle || title).trim();
  const seo_description = cleanText(descMeta ?? ogDesc ?? excerpt ?? '');

  return {
    title: title.trim(),
    excerpt: excerpt.slice(0, 2000),
    content_html: sanitized,
    tags,
    seo_title: seo_title.slice(0, 500),
    seo_description: seo_description.slice(0, 500),
    cover_image: ogImage,
  };
}

export function titleFromFileName(fileName: string): string {
  const base = fileName.replace(/\.(html|htm)$/i, '').split('/').pop() || fileName;
  const human = base.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  return human || 'Imported article';
}
