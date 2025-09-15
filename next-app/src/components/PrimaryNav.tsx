"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';

// Vereinfachte Navigation – basiert auf Legacy `PrimaryNav`, aber ohne react-router und ohne dynamische Idle-Aufwertung.
// Später kann MegaMenu & Standort-Dropdown re-integriert werden.

const mainItems = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Preise' },
  { href: '/technology', label: 'Technologie' },
  { href: '/projects', label: 'Projekte' },
  { href: '/contact', label: 'Kontakt' },
  { href: '/blog', label: 'Blog' }
];

export function PrimaryNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primäre Navigation" className="flex items-center gap-6 text-sm">
      {mainItems.map(it => {
        const active = pathname === it.href || pathname === '/en' + it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? 'page' : undefined}
            data-active={active ? 'true' : 'false'}
            className="hover:text-blue-600 text-neutral-700 font-medium data-[active=true]:text-blue-700 data-[active=true]:underline underline-offset-4"
          >
            {it.label}
          </Link>
        );
      })}
      <div className="pl-2 ml-2 border-l border-neutral-200"><LanguageSwitcher /></div>
    </nav>
  );
}

export default PrimaryNav;
