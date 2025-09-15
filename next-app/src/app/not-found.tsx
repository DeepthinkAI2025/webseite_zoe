import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold">Seite nicht gefunden</h1>
      <p className="text-sm opacity-80 max-w-md text-center">Die angeforderte Ressource existiert nicht oder wurde im Rahmen der Migration verschoben.</p>
      <Link href="/" className="underline text-blue-600">Zur Startseite</Link>
    </main>
  );
}