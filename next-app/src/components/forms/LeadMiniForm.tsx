"use client";
import React, { useState, useRef } from 'react';

interface LeadMiniFormProps {
  className?: string;
}

export function LeadMiniForm({ className }: LeadMiniFormProps){
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [postcode,setPostcode] = useState("");
  const [consent,setConsent] = useState(false);
  const [fieldErrors,setFieldErrors] = useState<Record<string,string>>({});
  const [loading,setLoading] = useState(false);
  const [done,setDone] = useState(false);
  const [error,setError] = useState<string|null>(null);
  const abortRef = useRef<AbortController|null>(null);
  // Attribution
  const [utmSource] = useState<string | undefined>(()=> {
    if (typeof window === 'undefined') return undefined;
    try { return new URL(window.location.href).searchParams.get('utm_source') || undefined; } catch { return undefined; }
  });
  const [utmMedium] = useState<string | undefined>(()=> {
    if (typeof window === 'undefined') return undefined;
    try { return new URL(window.location.href).searchParams.get('utm_medium') || undefined; } catch { return undefined; }
  });
  const [utmCampaign] = useState<string | undefined>(()=> {
    if (typeof window === 'undefined') return undefined;
    try { return new URL(window.location.href).searchParams.get('utm_campaign') || undefined; } catch { return undefined; }
  });
  const [utmTerm] = useState<string | undefined>(()=> {
    if (typeof window === 'undefined') return undefined;
    try { return new URL(window.location.href).searchParams.get('utm_term') || undefined; } catch { return undefined; }
  });
  const [utmContent] = useState<string | undefined>(()=> {
    if (typeof window === 'undefined') return undefined;
    try { return new URL(window.location.href).searchParams.get('utm_content') || undefined; } catch { return undefined; }
  });
  const [referrer] = useState<string | undefined>(()=> (typeof document !== 'undefined' && document.referrer ? document.referrer : undefined));
  const [landingPath] = useState<string | undefined>(()=> {
    if (typeof window === 'undefined') return undefined;
    try { return window.location.pathname + window.location.search; } catch { return undefined; }
  });
  const [duplicate,setDuplicate] = useState(false);
  const honeypotRef = useRef<HTMLInputElement|null>(null);

  async function submit(e: React.FormEvent){
    e.preventDefault();
    setError(null); setFieldErrors({}); setDuplicate(false);
    if(!name || !email || !postcode || !consent) { setError('Bitte Pflichtfelder ausfüllen.'); return; }
    try {
      setLoading(true);
      if(abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
  const payload: any = { name, email, postcode, consent:true, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, referrer, landingPath };
      // Honeypot
      if(honeypotRef.current?.value){ payload.honeypot = honeypotRef.current.value; }
      const res = await fetch('/api/lead', { method:'POST', headers:{'content-type':'application/json', 'accept':'application/json'}, body: JSON.stringify(payload), signal: ctrl.signal });
      const j = await res.json().catch(()=>({}));
      if(res.status === 422 && j?.errors){
        setFieldErrors(j.errors);
        setError('Bitte Eingaben prüfen.');
      } else if(!res.ok){
        if(res.status === 429) setError('Zu viele Versuche – bitte kurz warten.');
        else setError('Übermittlung fehlgeschlagen.');
      } else if(j?.duplicate){
        setDuplicate(true); setDone(true);
      } else if(j?.success){
        setDone(true);
      } else {
        setError('Unerwartete Antwort.');
      }
    } catch(err){
      setError('Netzwerkfehler.');
    } finally { setLoading(false); }
  }

  if(done){
    return <div className={className}><div className="p-4 rounded-md bg-green-50 text-green-800 text-sm">{duplicate ? 'Danke – Anfrage liegt bereits vor (Duplikat erkannt).' : 'Danke! Wir melden uns in Kürze mit ersten Kennzahlen.'}</div></div>;
  }

  return (
    <form onSubmit={submit} className={className + ' space-y-3 text-left'} aria-label="Schnellanfrage" noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium mb-1" htmlFor="mini-name">Name*</label>
          <input id="mini-name" required value={name} onChange={e=>setName(e.target.value)} className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-800 ${fieldErrors.name ? 'border-red-500' : 'border-neutral-300'}`} />
          {fieldErrors.name && <div className="text-[10px] text-red-600 mt-1">{fieldErrors.name}</div>}
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" htmlFor="mini-email">E-Mail*</label>
          <input id="mini-email" required type="email" value={email} onChange={e=>setEmail(e.target.value)} className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-800 ${fieldErrors.email ? 'border-red-500' : 'border-neutral-300'}`} />
          {fieldErrors.email && <div className="text-[10px] text-red-600 mt-1">{fieldErrors.email}</div>}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium mb-1" htmlFor="mini-postcode">PLZ*</label>
          <input id="mini-postcode" required pattern="\\d{5}" value={postcode} onChange={e=>setPostcode(e.target.value)} className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-800 ${fieldErrors.postcode ? 'border-red-500' : 'border-neutral-300'}`} />
          {fieldErrors.postcode && <div className="text-[10px] text-red-600 mt-1">{fieldErrors.postcode}</div>}
        </div>
        <div className="flex items-center pt-5">
          <label className="inline-flex items-center gap-2 text-xs">
            <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} /> Einwilligung*
          </label>
        </div>
      </div>
      {/* Honeypot Feld (sichtbar für Bots via name Attribut, visuell versteckt) */}
      <div style={{ position:'absolute', left:'-9999px', width:'1px', height:'1px', overflow:'hidden' }} aria-hidden="true">
        <label>Ihre Website
          <input ref={honeypotRef} type="text" tabIndex={-1} autoComplete="off" name="website" />
        </label>
      </div>
      {error && <div className="text-xs text-red-600">{error}</div>}
      <button disabled={loading} className="w-full inline-flex items-center justify-center rounded-md bg-neutral-900 text-white px-4 py-2 text-sm font-medium shadow hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? 'Sende…' : 'Kurz prüfen lassen'}
      </button>
      <p className="text-[10px] text-neutral-500 leading-snug">Wir verwenden die Angaben zur Einschätzung & Kontaktaufnahme. Keine Weitergabe. Widerruf jederzeit per E-Mail.</p>
    </form>
  );
}
