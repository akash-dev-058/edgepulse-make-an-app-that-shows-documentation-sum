import { SummarySection } from '@/types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MarkdownRenderer from '@/components/docs/markdown-renderer';
import Button from '@/components/ui/button';

interface Props {
  sections: SummarySection[];
}

/**
 * Accordion for documentation sections.
 */
export default function SectionAccordion({ sections }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.id} className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggle(section.id)}
            className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary flex justify-between items-center"
            aria-expanded={openId === section.id}
            aria-controls={`panel-${section.id}`}
          >
            <span className="font-medium">{section.title}</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${openId === section.id ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <AnimatePresence initial={false}>
            {openId === section.id && (
              <motion.div
                id={`panel-${section.id}`}
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { height: 'auto', opacity: 1 },
                  collapsed: { height: 0, opacity: 0 }
                }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="p-4 bg-white"
              >
                <MarkdownRenderer content={section.excerpt} />
                <Button variant="secondary" className="mt-4" onClick={() => window.location.assign(`/docs/${section.slug}`)}>
                  Read more
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
