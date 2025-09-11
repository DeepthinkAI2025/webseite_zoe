// Stub Implementierung für Route Prefetching / Idle Warmup
// TODO: Echte Prefetch Logik (dynamic import hints) wiederherstellen falls benötigt.

export function prefetchRoute(name){
  // Platzhalter: könnte dynamische Imports triggern
  const isProd = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'production';
  if(!isProd){
    // eslint-disable-next-line no-console
    console.debug('[prefetchRoute] stub', name);
  }
}

export function idleWarmRoutes(names){
  if(typeof window === 'undefined') return;
  requestIdleCallback?.(()=>{
    names.forEach(n=>prefetchRoute(n));
  });
}