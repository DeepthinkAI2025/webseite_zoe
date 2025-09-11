import React from 'react';

export function Textarea({ className = '', invalid, ...props }) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={`w-full px-3 py-2 border rounded-md bg-white text-neutral-900 placeholder-neutral-400 transition-shadow duration-150 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed resize-vertical ${invalid ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-400'} ${className}`}
      {...props}
    />
  );
}
