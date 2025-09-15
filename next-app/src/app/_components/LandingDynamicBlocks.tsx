"use client";
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamische Imports nur auf Client Seite (ssr:false nur hier erlaubt)
const TestimonialsSection = dynamic(
  () => import('@/components/marketing/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })),
  {
    ssr: false,
    loading: () => (
      <div className="zo-container py-24 text-sm text-neutral-500 animate-pulse" aria-label="Erfahrungsberichte werden geladen" role="status">
        Lade Erfahrungsberichte…
      </div>
    )
  }
);

const LeadMiniForm = dynamic(
  () => import('@/components/forms/LeadMiniForm').then(m => ({ default: m.LeadMiniForm })),
  {
    ssr: false,
    loading: () => (
      <div className="text-neutral-500 text-sm animate-pulse" aria-label="Formular wird geladen" role="status">
        Formular wird geladen…
      </div>
    )
  }
);

export function LandingDynamicBlocks(){
  return (
    <>
      <TestimonialsSection />
      {/* Formular kann optional weiter unten separat platziert werden */}
      <div className="zo-container mt-16">
        <LeadMiniForm />
      </div>
    </>
  );
}

export { LeadMiniForm, TestimonialsSection };