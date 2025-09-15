"use client";
import { ReactNode } from 'react';

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-md border border-amber-400/40 bg-amber-50 px-4 py-3 text-sm dark:bg-amber-900/20 dark:border-amber-500/40">
      {children}
    </div>
  );
}
