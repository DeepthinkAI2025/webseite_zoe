import React from 'react';

export function Card({ className = '', children }) {
  return <div className={`bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border border-[hsl(var(--border))] rounded-xl ${className}`}>{children}</div>;
}

export function CardHeader({ className = '', children }) {
  return <div className={`px-6 pt-6 ${className}`}>{children}</div>;
}

export function CardTitle({ className = '', children }) {
  return <h3 className={`text-[1.125rem] leading-6 font-semibold ${className}`}>{children}</h3>;
}

export function CardContent({ className = '', children }) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}
