'use client';

import { useEffect, useRef } from 'react';

interface ArticleBodyProps {
  html: string;
  className?: string;
}

export function ArticleBody({ html, className = '' }: ArticleBodyProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const anchors = ref.current.querySelectorAll('a');
    anchors.forEach((a) => {
      const href = a.getAttribute('href') || '';
      const isExternal = /^https?:\/\//i.test(href) && !href.includes(window.location.hostname);
      const isMailto = href.startsWith('mailto:');
      if (!isMailto) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
