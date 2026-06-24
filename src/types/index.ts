/** Repository metadata */
export interface RepoInfo {
  name: string;
  owner: string;
  ownerAvatarUrl: string;
  stars: number;
  forks: number;
  latestRelease?: string;
}

/** Summary section used on home and in docs */
export interface SummarySection {
  id: string;
  title: string;
  content: string; // full summary content
  excerpt: string; // short markdown excerpt for accordion
  slug: string;
}

/** Full document */
export interface Document {
  id: string;
  slug: string;
  title: string;
  content: string; // raw markdown
}

/** Summary attached to a document */
export interface Summary {
  id: string;
  title: string;
  content: string;
}

/** Search result */
export interface SearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string; // HTML snippet with highlighted terms
}

/** Search API response */
export interface SearchResponse {
  results: SearchResult[];
  total: number;
}
