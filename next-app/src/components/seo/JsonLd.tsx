import React from 'react';
import { headers } from 'next/headers';

interface JsonLdProps<T=any> {
  data: T;
  id?: string;
  type?: string; // override type attr if needed
}

// Server Component: rendert ein Inline JSON-LD Script mit CSP Nonce
export function JsonLd<T>({ data, id, type = 'application/ld+json' }: JsonLdProps<T>) {
  const nonce = (headers() as any).get('x-nonce') || undefined;
  return (
    <script
      id={id}
      type={type}
      nonce={nonce}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
