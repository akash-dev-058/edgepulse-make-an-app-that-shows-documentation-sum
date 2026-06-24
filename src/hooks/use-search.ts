import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchSearch } from '@/lib/api-client';
import { SearchResponse } from '@/types';

/**
 * Hook for searching documentation with React Query.
 */
export const useSearch = (query: string, options?: UseQueryOptions<SearchResponse, Error>) => {
  return useQuery(['search', query], () => fetchSearch(query), {
    enabled: !!query && query.length > 0,
    staleTime: 1000 * 60 * 5,
    ...options
  });
};
