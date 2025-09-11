import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Mail, CalcIcon as Calc, FileCheck } from '@/components/icons';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useTranslation } from 'react-i18next';

function useTrack() {
  return (event, payload = {}) => {
    try { if (typeof window !== 'undefined' && window.dataLayer) window.dataLayer.push({ event, ...payload }); } catch {}
  };
}

function Backdrop({ onClose, children, ariaTitle, labelledById }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3" role="presentation">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div role="dialog" aria-modal="true" {...(labelledById ? { 'aria-labelledby': labelledById } : { 'aria-label': ariaTitle })} className="relative w-full sm:max-w-lg outline-none focus-visible:focus-ring" tabIndex="-1">
        {children}
      </div>
    </div>
  );
}

function EmailCapture({ topic, onDone }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');
  const track = useTrack();
  const submit = async (e) => {
    e?.preventDefault?.();
    setErr('');
    if (!email || !email.includes('@')) { setErr(t('popup.common.email_invalid')); return; }
    try {
      setBusy(true);
      track('lead_submit', { placement: topic });
      const res = await fetch('/api/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Popup Lead', email, phone: 'n/a', message: topic, source: topic })
      });
      if (!res.ok) throw new Error('failed');
      setOk(true);
      onDone?.();
    } catch (e) {
      setErr(t('popup.common.submit_error'));
    } finally {
      setBusy(false);
    }
  };
  if (ok) return <div className="mt-3 text-sm rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-2">{t('popup.common.email_ok')}</div>;
  return (
    <form onSubmit={submit} className="mt-3 flex gap-2" noValidate aria-describedby={err ? 'popup-email-error' : undefined}>
      <div className="flex-1">
        <label htmlFor={`popup-email-${topic}`} className="sr-only">E-Mail</label>
        <Input id={`popup-email-${topic}`} type="email" aria-invalid={!!err} value={email} onChange={(e)=>setEmail(e.target.value)} placeholder={t('popup.timed.email_placeholder')} className="bg-white w-full" />
        {err && <p id="popup-email-error" className="mt-1 text-xs text-red-600" role="alert">{err}</p>}
      </div>
      <Button type="submit" disabled={busy} className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1 self-start h-11">
        <Mail className="w-4 h-4"/>{busy ? t('popup.common.sending') : t('popup.common.receive')}
      </Button>
    </form>
  );
}

function TimedPopup({ delayMs = 8000, hiddenRoutes = [] }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const track = useTrack();
  useEffect(() => {
    if (hiddenRoutes.some((r)=> location.pathname.toLowerCase().includes(r))) return;
    if (sessionStorage.getItem('zoe_popup_timed_shown') === '1') return;
    const id = setTimeout(() => {
      setOpen(true);
      try { sessionStorage.setItem('zoe_popup_timed_shown', '1'); } catch {}
      track('popup_timed_shown');
    }, delayMs);
    return () => clearTimeout(id);
  }, [delayMs, location.pathname]);
  if (!open) return null;
  return (
    <Backdrop onClose={() => setOpen(false)} ariaTitle={t('popup.timed.title')} labelledById="popup-timed-heading">
      <div className="relative rounded-2xl border border-neutral-200 bg-white shadow-2xl p-5 sm:p-6 outline-none focus-visible:focus-ring" tabIndex="-1">
  <Button variant="plain" aria-label="Schließen" onClick={()=>setOpen(false)} className="absolute top-2 right-2 p-2 rounded-full hover:bg-neutral-100 focus-visible:focus-ring"><X className="w-5 h-5"/></Button>
        <div className="flex items-start gap-4">
          <div className="hidden sm:block text-3xl" aria-hidden>📘</div>
          <div className="space-y-3">{/* space-y ersetzt mehrere mt-* */}
            <div id="popup-timed-heading" className="text-lg font-extrabold text-neutral-900">{t('popup.timed.title')}</div>
            <ul className="text-base sm:text-lg text-neutral-700 list-disc pl-5 space-y-1">
              <li>{t('popup.timed.l1')}</li>
              <li>{t('popup.timed.l2')}</li>
              <li>{t('popup.timed.l3')}</li>
            </ul>
            <EmailCapture topic="popup_timed" onDone={() => track('popup_timed_submit')} />
            <div className="text-[11px] text-neutral-500">{t('popup.timed.email_help')}</div>
            <div className="flex flex-wrap gap-2">
              <Link to={createPageUrl('Calculator')} className="inline-flex"><Button className="bg-neutral-900 hover:bg-black text-white focus-visible:focus-ring"><Calc className="w-4 h-4 mr-1"/>{t('popup.timed.cta_calc')}</Button></Link>
              <Button variant="outline" onClick={()=>setOpen(false)} className="border-neutral-300 focus-visible:focus-ring">{t('popup.timed.btn_later')}</Button>
            </div>
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

function ExitIntentPopup({ hiddenRoutes = [] }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [variant] = useState(()=> Math.random() < 0.5 ? 'base' : 'incentive');
  const track = useTrack();
  const location = useLocation();
  const triggered = useRef(false);
  useEffect(() => { triggered.current = false; }, [location.pathname]);
  useEffect(() => {
    if (hiddenRoutes.some((r)=> location.pathname.toLowerCase().includes(r))) return;
    const onMouseOut = (e) => {
      if (triggered.current) return;
      if (!e.relatedTarget && e.clientY <= 0) {
        triggered.current = true;
        if (sessionStorage.getItem('zoe_popup_exit_shown') === '1') return;
        setOpen(true);
        try { sessionStorage.setItem('zoe_popup_exit_shown', '1'); } catch {}
  track('popup_exit_shown',{ variant });
      }
    };
    document.addEventListener('mouseout', onMouseOut);
    return () => document.removeEventListener('mouseout', onMouseOut);
  }, [location.pathname]);
  if (!open) return null;
  return (
    <Backdrop onClose={() => setOpen(false)} ariaTitle={t('popup.exit.aria_title')} labelledById="popup-exit-heading">
      <div className="relative rounded-2xl border border-neutral-200 bg-white shadow-2xl p-5 sm:p-6 outline-none focus-visible:focus-ring" tabIndex="-1">
  <Button variant="plain" aria-label="Schließen" onClick={()=>setOpen(false)} className="absolute top-2 right-2 p-2 rounded-full hover:bg-neutral-100 focus-visible:focus-ring"><X className="w-5 h-5"/></Button>
        <div className="flex items-start gap-4">
          <div className="hidden sm:block text-3xl" aria-hidden>🧮</div>
          <div className="space-y-3">{/* space-y ersetzt mehrere mt-* */}
            {variant==='base' && <div className="space-y-2"><div id="popup-exit-heading" className="text-lg font-extrabold text-neutral-900">{t('popup.exit.title_base')}</div><div className="text-sm text-neutral-700">{t('popup.exit.desc_base')}</div></div>}
            {variant==='incentive' && <div className="space-y-2"><div id="popup-exit-heading" className="text-lg font-extrabold text-neutral-900">{t('popup.exit.title_incentive')}</div><div className="text-sm text-neutral-700" dangerouslySetInnerHTML={{ __html: t('popup.exit.desc_incentive') }} /></div>}
            <div className="flex flex-wrap gap-2">
              <Link to={createPageUrl('Calculator')} className="inline-flex" onClick={()=>track('popup_exit_click', { action: 'calculator', variant })}><Button className="bg-neutral-900 hover:bg-black text-white focus-visible:focus-ring"><Calc className="w-4 h-4 mr-1"/>{t('popup.exit.btn_calc')}</Button></Link>
              {variant==='incentive' && <Button onClick={()=>{ track('popup_exit_incentive_click'); setOpen(false); }} className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1 focus-visible:focus-ring"><FileCheck className="w-4 h-4"/>{t('popup.exit.btn_incentive')}</Button>}
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium text-neutral-900">{t('popup.exit.email_intro')}</div>
              <EmailCapture topic="popup_exit" onDone={() => track('popup_exit_submit')} />
            </div>
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

export default function PopupBanners() {
  // Nicht auf Kontakt/Impressum/Privacy nerven
  const hidden = ['contact', 'imprint', 'privacy'];
  return (
    <>
      <TimedPopup delayMs={8000} hiddenRoutes={hidden} />
      <ExitIntentPopup hiddenRoutes={hidden} />
    </>
  );
}
