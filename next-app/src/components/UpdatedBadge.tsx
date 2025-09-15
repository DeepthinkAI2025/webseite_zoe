import React from 'react';

interface UpdatedBadgeProps {
  date: string | Date; // ISO oder Date
  className?: string;
  prefix?: string;
}

// Formatiert Datum kompakt (Monat Jahr) + machine-readable datetime
function formatDisplay(d: Date) {
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function UpdatedBadge({ date, className = '', prefix = 'Aktualisiert' }: UpdatedBadgeProps) {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return null;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-medium text-emerald-800 tracking-wide ${className}`} aria-label={`${prefix}: ${formatDisplay(d)}`}>
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v6h-6" /><path d="M12 7v5l3 3" /></svg>
      <time dateTime={d.toISOString()}>{formatDisplay(d)}</time>
    </span>
  );
}

export default UpdatedBadge;