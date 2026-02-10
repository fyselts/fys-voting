import React from 'react';

export function PersonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <circle cx="10" cy="7" r="4" />
      <path d="M2 18c0-3.313 3.134-6 7-6s7 2.687 7 6" />
    </svg>
  );
}

export function AtIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} width={20} height={20} {...props}>
      <circle cx="10" cy="10" r="7" />
      <path d="M13.5 13V10a3.5 3.5 0 10-2 3.163" />
    </svg>
  );
}

export function KeypadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} width={20} height={20} {...props}>
      <circle cx="5" cy="5" r="2" />
      <circle cx="10" cy="5" r="2" />
      <circle cx="15" cy="5" r="2" />
      <circle cx="5" cy="10" r="2" />
      <circle cx="10" cy="10" r="2" />
      <circle cx="15" cy="10" r="2" />
      <circle cx="5" cy="15" r="2" />
      <circle cx="10" cy="15" r="2" />
      <circle cx="15" cy="15" r="2" />
    </svg>
  );
}

export function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} width={20} height={20} {...props}>
      <path d="M5 10h10M13 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
