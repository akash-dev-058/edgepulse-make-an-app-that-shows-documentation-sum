import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { fetchDocumentBySlug, fetchSummaryBySlug } from '@/lib/api-client';
import { Document, Summary } from '@/types';
import MarkdownRenderer from '@/components/docs/markdown-renderer';
import SummaryCard from '@/components/docs/summary-card';
import LoadingSkeleton from '@/components/ui/loading-skeleton';
import ErrorBoundary from '@/components/ui/error-boundary';
import { motion } from 'framer-motion';

interface DocPageProps {
  document: Document | null;
  summary: Summary | null;
}

const DocPage: NextPage<DocPageProps> = ({ document, summary }) => {
  const router = useRouter();
  if (router.isFallback) {
    return <LoadingSkeleton className="h-96 w-full" />;
  }

  return (
    <ErrorBoundary>
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="prose prose-sm md:prose-lg max-w-none"
      >
        {summary && <SummaryCard sections={[summary]} />}
        {document ? (
          <MarkdownRenderer content={document.content} />
        ) : (
          <p className="text-center text-gray-600">Document not found.</p>
        )}
      </motion.article>
    </ErrorBoundary>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // In a real app, you would fetch all slugs from the backend.
  // For ISR, we return an empty array and enable fallback.
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  try {
    const [document, summary] = await Promise.all([
      fetchDocumentBySlug(slug),
      fetchSummaryBySlug(slug)
    ]);
    return { props: { document, summary }, revalidate: 60 * 10 };
  } catch (error) {
    console.error('Error fetching doc page:', error);
    return { notFound: true };
  }
};

export default DocPage;
