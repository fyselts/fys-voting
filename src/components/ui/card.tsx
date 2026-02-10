import React from 'react';

export function Card({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {children}
    </div>
  );
}
