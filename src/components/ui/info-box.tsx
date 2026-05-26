import React from 'react';
import { ExclamationIcon } from '@/components/ui/icons';

interface InfoBoxProps {
  children: React.ReactNode;
  className?: string;
}

export function InfoBox({ children, className = '' }: InfoBoxProps) {
  return (
    <div
      className={`flex w-full items-start gap-3 rounded border border-[var(--border)] bg-[var(--background)] p-4 text-[var(--on-container)] ${className}`}
    >
      <ExclamationIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
      <div className="text-sm whitespace-pre-line">{children}</div>
    </div>
  );
}
