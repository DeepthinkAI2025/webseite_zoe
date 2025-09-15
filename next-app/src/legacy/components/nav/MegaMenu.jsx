import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Pill } from '@/components/ui/pill';

// leftRail: { title: string, items: [{ label, desc, to, until?: string|number|Date, badge?: string }] }
export default function MegaMenu({ label, items, image, highlight, leftRail, onLinkClick, active=false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const menuRef = useRef(null);

  // Schließt bei Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Keyboard: open/focus first; arrow navigation innerhalb Menü
  const focusFirst = () => {
    const root = menuRef.current;
    if (!root) return;
    const focusables = root.querySelectorAll('a, button');
    if (focusables.length) focusables[0].focus();
  };

  const onButtonKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setTimeout(focusFirst, 0);
    }
    if (e.key === 'Escape') setOpen(false);
  };

  const onMenuKeyDown = (e) => {
    if (!open) return;
    const root = menuRef.current;
    if (!root) return;
    const focusables = Array.from(root.querySelectorAll('a, button'));
    const idx = focusables.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = focusables[Math.min(idx + 1, focusables.length - 1)] || focusables[0];
      next.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = focusables[Math.max(idx - 1, 0)] || focusables[focusables.length - 1];
      prev.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusables[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      focusables[focusables.length - 1]?.focus();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const soonestUntil = useMemo(() => {
    if (!leftRail?.items) return null;
    const times = leftRail.items
      .map(i => (i.until ? new Date(i.until).getTime() : null))
      .filter(Boolean);
    return times.length ? Math.min(...times) : null;
  }, [leftRail]);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!soonestUntil) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [soonestUntil]);

  const formatRemaining = (untilTs) => {
    const diff = untilTs - now;
    if (diff <= 0) return 'endet bald';
    const s = Math.floor(diff / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div className="relative" ref={ref} onMouseLeave={() => setOpen(false)}>
      <Button
        variant="plain"
        className={`flex items-center text-[15px] sm:text-base lg:text-[17px] font-medium px-2 py-2 rounded-md transition-all duration-200 relative ${
          active || open ? 'text-blue-700 bg-blue-50' : 'text-neutral-700 hover:text-blue-600 hover:bg-neutral-50'
        } ${active ? 'after:absolute after:left-2 after:right-2 after:bottom-1 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#12b3c7] after:to-[#18b364]' : ''}`}
        onMouseEnter={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-current={active? 'page': undefined}
        onKeyDown={onButtonKeyDown}
      >
        {label}
        <svg className="w-4 h-4 ml-1 opacity-70" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/>
        </svg>
      </Button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-12 w-[1100px] max-w-[96vw]">
          <div
            ref={menuRef}
            className="bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200/80 p-0 overflow-hidden"
            role="menu"
            onKeyDown={onMenuKeyDown}
          >
            {/* Kopfzeile */}
            <div className="px-6 pt-5 pb-4 border-b border-neutral-100">
              <div className="text-sm font-semibold text-neutral-900">{label}</div>
            </div>
            <div className="grid grid-cols-12 gap-0">
            {leftRail ? (
              <div className="hidden md:block col-span-4">
                <div className="h-full p-6 bg-neutral-50 border-r border-neutral-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-700">{leftRail.title || 'Aktuell'}</div>
                    {soonestUntil && (
                      <Pill size="xs" variant="soft" color="info">endet in {formatRemaining(soonestUntil)}</Pill>
                    )}
                  </div>
                  <ul className="space-y-1 text-[15px] sm:text-base">
                    {leftRail.items?.map((li) => (
                      <li key={li.label}>
                        <Link to={li.to} onClick={onLinkClick} className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white group">
                          <div className="flex-1">
                            <div className="text-[15px] sm:text-base font-semibold text-neutral-900 group-hover:text-blue-700">{li.label}</div>
                            <div className="text-[12px] sm:text-[13px] text-neutral-500">{li.desc}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {li.badge && (
                              <Pill size="xs" variant="soft" color="info" className="font-medium uppercase tracking-wide">{li.badge}</Pill>
                            )}
                            {li.until && (
                              <span className="text-[10px] text-blue-600">{formatRemaining(new Date(li.until).getTime())}</span>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
            <div className={`col-span-12 ${leftRail ? 'md:col-span-5' : 'md:col-span-7'} grid sm:grid-cols-2 gap-0`}
                 >
              {items.map((it) => (
                <Link key={it.title} to={it.to} onClick={onLinkClick} className="group px-6 py-5 border-b border-neutral-100 hover:bg-neutral-50">
                  <div className="space-y-1">{/* space-y ersetzt mehrere einzelne mt-1 Elemente */}
                    <div className="text-[11px] uppercase tracking-wide text-blue-600 font-semibold">{it.kicker}</div>
                    <div className="text-[16px] sm:text-[17px] font-semibold text-neutral-900">{it.title}</div>
                    <div className="text-[13px] sm:text-[14px] text-neutral-600 leading-relaxed">{it.desc}</div>
                  </div>
                  <div className="mt-3 inline-flex items-center text-blue-700 font-medium text-[13px] sm:text-[14px]">
                    {it.cta}
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 10h8M9 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
            <div className={`col-span-12 ${leftRail ? 'md:col-span-3' : 'md:col-span-5'}`}>
              <div className="relative h-full bg-neutral-100">
                {image && (
                  <img src={image.src} alt={image.alt} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                )}
                {highlight && (
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
                    <div className="text-sm text-blue-300 font-medium">{highlight.kicker}</div>
                    <div className="text-lg font-semibold mt-1">{highlight.title}</div>
                    <div className="text-sm opacity-90 mt-1">{highlight.desc}</div>
                    <Link to={highlight.to} onClick={onLinkClick} className="mt-3 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium text-sm transition-colors">
                      {highlight.cta}
                    </Link>
                  </div>
                )}
              </div>
            </div>
            </div>
            {/* Footerleiste innerhalb des Menüs (optional) */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
              <div className="text-[13px] text-neutral-600">TÜV-zertifiziert • 25 Jahre Garantie • 2.500+ Projekte</div>
              <Link to="/" className="text-[13px] text-blue-700 font-semibold" onClick={onLinkClick}>Preisrechner öffnen →</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
