import React from 'react';

const BASE = 'rounded-xl transition-shadow duration-300';
const VARIANTS = {
  solid: 'bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border border-[hsl(var(--border))]',
  subtle: 'bg-white border border-neutral-200 text-neutral-900',
  glass: 'card-glass',
  accent: 'surface-card layered',
  outline: 'bg-white border border-neutral-200'
};
const ELEVATION = {
  none: 'shadow-none',
  sm: 'shadow-soft-sm',
  md: 'shadow-soft-md',
  lg: 'shadow-soft-lg'
};

export function Card({ className = '', children, variant='solid', elevation='sm', interactive=false }) {
  const v = VARIANTS[variant] || VARIANTS.solid;
  const e = ELEVATION[elevation] || '';
  const interactiveCls = interactive ? 'hover:shadow-soft-lg hover:-translate-y-[2px]' : '';
  return <div className={`${BASE} ${v} ${e} ${interactiveCls} ${className}`.trim()}>{children}</div>;
}

export function CardHeader({ className = '', children }) { return <div className={`px-6 pt-6 ${className}`}>{children}</div>; }

export function CardTitle({ className = '', children }) { return <h3 className={`text-[1.125rem] leading-6 font-semibold ${className}`}>{children}</h3>; }

export function CardContent({ className = '', children }) { return <div className={`px-6 pb-6 ${className}`}>{children}</div>; }
