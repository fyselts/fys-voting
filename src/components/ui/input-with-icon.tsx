import React from 'react';

export function InputWithIcon({
  icon,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }) {
  return (
    <div className="relative flex items-center text-[var(--on-container)]">
      <span className="absolute left-3 pointer-events-none flex items-center">{icon}</span>
      <input
        className={`pl-10 pr-3 py-2 border border-[var(--border)] rounded w-full bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${className}`}
        {...props}
      />
    </div>
  );
}
