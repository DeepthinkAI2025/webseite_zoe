import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from '@/components/icons';
import { usePersona } from '@/context/PersonaContext';

export default function PersonaMemoryDialog(){
  const { persona, setPersona, history, addTurn, preferences, setPreferences } = usePersona?.() || {};
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  if (!persona) return null;
  const submit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    addTurn?.('user', text);
    if (/speicher/i.test(text)) {
      setPreferences?.(p => ({ ...p, speicher: true }));
      addTurn?.('assistant', 'Verstanden: Speicher ist für Sie relevant.');
    } else if (/wallbox/i.test(text)) {
      setPreferences?.(p => ({ ...p, wallbox: true }));
      addTurn?.('assistant', 'Notiert: Wallbox Interesse gespeichert.');
    } else if (/gewerb|firma|unternehmen/i.test(text)) {
      setPersona?.('gewerbe');
      addTurn?.('assistant', 'Persona auf Gewerbe gesetzt.');
    } else if (/privat|efh|haus/i.test(text)) {
      setPersona?.('privat');
      addTurn?.('assistant', 'Persona auf Privat gestellt.');
    } else {
      addTurn?.('assistant', 'Hinweis gespeichert. (Demo – keine KI Backend-Analyse)');
    }
    setInput('');
  };
  return (
    <>
      <Button onClick={()=> setOpen(true)} variant="fab" aria-label="Persona & Memory">
        <MessageSquare className="w-7 h-7" />
      </Button>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/30 p-0 sm:p-6" onClick={()=> setOpen(false)}>
          <div className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh]" onClick={e=> e.stopPropagation()}>
            <div className="px-5 py-4 border-b flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-neutral-800">Persona & Memory</div>
              <Button variant="plain" onClick={()=> setOpen(false)} className="text-neutral-500 hover:text-neutral-700">×</Button>
            </div>
            <div className="px-5 py-3 text-xs text-neutral-500 flex flex-wrap gap-2 border-b">
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full px-2 py-0.5">Persona: {persona}</span>
              {preferences?.speicher && <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">Speicher</span>}
              {preferences?.wallbox && <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">Wallbox</span>}
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 text-sm">
              {history && history.length === 0 && (
                <div className="text-neutral-500">Noch keine Einträge. Schreiben Sie z.B.: "Ich interessiere mich für Speicher und Wallbox".</div>
              )}
              {history?.slice(-40).map((m,i)=>(
                <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                  <div className={`px-3 py-2 rounded-lg max-w-[80%] leading-snug ${m.role==='user'?'bg-neutral-900 text-white':'bg-neutral-100 text-neutral-800'}`}>{m.content}</div>
                </div>
              ))}
            </div>
            <form onSubmit={submit} className="p-4 border-t flex items-center gap-2" noValidate>
              <label htmlFor="memory-note" className="sr-only">Notiz eingeben</label>
              <input id="memory-note" value={input} onChange={e=> setInput(e.target.value)} placeholder="Ihre Notiz / Wunsch…" className="flex-1 rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus-visible:focus-ring" />
              <Button type="submit" className="rounded-full">Speichern</Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
