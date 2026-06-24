import { RepoInfo, SummarySection, Document, Summary, SearchResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/*$/, '') || '';

/**
 * Helper to handle HTTP responses.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody.detail || response.statusText);
    // @ts-ignore
    error.status = response.status;
    throw error;
  }
  return response.json();
}

/** Fetch repository metadata */
export async function fetchRepoInfo(): Promise<RepoInfo> {
  const res = await fetch(`${API_BASE}/repo/info`);
  return handleResponse<RepoInfo>(res);
}

/** Fetch summary sections for the home page */
export async function fetchSummarySections(): Promise<SummarySection[]> {
  const res = await fetch(`${API_BASE}/summaries/home`);
  return handleResponse<SummarySection[]>(res);
}

/** Fetch a document by slug */
export async function fetchDocumentBySlug(slug: string): Promise<Document> {
  const res = await fetch(`${API_BASE}/documents/${encodeURIComponent(slug)}`);
  return handleResponse<Document>(res);
}

/** Fetch a summary by slug */
export async function fetchSummaryBySlug(slug: string): Promise<Summary> {
  const res = await fetch(`${API_BASE}/summaries/${encodeURIComponent(slug)}`);
  return handleResponse<Summary>(res);
}

/** Search endpoint */
export async function fetchSearch(query: string): Promise<SearchResponse> {
  const res = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}`);
  return handleResponse<SearchResponse>(res);
}

/** Trigger backend sync */
export async function triggerSync(): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  await handleResponse<void>(res);
}
