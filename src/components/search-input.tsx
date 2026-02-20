'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconSearch } from '@/components/icons';

interface SearchInputProps {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ defaultValue = '', placeholder = 'Search articles...', className = '' }: SearchInputProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <IconSearch
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-light pointer-events-none"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 bg-card border border-ink/10 rounded-[12px] text-sm text-ink placeholder:text-gray-light focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
      />
    </form>
  );
}
