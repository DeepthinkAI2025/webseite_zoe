"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Einfache Sprachumschaltung: Wechselt Präfix /en für englische Version.
// Annahme: Deutsche Default-Route ohne Präfix, englische Seiten unter /en/... vorhanden.
// Verbesserbar: Persistenz via Cookie, Accept-Language Heuristik, Dropdown-UI.

function computeAlternate(path: string, locale: string){
  const segments = path.split('/').filter(Boolean);
  // Wenn erstes Segment eine bekannte Locale ist entfernen
  if (segments[0] === 'en' || segments[0] === 'de') segments.shift();
  const core = segments.join('/');
  if(locale === 'de') return '/' + core;
  return '/' + locale + (core ? '/' + core : '');
}

export const LanguageSwitcher: React.FC = () => {
  const pathname = usePathname() || '/';
  const isEnglish = pathname.startsWith('/en');
  const target = isEnglish ? computeAlternate(pathname, 'de') : computeAlternate(pathname, 'en');
  return (
    <Link href={target} prefetch className="text-xs font-medium border px-2 py-1 rounded hover:bg-neutral-100 text-neutral-600" aria-label={isEnglish ? 'Zu Deutsch wechseln' : 'Switch to English'}>
      {isEnglish ? 'DE' : 'EN'}
    </Link>
  );
};

export default LanguageSwitcher;
