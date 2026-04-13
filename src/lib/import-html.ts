/**
 * Client-side HTML article extraction for import (runs in browser with DOMParser).
 * Precedence: title — &lt;title&gt;, first &lt;h1&gt;, then filename stem.
 * Body — &lt;article&gt;, &lt;main&gt;, else &lt;body&gt; inner HTML.
 */
export function parseHtmlToArticle(html: string, filename?: string): { title: string; content_html: string } {
  if (typeof document === 'undefined') {
    return {
      title: filename?.replace(/\.(html|htm)$/i, '').replace(/[-_]/g, ' ') || 'Imported article',
      content_html: html,
    };
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const titleFromMeta = doc.querySelector('title')?.textContent?.trim();
  const titleFromHeading = doc.querySelector('h1')?.textContent?.trim();
  const fromFile = filename
    ? filename
        .replace(/\.(html|htm)$/i, '')
        .replace(/[-_]+/g, ' ')
        .trim()
    : '';

  const title = titleFromMeta || titleFromHeading || fromFile || 'Imported article';

  const article = doc.querySelector('article');
  const main = doc.querySelector('main');
  const body = doc.body;

  let content_html = '';
  if (article?.innerHTML?.trim()) content_html = article.innerHTML;
  else if (main?.innerHTML?.trim()) content_html = main.innerHTML;
  else if (body?.innerHTML?.trim()) content_html = body.innerHTML;
  else content_html = html;

  if (content_html) {
    const wrapper = doc.createElement('div');
    wrapper.innerHTML = content_html;

    // Strip layout/script noise so payloads stay small for server actions.
    wrapper
      .querySelectorAll(
        'script,style,svg,noscript,template,iframe,canvas,header,footer,nav,aside,form,button,input,select,textarea,meta,link'
      )
      .forEach((el) => el.remove());

    content_html = wrapper.innerHTML
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  return { title, content_html };
}
