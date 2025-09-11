import React, { Suspense } from 'react';

// Dynamischer Icon Loader – lädt nur bei Bedarf das Icon Modul (Code Splitting pro Icon Name)
// Nutzung: <DynamicIcon name="Send" className="w-4 h-4" />

const cache = new Map();

function loadIcon(name){
  if(cache.has(name)) return cache.get(name);
  // Dynamic import Pfad basierend auf lucide-react ESM Struktur
  const p = import('lucide-react').then(mod => {
    if(mod[name]) return mod[name];
    throw new Error('Icon nicht gefunden: ' + name);
  });
  cache.set(name, p);
  return p;
}

export function DynamicIcon({ name, fallback = null, ...rest }){
  const Icon = React.useSyncExternalStore(
    (subscribe)=>{ let cancelled=false; loadIcon(name).then(()=>!cancelled&&subscribe()); return ()=>{cancelled=true}; },
    ()=>()=>{}, // snapshot unused
    ()=>()=>{}
  );
  // Vereinfachter Ansatz: Suspense boundary höher in App setzen
  const Lazy = React.lazy(()=>loadIcon(name).then(C=>({ default: C })));
  return <Suspense fallback={fallback}>{<Lazy {...rest} />}</Suspense>;
}
