import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

const SelectCtx = createContext(null);

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function onClickOutside(e){
      if(ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, []);
  return (
    <SelectCtx.Provider value={{ value, onValueChange, open, setOpen }}>
      <div ref={ref} className="relative">{children}</div>
    </SelectCtx.Provider>
  );
}

export function SelectTrigger({ className = '', children, id }) {
  const { open, setOpen } = useContext(SelectCtx);
  return (
    <button
      id={id}
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
  className={`w-full h-10 px-3 text-left border rounded-md bg-white border-neutral-300 hover:border-neutral-400 focus:outline-none focus-visible:focus-ring transition ${className}`}
    >{children}</button>
  );
}

export function SelectValue({ placeholder }) {
  const { value } = useContext(SelectCtx);
  return <span className={value ? 'text-neutral-900' : 'text-neutral-600'}>{value || placeholder}</span>;
}

export function SelectContent({ children }) {
  const { open } = useContext(SelectCtx);
  if (!open) return null;
  return <ul role="listbox" className="absolute z-10 mt-2 w-full border border-neutral-200 rounded-md bg-white shadow-lg p-1.5 space-y-0.5 max-h-60 overflow-auto focus:outline-none">{children}</ul>;
}

export function SelectItem({ value, children }) {
  const { onValueChange, setOpen, value: current } = useContext(SelectCtx);
  const selected = current === value;
  return (
    <li
      role="option"
      aria-selected={selected}
      tabIndex={-1}
      onClick={() => { onValueChange && onValueChange(value); setOpen(false); }}
  className={`px-3 py-2 rounded-md cursor-pointer text-sm flex items-center gap-2 hover:bg-neutral-100 focus-visible:focus-ring ${selected ? 'bg-neutral-100 font-medium' : ''}`}
    >
      {children}
      {selected && <span className="ml-auto text-blue-600" aria-hidden>✓</span>}
    </li>
  );
}
