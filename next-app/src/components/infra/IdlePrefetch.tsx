"use client";
import React from 'react';

// Minimaler Idle Prefetch: Lädt gezielt Routen wenn Browser Leerlauf signalisiert
// Verwendet native router.prefetch (Next App Router) via dynamic import von next/navigation

const ROUTES = ['/pricing','/projects','/standorte','/contact'];

export function IdlePrefetch(){
  React.useEffect(()=>{
    if(typeof window === 'undefined') return;
    const run = () => {
      import('next/navigation').then(mod => {
        const prefetch = (url: string) => {
          try { (mod as any).prefetch?.(url); } catch { /* noop */ }
        };
        ROUTES.forEach(r => prefetch(r));
      });
    };
    if('requestIdleCallback' in window){
      (window as any).requestIdleCallback(run, { timeout: 2500 });
    } else {
      setTimeout(run, 1500);
    }
  },[]);
  return null;
}
