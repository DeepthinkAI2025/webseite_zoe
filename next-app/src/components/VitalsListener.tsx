"use client";
import { useEffect, useRef } from 'react';
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

interface MetricPayload {
  name: string;
  value: number;
  id: string;
  rating?: string;
  delta?: number;
}

function sendMetric(metric: MetricPayload){
  try {
    const body = JSON.stringify({ ...metric, ts: Date.now() });
    const url = '/api/vitals';
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, { method: 'POST', headers: { 'Content-Type':'application/json' }, body });
    }
  } catch {/* ignore */}
}

export default function VitalsListener(){
  const sentIds = useRef(new Set<string>());
  useEffect(()=> {
    // Lazy import optionaler RUM Erweiterung (z.B. custom Posting) ohne SSR break
    import('@/lib/rum/web-vitals-client').catch(()=>{/* optional */});
    const handler = (metric: any) => {
      // Verhindern mehrfaches Senden gleicher ID + Name Kombination im selben Lifecycle
      const key = metric.name + metric.id;
      if(sentIds.current.has(key)) return;
      sentIds.current.add(key);
      sendMetric({ name: metric.name, value: metric.value, id: metric.id, rating: metric.rating, delta: metric.delta });
    };
    onCLS(handler);
    onINP(handler);
    onLCP(handler);
    onFCP(handler);
    onTTFB(handler);
  },[]);
  return null;
}
