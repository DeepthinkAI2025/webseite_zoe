// web-vitals-client.ts
// Sendet Core Web Vitals (LCP, INP, CLS, FID optional) an /api/rum
// Nutzung: in RootLayout importieren (Client-Komponente) oder dynamisch laden.
import { onCLS, onINP, onLCP, onTTFB } from 'web-vitals';

type MetricHandler = (metric: any)=> void;

function post(metric:any){
  try {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      delta: metric.delta,
      id: metric.id,
      rating: metric.rating,
      url: window.location.pathname,
      ts: Date.now()
    });
    navigator.sendBeacon?.('/api/rum', body) || fetch('/api/rum', { method:'POST', headers:{'Content-Type':'application/json'}, body });
  } catch {}
}

export function initWebVitalsRUM(){
  if((window as any).__wvInit) return; (window as any).__wvInit = true;
  onLCP(post as MetricHandler);
  onINP(post as MetricHandler);
  onCLS(post as MetricHandler);
  onTTFB(post as MetricHandler);
}

// Auto-init bei direktem Import
if(typeof window !== 'undefined'){
  // Idle Callback um Hydration nicht zu stören
  (window.requestIdleCallback || window.setTimeout)(()=> initWebVitalsRUM(), {timeout:3000} as any);
}
