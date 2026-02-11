import React from 'react';
import { ExclamationIcon } from '@/components/ui/icons';

interface InfoBoxProps {
  children: React.ReactNode;
  className?: string;
}

export function InfoBox({ children, className = '' }: InfoBoxProps) {
  return (
    <div className={`flex items-start gap-3 text-[var(--on-container)] bg-[var(--background)] p-4 rounded w-full border border-[var(--border)] ${className}`}>
      <ExclamationIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="text-sm whitespace-pre-line">
        {children}
      </div>
    </div>
  );
}
