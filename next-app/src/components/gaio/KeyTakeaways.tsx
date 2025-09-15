import React from 'react';

interface KeyTakeawaysProps {
  items: string[];
  title?: string;
  className?: string;
}

export function KeyTakeaways({ items, title = 'Key Takeaways', className }: KeyTakeawaysProps) {
  if (!items?.length) return null;
  return (
    <section aria-label={title} className={className} data-gaio-block="key-takeaways">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
        {items.slice(0,5).map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </section>
  );
}
