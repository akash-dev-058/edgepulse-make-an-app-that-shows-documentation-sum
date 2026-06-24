import { SummarySection } from '@/types';
import { motion } from 'framer-motion';

interface Props {
  sections: SummarySection[];
}

/**
 * Summary card component.
 */
export default function SummaryCard({ sections }: Props) {
  return (
    <section className="bg-secondary text-white rounded-lg p-6 mb-8">
      <h2 className="text-xl font-heading mb-4">Key Takeaways</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <motion.div
            key={section.id}
            className="bg-primary bg-opacity-10 p-4 rounded"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.15 }}
          >
            <h3 className="font-semibold mb-2">{section.title}</h3>
            <p className="text-sm leading-relaxed">{section.content}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
