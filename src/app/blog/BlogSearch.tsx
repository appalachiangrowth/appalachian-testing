"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

interface Props {
  currentSearch: string;
  currentCategory: string;
}

export default function BlogSearch({ currentSearch, currentCategory }: Props) {
  const [query, setQuery] = useState(currentSearch);
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    if (currentCategory) params.set('category', currentCategory);
    router.push(`/blog${params.toString() ? '?' + params.toString() : ''}`);
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full sm:max-w-xs">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555]" />
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search articles..."
        className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0A0A0A] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#555] focus:border-[rgba(182,255,0,0.3)] focus:outline-none focus:ring-1 focus:ring-[rgba(182,255,0,0.15)]"
      />
    </form>
  );
}
