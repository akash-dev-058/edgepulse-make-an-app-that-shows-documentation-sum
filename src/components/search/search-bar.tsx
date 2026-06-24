import React, { ChangeEvent, useEffect, useRef, useCallback, useState } from 'react';
import { LucideSearch } from 'lucide-react';

/**
 * Props for the SearchBar component.
 */
interface Props {
  /** Current search value controlled by the parent */
  value: string;
  /** Callback invoked after the user stops typing for the debounce interval */
  onChange: (value: string) => void;
}

/**
 * Custom hook that returns a debounced version of a callback.
 * The returned function maintains a stable reference across renders.
 *
 * @param callback The function to debounce.
 * @param delay    Debounce interval in milliseconds.
 */
function useDebouncedCallback(callback: (val: string) => void, delay: number) {
  const timeoutRef = useRef<number | null>(null);

  // `useCallback` ensures the debounced function identity does not change.
  const debounced = useCallback(
    (val: string) => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        callback(val);
      }, delay);
    },
    [callback, delay]
  );

  // Cleanup any pending timeout when the component unmounts.
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debounced;
}

/**
 * Search bar component with built‑in debouncing.
 * Mirrors the design used in the Navbar but is a reusable, isolated component.
 */
export default function SearchBar({ value, onChange }: Props): JSX.Element {
  const [internal, setInternal] = useState<string>(value);
  const debouncedOnChange = useDebouncedCallback(onChange, 300);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInternal(newVal);
    debouncedOnChange(newVal);
  };

  // Keep internal state in sync when the parent updates the `value` prop.
  useEffect(() => {
    setInternal(value);
  }, [value]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <input
        type="search"
        value={internal}
        onChange={handleChange}
        placeholder="Search documentation…"
        className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Search documentation"
      />
      <LucideSearch
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        size={20}
        aria-hidden="true"
      />
    </div>
  );
}
