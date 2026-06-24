import { ReactNode } from 'react';
import clsx from 'clsx';

interface Props {
  className?: string;
  children?: ReactNode;
}

/**
 * Loading skeleton component.
 */
export default function LoadingSkeleton({ className = '', children }: Props) {
  return (
    <div className={clsx('animate-pulse bg-gray-200 rounded', className)}>
      {children}
    </div>
  );
}
