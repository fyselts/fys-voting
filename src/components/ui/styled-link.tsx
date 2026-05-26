import React from 'react';
import Link from 'next/link';

export function StyledLink({
  children,
  className = '',
  href,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 text-[var(--on-container)] transition-colors hover:underline ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
