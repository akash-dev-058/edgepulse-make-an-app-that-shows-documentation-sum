import React, { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LucideSearch } from 'lucide-react';

/**
 * Top navigation bar used across the application.
 *
 * Features:
 *   • Logo and site title linking to the home page.
 *   • Accessible search input that navigates to the search page on submit.
 *   • Admin sync link (in a real app this would be conditionally rendered based on auth).
 *
 * Accessibility considerations:
 *   • All interactive elements have discernible text or `aria-label`s.
 *   • Focus outlines are provided via Tailwind's `focus:ring` utilities.
 *   • The search input is labelled for screen readers.
 */
export default function Navbar(): JSX.Element {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (trimmed) {
      router.push(`/search?query=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <header className="bg-primary text-secondary sticky top-0 z-50 shadow-md">
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo and site title */}
        <Link href="/" className="flex items-center space-x-2" aria-label="Home">
          {/* Simple SVG logo representing the React atom */}
          <svg viewBox="0 0 841.9 595.3" className="w-8 h-8" aria-hidden="true" focusable="false">
            <g fill="currentColor">
              <path d="M666.3 296.5c0 84.5-68.5 153-153 153s-153-68.5-153-153 68.5-153 153-153 153 68.5 153 153z" />
            </g>
          </svg>
          <span className="font-heading text-xl font-bold">ReactDocsPulse</span>
        </Link>

        {/* Search form – expands to fill available space */}
        <form onSubmit={handleSubmit} className="flex-1 mx-4 max-w-lg" aria-label="Search documentation">
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search docs…"
              className="w-full pl-10 pr-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-secondary"
              aria-label="Search documentation"
            />
            <LucideSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
              aria-hidden="true"
            />
          </div>
        </form>

        {/* Admin sync link – in production this would be behind auth */}
        <Link
          href="/admin/sync"
          className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-white"
        >
          Admin Sync
        </Link>
      </nav>
    </header>
  );
}
