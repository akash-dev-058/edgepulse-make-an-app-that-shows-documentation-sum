/**
 * Debounce a function.
 */
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  } as T;
}

/**
 * Simple date formatter.
 */
export function formatDate(date: string | Date, locale = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(d);
}

/**
 * Truncate a string to a maximum length.
 */
export function truncate(text: string, max = 150): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
