import React from 'react';

interface ImpactMetric { label: string; value: string; accent?: string; }

const IMPACTS: ImpactMetric[] = [
  { label: 'CO₂ Einsparung / Jahr', value: '1.2 t', accent: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Ø Autarkie Grad', value: '72–88 %', accent: 'text-blue-600 dark:text-blue-400' },
  { label: 'Ø Amortisation', value: '6–9 Jahre', accent: 'text-amber-600 dark:text-amber-400' }
];

/**
 * ImpactSection – Kennzahlen / Outcomes Snapshot
 * Einsatz: Zwischenlösung oder Social Proof Ergänzung.
 */
export function ImpactSection() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {IMPACTS.map(m => (
        <div key={m.label} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 text-center shadow-sm">
          <div className={`text-2xl font-semibold tracking-tight mb-2 tabular-nums ${m.accent}`}>{m.value}</div>
          <p className="text-[13px] leading-snug text-neutral-600 dark:text-neutral-400 font-medium uppercase tracking-wide">{m.label}</p>
        </div>
      ))}
    </div>
  );
}
