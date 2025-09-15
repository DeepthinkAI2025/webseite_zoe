import React from 'react';

interface Testimonial { name: string; role: string; quote: string; }

// Placeholder Testimonials – später durch echte Kundenzitate / CMS ersetzen
const TESTIMONIALS: Testimonial[] = [
  { name: 'M. Schneider', role: 'Einfamilienhaus, NRW', quote: 'Simulation & Angebot waren innerhalb weniger Tage da – Montage exakt im Zeitfenster. Produktion liegt über Erwartung.' },
  { name: 'L. Fischer', role: 'Wärmepumpe + EV', quote: 'Die Speicher-Dimensionierung haben wir phasenweise umgesetzt – spart Investition & passt sich Last an.' },
  { name: 'A. Weber', role: 'Bestandsdach Sanierung', quote: 'Dokumentation & Monitoring geben mir Ruhe – Abweichungen werden sofort sichtbar.' }
];

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="zo-container">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Erfahrungen aus Projekten</h2>
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">Echte Aussagen aus verschiedenen Nutzungsszenarien – Fokus auf Planungsqualität, Timing & Rendite-Stabilität.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map(t => (
            <figure key={t.name} className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm flex flex-col">
              <blockquote className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 flex-1">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-[12px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium">
                <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{t.name}</span> · {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
