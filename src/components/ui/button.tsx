import React from 'react';

export function Button({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`bg-[var(--color-primary)] text-white p-2 rounded flex items-center justify-center gap-2 font-medium transition-colors hover:bg-[color:rgba(0,8,125,0.85)] disabled:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
