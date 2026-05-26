import React from 'react';

export function InputWithIcon({
  icon,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }) {
  return (
    <div className="relative flex items-center text-[var(--on-container)]">
      <span className="pointer-events-none absolute left-3 flex items-center">
        {icon}
      </span>
      <input
        className={`w-full rounded border border-[var(--border)] bg-[var(--background)] py-2 pr-3 pl-10 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none ${className}`}
        {...props}
      />
    </div>
  );
}
