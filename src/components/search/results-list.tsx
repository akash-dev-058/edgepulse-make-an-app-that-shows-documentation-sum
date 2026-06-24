import { SearchResult } from '@/types';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Props {
  results: SearchResult[];
}

/**
 * Render search results.
 */
export default function ResultsList({ results }: Props) {
  return (
    <ul className="space-y-4">
      {results.map((result) => (
        <motion.li
          key={result.id}
          whileHover={{ scale: 1.02 }}
          className="border rounded p-4 hover:bg-gray-50 transition-colors"
        >
          <Link href={result.url} className="text-primary font-medium">
            {result.title}
          </Link>
          <p className="mt-2 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: result.snippet }} />
        </motion.li>
      ))}
    </ul>
  );
}
