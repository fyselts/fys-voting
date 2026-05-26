import React from 'react';

export function Form({
  children,
  className = '',
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form
      className={`flex w-full max-w-md flex-col gap-4 ${className}`}
      {...props}
    >
      {children}
    </form>
  );
}
