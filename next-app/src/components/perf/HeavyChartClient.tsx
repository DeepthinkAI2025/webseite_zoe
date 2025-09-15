"use client";
import dynamic from 'next/dynamic';
import React from 'react';

// Client Side Wrapper für HeavyChart mit Lazy Loading
const HeavyChartInner = dynamic(() => import('./HeavyChart'), {
  ssr: false,
  loading: () => <div className="animate-pulse text-sm text-neutral-500">Lade Analyse Modul…</div>
});

export function HeavyChartClient(){
  return <HeavyChartInner />;
}
