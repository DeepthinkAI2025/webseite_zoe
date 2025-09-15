import React from 'react';

// Placeholder Logos (können durch <Image /> mit realen Assets ersetzt werden)
const LOGOS = ['TÜV', 'SMA', 'Fronius', 'Q-Cells', 'BYD', 'SolarEdge'];

export function TrustAuthoritySection() {
  return (
    <section className="py-16 bg-neutral-50 dark:bg-neutral-900/30">
      <div className="zo-container text-center">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Vertrauen & technische Partnerschaften</h2>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">Zertifizierte Installations- und Technologiepartner – sichert Qualität, Lieferfähigkeit & Kompatibilität künftiger Komponenten.</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {LOGOS.map(l => (
            <div key={l} className="text-neutral-400 dark:text-neutral-600 text-2xl font-semibold tracking-tight grayscale hover:grayscale-0 transition-all select-none">{l}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
