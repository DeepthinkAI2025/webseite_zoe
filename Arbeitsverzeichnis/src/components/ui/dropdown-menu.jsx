import React, { useState, useContext, useRef, useEffect, createContext } from 'react';

const Ctx = createContext(null);

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, []);

  return (
    <Ctx.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block text-left">
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function DropdownMenuTrigger({ className = '', children }) {
  const { open, setOpen } = useContext(Ctx);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      onMouseEnter={() => setOpen(true)}
      className={className}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({ className = '', children }) {
  const { open, setOpen } = useContext(Ctx);
  if (!open) return null;
  return (
    <div
      onMouseLeave={() => setOpen(false)}
      className={`absolute mt-2 w-56 origin-top-right right-0 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${className}`}
    >
      <div className="py-1">{children}</div>
    </div>
  );
}

export function DropdownMenuItem({ asChild = false, children }) {
  return (
    <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
      {children}
    </div>
  );
}
