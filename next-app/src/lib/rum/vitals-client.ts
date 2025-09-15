"use client";
import { onLCP, onCLS, onINP, onFCP, Metric } from 'web-vitals';

type VitalName = 'LCP' | 'CLS' | 'INP' | 'FCP' | 'TTFB';

interface RumPayload {
  name: VitalName;
  value: number;
  rating?: string;
  id: string;
  navigationType?: string;
  url: string;
  ts: string;
  sampleRate?: number;
}

const SAMPLE_RATE = (()=>{
  const v = Number((window as any).RUM_SAMPLE_RATE || process.env.NEXT_PUBLIC_RUM_SAMPLE_RATE || 1);
  return isNaN(v) ? 1 : Math.min(1, Math.max(0, v));
})();

const sampledOut = Math.random() > SAMPLE_RATE;

function send(metric: Metric){
  if (sampledOut) return; // Skip event
  const body: RumPayload = {
    name: metric.name as VitalName,
    value: metric.value,
    rating: (metric as any).rating,
    id: metric.id,
    navigationType: (metric as any).navigationType,
    url: window.location.href,
    ts: new Date().toISOString(),
    sampleRate: SAMPLE_RATE
  };
  if (navigator.sendBeacon) {
    try {
      const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
      navigator.sendBeacon('/api/rum', blob);
      return;
    } catch {/* fallback */}
  }
  fetch('/api/rum', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
}

let registered = false;
export function registerWebVitals(){
  if (registered) return; registered = true;
  // Verzögert registrieren nach Idle, um Main Thread nicht zu stören
  const register = () => { onLCP(send); onCLS(send); onINP(send); onFCP(send); captureTTFB(); };
  if ('requestIdleCallback' in window) (window as any).requestIdleCallback(register); else setTimeout(register,0);
}

// Optional Auto-Init wenn in globalem Layout importiert
if (typeof window !== 'undefined') {
  // Lazy: erst nach First Interaction oder 3s
  let fired = false;
  const init = () => { if (fired) return; fired = true; registerWebVitals(); };
  ['keydown','pointerdown','mousedown','touchstart','visibilitychange'].forEach(evt=>{
    window.addEventListener(evt, init, { once:true, passive:true });
  });
  setTimeout(init, 3000);
}

// TTFB Messung über PerformanceResourceTiming / Navigation Timing
function captureTTFB(){
  try {
    const navEntries = performance.getEntriesByType('navigation');
    const nav = navEntries && navEntries[0] as PerformanceNavigationTiming | undefined;
    if (!nav) return;
    const ttfb = nav.responseStart - nav.requestStart;
    if (ttfb >= 0) {
      send({
        name: 'TTFB',
        value: ttfb,
        id: 'nav-ttfb',
        entries: [],
        delta: ttfb,
        rating: ttfb < 200 ? 'good' : ttfb < 600 ? 'needs-improvement' : 'poor'
      } as any);
    }
  } catch {/* ignore */}
}
