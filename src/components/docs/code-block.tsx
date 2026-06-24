import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-js';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-tomorrow.css';

interface Props {
  language: string;
  value: string;
}

/**
 * Prism code block.
 */
export default function CodeBlock({ language, value }: Props) {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (ref.current) {
      Prism.highlightElement(ref.current);
    }
  }, [value, language]);

  return (
    <pre ref={ref} className={`language-${language} rounded p-4 bg-gray-900 text-white overflow-x-auto`}>
      <code>{value}</code>
    </pre>
  );
}
