import React from 'react';

export function Form({ children, className = '', ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form className={`flex flex-col gap-4 w-full max-w-md ${className}`} {...props}>
      {children}
    </form>
  );
}
