import React from 'react';

export function Input({ className = '', invalid, ...props }) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={`w-full h-10 px-3 border rounded-md bg-white text-neutral-900 placeholder-neutral-400 transition-shadow duration-150 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed ${invalid ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-400'} ${className}`}
      {...props}
    />
  );
}
