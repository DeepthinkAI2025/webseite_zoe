"use client";
import React from 'react';

export interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className = '' }: ContactFormProps){
  const [state,setState] = React.useState<'idle'|'submitting'|'success'|'error'>('idle');
  const [errors,setErrors] = React.useState<Record<string,string>>({});
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(state==='submitting') return;
    setState('submitting');
    setErrors({});
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/api/fapro/lead', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
      const json = await res.json();
      if(!res.ok){
        if(json.fields) setErrors(json.fields);
        setState('error');
        return;
      }
      setState('success');
      form.reset();
    } catch {
      setState('error');
    }
  };
  return (
    <form onSubmit={onSubmit} className={['space-y-4', className].filter(Boolean).join(' ')} aria-label="Kontaktformular">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required className="w-full rounded border px-3 py-2 text-sm" aria-invalid={!!errors.name} />
        {errors.name && <p className="text-xs text-red-600 mt-1">Name zu kurz</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">E-Mail</label>
        <input id="email" name="email" type="email" required className="w-full rounded border px-3 py-2 text-sm" aria-invalid={!!errors.email} />
        {errors.email && <p className="text-xs text-red-600 mt-1">E-Mail ungültig</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="plz">PLZ (optional)</label>
        <input id="plz" name="plz" type="text" pattern="\d{4,5}" className="w-full rounded border px-3 py-2 text-sm" aria-invalid={!!errors.plz} />
        {errors.plz && <p className="text-xs text-red-600 mt-1">PLZ ungültig</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="message">Nachricht</label>
        <textarea id="message" name="message" rows={4} required className="w-full rounded border px-3 py-2 text-sm" aria-invalid={!!errors.message}></textarea>
        {errors.message && <p className="text-xs text-red-600 mt-1">Nachricht zu kurz</p>}
      </div>
      <button disabled={state==='submitting'} type="submit" className="inline-flex items-center rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
        {state==='submitting' ? 'Sende…' : state==='success' ? 'Gesendet ✓' : 'Absenden'}
      </button>
      {state==='error' && <p className="text-xs text-red-600">Fehler beim Senden – bitte später erneut versuchen.</p>}
      {state==='success' && <p className="text-xs text-emerald-700">Anfrage erfolgreich übertragen.</p>}
      <p className="text-xs text-neutral-500 dark:text-neutral-400">Ihre Anfrage wird sicher verarbeitet. Es erfolgt keine Weitergabe an Dritte.</p>
    </form>
  );
}

export default ContactForm;
