import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

/**
 * Reusable button component with variants and loading state.
 */
export default function Button({ children, loading = false, variant = 'primary', className, ...rest }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150';
  const variants = {
    primary: 'bg-primary text-secondary hover:bg-primary/80 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary/80 focus:ring-secondary',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  }[variant];

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      disabled={loading || rest.disabled}
      className={clsx(base, variants, className, { 'opacity-50 cursor-not-allowed': loading })}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5 mr-2 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      )}
      {children}
    </motion.button>
  );
}
