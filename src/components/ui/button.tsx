import React from 'react';

export function Button({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`flex items-center justify-center gap-2 rounded bg-[var(--color-primary)] p-2 font-medium text-white transition-colors hover:bg-[color:rgba(0,8,125,0.85)] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
