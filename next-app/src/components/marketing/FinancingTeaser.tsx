import React from 'react';
import { Button } from '@/components/ui/Button';

/**
 * FinancingTeaser (Marketing)
 * Kurzer Block zur optionalen Finanzierung / Förderung.
 * Stilistisch an neue Design Tokens angepasst (neutral surfaces, subtle border, spacing system).
 */
export function FinancingTeaser() {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">Flexible Finanzierung</h3>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 max-w-md">0% Anzahlung möglich · Fördermittel Screening · Laufzeiten bis 20 Jahre – sichern Sie sich niedrige Monatsraten & Liquidität.</p>
      </div>
      <Button asChild size="lg" variant="outline">
        <a href="/finanzierung" aria-label="Finanzierungsoptionen prüfen">Optionen prüfen</a>
      </Button>
    </div>
  );
}
