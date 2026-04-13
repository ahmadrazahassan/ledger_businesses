import 'server-only';
import { parse } from 'node-html-parser';
import sanitizeHtml from 'sanitize-html';

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
  // Use sanitize-html (no jsdom). isomorphic-dompurify pulls jsdom and breaks on Vercel (ERR_REQUIRE_ESM).
  let sanitized: string;
  try {
    sanitized = sanitizeHtml(innerHtml, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'picture', 'source']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        a: ['href', 'name', 'target', 'rel'],
        img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
        source: ['src', 'srcset', 'type', 'media', 'sizes'],
      },
      allowedSchemes: ['http', 'https', 'mailto', 'tel'],
      allowedSchemesByTag: {
        img: ['http', 'https', 'data'],
      },
    });
  } catch (e) {
    console.error('[parseHtmlForImport] sanitize-html failed, using raw inner HTML:', e);
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
