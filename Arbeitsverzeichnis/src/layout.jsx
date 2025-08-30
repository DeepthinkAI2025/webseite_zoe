import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { createPageUrl } from "@/utils";
import { Sun, Phone, Mail, ChevronDown, Menu, X, Zap, Battery, Award, Shield, Home as HomeIcon, Calculator as CalcIcon, Users, Star, Settings, Wrench, Globe, Facebook, Twitter, Instagram, Linkedin, ArrowUp } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import MegaMenu from "@/components/nav/MegaMenu";
import { MessageCircle, PhoneCall } from "lucide-react";
import SupportChatDrawer from "@/components/SupportChatDrawer";
import ServiceDrawer from "@/components/ServiceDrawer";
import PopupBanners from "@/components/PopupBanners";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isActive = (path) => location.pathname === createPageUrl(path);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [afterHero, setAfterHero] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [command, setCommand] = useState("");
  const [showCmd, setShowCmd] = useState(false);
  const [cmdIndex, setCmdIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [showTopBanner, setShowTopBanner] = useState(true);
  const bannerRef = useRef(null);
  const headerRef = useRef(null);
  const cmdInputRef = useRef(null);
  const suggestions = [
    { label: 'Kontakt aufnehmen', to: 'Contact', kw: ['kontakt','beratung','anfrage','telefon'] },
    { label: 'Preise & Kosten', to: 'Pricing', kw: ['preise','kosten','angebot'] },
    { label: 'Finanzierung & Förderung', to: 'Financing', kw: ['förder','finanz'] },
    { label: 'Projekte & Referenzen', to: 'Projects', kw: ['projekt','referenz'] },
    { label: 'Service & Wartung', to: 'Service', kw: ['service','wartung'] },
    { label: 'Ersparnis/ROI Rechner', to: 'Calculator', kw: ['rechner','ersparnis','roi','kwp'] },
  ];
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const path = location.pathname;
  const locales = ['de','en','fr','es'];
  const buildHrefWithLng = (lng) => {
    if (typeof window === 'undefined') return `${origin}${path}`;
    const url = new URL(window.location.href);
    url.searchParams.set('lng', lng);
    return url.toString();
  };

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

  // Hero-Ende beobachten, um Header-Layout zu wechseln
  useEffect(() => {
    const hero = document.getElementById('start');
    if (!hero) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setAfterHero(!entry.isIntersecting),
      { root: null, threshold: 0, rootMargin: '-1px 0px 0px 0px' }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Load history on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('zoe_cmd_history');
      if (raw) setHistory(JSON.parse(raw));
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
      const next = [q, ...history.filter(x => x !== q)].slice(0, 5);
      setHistory(next);
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
      {/* Subtle global background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute top-40 -right-24 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
      </div>
      <Helmet>
        <link rel="canonical" href={`${origin}${path}`} />
        {locales.map(l => (
          <link key={l} rel="alternate" hrefLang={l} href={buildHrefWithLng(l)} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`${origin}${path}`} />
        <script type="application/ld+json">{JSON.stringify(orgLd)}</script>
        <script type="application/ld+json">{JSON.stringify(siteLd)}</script>
      </Helmet>
      <ServiceDrawer />
  <PopupBanners />

      {/* Top Promo Banner */}
  {showTopBanner && (
    <div ref={bannerRef} className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
            <div className="text-sm sm:text-base md:text-[17px] font-medium leading-snug">
              <span className="hidden sm:inline">Jeder Monat ohne PV kostet bei 0,34 €/kWh rund 200–300 €.</span>{' '}
              <span className="font-semibold">Jetzt Angebot sichern und sparen.</span>
            </div>
            <div className="flex items-center gap-2">
              <Link to={createPageUrl('Calculator')} className="hidden sm:inline-flex items-center rounded-full bg-white/10 hover:bg-white/20 px-3 py-1 text-sm sm:text-base">
                Jetzt prüfen
              </Link>
            </div>
          </div>
        </div>
      )}

  {/* Header: navbar – beim Scrollen vollbreit und ohne Transparenz */}
  {/* Abstand zum Banner als Spacer, damit Header nicht springt */}
  {/* Enpal-Style: Header-Hintergrund wird beim Einrasten vollflächig weiß */}
  {!afterHero && <div style={{height:24}} aria-hidden="true"></div>}
  <header ref={headerRef} className={`sticky z-40 transition-colors duration-300 ${afterHero ? 'bg-white border-b border-gray-200 shadow-sm' : 'bg-transparent'}`} style={{ top: 'var(--zoe-banner-h, 0px)' }}>
    <div className={`${afterHero ? 'max-w-none px-0' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} transition-all duration-300`}>
      <div className={`flex items-center justify-between ${afterHero ? '' : 'rounded-full bg-white/70 backdrop-blur border border-gray-200/60 shadow-sm'} ${afterHero ? '' : 'border'} px-3 sm:px-4 py-3 w-full transition-all duration-300`}>
            {/* Left: Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 pl-1">
              <img src="/Logo-ZOE.png" alt="ZOE Solar" width="28" height="28" className="rounded" />
              <span className="hidden sm:block font-semibold text-gray-800">ZOE Solar</span>
            </Link>

            {/* Center: Nav (desktop) */}
            <nav className="hidden md:flex items-center gap-1">
              {/* Primary Mega Menu entry */}
              <MegaMenu
                label={t('nav.why')}
                onLinkClick={() => setMobileMenuOpen(false)}
                leftRail={{
                  title: 'Schnelleinstieg',
                  items: [
                    { label: 'Warum ZOE', desc: 'Unser Versprechen – fair und schriftlich', to: createPageUrl('WhyUs'), badge: 'Neu' },
                    { label: 'Technologie', desc: 'Komponenten & Auslegung', to: createPageUrl('Technology') },
                    { label: 'Projekte', desc: 'Referenzen aus der Praxis', to: createPageUrl('Projects') },
                  ]
                }}
                items={[
                  { kicker: 'Kaufentscheidung', title: 'Festpreis & Fixtermin', desc: 'Was heißt Festpreis bei uns wirklich?', cta: 'Mehr erfahren', to: createPageUrl('WhyUs') },
                  { kicker: 'Technik', title: 'PV + Speicher richtig dimensionieren', desc: 'Konservativ gerechnet statt Schönwetter.', cta: 'Zur Technologie', to: createPageUrl('Technology') },
                  { kicker: 'Service', title: 'Wartung & Monitoring', desc: 'Dokumentierte Übergabe & echter Support.', cta: 'Zum Service', to: createPageUrl('Service') },
                  { kicker: 'Rechner', title: 'Ersparnis/ROI in 30 Sek.', desc: 'Spanne statt Wunschzahl, ohne Pflichtfelder.', cta: 'Rechner öffnen', to: createPageUrl('Calculator') },
                ]}
                image={{ src: '/homepage/herosection/photovoltaic-8156008_1920.jpg', alt: 'PV-Anlage' }}
                highlight={{ kicker: 'Start', title: 'In 30 Sek. zur Solarsparzahl', desc: 'Konservativ gerechnet. Ohne Druck.', cta: 'Jetzt prüfen', to: createPageUrl('Calculator') }}
              />
              {/* Short links as pills */}
              <Link to={createPageUrl('Blog')} className="px-3 py-1.5 text-[15px] sm:text-base lg:text-[17px] text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100 inline-block">Ratgeber</Link>
              <Link to={createPageUrl('Pricing')} className="px-3 py-1.5 text-[15px] sm:text-base lg:text-[17px] text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100 inline-block">Preise</Link>
              <Link to={createPageUrl('Projects')} className="px-3 py-1.5 text-[15px] sm:text-base lg:text-[17px] text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100 inline-block">Projekte</Link>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
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
                    className="w-[260px] px-3 py-1.5 text-sm rounded-full border border-gray-300 bg-white/70 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    ref={cmdInputRef}
                  />
                  <span className="absolute right-2 top-1.5 text-[11px] text-gray-400">Enter · ⌘/Ctrl K</span>
          {showCmd && (
                    <div className="absolute left-0 right-0 mt-1 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-10">
            {(command.trim() ? filtered : suggestions).map((s, i) => (
                        <button
                          key={s.label}
                          onMouseDown={(e)=>{ e.preventDefault(); navigate(createPageUrl(s.to)); setShowCmd(false); saveHistory(command.trim()); }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${i===cmdIndex ? 'bg-gray-50' : ''}`}
                        >{s.label}</button>
                      ))}
            {(command.trim() ? filtered : suggestions).length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">Keine Vorschläge</div>
                      )}
            {!command.trim() && history.length > 0 && (
                      <div className="border-t border-gray-100">
                        <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-gray-400">Zuletzt gesucht</div>
                        <div className="py-1">
                          {history.map((h, i) => (
                            <button key={i} onMouseDown={(e)=>{ e.preventDefault(); setCommand(h); requestAnimationFrame(()=>cmdInputRef.current?.focus()); }} className="w-full text-left px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">{h}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    </div>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-2 px-2.5 py-1.5 text-[15px] sm:text-base lg:text-[17px] text-gray-700 rounded-full hover:bg-gray-100">
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
              <Link to={createPageUrl('Calculator')} className="hidden sm:inline-flex items-center px-3 py-1.5 text-[15px] sm:text-base lg:text-[17px] rounded-full border border-gray-300 text-gray-800 hover:bg-gray-100">
                Solarrechner
              </Link>
              <Link to={createPageUrl('Contact')} className="inline-flex items-center px-3 sm:px-4 py-1.5 text-[15px] sm:text-base lg:text-[17px] font-semibold rounded-full text-white bg-amber-600 hover:bg-amber-700">
                <Phone className="w-4 h-4 mr-1.5" /> Kontakt
              </Link>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-full hover:bg-gray-100">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile overlay menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
            <div className="absolute top-16 left-0 right-0 mx-4 rounded-2xl border border-gray-200 bg-white shadow-xl p-3" onClick={(e)=>e.stopPropagation()}>
              <div className="grid grid-cols-1 gap-1">
                {navLinks.map((link, index) => (
                  <div key={index}>
                    {link.dropdown ? (
                      <div className="py-1">
                        <div className="px-3 text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">{link.name}</div>
                        <div className="mt-1">
                          {link.dropdown.map((item, idx) => (
                            <Link key={idx} to={createPageUrl(item.path)} className="block px-3 py-2 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-50">{item.name}</Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link to={createPageUrl(link.path)} className="block px-3 py-2 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-50">{link.name}</Link>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Link to={createPageUrl('Calculator')} className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm sm:text-base rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50">Rechner</Link>
                <Link to={createPageUrl('Contact')} className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm sm:text-base font-semibold rounded-lg text-white bg-amber-600 hover:bg-amber-700">Kontakt</Link>
              </div>
            </div>
          </div>
        )}
      </header>

  <main className="min-h-[60vh]">
        {children}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 space-y-3">
        <button className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
          <MessageCircle className="w-7 h-7" />
        </button>
        <Link to={createPageUrl('Contact')} className="w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors">
          <PhoneCall className="w-7 h-7" />
        </Link>
      </div>

      {/* Global Chat Drawer Mount */}
      <SupportChatDrawer />

      {/* Footer – minimalistisch */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 content-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/Logo-ZOE.png" alt="ZOE" width="24" height="24" className="rounded" />
              <span className="text-sm sm:text-base text-gray-600">&copy; {new Date().getFullYear()} ZOE Solar GmbH</span>
            </div>
            <nav className="flex items-center gap-3 text-base sm:text-lg text-gray-700">
              <Link to={createPageUrl('Pricing')} className="hover:text-gray-900">Preise</Link>
              <Link to={createPageUrl('Projects')} className="hover:text-gray-900">Projekte</Link>
              <Link to={createPageUrl('Blog')} className="hover:text-gray-900">Ratgeber</Link>
              <Link to={createPageUrl('Contact')} className="hover:text-gray-900">Kontakt</Link>
              <span className="mx-2 h-4 w-px bg-gray-300 hidden sm:inline-block" />
              <Link to={createPageUrl('Imprint')} className="hover:text-gray-900">Impressum</Link>
              <Link to={createPageUrl('Privacy')} className="hover:text-gray-900">Datenschutz</Link>
            </nav>
            <div className="flex items-center gap-3 text-gray-500">
              <a href="#" aria-label="Facebook" className="hover:text-gray-700"><Facebook className="w-4 h-4"/></a>
              <a href="#" aria-label="Instagram" className="hover:text-gray-700"><Instagram className="w-4 h-4"/></a>
              <a href="#" aria-label="Twitter" className="hover:text-gray-700"><Twitter className="w-4 h-4"/></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-gray-700"><Linkedin className="w-4 h-4"/></a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-20 right-6 z-50 w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
