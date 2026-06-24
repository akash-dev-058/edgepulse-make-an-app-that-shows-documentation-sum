import { GetStaticProps, NextPage } from 'next';
import { RepoInfo, SummarySection } from '@/types';
import { fetchRepoInfo, fetchSummarySections } from '@/lib/api-client';
import RepoInfoCard from '@/components/docs/repo-info-card';
import SummaryCard from '@/components/docs/summary-card';
import SectionAccordion from '@/components/docs/section-accordion';
import LoadingSkeleton from '@/components/ui/loading-skeleton';
import ErrorBoundary from '@/components/ui/error-boundary';

interface HomeProps {
  repoInfo: RepoInfo | null;
  summarySections: SummarySection[] | null;
}

/**
 * Home page showing repository metadata, summary cards and an accordion of sections.
 */
const HomePage: NextPage<HomeProps> = ({ repoInfo, summarySections }) => {
  return (
    <ErrorBoundary>
      <div className="max-w-5xl mx-auto space-y-8">
        {repoInfo ? (
          <RepoInfoCard info={repoInfo} />
        ) : (
          <LoadingSkeleton className="h-32 w-full" />
        )}
        {summarySections ? (
          <SummaryCard sections={summarySections} />
        ) : (
          <LoadingSkeleton className="h-48 w-full" />
        )}
        {summarySections && summarySections.length > 0 ? (
          <SectionAccordion sections={summarySections} />
        ) : (
          <p className="text-center text-gray-600">No documentation sections available.</p>
        )}
      </div>
    </ErrorBoundary>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [repoInfo, summarySections] = await Promise.all([
      fetchRepoInfo(),
      fetchSummarySections()
    ]);
    return { props: { repoInfo, summarySections }, revalidate: 60 * 15 };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return { props: { repoInfo: null, summarySections: null }, revalidate: 60 };
  }
};

export default HomePage;
