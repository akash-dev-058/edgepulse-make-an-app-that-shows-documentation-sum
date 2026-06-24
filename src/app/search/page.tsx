import { useState } from 'react';
import SearchBar from '@/components/search/search-bar';
import ResultsList from '@/components/search/results-list';
import { useSearch } from '@/hooks/use-search';
import LoadingSkeleton from '@/components/ui/loading-skeleton';
import ErrorBoundary from '@/components/ui/error-boundary';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const { data, isLoading, isError, refetch } = useSearch(query, { enabled: query.length > 0 });

  const handleRetry = () => {
    refetch();
  };

  return (
    <ErrorBoundary>
      <section className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Search React Docs</h1>
        <SearchBar value={query} onChange={setQuery} />
        {isLoading && <LoadingSkeleton className="h-48 w-full" />}
        {isError && (
          <div className="p-4 bg-red-100 text-red-800 rounded">
            <p>Failed to load results.</p>
            <button className="mt-2 btn-primary" onClick={handleRetry}>Retry</button>
          </div>
        )}
        {data && data.results.length > 0 ? (
          <ResultsList results={data.results} />
        ) : (
          query && !isLoading && (
            <p className="text-center text-gray-600">No results found for "{query}".</p>
          )
        )}
      </section>
    </ErrorBoundary>
  );
};

export default SearchPage;
