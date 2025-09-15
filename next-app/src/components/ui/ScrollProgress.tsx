"use client";
import * as React from 'react';

export const ScrollProgress: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function onScroll() {
      const el = ref.current; if (!el) return;
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const progress = height > 0 ? Math.min(1, scrollTop / height) : 0;
      el.style.setProperty('--progress', progress.toString());
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div aria-hidden ref={ref} className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-transparent">
      <div className="h-full w-full origin-left scale-x-[var(--progress)] bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 transition-[transform] duration-75 will-change-transform" style={{transform: 'scaleX(var(--progress))'}} />
    </div>
  );
};

export default ScrollProgress;
