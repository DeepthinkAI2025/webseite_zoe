"use client";
import * as React from 'react';

interface Options { rootMargin?: string; once?: boolean; threshold?: number; }

export function useReveal<T extends HTMLElement>(opts: Options = {}) {
  const { rootMargin = '0px 0px -10% 0px', once = true, threshold = 0.1 } = opts;
  const ref = React.useRef<T | null>(null);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = ref.current; if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.dataset.revealed = 'true';
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          el.dataset.revealed = 'true';
          if (once) io.disconnect();
        } else if (!once) {
          el.dataset.revealed = 'false';
        }
      });
    }, { root: null, rootMargin, threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, once, threshold]);
  return ref;
}
