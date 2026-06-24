import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Sidebar navigation component.
 */
export default function Sidebar() {
  const pathname = usePathname();
  const links = [
    { href: '/', label: 'Home' },
    { href: '/search', label: 'Search' },
    { href: '/docs/getting-started', label: 'Getting Started' },
    { href: '/docs/core-concepts', label: 'Core Concepts' },
    { href: '/docs/api-reference', label: 'API Reference' }
  ];

  return (
    <aside className="hidden md:block w-64 bg-gray-50 border-r overflow-y-auto">
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded hover:bg-primary hover:text-white transition-colors ${pathname === link.href ? 'bg-primary text-white' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
