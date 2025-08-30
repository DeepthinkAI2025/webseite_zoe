import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

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

export function SelectTrigger({ className = '', children }) {
  const { open, setOpen } = useContext(SelectCtx);
  return (
    <button type="button" onClick={() => setOpen(!open)} className={`w-full h-10 px-3 text-left border border-gray-300 rounded-md ${className}`}>{children}</button>
  );
}

export function SelectValue({ placeholder }) {
  const { value } = useContext(SelectCtx);
  return <span className={value ? 'text-gray-900' : 'text-gray-500'}>{value || placeholder}</span>;
}

export function SelectContent({ children }) {
  const { open } = useContext(SelectCtx);
  if (!open) return null;
  return <div className="absolute z-10 mt-2 w-full border border-gray-200 rounded-md bg-white shadow-lg p-2 space-y-1">{children}</div>;
}

export function SelectItem({ value, children }) {
  const { onValueChange, setOpen } = useContext(SelectCtx);
  return (
    <div
      className="px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
      onClick={() => { onValueChange && onValueChange(value); setOpen(false); }}
    >
      {children}
    </div>
  );
}
