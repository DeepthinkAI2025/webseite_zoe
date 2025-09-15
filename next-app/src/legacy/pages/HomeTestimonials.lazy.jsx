import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Quote } from '@/components/icons';

export default function HomeTestimonialsLazy(){
  const items = useMemo(() => ([
    { quote: 'Unsere Stromrechnung ist endlich entspannt. Die Jungs haben sauber gearbeitet und nichts beschönigt – genau so wollten wir das.', name: 'Familie M., Potsdam (Brandenburg)', meta: '9,8 kWp mit Speicher, Inbetriebnahme 05/2025' },
    { quote: 'Kein Blabla, sondern klare Zahlen. Termin wurde gehalten, Dach war nach zwei Tagen fertig – top organisiert.', name: 'Miriam M., Berlin-Pankow', meta: '8,2 kWp, ohne Speicher, Inbetriebnahme 04/2025' },
    { quote: 'Wir hatten Respekt vor dem Aufwand. Am Ende lief’s geräuschlos – inklusive Netzbetreiberkram. Danke!', name: 'Jonas M., Teltow (Brandenburg)', meta: '11,4 kWp mit Speicher, Inbetriebnahme 06/2025' },
    { quote: 'Preis stand, Termin stand, am Ende gab’s eine ordentliche Einweisung. So macht man das.', name: 'Sven K., Berlin-Köpenick', meta: '7,6 kWp, Inbetriebnahme 05/2025' },
  ]), []);
  const [i,setI]=useState(0); const [paused,setPaused]=useState(false);
  useEffect(()=>{ if(paused) return; const id=setInterval(()=> setI(v=> (v+1)%items.length),6000); return ()=> clearInterval(id); },[items.length,paused]);
  const current=items[i];
  const go = dir => setI(v => (v + (dir==='next'?1:items.length-1)) % items.length);
  return (
    <div className="mt-8" role="region" aria-label="Kundenstimmen" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
      <Helmet>
  <title>Solar Testimonials 2025 Vorschau – Echte Kundenstimmen DE</title>
  <meta name="description" content="Solar Testimonials Vorschau 2025: Erfahrungen zu Installation Termintreue Ersparnis Autarkie Service Qualität Wirtschaftlichkeit – Kundenstimmen ansehen." />
      </Helmet>
      <div className="mx-auto max-w-3xl">
  <div className="relative rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
          <Quote className="w-6 h-6 text-amber-600 absolute -top-3 -left-3 bg-amber-50 border border-amber-200 rounded-full p-1" />
          <p className="text-base text-neutral-800">“{current.quote}”</p>
          <div className="mt-3 text-sm font-semibold text-neutral-900">{current.name}</div>
          <div className="text-xs sm:text-sm text-neutral-600">{current.meta}</div>
          <div className="mt-4 flex items-center gap-1">
            {items.map((_,idx)=>(
              <button key={idx} aria-label={`Testimonial ${idx+1} anzeigen`} onClick={()=>setI(idx)} className={`h-1.5 w-6 rounded-full ${idx===i?'bg-amber-600':'bg-neutral-200'} focus-visible:focus-ring`} />
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
            <button aria-label="Vorheriges Testimonial" onClick={()=>go('prev')} className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border border-amber-200 text-amber-800 hover:bg-amber-50 focus-visible:focus-ring">‹</button>
            <button aria-label="Nächstes Testimonial" onClick={()=>go('next')} className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border border-amber-200 text-amber-800 hover:bg-amber-50 focus-visible:focus-ring">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
