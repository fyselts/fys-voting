import React from 'react';

export function Card({
  children,
  className = '',
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-lg bg-white p-6 shadow ${className}`}>
      {children}
    </div>
  );
}
