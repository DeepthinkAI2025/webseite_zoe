"use client";
import React from 'react';
import { Button } from '@/components/ui/Button';

// Einfache Persistenz via localStorage
const STORAGE_KEY = 'zoe_sticky_cta_dismissed_v1';

export function StickyCtaBar() {
  const [visible, setVisible] = React.useState(false);
  const [reducedData, setReducedData] = React.useState(false);
  React.useEffect(() => {
    try {
      const dismissed = typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY);
      if (!dismissed) setVisible(true);
      // Data Saver Respect (Client Seitig)
      const media = (window as any).matchMedia && window.matchMedia('(prefers-reduced-data: reduce)');
      if (media && media.matches) setReducedData(true);
    } catch {}
  }, []);

  function dismiss() {
    try { window.localStorage.setItem(STORAGE_KEY, '1'); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div role="complementary" aria-label="Schnellkontakt" className="fixed bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-40 w-[min(100%,960px)] px-2 sm:px-3">
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-neutral-900/75 backdrop-blur-xl supports-[backdrop-filter]:bg-white/65 dark:supports-[backdrop-filter]:bg-neutral-900/55 px-4 sm:px-5 py-3 sm:py-4 shadow-lg overflow-hidden" role="region" aria-labelledby="sticky-cta-heading">
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl" style={{background:'linear-gradient(120deg,rgba(255,195,38,0.18),rgba(16,185,129,0.18))', mixBlendMode:'multiply', opacity:0.28}} />
        <button onClick={dismiss} aria-label="Banner schließen" className="absolute top-2 right-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">✕</button>
        <div className="flex-1 min-w-0">
          <h2 id="sticky-cta-heading" className="sr-only">Schnellkontakt Analyse CTA</h2>
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 leading-snug" aria-describedby="sticky-cta-sub">
            {reducedData ? 'Kostenlose Ertragsanalyse anfragen.' : 'In 48h: Erste Ertrags- & Amortisationsabschätzung. '}<span className="text-emerald-600 dark:text-emerald-400 font-semibold">Jetzt Analyse sichern.</span>
          </p>
          <p id="sticky-cta-sub" className="mt-1 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Kostenlos · Unverbindlich · Fundiert</p>
        </div>
        <div className="flex gap-3 sm:items-center">
          <Button asChild size="sm" variant="primary">
            <a href="/contact" aria-label="Kostenlose Analyse starten – Kontaktformular">Analyse starten</a>
          </Button>
          <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
            <a href="#prozess">Ablauf</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
