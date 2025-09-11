// Lightweight RUM metrics collection (LCP, CLS, INP) using PerformanceObserver.
// Sends data once per metric (first final value) to optional window.dataLayer or logs to console.
// Can be extended later with batching / beacon endpoint.

function send(metric){
  try {
    if(window.dataLayer){
      window.dataLayer.push({ event: 'web_vitals', metric: metric.name, value: metric.value, rating: metric.rating });
    } else {
      // eslint-disable-next-line no-console
      console.info('[web-vitals]', metric.name, metric.value, metric.rating);
    }
  } catch { /* noop */ }
}

function observe(name, type, entryHandler){
  try {
    new PerformanceObserver((list)=>{
      for(const entry of list.getEntries()) entryHandler(entry);
    }).observe({ type, buffered: true });
  } catch { /* noop */ }
}

// LCP
observe('LCP','largest-contentful-paint',(entry)=>{
  if(!window.__lcp_final){ window.__lcp_final = entry.renderTime || entry.loadTime; }
  // Send after first interaction or when page is hidden
  const report = ()=>{ if(window.__lcp_final_sent) return; window.__lcp_final_sent = true; send({ name:'LCP', value: window.__lcp_final, rating: window.__lcp_final < 2500 ? 'good' : (window.__lcp_final < 4000 ? 'needs-improvement':'poor') }); };
  document.addEventListener('visibilitychange', () => { if(document.visibilityState==='hidden') report(); }, { once:true });
  window.addEventListener('pointerdown', report, { once:true, passive:true });
});

// CLS
let clsValue = 0;
observe('CLS','layout-shift',(entry)=>{
  if(!entry.hadRecentInput){ clsValue += entry.value; }
  clearTimeout(window.__cls_timeout);
  window.__cls_timeout = setTimeout(()=>{
    if(window.__cls_sent) return; window.__cls_sent = true; send({ name:'CLS', value: +clsValue.toFixed(4), rating: clsValue <= 0.1 ? 'good' : (clsValue <= 0.25 ? 'needs-improvement':'poor') });
  }, 3000);
});

// INP (experimental) – fallback zu FID für ältere Browser
observe('INP','event',(entry)=>{
  if(!['click','pointerdown','keydown'].includes(entry.name)) return;
  const dur = entry.duration; // Interaction latency
  if(window.__inp_best == null || dur > window.__inp_best){ window.__inp_best = dur; }
  clearTimeout(window.__inp_timeout);
  window.__inp_timeout = setTimeout(()=>{
    if(window.__inp_sent) return; window.__inp_sent = true; const value = window.__inp_best; send({ name:'INP', value: Math.round(value), rating: value <= 200 ? 'good' : (value <= 500 ? 'needs-improvement':'poor') });
  }, 5000);
});

export function initRUM(){ try { if(!('PerformanceObserver' in window)) return; /* triggers observers */ } catch { /* noop */ } }

if(typeof window !== 'undefined'){
  if(document.readyState === 'complete' || document.readyState === 'interactive') initRUM();
  else window.addEventListener('DOMContentLoaded', initRUM, { once:true });
}
