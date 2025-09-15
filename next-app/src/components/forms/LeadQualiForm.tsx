"use client";
import { useState, useRef } from 'react';

type LeadFormState = {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  roofType: string;
  annualConsumptionKWh: string;
  storageInterest: boolean;
  wallboxInterest: boolean;
  message: string;
  consent: boolean;
  honeypot: string; // hidden
};

const initialState: LeadFormState = {
  name: '', email: '', phone: '', postcode: '', roofType: '', annualConsumptionKWh: '', storageInterest: false, wallboxInterest: false, message: '', consent: false, honeypot: ''
};

export function LeadQualiForm(){
  const [data, setData] = useState<LeadFormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const statusRef = useRef<HTMLDivElement|null>(null);

  function update<K extends keyof LeadFormState>(key: K, val: LeadFormState[K]){
    setData(d => ({ ...d, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setSuccess(false);
    try {
      const payload: any = { ...data };
      if(payload.annualConsumptionKWh){
        payload.annualConsumptionKWh = Number(payload.annualConsumptionKWh);
      } else {
        delete payload.annualConsumptionKWh;
      }
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      if(res.ok){
        setSuccess(true);
        setData(initialState);
        statusRef.current?.focus();
      } else if(res.status === 422){
        const json = await res.json();
        setErrors(json.errors || {});
        statusRef.current?.focus();
      } else {
        setErrors({ form: 'Server Fehler oder Rate Limit' });
        statusRef.current?.focus();
      }
    } catch {
      setErrors({ form: 'Netzwerkfehler' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6" aria-describedby="lead-form-status">
      <div
        id="lead-form-status"
        ref={statusRef}
        tabIndex={-1}
        aria-live="polite"
        className="outline-none text-sm"
      >
        {success && <p className="text-green-600 font-medium">Danke – wir melden uns zeitnah.</p>}
        {errors.form && <p className="text-red-600 font-medium">{errors.form}</p>}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium">Name *</label>
          <input className="mt-1 w-full border rounded px-3 py-2 text-sm" required value={data.name} onChange={e=>update('name', e.target.value)} />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">E-Mail *</label>
          <input type="email" className="mt-1 w-full border rounded px-3 py-2 text-sm" required value={data.email} onChange={e=>update('email', e.target.value)} />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Telefon</label>
          <input className="mt-1 w-full border rounded px-3 py-2 text-sm" value={data.phone} onChange={e=>update('phone', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">PLZ *</label>
            <input inputMode="numeric" pattern="\\d{5}" className="mt-1 w-full border rounded px-3 py-2 text-sm" required value={data.postcode} onChange={e=>update('postcode', e.target.value)} />
          {errors.postcode && <p className="text-xs text-red-600 mt-1">{errors.postcode}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Dachtyp</label>
          <select className="mt-1 w-full border rounded px-3 py-2 text-sm" value={data.roofType} onChange={e=>update('roofType', e.target.value)}>
            <option value="">– auswählen –</option>
            <option value="ziegel">Ziegel</option>
            <option value="flachdach">Flachdach</option>
            <option value="pultdach">Pultdach</option>
            <option value="walmdach">Walmdach</option>
            <option value="andere">Andere</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Jahresverbrauch (kWh)</label>
          <input type="number" min={300} max={60000} className="mt-1 w-full border rounded px-3 py-2 text-sm" value={data.annualConsumptionKWh} onChange={e=>update('annualConsumptionKWh', e.target.value)} />
          {errors.annualConsumptionKWh && <p className="text-xs text-red-600 mt-1">{errors.annualConsumptionKWh}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <input id="storageInterest" type="checkbox" checked={data.storageInterest} onChange={e=>update('storageInterest', e.target.checked)} />
          <label htmlFor="storageInterest" className="text-sm">Speicher Interesse</label>
        </div>
        <div className="flex items-center space-x-2">
          <input id="wallboxInterest" type="checkbox" checked={data.wallboxInterest} onChange={e=>update('wallboxInterest', e.target.checked)} />
          <label htmlFor="wallboxInterest" className="text-sm">Wallbox Interesse</label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Nachricht</label>
        <textarea className="mt-1 w-full border rounded px-3 py-2 text-sm h-28" value={data.message} onChange={e=>update('message', e.target.value)} />
      </div>
      {/* Honeypot */}
      <div style={{ position: 'absolute', left: '-5000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
        <label>Website</label>
        <input tabIndex={-1} autoComplete="off" value={data.honeypot} onChange={e=>update('honeypot', e.target.value)} />
      </div>
      <div className="flex items-start space-x-2">
        <input id="consent" type="checkbox" checked={data.consent} onChange={e=>update('consent', e.target.checked)} />
        <label htmlFor="consent" className="text-xs leading-snug">Ich stimme der Verarbeitung meiner angegebenen Daten zur Kontaktaufnahme zu. Ein Widerruf ist jederzeit möglich.</label>
      </div>
      {errors.consent && <p className="text-xs text-red-600 -mt-4">{errors.consent}</p>}
      <div>
        <button disabled={submitting} className="px-5 py-2 rounded bg-blue-600 text-white text-sm font-medium disabled:opacity-50">{submitting ? 'Senden…' : 'Anfrage absenden'}</button>
      </div>
    </form>
  );
}

export default LeadQualiForm;
