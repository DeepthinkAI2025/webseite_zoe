import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { createPageUrl } from "@/utils";
import { buildHreflang } from '@/utils/structuredData';
import { useHreflang } from '@/utils/hreflang';
import { Sun, Phone, Mail, ChevronDown, Menu, X, Zap, Battery, Award, Shield, HomeIcon, CalcIcon, Users, Star, Wrench, Globe, ArrowUp, MessageSquare, MessageCircle, PhoneCall } from '@/components/icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
// Navigation: Schwerere Komponenten (MegaMenu, PrimaryNav) werden lazy geladen
// um initiales Hydration-Budget zu reduzieren. Ein minimalistischer Fallback
// (nur Kernlinks) bleibt sofort interaktiv.
const PrimaryNavLazy = React.lazy(()=> import('@/components/nav/PrimaryNav'));
// MegaMenu wird nur noch innerhalb PrimaryNav dynamisch geladen; direkte Alt-Imports entfernt.
const SiteFooterLazy = React.lazy(()=> import('@/components/footer/SiteFooter').then(m=>({ default: m.SiteFooter })));
const PersonaMemoryDialogLazy = React.lazy(()=> import('@/components/PersonaMemoryDialog'));
const SupportChatDrawer = React.lazy(()=> import('@/components/SupportChatDrawer'));
const ServiceDrawer = React.lazy(()=> import('@/components/ServiceDrawer'));
const PopupBanners = React.lazy(()=> import('@/components/PopupBanners'));
import { usePersona } from '@/context/PersonaContext';
import { prefetchRoute, idleWarmRoutes } from '@/utils/routePrefetch';
import { trackNav, trackFooter, trackVisualLayerActive, measureFps, toggleVariant, getVariant } from '@/utils/tracking';
import ConsentManager from '@/components/ConsentManager';

export default function Layout({ children }) {
  const { persona, setPersona, history: personaHistory, addTurn } = usePersona?.() || {};
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isActive = (path) => location.pathname === createPageUrl(path);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showTopBanner, setShowTopBanner] = useState(true);
  // Hero Scroll Schwellenwert Zustand (fehlte zuvor -> ReferenceError)
  const [afterHero, setAfterHero] = useState(false);
  // Variant (Theme/Experiment) lokaler UI-State für Label
  const [variant, setVariant] = useState(() => (typeof window !== 'undefined' ? getVariant() : 'minimal'));
  const headerRef = useRef(null);
  // Ensure bannerRef is defined
  const bannerRef = useRef(null);
  // Defer non-critical mounts until first interaction or idle
  const [mountDeferred, setMountDeferred] = useState(false);

  // Command palette state
  const [showCmd, setShowCmd] = useState(false);
  const [command, setCommand] = useState('');
  const [cmdIndex, setCmdIndex] = useState(0);
  const [cmdHistory, setCmdHistory] = useState([]);
  const cmdInputRef = useRef(null);

  // Command palette suggestions
  const suggestions = [
    { label: 'Solaranlage Beratung', to: 'Contact', kw: ['beratung', 'kontakt', 'anfrage'] },
    { label: 'Solar-Rechner', to: 'Calculator', kw: ['rechner', 'kosten', 'berechnen'] },
    { label: 'Projekte ansehen', to: 'Projects', kw: ['projekte', 'referenzen', 'beispiele'] },
    { label: 'Technologie erfahren', to: 'Technology', kw: ['technologie', 'module', 'wechselrichter'] },
    { label: 'Preise prüfen', to: 'Pricing', kw: ['preise', 'kosten', 'pakete'] },
    { label: 'Finanzierung', to: 'Financing', kw: ['finanzierung', 'förderung', 'kredit'] },
    { label: 'Service & Wartung', to: 'Service', kw: ['service', 'wartung', 'support'] },
    { label: 'Über uns', to: 'About', kw: ['über', 'unternehmen', 'team'] },
  ];

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const path = location.pathname;
  const locales = React.useMemo(()=> Object.keys(i18n?.options?.resources || { de: {} }), [i18n?.options?.resources]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Defer mount trigger: first user input or idle timeout
  useEffect(() => {
    const trigger = () => setMountDeferred(true);
    if (typeof window !== 'undefined') {
      window.addEventListener('pointerdown', trigger, { once: true, passive: true });
      window.addEventListener('keydown', trigger, { once: true });
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => setMountDeferred(true), { timeout: 2500 });
      } else {
        setTimeout(() => setMountDeferred(true), 2500);
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('pointerdown', trigger);
        window.removeEventListener('keydown', trigger);
      }
    };
  }, []);

  // Initialize command history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('zoe_cmd_history');
      if (stored) setCmdHistory(JSON.parse(stored));
    } catch {}
  }, []);
  useEffect(() => {
    try {
  // Theme-Toggle entfernt – einheitliches Theme ohne data-theme
      
      // Visual layer heuristic (Grain only if fps >= 50)
      measureFps(500).then(fps => {
        const enableGrain = fps >= 50 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!enableGrain) {
          const grainEl = document.querySelector('.film-grain');
          if (grainEl) grainEl.remove();
        }
        trackVisualLayerActive({ grain: enableGrain, cinematicHero: true, warmSections: true, fps: Math.round(fps) });
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Error in layout effect:", e);
    }
  }, []);

  // Idle warm common next routes (network aware) – defer to idle to not compete with LCP
  useEffect(() => {
    const run = () => idleWarmRoutes(['Calculator','Pricing','Contact','Projects','WhyUs']);
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(run, { timeout: 4000 });
      } else {
        setTimeout(run, 4000);
      }
    }
  }, []);

  // Sanfter Scroll-Listener statt IntersectionObserver (vermeidet "Haken")
  useEffect(() => {
    const hero = document.getElementById('start');
    if (!hero) return;
    const compute = () => {
      try {
        const headerH = headerRef.current?.offsetHeight || 0;
        const trigger = hero.offsetTop + hero.offsetHeight - headerH - 60; // 60px Puffer vor Hero-Ende
        const scrolled = window.scrollY >= trigger;
        document.documentElement.setAttribute('data-hero-scrolled', scrolled ? 'true' : 'false');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error in scroll compute:", e);
      }
    };
    window.addEventListener('scroll', compute, { passive: true });
    compute(); // Initial call
    return () => window.removeEventListener('scroll', compute);
  }, []);

  // (duplicate call removed)

  // Sanfter Scroll-Listener statt IntersectionObserver (vermeidet "Haken")
  useEffect(() => {
    const hero = document.getElementById('start');
    if (!hero) return;
    const compute = () => {
      try {
        const headerH = headerRef.current?.offsetHeight || 0;
        const trigger = hero.offsetTop + hero.offsetHeight - headerH - 60; // 60px Puffer vor Hero-Ende
        setAfterHero(window.scrollY >= trigger);
      } catch {}
    };
    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => { window.removeEventListener('scroll', compute); window.removeEventListener('resize', compute); };
  }, []);

  // Load history on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('zoe_cmd_history');
  if (raw) setCmdHistory(JSON.parse(raw));
  const dismissed = localStorage.getItem('zoe_top_banner_dismissed');
  if (dismissed === '1') setShowTopBanner(false);
    } catch {}
  }, []);

  // Allow forcing banner visible via query ?showBanner=1
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get('showBanner') === '1') {
        setShowTopBanner(true);
        localStorage.removeItem('zoe_top_banner_dismissed');
      }
    } catch {}
  }, [location.search]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const setVars = () => {
      const bannerH = bannerRef.current?.offsetHeight || 0;
      const headerH = headerRef.current?.offsetHeight || 0;
      let headerGap = 0;
      try {
        if (headerRef.current) {
          const cs = getComputedStyle(headerRef.current);
          headerGap = parseFloat(cs.marginTop || '0') || 0;
        }
      } catch {}
      document.documentElement.style.setProperty('--zoe-banner-h', `${bannerH}px`);
      document.documentElement.style.setProperty('--zoe-banner-h-half', `${Math.round(bannerH / 2)}px`);
      document.documentElement.style.setProperty('--zoe-header-h', `${headerH}px`);
      document.documentElement.style.setProperty('--zoe-header-gap', `${headerGap}px`);
    };
    setVars();
    let ro1, ro2;
    if ('ResizeObserver' in window) {
      ro1 = new ResizeObserver(setVars);
      ro2 = new ResizeObserver(setVars);
      if (bannerRef.current) ro1.observe(bannerRef.current);
      if (headerRef.current) ro2.observe(headerRef.current);
    } else {
      // fallback: listen to resize
      window.addEventListener('resize', setVars);
    }
    return () => {
      try { ro1?.disconnect(); ro2?.disconnect(); } catch {}
      window.removeEventListener('resize', setVars);
    };
  }, [showTopBanner]);

  const saveHistory = (q) => {
    try {
      if (!q) return;
      const next = [q, ...cmdHistory.filter(x => x !== q)].slice(0, 5);
      setCmdHistory(next);
      localStorage.setItem('zoe_cmd_history', JSON.stringify(next));
    } catch {}
  };

  // Global hotkey: Cmd/Ctrl-K to focus command bar
  useEffect(() => {
    const onKey = (e) => {
      const metaK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
      if (metaK) {
        e.preventDefault();
        setShowCmd(true);
        requestAnimationFrame(() => cmdInputRef.current?.focus());
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filtered = useMemo(() => {
    const q = command.trim().toLowerCase();
    if (!q) return suggestions; // show base suggestions when empty
    return suggestions.filter(s => s.label.toLowerCase().includes(q) || s.kw.some(k => q.includes(k)));
  }, [command]);
  
  const navLinks = [
    { name: t('nav.start'), path: "Home" },
    {
      name: t('nav.why'),
      dropdown: [
        { name: "Unser Versprechen", path: "WhyUs" },
        { name: "Technologie", path: "Technology" },
        { name: "Projekte", path: "Projects" },
        { name: "Über Uns", path: "About" },
      ]
    },
    {
      name: t('nav.info'),
      dropdown: [
        { name: "Preise & Kosten", path: "Pricing" },
        { name: "Finanzierung & Förderung", path: "Financing" },
        { name: "Service & Wartung", path: "Service" },
        { name: "FAQ", path: "Faq" },
      ]
    },
    {
      name: t('nav.exp'),
      dropdown: [
        { name: "Erfolgsgeschichten", path: "SuccessStories" },
        { name: "Solar-Ratgeber", path: "Blog" },
        { name: "Kostenloser Guide", path: "Guide" },
      ]
    },
    { name: t('nav.calc'), path: "Calculator" },
  ];

  // JSON-LD: Organization & WebSite
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ZOE Solar',
    url: origin || 'https://example.com',
    logo: `${origin}/Logo-ZOE.png`,
    sameAs: [
      'https://www.linkedin.com/company/zoe-solar',
      'https://www.instagram.com/zoe.solar',
      'https://www.facebook.com/zoe.solar',
      'https://www.youtube.com/@zoe-solar'
    ]
  };
  const siteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ZOE Solar',
    url: origin || 'https://example.com',
    inLanguage: i18n.resolvedLanguage || 'de',
  };

  return (
    <div className="min-h-screen relative bg-white font-sans">
      {/* Idle Prefetch der Navigation (reduziert Interaktions-Latenz nach First Paint) */}
      <script dangerouslySetInnerHTML={{__html: `
        (function(){
          if (!('requestIdleCallback' in window)) {
            return setTimeout(loadNav, 1200);
          }
          requestIdleCallback(loadNav, { timeout: 1800 });
          function loadNav(){
            if (window.__zoeNavLoaded) return; window.__zoeNavLoaded = true;
            import(/* webpackPrefetch: true */ '/src/components/nav/PrimaryNav.jsx').catch(()=>{});
          }
        })();
      `}} />
      {/* Skip Link for Accessibility (in Landmark) */}
      <nav aria-label="Schnellzugriff">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:border focus:border-neutral-300 focus:rounded-md focus:shadow" tabIndex="0">Zum Inhalt springen</a>
      </nav>
      {/* Background Accent (reduced) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[620px] w-[1000px] rounded-full bg-gradient-to-b from-neutral-100 via-white to-transparent blur-3xl opacity-90" />
      </div>
      <div className="film-grain" aria-hidden />
      <Helmet>
        <link rel="canonical" href={`${origin}${path}`} />
        {/* Hreflang für internationale SEO */}
        {(() => {
          const { getHreflangLinks } = useHreflang();
          return getHreflangLinks(path).map(link => (
            <link key={link.hreflang} rel={link.rel} hreflang={link.hreflang} href={link.href} />
          ));
        })()}
        {/* OpenGraph & Twitter Basis */}
        <meta property="og:site_name" content="ZOE Solar" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={`${(i18n.resolvedLanguage||'de').toLowerCase()}_${(i18n.resolvedLanguage||'DE').toUpperCase()}`} />
        {locales.filter(l => l !== i18n.resolvedLanguage).map(l => (
          <meta key={l} property="og:locale:alternate" content={`${l.toLowerCase()}_${l.toUpperCase()}`} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@zoe_solar" />
        <meta name="twitter:creator" content="@zoe_solar" />
        <script type="application/ld+json">{JSON.stringify(orgLd)}</script>
        <script type="application/ld+json">{JSON.stringify(siteLd)}</script>

        {/* Google Tag Manager - Uncomment and add your GTM ID */}
        {/*
        <script async src="https://www.googletagmanager.com/gtag/js?id=GTM-XXXXXXX"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GTM-XXXXXXX');
          `}
        </script>
        */}

        {/* Google Analytics 4 - Uncomment and add your GA4 ID */}
        {/*
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA-XXXXXXXXXX"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA-XXXXXXXXXX');
          `}
        </script>
        */}

        {/* Facebook Pixel - Uncomment and add your Pixel ID */}
        {/*
        <script>
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'YOUR_PIXEL_ID');
            fbq('track', 'PageView');
          `}
        </script>
        */}

        {/* LinkedIn Insight Tag - Uncomment and add your Partner ID */}
        {/*
        <script type="text/javascript">
          {`
            _linkedin_partner_id = "YOUR_PARTNER_ID";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          `}
        </script>
        <script type="text/javascript">
          {`
            (function(l) {
            if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
            window.lintrk.q=[]}
            var s = document.getElementsByTagName("script")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";b.async = true;
            b.src = "https://snap.licdn.com/li/lms/analytics/insight.min.js";
            s.parentNode.insertBefore(b, s);})(window.lintrk);
          `}
        </script>
        */}
      </Helmet>
  {mountDeferred && (
      <React.Suspense fallback={null}>
        <ConsentManager />
        <ServiceDrawer />
        <PopupBanners />
      </React.Suspense>
  )}

      {/* Top Promo Banner */}
  {showTopBanner && (
  <div ref={bannerRef} role="region" aria-label="Hinweis durchschnittliche Amortisationszeit" className="w-full sticky top-0 z-50 border-b border-neutral-200 bg-white shadow-sm">
  <div className="pro-container py-2 flex flex-wrap items-center gap-4 top-banner text-neutral-700">
  <span className="inline-flex items-center gap-1 text-neutral-600"><span className="hidden md:inline">Konservativ kalkuliert:</span> <strong className="font-medium tracking-tight">Ø 9–11 Jahre Payback</strong></span>
        <span className="hidden md:inline h-4 w-px bg-neutral-300" />
        <Link to={createPageUrl('Calculator')} className="cta-link">Analyse starten</Link>
  <Button variant="plain" onClick={()=>{ setShowTopBanner(false); localStorage.setItem('zoe_top_banner_dismissed','1'); }} className="ml-auto text-neutral-600 hover:text-neutral-800 text-[11px] font-medium tracking-wide uppercase">Schließen</Button>
      </div>
    </div>
  )}

  {/* Header: navbar – beim Scrollen vollbreit und ohne Transparenz */}
  {/* Abstand zum Banner als Spacer, damit Header nicht springt */}
  {/* Enpal-Style: Header-Hintergrund wird beim Einrasten vollflächig weiß */}
  {/* Header: vor dem Scroll (innerhalb Hero) absolut über Bild, danach sticky mit Hintergrund */}
  <header
    role="banner"
    ref={headerRef}
  className={`site-header fixed z-40 left-0 right-0 transition-all duration-300 ${afterHero ? 'bg-white border-b border-neutral-200 shadow-sm' : 'bg-transparent'} ${afterHero ? 'py-2.5' : 'py-2 mt-2'}`}
    style={{ top: 'var(--zoe-banner-h, 0px)' }}
  >
  <div className="pro-container">
  <div className={`flex items-center justify-between w-full gap-4 ${afterHero ? '' : 'rounded-full bg-white border border-neutral-200 shadow-sm'} px-5 sm:px-6 lg:px-7 transition-all duration-300`}> 
            {/* Left: Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 pl-1" aria-label="Startseite – ZOE Solar">
              {/* Logo ist dekorativ, Text daneben liefert Namen => leeres Alt für Screenreader */}
              <img src="/Logo-ZOE.png" alt="" width="28" height="28" className="rounded" aria-hidden="true" />
              <span className="hidden sm:block font-semibold text-neutral-800 logo-text">ZOE Solar</span>
            </Link>

            {/* Center: Nav (desktop) – lazy. Fallback: extrem leichtes Skeleton */}
            <React.Suspense 
              fallback={
                <nav aria-label="Primäre Navigation" className="flex gap-6 text-sm opacity-0 animate-fade-in">
                  <span className="w-16 h-4 rounded bg-neutral-200" />
                  <span className="w-20 h-4 rounded bg-neutral-200" />
                  <span className="w-12 h-4 rounded bg-neutral-200" />
                </nav>
              }
            >
              <PrimaryNavLazy t={t} onCloseMobile={()=> setMobileMenuOpen(false)} />
            </React.Suspense>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* ThemeToggle entfernt */}
              {/* Command-Bar */}
              <div className="hidden lg:flex items-center">
                <div className="relative" onBlur={(e)=>{ if (!e.currentTarget.contains(e.relatedTarget)) setShowCmd(false); }}>
                  <input
                    type="text"
                    placeholder="Frag uns: Speichergröße? Förderung? kWp?"
                    value={command}
                    onChange={(e)=> { setCommand(e.target.value); setShowCmd(true); setCmdIndex(0); }}
                    onKeyDown={(e)=>{
                      if (e.key === 'Enter') {
                        const q = command.trim().toLowerCase();
                        // naive intent routing
                        if (q.includes('kontakt') || q.includes('anfrage') || q.includes('beratung')) {
                          navigate(createPageUrl('Contact') + (q ? `?q=${encodeURIComponent(command)}` : ''));
                        } else if (q.includes('preis') || q.includes('kosten')) {
                          navigate(createPageUrl('Pricing'));
                        } else if (q.includes('förder') || q.includes('finanz')) {
                          navigate(createPageUrl('Financing'));
                        } else if (q.includes('projekt') || q.includes('referenz')) {
                          navigate(createPageUrl('Projects'));
                        } else if (q.includes('service') || q.includes('wartung')) {
                          navigate(createPageUrl('Service'));
                        } else {
                          navigate(createPageUrl('Calculator') + (q ? `?q=${encodeURIComponent(command)}` : ''));
                        }
                        saveHistory(command.trim());
                        setShowCmd(false);
                       } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setShowCmd(true);
                        setCmdIndex((i)=> Math.min(i+1, filtered.length-1));
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setCmdIndex((i)=> Math.max(i-1, 0));
                       } else if (e.key === 'Escape') {
                         setShowCmd(false);
                      } else if (e.key === 'Tab' && showCmd) {
                        e.preventDefault();
                        const s = filtered[cmdIndex];
            if (s) setCommand(s.label);
                      }
                    }}
                    className="w-[260px] px-3 py-1.5 text-sm rounded-full border border-neutral-300 bg-white placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus-visible:focus-ring"
                    ref={cmdInputRef}
                  />
                  <span className="absolute right-2 top-1.5 text-[11px] text-neutral-600">Enter · ⌘/Ctrl K</span>
          {showCmd && (
                    <div className="absolute left-0 right-0 mt-1 rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden z-10">
            {(command.trim() ? filtered : suggestions).map((s, i) => (
                        <Button
                          variant="plain"
                          key={s.label}
                          onMouseDown={(e)=>{ e.preventDefault(); navigate(createPageUrl(s.to)); setShowCmd(false); saveHistory(command.trim()); }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 focus-visible:focus-ring ${i===cmdIndex ? 'bg-neutral-50' : ''}`}
                        >{s.label}</Button>
                      ))}
            {(command.trim() ? filtered : suggestions).length === 0 && (
                        <div className="px-3 py-2 text-sm text-neutral-500">Keine Vorschläge</div>
                      )}
          {!command.trim() && cmdHistory.length > 0 && (
                      <div className="border-t border-neutral-100">
                        <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-neutral-400">Zuletzt gesucht</div>
                        <div className="py-1">
            {cmdHistory.map((h, i) => (
                            <Button variant="plain" key={i} onMouseDown={(e)=>{ e.preventDefault(); setCommand(h); requestAnimationFrame(()=>cmdInputRef.current?.focus()); }} className="w-full text-left px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 focus-visible:focus-ring">{h}</Button>
                          ))}
                        </div>
                      </div>
                    )}
                    </div>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                    className="nav-item font-medium"
                    aria-label={`Sprache ändern (${i18n.resolvedLanguage.toUpperCase()})`}
                  >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:block">{i18n.resolvedLanguage.toUpperCase()}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {locales.map((lng) => (
                    <DropdownMenuItem key={lng} onClick={() => i18n.changeLanguage(lng)}>
                      {lng.toUpperCase()}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to={createPageUrl('Calculator')} onMouseEnter={()=>prefetchRoute('Calculator')} onClick={()=>trackNav('Solarrechner')} className={`hidden sm:inline-flex items-center nav-item border border-neutral-300 ${isActive('Calculator')?'is-active':''}`}>Solarrechner</Link>
              <Button
                variant="plain"
                onClick={()=> {
                  const next = toggleVariant();
                  setVariant(next);
                }}
                className="hidden xl:inline-flex items-center nav-item border border-neutral-300"
                title="Variant umschalten (intern)"
              >{variant === 'type' ? 'Minimal' : 'Typo'}</Button>
              <a href="tel:+49301234567" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm sm:text-[15px] font-semibold rounded-full text-white bg-neutral-900 hover:bg-neutral-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand/50" title="Direkt anrufen" aria-label="Telefonnummer anrufen 030 1234567">
                <Phone className="w-4 h-4" /> 030 1234567
              </a>
              <Button
                variant="plain"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-neutral-100"
                aria-label={mobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
                aria-expanded={mobileMenuOpen ? 'true' : 'false'}
                aria-controls="mobile-navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile overlay menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
            <div id="mobile-navigation" className="absolute top-16 left-0 right-0 mx-4 rounded-2xl border border-neutral-200 bg-white shadow-xl p-4" onClick={(e)=>e.stopPropagation()} role="dialog" aria-label="Navigation">
              <div className="grid grid-cols-1 gap-1">
                {navLinks.map((link, index) => (
                  <div key={index}>
                    {link.dropdown ? (
                      <div className="py-1">
                        <div className="px-3 text-xs sm:text-sm font-semibold text-neutral-500 uppercase tracking-wider">{link.name}</div>
                        <div className="mt-1">
                          {link.dropdown.map((item, idx) => (
                            <Link key={idx} to={createPageUrl(item.path)} onMouseEnter={()=>prefetchRoute(item.path)} onClick={()=>trackNav(item.name)} className="block px-3 py-2 rounded-lg text-sm sm:text-base text-neutral-700 hover:bg-neutral-50">{item.name}</Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link to={createPageUrl(link.path)} onMouseEnter={()=>prefetchRoute(link.path)} onClick={()=>trackNav(link.name)} className="block px-3 py-2 rounded-lg text-sm sm:text-base text-neutral-700 hover:bg-neutral-50">{link.name}</Link>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <Link to={createPageUrl('Calculator')} onClick={()=>trackNav('Rechner')} className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm sm:text-base rounded-lg border border-neutral-300 text-neutral-800 hover:bg-neutral-50">Rechner</Link>
                <Link to={createPageUrl('Contact')} onClick={()=>trackNav('Kontakt')} className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm sm:text-base font-semibold rounded-lg text-white bg-neutral-900 hover:bg-neutral-800">Kontakt</Link>
              </div>
            </div>
          </div>
        )}
  </header>

  {/* Skip-Link sichtbar bei Fokus (in Landmark) */}
  <nav aria-label="Schnellzugriff (Footer)">
    <a href="#main-content" className="skip-link sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] bg-blue-600 text-white px-4 py-2 rounded shadow focus-visible:focus-ring">Zum Inhalt springen</a>
  </nav>

  {/* Hauptinhalt Landmark: genau ein <main> pro Dokument */}
  <main id="main-content" role="main" aria-label="Hauptinhalt" className="min-h-[60vh] outline-none focus:outline-none focus-visible:focus-ring" tabIndex={-1}>
        {children}
      </main>

      {/* Floating Action Buttons */}
  <div className="fixed bottom-6 right-6 z-50 space-y-3" role="complementary" aria-label="Schnellaktionen">
        <Button variant="fab" aria-label="Chat öffnen">
          <MessageCircle className="w-7 h-7" />
        </Button>
  <a href="tel:+49301234567" className="fab-btn focus:outline-none focus-visible:focus-ring" aria-label="Jetzt anrufen">
          <PhoneCall className="w-7 h-7" />
        </a>
        {mountDeferred && (
          <React.Suspense fallback={null}>
            <PersonaMemoryDialogLazy />
          </React.Suspense>
        )}
      </div>

      {/* Global Chat Drawer Mount (deferred) */}
      {mountDeferred && (
        <React.Suspense fallback={null}>
          <SupportChatDrawer />
        </React.Suspense>
      )}

  {/* Footer (deferred) */}
  <React.Suspense fallback={null}>
    <SiteFooterLazy />
  </React.Suspense>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button variant="plain" onClick={scrollToTop} className="fixed bottom-20 right-6 z-50 w-12 h-12 rounded-full bg-neutral-900 text-white shadow-lg flex items-center justify-center hover:bg-neutral-800 transition-colors">
          <ArrowUp className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}

// Persona Memory Dialog – leichter Overlay Dialog für gespeicherte Präferenzen / Mini-Chat
function PersonaMemoryDialog() {
  const { persona, setPersona, history, addTurn, preferences, setPreferences } = usePersona?.() || {};
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  if (!persona) return null;
  const submit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    addTurn?.('user', text);
    // sehr einfacher Intent-Parser für Präferenzen
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
              <Button type="submit" className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold" variant="plain">Speichern</Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// FooterMegaPanel in eigene Datei extrahiert (SiteFooter)
