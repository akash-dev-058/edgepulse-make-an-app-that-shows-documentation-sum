import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

/**
 * Styled input component.
 */
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <input
      ref={ref}
      className={clsx('border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary transition-colors', className)}
      {...rest}
    />
  );
});

Input.displayName = 'Input';
export default Input;
