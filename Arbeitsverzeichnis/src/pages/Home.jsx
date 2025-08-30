import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calculator,
  Shield,
  CheckCircle2,
  Handshake,
  Clock,
  FileCheck,
  Sparkles,
  Star,
  LineChart,
  Crown,
  Info,
  XCircle,
  Phone,
  Calendar,
  AlertCircle,
  Quote,
} from "lucide-react";
import { useTranslation } from 'react-i18next';
const SmartPlannerLazy = React.lazy(() => import('@/components/SmartPlanner')); 

export default function HomePage() {
  const { i18n } = useTranslation();
  const [persona, setPersona] = useState('privat');
  const [variant, setVariant] = useState('a');
  const [showAb, setShowAb] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [offerTier, setOfferTier] = useState('komfort');
  const videoRef = useRef(null);
  const location = useLocation();

  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Photovoltaik-Komplettanlagen',
    description: 'Planung, Lieferung und Montage von Photovoltaik-Anlagen inkl. Speicher und Wallbox zum Festpreis.',
    provider: {
      '@type': 'Organization',
      name: 'ZOE Solar',
      logo: '/Logo-ZOE.png'
    },
    areaServed: 'DE',
    inLanguage: i18n.resolvedLanguage || 'de'
  };

  const sections = useMemo(() => ([
    { id: 'start', label: 'Start' },
    { id: 'mission', label: 'Warum wir' },
    { id: 'problem', label: 'Das Problem' },
    { id: 'beweis', label: 'Beweise' },
    { id: 'ablauf', label: 'Ablauf' },
    { id: 'angebot', label: 'Angebot' },
    { id: 'vergleich', label: 'Vergleich' },
    { id: 'versprechen', label: 'Versprechen' },
    { id: 'schutz', label: 'Sicherheit' },
  { id: 'einwaende', label: 'Einwände' },
    { id: 'faq', label: 'FAQ' },
    { id: 'cta', label: 'Loslegen' },
  ]), []);

  const [activeId, setActiveId] = useState('start');
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  // tiny tracking helper (dataLayer optional)
  const track = (eventName, payload = {}) => {
    try {
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({ event: eventName, ...payload });
      } else {
        // eslint-disable-next-line no-console
        console.debug('[track]', eventName, payload);
      }
    } catch {}
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.5, 1] }
    );
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  // Reveal-on-scroll for elements with .reveal
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const els = Array.from(document.querySelectorAll('.reveal'));
    if (els.length === 0) return;
    const rObs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          rObs.unobserve(e.target);
        }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    els.forEach(el => rObs.observe(el));
    return () => rObs.disconnect();
  }, [location.pathname]);

  // Persona aus URL übernehmen (Deep-Link) und bei Wechsel in der URL halten
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(location.search).get('persona');
    if (p === 'privat' || p === 'gewerbe') setPersona(p);
  const v = new URLSearchParams(location.search).get('variant');
  if (v === 'a' || v === 'b') setVariant(v);
  const ab = new URLSearchParams(location.search).get('ab');
  setShowAb(ab === '1');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handlePersonaChange = (id) => {
  setPersona(id);
  try { track('persona_change', { persona: id }); } catch {}
    try {
      const params = new URLSearchParams(location.search);
      params.set('persona', id);
      navigate({ search: params.toString() }, { replace: true });
    } catch {}
  };

  const handleVariantChange = (id) => {
  setVariant(id);
  try { track('ab_variant_change', { variant: id }); } catch {}
    try {
      const params = new URLSearchParams(location.search);
      params.set('variant', id);
      navigate({ search: params.toString() }, { replace: true });
    } catch {}
  };

  // Scroll-Progress für die Subnav
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const doc = document.documentElement;
          const total = Math.max(1, doc.scrollHeight - window.innerHeight);
          const current = doc.scrollTop;
          setScrollProgress(Math.max(0, Math.min(1, current / total)));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const onPlannerResult = (res) => {
    const params = new URLSearchParams({ kWp: String(res.kWp), storage: String(res.storage), payback: String(res.payback), persona });
    window.location.href = createPageUrl('Contact') + '?' + params.toString();
  };

  // Respect prefers-reduced-motion and set initial state
  useEffect(() => {
    try {
      const m = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduceMotion(!!(m && m.matches));
    } catch {}
  }, []);

  const toggleVideo = () => {
    try {
      const v = videoRef.current;
      if (!v) return;
      if (v.paused) { v.play(); setVideoPaused(false); }
      else { v.pause(); setVideoPaused(true); }
    } catch {}
  };

  // Collect UTM params for lead attribution
  const getUtmParams = () => {
    try {
      const p = new URLSearchParams(location.search);
      const keys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'];
      const utm = {};
      keys.forEach(k => { const v = p.get(k); if (v) utm[k] = v; });
      return utm;
    } catch { return {}; }
  };

  return (
    <div className="bg-white" ref={containerRef}>
      <a href="#start" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-amber-600 focus:text-white focus:px-3 focus:py-2 focus:rounded">Zum Inhalt springen</a>
    <Helmet>
        <title>ZOE Solar – Die Geschichte zu Ihrer unabhängigen Energie</title>
        <meta name="description" content="Die Startseite als klare Story: Problem erkennen, Lösung verstehen, Beweise sehen und sicher anfragen. Photovoltaik zum Festpreis mit 25 Jahren Garantie." />
        <meta property="og:title" content="ZOE Solar – Unabhängigkeit, die sich rechnet" />
        <meta property="og:description" content="Psychologisch optimierte Startseite: von Problem zu Beweis bis Anfrage – klar, modern, überzeugend." />
        <meta property="og:type" content="website" />
  <link rel="canonical" href={(typeof window !== 'undefined' ? window.location.origin : '') + location.pathname} />
  <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
  <link rel="preconnect" href="https://images.unsplash.com" />
  <link rel="preload" as="image" href="/homepage/herosection/energy-1322810_1920%20(1).jpg" />
  <script type="application/ld+json">{JSON.stringify(serviceLd)}</script>
  <style>{`@keyframes logoMarquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }`}</style>
  <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'ZOE Solar', url: typeof window !== 'undefined' ? window.location.origin : 'https://example.com', logo: '/Logo-ZOE.png' })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'ZOE Solar',
          url: typeof window !== 'undefined' ? window.location.origin : undefined,
          image: '/Logo-ZOE.png',
          priceRange: '€€',
          areaServed: 'DE',
          aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '250' }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'PV-Komplettpaket mit Speicher' },
          priceCurrency: 'EUR', price: 'auf Anfrage', availability: 'https://schema.org/LimitedAvailability'
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'Wie realistisch sind die Ertragsprognosen?', acceptedAnswer: { '@type': 'Answer', text: 'Wir rechnen konservativ mit Standortdaten und Verbrauchsprofil. Abweichungen besprechen wir transparent.' }},
            { '@type': 'Question', name: 'Wie schnell geht die Montage?', acceptedAnswer: { '@type': 'Answer', text: 'Nach Freigabe terminieren wir. Vor Ort dauert es meist 1–2 Tage, inkl. Einweisung.' }},
            { '@type': 'Question', name: 'Welche Förderungen sind möglich?', acceptedAnswer: { '@type': 'Answer', text: 'Wir prüfen passende Programme, übernehmen die Beantragung und rechnen sie im Angebot ein.' }}
          ]
        })}</script>
      </Helmet>

      {/* Sanfte Scroll-Indikatoren (rechts, Desktop) */}
  <div className="hidden lg:block fixed right-4 top-1/2 -translate-y-1/2 z-30">
        <nav aria-label="Scroll-Indikatoren" className="flex flex-col gap-2">
          {sections
            .filter(s => ['start','mission','problem','loesung','schnellrechner','beweis','angebot','faq','cta'].includes(s.id))
            .map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                title={s.label}
                aria-current={activeId === s.id ? 'page' : undefined}
                className={`group relative block rounded-full border transition-all ${activeId === s.id ? 'w-2.5 h-2.5 bg-amber-500 border-amber-500 ring-2 ring-amber-300/50' : 'w-2 h-2 bg-gray-300/80 border-white hover:bg-amber-400'}`}
              >
                <span className="sr-only">{s.label}</span>
                <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 whitespace-nowrap text-[13px] sm:text-sm bg-white/95 border border-gray-200 text-gray-800 rounded-full px-2 py-0.5 shadow-sm opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition">{s.label}</span>
              </a>
            ))}
        </nav>
      </div>

      {/* Aktives Abschnitts-Label (Desktop) */}
      <div className="hidden lg:block fixed right-16 top-1/2 -translate-y-1/2 z-30">
        <div className="bg-white/95 border border-gray-200 text-gray-800 rounded-full px-3 py-1 shadow-sm text-[13px] sm:text-sm select-none">
          {sections.find(s => s.id === activeId)?.label || ''}
        </div>
      </div>

      {/* Dezente Scroll-Fortschrittslinie (ohne zweite Menüleiste) */}
      <div className="pointer-events-none fixed top-0 left-0 right-0 z-40 hidden sm:block" aria-hidden="true">
        <div
      className="h-[2px] md:h-[3px] bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 transition-[width] duration-200 rounded-r-full"
          style={{ width: `${Math.round(scrollProgress * 100)}%` }}
        />
      </div>

      {/* Mobile: dezente Bottom-Bar als Scroll-Fortschritt */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 sm:hidden" aria-hidden="true">
        <div
          className="h-[2px] bg-amber-500/80 transition-[width] duration-200"
          style={{ width: `${Math.round(scrollProgress * 100)}%` }}
        />
      </div>

  {/* HERO – Hintergrundbild mit Overlay */}
  <section
        id="start"
        className="relative isolate pb-12 overflow-hidden reveal"
  >
        <div aria-hidden className="absolute inset-0 -z-10">
          <img src="/homepage/herosection/energy-1322810_1920%20(1).jpg" alt="Photovoltaik auf Dach" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
          <div className="grid lg:grid-cols-12 gap-8 xl:gap-14 items-start">
            <div className="lg:col-span-7 max-w-3xl text-center lg:text-left mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 text-gray-900 px-3 py-1 text-xs sm:text-sm font-semibold">
              <Star className="w-4 h-4 text-amber-500"/> 4,9/5 • Festpreis • Fixtermin
            </div>
      <h1 className="mt-5 text-5xl sm:text-6xl font-extrabold tracking-tight text-white">
              {persona==='privat' ? 'Sparen Sie 250–450 € monatlich mit Solar' : 'Sparen Sie 900–1.400 € monatlich mit Solar'}
            </h1>
      <p className="mt-4 text-[19px] sm:text-xl text-white/90 leading-relaxed">
              {persona==='privat'
                ? 'Konservativ gerechnete Ersparnis‑Spannen, Festpreis & Fixtermin schwarz auf weiß. Meistergeführt, sauber umgesetzt.'
                : 'Konservativ gerechnete Ersparnis‑Spannen, Festpreis & Fixtermin schwarz auf weiß. Meistergeführt, sauber umgesetzt.'}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
        className="inline-flex items-center justify-center rounded-md px-6 py-3.5 text-base font-semibold bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-black/20"
                to={createPageUrl('Calculator') + `?persona=${persona}`}
                onClick={()=>track('cta_click',{placement:'hero',action:'calculator',persona})}
              >
                In 30 Sek. {persona==='privat'?'Ersparnis':'ROI'} prüfen
              </Link>
              <Link
        className="inline-flex items-center justify-center rounded-md px-6 py-3.5 text-base font-semibold border border-white/70 text-white/95 hover:bg-white/10 backdrop-blur"
                to={createPageUrl('Contact') + `?persona=${persona}`}
                onClick={()=>track('cta_click',{placement:'hero',action:'contact',persona})}
              >
                15‑Min‑Mini‑Beratung
              </Link>
            </div>
            <div className="mt-3 inline-flex items-center gap-2 text-xs sm:text-sm text-white/90">
              <Calendar className="w-4 h-4"/> {getNextInstallSlotLabel()}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm justify-center lg:justify-start">
              {[{t:'Keine versteckten Kosten'},{t:'Festpreis & Termin schriftlich'},{t:'Meistergeführt'}].map(({t})=> (
                <Pill key={t} icon={CheckCircle2} variant="dark">{t}</Pill>
              ))}
            </div>
            </div>
            {/* Rechte Spalte: Funnel/Rechner im Hero (weiter nach rechts) */}
            <div className="lg:col-span-5 lg:justify-self-end">
              <div className="rounded-2xl bg-white/95 backdrop-blur border border-gray-200 p-4 shadow-lg max-w-lg ml-auto">
                <HeroFunnel persona={persona} onTrack={track} />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Partner/Referenzen – ruhiger Trust‑Strip */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-xs sm:text-sm uppercase tracking-wider text-gray-500 mb-4">Vertraut von</div>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
            {[
              '/homepage/herosection/partnerlogos/1.png',
              '/homepage/herosection/partnerlogos/2.png',
              '/homepage/herosection/partnerlogos/3.png',
              '/homepage/herosection/partnerlogos/4.png',
              '/homepage/herosection/partnerlogos/5.png',
              '/homepage/herosection/partnerlogos/6.png',
              '/homepage/herosection/partnerlogos/7.png',
              '/homepage/herosection/partnerlogos/8.png',
              '/homepage/herosection/partnerlogos/9.png',
              '/homepage/herosection/partnerlogos/10.png',
            ].map((src) => (
              <img
                key={src}
                src={src}
                alt="Partner Logo"
                className="h-10 sm:h-12 grayscale contrast-125 opacity-70 hover:opacity-95 transition"
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
      </div>

  {/* Mission – Conversion-starke Kundenfalle */}
  <section id="mission" className="relative py-24 bg-white bg-grid-slate bg-sun">
        <div className="absolute -z-10 left-[-10%] top-[-40px] w-[420px] h-[420px] rounded-full bg-gray-200/30 blur-3xl" />
        <div className="absolute -z-10 right-[-10%] bottom-[-60px] w-[360px] h-[360px] rounded-full bg-gray-200/20 blur-3xl" />
        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-[17px] md:text-[18px] leading-relaxed content-lg">
          <div className="text-center max-w-2xl mx-auto reveal">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">Unsere Mission: Damit Sie nie wieder zu viel für Strom bezahlen</h2>
            <p className="mt-4 text-xl text-gray-700">Wir schützen Sie vor teuren Fehlentscheidungen – mit klaren Zahlen, verbindlichem Festpreis und sauberer Umsetzung. So rechnet sich Ihre Anlage wirklich und Sie fühlen sich sicher.</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <Pill icon={CheckCircle2} variant="light">Festpreis & Termin schriftlich</Pill>
              <Pill icon={CheckCircle2} variant="light">Meistergeführte Montage</Pill>
              <Pill icon={CheckCircle2} variant="light">Abgestimmt mit Netzbetreiber</Pill>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-8 items-center">
            {/* Textseite */}
            <div className="reveal">
              <div className="card-glass p-6 hover-lift">
                <div className="flex items-center gap-3 text-gray-900 font-semibold text-base sm:text-lg">
                  <span className="icon-pill-amber"><AlertCircle className="w-4 h-4 text-amber-900"/></span>
                  <span>Woran viele scheitern</span>
                </div>
                <ul className="mt-4 space-y-2 text-base sm:text-lg text-gray-700">
                  <li className="flex gap-2"><XCircle className="w-4 h-4 text-gray-700"/>Teure Angebote ohne klare Leistung</li>
                  <li className="flex gap-2"><XCircle className="w-4 h-4 text-gray-700"/>Billigteile, die langfristig teuer werden</li>
                  <li className="flex gap-2"><XCircle className="w-4 h-4 text-gray-700"/>Niemand fühlt sich zuständig nach der Montage</li>
                </ul>
              </div>
              <div className="mt-4 card-glass p-6 hover-lift">
                <div className="flex items-center gap-3 text-gray-900 font-semibold text-base sm:text-lg">
                  <span className="icon-pill-amber"><Shield className="w-4 h-4 text-amber-900"/></span>
                  <span>So schützen wir Sie</span>
                </div>
                <ul className="mt-4 space-y-2 text-base sm:text-lg text-gray-700">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-gray-700"/>Schriftlicher Festpreis & klarer Leistungsumfang</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-gray-700"/>Meistergeführte, dokumentierte Montage</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-gray-700"/>Abstimmung mit Netzbetreiber inklusive</li>
                </ul>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                  <Pill icon={Star} variant="light" size="md">4,9/5 aus 250+ Bewertungen</Pill>
                  <Pill icon={LineChart} variant="light" size="md">Ertragsrechnung vorab</Pill>
                  <Pill icon={FileCheck} variant="light" size="md">Dokumentierte Übergabe</Pill>
                </div>
              </div>
            </div>
            {/* Bildseite */}
            <div className="relative reveal">
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover-lift">
                <img src="/homepage/herosection/Google_AI_Studio_2025-08-29T15_15_13.542Z.png" alt="ZOE Team bei Installation/Abnahme" className="w-full h-[420px] md:h-[360px] object-cover object-center md:object-[center_40%]" loading="lazy" decoding="async" width={1600} height={900} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute -bottom-4 left-4 right-4">
                <div className="rounded-xl bg-white/95 backdrop-blur border border-gray-200 p-3 shadow-sm flex items-center gap-3 hover-lift text-[13px] sm:text-sm">
                  <div className="flex items-center gap-1 text-amber-900"><FileCheck className="w-4 h-4 text-amber-600"/>Abnahme & Einweisung dokumentiert</div>
                  <div className="hidden sm:block w-px h-5 bg-gray-200"/>
                  <div className="text-gray-700">Netzbetreiber-Abstimmung inklusive</div>
                </div>
              </div>
            </div>
          </div>

          {/* Micro-Commit CTA – aufgewertet */}
          <div className="mt-12">
            <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white shadow-sm hover-lift">
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-amber-100/60 blur-3xl" aria-hidden />
              <div className="relative px-5 sm:px-6 py-5">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                  <div className="text-center lg:text-left">
                    <div className="text-base sm:text-lg font-semibold text-gray-900">In 30 Sekunden prüfen, ob es sich für Sie lohnt</div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 justify-center lg:justify-start">
                      <Pill icon={Star} variant="light">4,9/5 aus 250+ Bewertungen</Pill>
                      <Pill icon={FileCheck} variant="light">Ohne Pflichtangaben</Pill>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                          <Link to={createPageUrl('Calculator') + `?persona=${persona}`} data-gtm="mission_micro_commit" onClick={() => track('cta_click', { placement:'mission_cta', action:'calculator', persona })}>
                            <Button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 text-base">
                              <Calculator className="w-5 h-5 mr-2"/>Jetzt kostenlos prüfen
                            </Button>
                          </Link>
                          <a href="#beweis" className="text-base text-amber-700 hover:text-amber-800 underline underline-offset-4">Referenzen ansehen</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* (Auf Wunsch entfernt) FAQ/Einwände-Karten */}
        </div>
      </section>

      

      {/* Sicherheitsnetz / Vertrauen – neu gestaltet */}
  <section id="versprechen" className="relative py-24 bg-gradient-to-b from-white to-amber-50/40 reveal bg-sun">
        {/* dezente Dekoelemente */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-amber-100/50 blur-3xl" />
          <div className="absolute top-20 -right-16 h-48 w-48 rounded-full bg-amber-200/40 blur-3xl" />
        </div>
    <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-[17px] md:text-[18px] leading-relaxed content-lg">
      <div className="text-center max-w-2xl mx-auto">
    <div className="eyebrow">Sicher & planbar</div>
      <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">Ihr Sicherheitsnetz: Klarheit, Qualität, Verantwortung</h2>
      <p className="mt-3 text-xl text-gray-700">Damit Sie sicher entscheiden können – mit Fakten statt Floskeln und einem Prozess, der hält, was er verspricht.</p>
          </div>

      <div className="grid md:grid-cols-3 gap-6 reveal">
    <Card className="card-glass hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
      <span className="icon-pill-amber"><FileCheck className="w-4 h-4 text-amber-900"/></span>
                  <div className="font-semibold text-gray-900">Transparenz</div>
                </div>
                <ul className="mt-4 space-y-2 text-base sm:text-lg text-gray-700">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Festpreis & Leistungsbeschreibung schriftlich</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Nachvollziehbare Ertragsrechnung vorab</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Keine versteckten Zusatzkosten</li>
                </ul>
              </CardContent>
            </Card>
    <Card className="card-glass hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
      <span className="icon-pill-amber"><Shield className="w-4 h-4 text-amber-900"/></span>
                  <div className="font-semibold text-gray-900">Qualität</div>
                </div>
                <ul className="mt-4 space-y-2 text-base sm:text-lg text-gray-700">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Meistergeführte, dokumentierte Montage</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Marken‑Komponenten passend dimensioniert</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Saubere Übergabe inkl. Einweisung</li>
                </ul>
              </CardContent>
            </Card>
    <Card className="card-glass hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
      <span className="icon-pill-amber"><LineChart className="w-4 h-4 text-amber-900"/></span>
                  <div className="font-semibold text-gray-900">Sicherheit</div>
                </div>
                <ul className="mt-4 space-y-2 text-base sm:text-lg text-gray-700">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Netzbetreiber‑Abstimmung inklusive</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Inbetriebnahme mit Protokoll</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Erreichbarer Service statt Hotline‑Pingpong</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Trennlinie */}
          <div className="mt-10 mb-2 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />

          {/* Garantien & Schutz – konkret und überprüfbar */}
      <div className="mt-8 grid md:grid-cols-3 gap-6 reveal">
    <Card className="card-glass hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 font-semibold text-gray-900">
      <span className="icon-pill-amber"><FileCheck className="w-4 h-4 text-amber-900"/></span>
                  Festpreis – was es heißt
                </div>
                <ul className="mt-3 text-base sm:text-lg text-gray-700 space-y-2">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Leistungsumfang schriftlich definiert</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Keine nachträglichen Materialaufschläge</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Änderungswünsche nur mit schriftlicher Freigabe</li>
                </ul>
              </CardContent>
            </Card>
    <Card className="card-glass hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 font-semibold text-gray-900">
      <span className="icon-pill-amber"><Calendar className="w-4 h-4 text-amber-900"/></span>
                  Terminbindung
                </div>
                <ul className="mt-3 text-base sm:text-lg text-gray-700 space-y-2">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Fixtermin schriftlich im Angebot</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Montagefenster 10–14 Tage</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Pro Tag begrenzte Slots – planbar</li>
                </ul>
              </CardContent>
            </Card>
    <Card className="card-glass hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 font-semibold text-gray-900">
      <span className="icon-pill-amber"><Phone className="w-4 h-4 text-amber-900"/></span>
                  Erreichbarer Service
                </div>
                <ul className="mt-3 text-base sm:text-lg text-gray-700 space-y-2">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Fester Ansprechpartner statt Hotline</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Dokumentierte Übergabe & Einweisung</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Auf Wunsch: Monitoring & Wartung</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Klartext-Details – entfernt auf Wunsch */}

          {/* Trust‑Leiste mit starker, aber seriöser CTA */}
          <div className="mt-10 rounded-2xl border border-amber-200 bg-gradient-to-r from-white via-amber-50/60 to-white px-4 sm:px-6 py-5 shadow-sm reveal hover-lift">
            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 justify-between">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-full px-3 py-1"><Star className="w-4 h-4 text-amber-500"/>4,9/5 aus 250+ Bewertungen</span>
                <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-full px-3 py-1"><FileCheck className="w-4 h-4 text-amber-600"/>Keine versteckten Kosten</span>
                <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-full px-3 py-1"><XCircle className="w-4 h-4 text-amber-600"/>Kein Verkaufsdruck</span>
              </div>
              <div className="flex items-center gap-3">
                <Link to={createPageUrl('Calculator') + `?persona=${persona}`} onClick={() => track('cta_click', { placement: 'versprechen', action: 'calculator', persona })}>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white"><Calculator className="w-4 h-4 mr-2"/>In 30 Sekunden prüfen</Button>
                </Link>
                <Link to={createPageUrl('Contact') + `?persona=${persona}`} onClick={() => track('cta_click', { placement: 'versprechen', action: 'contact', persona })}>
                  <Button variant="outline" className="border-amber-200 text-amber-800 hover:bg-amber-50"><Phone className="w-4 h-4 mr-2"/>Erstgespräch</Button>
                </Link>
              </div>
            </div>
            <div className="mt-3 text-center text-xs sm:text-sm text-gray-500">Keine Kaltakquise. Keine Weitergabe an unkontrollierte Subunternehmer.</div>
          </div>
        </div>
      </section>

      {/* Entscheidungs‑Sektion – glasklar & vertrauensbildend */}
    <section id="problem" className="py-24 bg-gradient-to-b from-white to-gray-50 bg-grid-slate">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-[17px] md:text-[18px] leading-relaxed content-lg">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">Entscheidung leicht gemacht – sicher, planbar, schriftlich</h2>
            <p className="mt-3 text-xl text-gray-700">Wir führen Sie in drei klaren Schritten von der ersten Zahl zum umgesetzten Projekt – ohne Verkaufsdruck, ohne Überraschungen.</p>
          </div>
      {/* Slider nach unten verschoben */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="card-glass hover-lift">
              <CardContent className="p-8">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">Schritt 1</div>
                <div className="mt-3 flex items-center gap-2 font-semibold text-gray-900 text-lg"><Calculator className="w-6 h-6 text-gray-700"/>Erste Zahl – konservativ</div>
                <p className="mt-2 text-gray-700">3 Klicks reichen: Wir kalkulieren Ertrag und Ersparnis mit realistischen Annahmen. Keine Pflichtangaben.</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs sm:text-sm">
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-800 rounded-full px-3 py-1"><Clock className="w-3.5 h-3.5 text-gray-700"/>30 Sek.</span>
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-800 rounded-full px-3 py-1"><Info className="w-3.5 h-3.5 text-gray-700"/>Ohne Pflichtangaben</span>
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-800 rounded-full px-3 py-1"><LineChart className="w-3.5 h-3.5 text-gray-700"/>Realistische Annahmen</span>
                </div>
              </CardContent>
            </Card>
            <Card className="card-glass hover-lift">
              <CardContent className="p-8">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">Schritt 2</div>
                <div className="mt-3 flex items-center gap-2 font-semibold text-gray-900 text-lg"><FileCheck className="w-6 h-6 text-gray-700"/>Festpreis & Termin schriftlich</div>
                <p className="mt-2 text-gray-700">Sie erhalten Leistungsbeschreibung, Festpreis und Terminvorschlag – schwarz auf weiß.</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs sm:text-sm">
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-800 rounded-full px-3 py-1"><FileCheck className="w-3.5 h-3.5 text-gray-700"/>Festpreis</span>
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-800 rounded-full px-3 py-1"><Calendar className="w-3.5 h-3.5 text-gray-700"/>Termin schriftlich</span>
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-800 rounded-full px-3 py-1"><XCircle className="w-3.5 h-3.5 text-gray-700"/>Keine versteckten Kosten</span>
                </div>
              </CardContent>
            </Card>
            <Card className="card-glass hover-lift">
              <CardContent className="p-8">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">Schritt 3</div>
                <div className="mt-3 flex items-center gap-2 font-semibold text-gray-900 text-lg"><Shield className="w-6 h-6 text-gray-700"/>Saubere Umsetzung</div>
                <p className="mt-2 text-gray-700">Meistergeführte Montage, Netzbetreiber‑Abstimmung und dokumentierte Übergabe inkl. Einweisung.</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs sm:text-sm">
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-800 rounded-full px-3 py-1"><Crown className="w-3.5 h-3.5 text-gray-700"/>Meistergeführt</span>
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-800 rounded-full px-3 py-1"><Handshake className="w-3.5 h-3.5 text-gray-700"/>Netzbetreiber abgestimmt</span>
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-800 rounded-full px-3 py-1"><FileCheck className="w-3.5 h-3.5 text-gray-700"/>Dokumentierte Übergabe</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-10 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
              <div className="text-base text-gray-800">Starten Sie mit der ersten Zahl – dauert 30 Sekunden</div>
              <Link to={createPageUrl('Calculator') + `?persona=${persona}`} onClick={() => track('cta_click', { placement: 'problem', action: 'calculator', persona })}>
                <Button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 text-base">Jetzt kostenlos prüfen</Button>
              </Link>
              <div className="text-sm text-gray-500">Kein Verkaufsdruck. Keine versteckten Kosten.</div>
            </div>
          </div>
          {/* Testimonial-Slider (nach unten verlegt) */}
          <div className="mt-12">
            <TestimonialsSlider />
          </div>
        </div>
      </section>

  {/* Sektion "loesung" entfernt auf Wunsch */}

  

      {/* Beweis / Social Proof – verkaufsstark gestaltet */}
      <section id="beweis" className="py-24 bg-gradient-to-b from-white to-amber-50/20 bg-sun">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-[17px] md:text-[18px] leading-relaxed content-lg">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-full px-3 py-1 text-xs sm:text-sm font-semibold">Beweise</div>
            <h3 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">Ergebnisse, die überzeugen</h3>
            <p className="mt-2 text-xl text-gray-700">Zahlen, die standhalten. Stimmen aus der Praxis. Standards, die Sie absichern.</p>
          </div>

          {/* Vertrauens-Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-800 rounded-full px-3 py-1"><Star className="w-4 h-4 text-amber-500"/>4,9/5 aus 250+ Bewertungen</span>
            <span className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-800 rounded-full px-3 py-1"><Calendar className="w-4 h-4 text-amber-600"/>98% Termintreue</span>
            <span className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-800 rounded-full px-3 py-1"><Sparkles className="w-4 h-4 text-amber-600"/>2.500+ Installationen</span>
          </div>

          {/* Stat-Kacheln */}
          <div className="mt-10 grid md:grid-cols-3 gap-6 reveal">
            {[{ icon: Sparkles, number: '2.500+', label: 'Installationen' }, { icon: Star, number: '4,9/5', label: 'Kundenzufriedenheit' }, { icon: Calendar, number: '98%', label: 'Termintreue' }].map((s) => (
              <div key={s.label} className="rounded-2xl p-6 card-glass text-center hover-lift">
                <div className="mx-auto mb-3 icon-pill-amber">
                  <s.icon className="w-4 h-4 text-amber-900" />
                </div>
                <div className="text-3xl font-extrabold text-gray-900">{s.number}</div>
                <div className="text-sm text-gray-600 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Cases – mit Mini‑Sparkline als Evidence */}
          <div className="mt-12 grid md:grid-cols-2 gap-6 reveal">
            {[
              {
                title: 'EFH Berlin‑Pankow',
                caption: 'Satteldach Süd/Ost, Speicher 7 kWh',
                points: [1800, 2100, 2300, 2400, 2450],
                kpis: ['8,6 kWp', '80% Autarkie', '≈ 2.450 € /Jahr'],
                note: 'Konservativ gerechnet – Standortdaten + Verbrauchsprofil.'
              },
              {
                title: 'Gewerbe Brandenburg',
                caption: 'Flachdach 60 kWp, Peak‑Lasten gesenkt',
                points: [0, 8, 11, 13, 12],
                kpis: ['ROI 6–7 Jahre', 'Fixtermin', 'Festpreis'],
                note: 'Cashflow aus Eigenverbrauch – ohne Speicherkosten eingerechnet.'
              }
            ].map((c, i) => (
              <div key={i} className="rounded-2xl card-glass p-8 hover-lift">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-gray-900">{c.title}</div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-0.5">{c.caption}</div>
                  </div>
                  <div className="eyebrow">Echte Basiswerte</div>
                </div>
                {/* Sparkline */}
                <div className="mt-4">
                  <MiniSparkline points={c.points} height={40} className="text-emerald-600" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.kpis.map(k => (
                    <span key={k} className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800"><CheckCircle2 className="w-4 h-4 text-emerald-600"/>{k}</span>
                  ))}
                </div>
                <div className="mt-4 text-xs sm:text-sm text-gray-500">{c.note}</div>
              </div>
            ))}
          </div>

          {/* Lead-Magnet CTA innerhalb der Beweis-Sektion */}
          <div className="mt-10 rounded-2xl border border-amber-200 bg-gradient-to-r from-white via-amber-50/60 to-white px-5 py-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 reveal hover-lift">
            <div>
              <div className="text-base font-semibold text-gray-900">Holen Sie sich Ihren Beispiel‑Bericht</div>
              <div className="text-sm text-gray-700">Konservativ gerechnete Ertragsbasis als PDF – in 2 Minuten angefordert.</div>
            </div>
      <div className="flex items-center gap-3">
              <Link to={createPageUrl('Calculator') + `?persona=${persona}`} onClick={() => track('cta_click', { placement: 'beweis', action: 'calculator', persona })}>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 text-base"><Calculator className="w-5 h-5 mr-2"/>Jetzt kostenlos prüfen</Button>
              </Link>
              <Link to={createPageUrl('Contact') + `?persona=${persona}&offer=beispielbericht`} onClick={() => track('cta_click', { placement: 'beweis', action: 'contact', persona })}>
        <Button variant="outline" className="border-amber-200 text-amber-800 hover:bg-amber-50 px-6 py-3 text-base"><FileCheck className="w-5 h-5 mr-2"/>Bericht anfordern</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Ablauf – Projektfahrplan mit klaren Lieferobjekten */}
      <section id="ablauf" className="py-24 bg-gradient-to-b from-amber-50/50 to-white bg-grid-slate">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-[17px] md:text-[18px] leading-relaxed content-lg">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">Ihr persönlicher Projektfahrplan – in ~14 Tagen zur Entscheidung</h2>
            <p className="mt-3 text-xl text-gray-700">Statt Floskeln: konkrete Etappen, klare Dokumente, verbindliche Termine. Transparent, prüfbar, ohne Verkaufsdruck.</p>
          </div>

          <div className="mt-12 grid lg:grid-cols-12 gap-8 items-start">
            {/* Linke Spalte: Etappen als Stepper */}
            <div className="lg:col-span-7">
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-gray-200 via-gray-100 to-transparent" />
                <div className="space-y-6">
                  {[
                    {
                      badge: 'Tag 0–2',
                      icon: FileCheck,
                      title: 'Kickoff & Kurzkonzept (30–45 Min)',
                      desc: 'Anforderungen klären, Dach & Zähler prüfen, Grunddaten erfassen. Ergebnis: belastbares Kurzkonzept als PDF.',
                      chips: ['ohne Pflichtunterlagen', 'digital oder vor Ort', 'erste Ertragsspanne'],
                    },
                    {
                      badge: 'Tag 3–6',
                      icon: LineChart,
                      title: 'Vorprüfung & Wirtschaftlichkeit',
                      desc: 'Standortdaten, Dachanalyse, Förderung/EEG‑Check, Lastprofil‑Indiz. Ergebnis: Ertrags‑ & Amortisationsbasis – konservativ.',
                      chips: ['Standortdaten', 'Förder‑Check', 'konservativ gerechnet'],
                    },
                    {
                      badge: 'Tag 7–10',
                      icon: Calendar,
                      title: 'Festpreisangebot & Terminplan',
                      desc: 'Leistungsbeschreibung, Festpreis, Meilensteine. Ergebnis: Angebot inkl. Fixtermin‑Vorschlag schriftlich.',
                      chips: ['Festpreis schriftlich', 'Terminplan', 'keine versteckten Kosten'],
                    },
                    {
                      badge: 'Tag 11–14',
                      icon: Handshake,
                      title: 'Entscheidung & Reservierung',
                      desc: 'Offene Punkte klären. Auf Wunsch: Komponenten reservieren, Netz‑Voranfrage starten. Ergebnis: Startklar oder To‑do‑Liste.',
                      chips: ['ohne Verpflichtung', 'Option Reservierung', 'Netz vorgeklärt'],
                    },
                  ].map((s, i) => (
                    <div key={s.title} className="relative pl-10 hover-lift">
                      <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center">
                        <s.icon className="w-3.5 h-3.5 text-gray-700" />
                      </div>
                      <div className="inline-flex items-center gap-2 bg-white text-gray-800 border border-gray-200 rounded-full px-3 py-1 text-xs sm:text-sm font-semibold">{s.badge}</div>
                      <h3 className="mt-2 font-semibold text-gray-900">{s.title}</h3>
                      <p className="mt-1 text-sm text-gray-700">{s.desc}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {s.chips.map(c => (
                          <span key={c} className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-800 rounded-full px-3 py-1 text-xs sm:text-sm"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600"/>{c}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA unter dem Stepper */}
              <div className="mt-10">
                <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-amber-200 bg-white px-6 py-5 shadow-sm">
                  <div className="text-base text-gray-800">Fordern Sie Ihren Fahrplan an – kostenlos, in wenigen Minuten startklar.</div>
                  <Link to={createPageUrl('Contact') + `?persona=${persona}`} onClick={() => track('cta_click', { placement: 'ablauf', action: 'contact', persona })}>
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 text-base">Fahrplan anfordern</Button>
                  </Link>
                  <div className="text-sm text-gray-500">Kein Verkaufsdruck. Ergebnisse schriftlich.</div>
                </div>
                <div className="mt-3 text-sm text-gray-500">Hinweis: Zeitangaben sind Richtwerte und abhängig von Projektgröße und Terminen.</div>
              </div>
            </div>

            {/* Rechte Spalte: Was Sie schriftlich bekommen */}
            <div className="lg:col-span-5">
              <Card className="card-glass hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <span className="icon-pill-amber"><Shield className="w-4 h-4 text-amber-900"/></span>
                    <div className="font-semibold text-gray-900">Was Sie schriftlich bekommen</div>
                  </div>
                  <ul className="mt-4 space-y-2 text-base sm:text-lg text-gray-700">
                    <li className="flex gap-2"><FileCheck className="w-4 h-4 text-amber-700"/> Kurzkonzept (PDF) mit Variante(n)</li>
                    <li className="flex gap-2"><LineChart className="w-4 h-4 text-amber-700"/> Ertrags‑ & Amortisationsbasis (konservativ)</li>
                    <li className="flex gap-2"><Calendar className="w-4 h-4 text-amber-700"/> Fixtermin‑Vorschlag mit Meilensteinen</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-700"/> Förder‑Check & nächster Schritt</li>
                    <li className="flex gap-2"><Shield className="w-4 h-4 text-amber-700"/> Festpreisangebot mit Leistungsbeschreibung</li>
                  </ul>
                  <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm">
                    Fair & risikofrei: Keine Verpflichtung. Festpreis vorbehaltlich Vor‑Ort‑Check. Keine versteckten Kosten.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Angebot – Konfigurator mit 3 Paketen und Micro‑Commit */}
  <section id="angebot" className="py-24 bg-gray-50 bg-grid-slate">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-[17px] md:text-[18px] leading-relaxed content-lg">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">{persona==='privat' ? 'Ihr Paket – passend zu Haus & Prioritäten' : 'Ihr Projektpaket – skalierbar & ROI‑stark'}</h2>
            <p className="mt-3 text-xl text-gray-700">Wählen Sie die Richtung – wir rechnen die konkrete Ausprägung konservativ und schriftlich.</p>
          </div>

          {/* Tier Switcher */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {[
              { key: 'smart', label: 'Smart' },
              { key: 'komfort', label: 'Komfort', recommended: true },
              { key: 'premium', label: 'Premium' },
            ].map(t => (
              <div key={t.key} className="relative">
                {t.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-amber-800 bg-amber-100 border border-amber-200 rounded-full px-2 py-0.5">
                    Empfohlen
                  </span>
                )}
                <button
                  onClick={() => setOfferTier(t.key)}
                  className={`px-4 py-2 rounded-full text-sm border ${offerTier===t.key ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                  aria-pressed={offerTier===t.key}
                >{t.label}</button>
              </div>
            ))}
          </div>

          {/* Pakete */}
          <div className="mt-8 grid lg:grid-cols-12 gap-6 items-start">
            {/* Leistungs-Card */}
            <div className="lg:col-span-7">
      <Card className="card-glass reveal hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
        <span className="icon-pill-amber"><Sparkles className="w-4 h-4 text-amber-900"/></span>
                    <div className="font-semibold">{persona==='privat' ? 'Leistung & Ausstattung' : 'Scope & Ausstattung'}</div>
                  </div>
                  <ul className="mt-4 space-y-2 text-base sm:text-lg text-gray-700">
                    {(
                      offerTier==='smart'
                        ? [
                            persona==='privat' ? 'Module + WR, Speicher optional' : 'Module + Strang‑WR, Speicher optional',
                            'Transparente Basis‑Auslegung',
                            'Monitoring & Einweisung',
                            persona==='privat' ? 'Vorbereitung Wallbox' : 'Netz‑/EEG‑Check inklusive',
                          ] : offerTier==='komfort'
                        ? [
                            persona==='privat' ? 'Module, WR, Speicher 5–10 kWh' : 'Module, Strang‑/Zentral‑WR, Lastmanagement',
                            'Optimierte Auslegung inkl. Verschattung',
                            'Monitoring, App, Dokumentation',
                            persona==='privat' ? 'Wallbox optional integriert' : 'Förder‑Check & Antrag',
                          ] : [
                            persona==='privat' ? 'High‑Efficiency Module, Hybrid‑WR, Speicher 10–15 kWh' : 'High‑Efficiency Module, Hybrid/Wechselrichter‑Redundanz',
                            'Detail‑Auslegung inkl. Strings & Statik‑Koordination',
                            'Erweitertes Monitoring & Übergabeprotokoll',
                            persona==='privat' ? 'Wallbox & Notstrom‑Option' : 'EVU‑Abstimmung & PPA‑Option',
                          ]
                    ).map((li) => (
                      <li key={li} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600"/>{li}</li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <Pill variant="light">Festpreis schriftlich</Pill>
                    <Pill variant="light">Konservativ gerechnet</Pill>
                    <Pill variant="light">Keine versteckten Kosten</Pill>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Link to={createPageUrl('Contact') + `?persona=${persona}&tier=${offerTier}`} onClick={() => track('cta_click', { placement: 'angebot', action: 'contact', persona, offerTier })}>
                      <Button className="bg-amber-500 hover:bg-amber-600 text-white">Konkretes Angebot anfordern</Button>
                    </Link>
                    <Link to={createPageUrl('Calculator') + `?persona=${persona}`} onClick={() => track('cta_click', { placement: 'angebot', action: 'calculator', persona, offerTier })}>
                      <Button variant="outline" className="border-amber-200 text-amber-800 hover:bg-amber-50">{persona==='privat'?'Ersparnis prüfen':'ROI prüfen'}</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Zusicherungen */}
            <div className="lg:col-span-5">
        <Card className="card-glass reveal hover-lift">
                <CardContent className="p-6">
          <div className="font-semibold flex items-center gap-2"><span className="icon-pill-amber"><Shield className="w-4 h-4 text-amber-900"/></span>{persona==='privat' ? 'Was fix ist' : 'Was fix zugesichert ist'}</div>
                  <ul className="mt-4 space-y-2 text-base sm:text-lg text-gray-700">
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600"/> Ertrags‑ & Amortisationsbasis (konservativ, schriftlich)</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600"/> Festpreis & Leistungsbeschreibung (keine versteckten Kosten)</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600"/> Terminplan mit Meilensteinen</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600"/> Förder‑Check & Abwicklung</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600"/> Meistergeführte Montage, dokumentierte Übergabe</li>
                  </ul>
                  <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm">
                    Realistisch & fair: Zeitpläne sind Richtwerte. Angebot gilt vorbehaltlich Vor‑Ort‑Check.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Investment‑Framing */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 reveal hover-lift">
            <div className="flex items-center gap-3 text-gray-900"><AlertCircle className="w-6 h-6"/>
              <span className="font-semibold text-lg">Investition als Monatsrate gedacht</span>
            </div>
            <div className="text-base text-gray-800">Richtwert: ab <span className="font-bold">{`€${(persona==='privat'?120:480)}`}</span>/Monat bei typischer Laufzeit. Keine Finanzberatung – Details im Gespräch.</div>
          </div>
        </div>
      </section>

    {/* Vergleich – klare Transparenz statt Marketing */}
  <section id="vergleich" className="py-20 bg-gray-50 reveal bg-grid-slate">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-[17px] md:text-[18px] leading-relaxed content-lg">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 text-center">Transparenz im Vergleich</h2>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-gray-200 bg-white hover-lift">
            <div className="grid grid-cols-3 text-sm font-semibold">
              <div className="px-4 py-3"></div>
              <div className="px-4 py-3 text-gray-900 bg-gray-50 border-l border-gray-200">ZOE Solar</div>
              <div className="px-4 py-3 text-gray-700 border-l border-gray-200">Marktstandard</div>
            </div>
            <div className="divide-y divide-gray-200">
              {[
        { k: 'Ertrags- & Amortisationsbasis', a: 'konservativ & schriftlich', b: 'teils unverbindlich' },
        { k: 'Festpreis mit Leistungsbeschreibung', a: 'fest & transparent', b: 'Zusatzkosten möglich' },
        { k: 'Förderabwicklung', a: 'inklusive', b: 'oft selbst zu erledigen' },
        { k: 'Terminplan', a: 'Fixtermine mit Meilensteinen', b: 'variabel' },
        { k: 'Monitoring & Einweisung', a: 'inklusive', b: 'optional' },
  { k: 'Subunternehmer‑Steuerung', a: 'zentrale Verantwortung, dokumentierte Übergabe', b: 'oft unklare Zuständigkeiten' },
              ].map((row) => (
                <div key={row.k} className="grid grid-cols-3">
                  <div className="px-4 py-3 text-sm text-gray-700">{row.k}</div>
                  <div className="px-4 py-3 border-l border-gray-200">
          <div className="inline-flex items-center gap-2 text-emerald-700"><CheckCircle2 className="w-4 h-4"/> {row.a}</div>
                  </div>
                  <div className="px-4 py-3 border-l border-gray-200">
                    <div className="inline-flex items-center gap-2 text-gray-600"><XCircle className="w-4 h-4"/> {row.b}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

  {/* Sicherheit / Risiko-Umkehr */}
      <section id="schutz" className="py-20 bg-gray-50 bg-grid-slate">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-[17px] md:text-[18px] leading-relaxed content-lg">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { h: 'Festpreis', d: 'Keine versteckten Kosten. Alles schriftlich dokumentiert.', i: Shield },
              { h: 'Qualitätsgarantien', d: 'Bis zu 25 Jahre auf Module und Leistung.', i: CheckCircle2 },
              { h: 'Meisterbetrieb', d: 'Zertifizierte Fachmontage, geprüfte Komponenten.', i: Crown },
            ].map((b) => (
      <div key={b.h} className="rounded-2xl border border-amber-200 p-6 bg-white hover-lift">
                <b.i className="w-6 h-6 text-amber-600" />
                <div className="mt-3 font-semibold text-gray-900">{b.h}</div>
                <p className="mt-1 text-sm text-gray-600">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    {/* Verlustaversion / Dringlichkeit – aber seriös */}
      <section id="nudge" className="py-16 bg-gray-50 bg-grid-slate">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-[17px] md:text-[18px] leading-relaxed">
                   <div className="rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover-lift">
            <div className="text-base text-gray-800">Jeder Monat ohne PV kostet Sie bei einem Preis von 0,34 €/kWh etwa <span className="font-semibold">{persona==='privat' ? '200–300€' : '900–1.400€'}</span> – das ist verlorenes Geld. Wir rechnen Ihnen das exakt vor.</div>
            <Link to={createPageUrl('Calculator') + `?persona=${persona}`} onClick={() => track('cta_click', { placement: 'nudge', action: 'calculator', persona })}><Button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 text-base">Jetzt berechnen</Button></Link>
          </div>
        </div>
      </section>

      {/* FAQ – häufige Fragen */}
  <section id="faq" className="py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-[17px] md:text-[18px] leading-relaxed content-lg">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 text-center">Häufige Fragen</h2>
          <div className="mt-10 grid md:grid-cols-2 gap-5">
            {[
              { q: 'Wie realistisch sind die Ertragsprognosen?', a: 'Wir rechnen konservativ mit Standortdaten und Verbrauchsprofil. Abweichungen besprechen wir transparent – keine Luftschlösser.' },
              { q: 'Wie schnell geht die Montage?', a: 'Nach Freigabe terminieren wir. Vor Ort dauert es meist 1–2 Tage, inkl. Einweisung. Sauber & pünktlich.' },
              { q: 'Welche Förderungen sind möglich?', a: 'Wir prüfen passende Programme, übernehmen die Beantragung und rechnen sie im Angebot ein – ohne Mehraufwand für Sie. Details im Guide „Förderung ohne Stress“.' },
              { q: 'Muss ich vorab zahlen?', a: 'Nein, die Zahlungsmodalitäten sind fair gestaffelt und schriftlich geregelt. Keine versteckten Kosten.' },
              { q: 'Wie läuft die Anmeldung beim Netzbetreiber?', a: 'Wir übernehmen Antrag, Kommunikation und Inbetriebsetzungsprotokolle – Sie müssen nichts tun.' },
              { q: 'Wie wird die Anlage gewartet?', a: 'Monitoring, Sichtprüfung, optionaler Wartungsplan – skalierbar nach Bedarf. Alles inklusive.' },
            ].map((f) => (
              <div key={f.q} className="rounded-2xl border border-gray-200 p-6 bg-white hover-lift">
                <div className="font-semibold text-gray-900 text-lg">{f.q}</div>
                <p className="mt-2 text-base text-gray-700 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Abschluss-CTA */}
      <section id="cta" className="py-24 bg-amber-500 text-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[17px] md:text-[18px] leading-relaxed">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {[{icon:Shield, text:'25 Jahre Garantie'},{icon:FileCheck,text:'Echter Festpreis'},{icon:Handshake,text:'Ohne Druck'},{icon:Crown,text:'Meisterbetrieb'},{icon:Clock,text:'Schnelle Umsetzung'}].map((b,i)=>(
              <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-full px-5 py-2.5 text-base">
                <b.icon className="w-5 h-5"/>{b.text}
              </div>
            ))}
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Starten Sie jetzt – mit klaren Zahlen</h2>
          <p className="mt-3 text-xl opacity-90 max-w-2xl mx-auto">In wenigen Minuten verstehen Sie Ihr Potenzial – konservativ gerechnet, schriftlich dokumentiert. Kein Druck, nur Fakten.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Calculator") + `?persona=${persona}`} onClick={() => track('cta_click', { placement: 'cta', action: 'calculator', persona })}>
              <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-50 font-bold px-12 py-6 text-lg">{persona==='privat' ? 'Ersparnis prüfen' : 'ROI prüfen'}</Button>
            </Link>
            <Link to={createPageUrl("Contact")  + `?persona=${persona}`} onClick={() => track('cta_click', { placement: 'cta', action: 'contact', persona })}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-700 px-12 py-6 text-lg">15‑Min‑Mini‑Beratung</Button>
            </Link>
          </div>
              <div className="flex items-center gap-2 text-base text-amber-800 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 w-full sm:w-auto mx-auto mt-6">
                <Calendar className="w-5 h-5" /> {getNextInstallSlotLabel()}
              </div>
          {/* Inline Lead Form */}
          <LeadForm persona={persona} onTracked={track} />
        </div>
      </section>
      <SmartStickyCTA activeId={activeId} persona={persona} />
    </div>
  );
}

// Inline Lead Form Component (zurück hinzugefügt)
function LeadForm({ persona, onTracked }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !phone) {
      setError('Bitte Name, E‑Mail und Telefon angeben.');
      return;
    }
    try {
      setBusy(true);
      onTracked?.('lead_submit', { placement: 'cta_form', persona });
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message, persona, source: 'cta_section', utm: (typeof window!== 'undefined' ? ( () => { try { const u = new URLSearchParams(window.location.search); const o={}; ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(k=>{const v=u.get(k); if(v) o[k]=v;}); return o; } catch { return {}; } })() : {}) })
      });
      if (!res.ok) throw new Error('Request failed');
      setDone(true);
      try { if (typeof window !== 'undefined' && window.dataLayer) window.dataLayer.push({ event: 'lead_success', persona, placement: 'cta_form' }); } catch {}
    } catch (e) {
      setError('Senden fehlgeschlagen. Bitte später erneut versuchen.');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="mt-10 max-w-2xl mx-auto bg-white text-amber-800 rounded-2xl p-6 text-left">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600"/>
          <div>
            <p className="font-semibold">Danke! Wir melden uns schnellstmöglich.</p>
            <p className="text-sm mt-1 text-amber-900">Unser Team ruft Sie in der Regel binnen 24 Stunden zurück.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-10 max-w-2xl mx-auto bg-white/10 backdrop-blur rounded-2xl p-7 text-left">
      <p className="font-semibold mb-4 text-lg">Oder tragen Sie sich ein – wir melden uns mit einem konkreten Vorschlag. Kein Verkaufsdruck, nur Fakten.</p>
      {error && <div className="mb-4 text-sm bg-red-50 text-red-700 rounded-md px-3 py-2">{error}</div>}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="lead-name" className="text-white/90 text-base">Name</Label>
          <Input id="lead-name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Max Mustermann" className="mt-1 bg-white text-amber-900 placeholder:text-amber-700/60 h-11 text-base" />
        </div>
        <div>
          <Label htmlFor="lead-email" className="text-white/90 text-base">E‑Mail</Label>
          <Input id="lead-email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="max@mail.de" className="mt-1 bg-white text-amber-900 placeholder:text-amber-700/60 h-11 text-base" />
        </div>
        <div>
          <Label htmlFor="lead-phone" className="text-white/90 text-base">Telefon</Label>
          <Input id="lead-phone" type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="0151 2345678" className="mt-1 bg-white text-amber-900 placeholder:text-amber-700/60 h-11 text-base" />
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor="lead-msg" className="text-white/90 text-base">Kurz Ihr Ziel (optional)</Label>
        <Input id="lead-msg" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder={persona==='privat' ? 'z.B. Einfamilienhaus, 5 kWp, Speicher geplant' : 'z.B. Halle, 50 kWp, Lastspitzen senken'} className="mt-1 bg-white text-amber-900 placeholder:text-amber-700/60 h-11 text-base" />
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-white/85">Mit Klick stimmen Sie der Verarbeitung gemäß Datenschutz zu. Wir rufen Sie nur für die Beratung an.</p>
        <Button type="submit" disabled={busy} className="bg-white text-amber-700 hover:bg-amber-50 px-6 py-3 text-base">{busy ? 'Senden…' : 'Rückruf anfordern'}</Button>
      </div>
    </form>
  );
}

// SmartStickyCTA (zurück hinzugefügt)
function SmartStickyCTA({ activeId, persona }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const hide = activeId === 'cta' || y < 200;
      setVisible(!hide);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeId]);
  const msg = persona==='privat' ? 'Sparen Sie 250–450 €/Monat mit Solar' : 'Verdienen Sie mit Solar: ROI kalkulieren';
  if (!visible) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pb-4">
        <div className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border border-amber-200 rounded-2xl shadow-xl p-4 flex items-center justify-between">
          <div className="text-base font-semibold text-amber-800">{msg}</div>
          <div className="flex gap-2">
            <Link to={createPageUrl('Calculator') + `?persona=${persona}`} onClick={() => track('cta_click', { placement: 'sticky', action: 'calculator', persona })}><Button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 text-sm">{persona==='privat'?'Ersparnis prüfen':'ROI prüfen'}</Button></Link>
            <Link to={createPageUrl('Contact') + `?persona=${persona}`}><Button variant="outline" className="border-amber-200 text-amber-800 hover:bg-amber-50 px-4 py-2 text-sm">{persona==='privat'?'Beratung':'Gespräch'}</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// HeroPrompt – Chat-ähnlicher Prompt im Hero
function HeroPrompt({ persona, onTracked }) {
  const [value, setValue] = useState(persona==='privat' ? 'EFH, 220 € Strom/Monat – lohnt Speicher?' : '60 kWp Hallendach – ROI bei 0,28 €/kWh?');
  const navigate = useNavigate();
  const suggestions = persona==='privat'
    ? ['5 kWp – wann amortisiert?', 'Lohnt Speicher bei 4.500 kWh?', 'Wie viel spare ich bei 0,34 €/kWh?']
    : ['ROI bei 60 kWp Halle?', 'Eigenverbrauch vs. Einspeisung?', 'Lastspitzen senken – lohnt Speicher?'];
  const go = (q) => {
    const query = typeof q === 'string' ? q : value;
    onTracked?.('hero_prompt_submit', { value: query, persona });
    navigate(createPageUrl('Calculator') + `?persona=${persona}&q=${encodeURIComponent(query)}`);
  };
  return (
    <div className="mt-3">
      <div className="rounded-full border border-gray-300 bg-white p-1.5 flex items-center gap-2 shadow-sm">
        <input
          value={value}
          onChange={(e)=> setValue(e.target.value)}
          onKeyDown={(e)=> { if (e.key==='Enter') go(); }}
          className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
          placeholder={persona==='privat' ? 'z.B. Dachform, Speicher, Ersparnis…' : 'z.B. ROI, kWp, Lastprofil…'}
          aria-label={persona==='privat' ? 'Frage zur Ersparnis' : 'Frage zum ROI'}
        />
        <Button onClick={()=>go()} className="rounded-full bg-gray-900 hover:bg-black text-white px-4 py-2">
          <Calculator className="w-4 h-4 mr-1"/> Los
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s)=> (
          <button key={s} onClick={()=>go(s)} className="text-xs sm:text-sm rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-700 hover:bg-gray-50">{s}</button>
        ))}
      </div>
    </div>
  );
}

// Kleine Sparkline (SVG) für Evidence in Case-Karten
function MiniSparkline({ points = [], width = 220, height = 40, className = '' }) {
  // Normalisieren auf 0..1, dann in ViewBox skalieren
  if (!points || points.length === 0) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(1, max - min);
  const step = points.length > 1 ? width / (points.length - 1) : width;
  const d = points.map((p, i) => {
    const x = i * step;
    const y = height - ((p - min) / range) * height;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');
  // Fläche unter der Kurve leicht füllen
  const area = `${d} L ${width},${height} L 0,${height} Z`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="block">
      <path d={area} fill="currentColor" className={`${className} opacity-10`} />
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" className={className} />
    </svg>
  );
}

// HeroFunnel – kompakte 3 Schritte mit Sofortergebnis (im Hero rechts)
function HeroFunnel({ persona, onTrack }) {
  const [consumption, setConsumption] = useState(persona==='privat'?4000:30000);
  const [price, setPrice] = useState(0.34);
  const navigate = useNavigate();

  useEffect(()=>{ setConsumption(persona==='privat'?4000:30000); }, [persona]);

  const est = useMemo(()=>{
    const eigen = persona==='privat'?0.7:0.55; // konservative Eigenverbrauchsquote
    const baselineCost = Math.round(consumption * price); // €/Jahr ohne PV
    const baselineCostNeg = -baselineCost; // als negativer Verlust anzeigen
    const savings = Math.round(consumption * eigen * price); // Gewinn/Ersparnis pro Jahr
    return { eigen, baselineCostNeg, savings };
  }, [persona, consumption, price]);

  return (
    <div>
      <div className="text-sm font-semibold text-gray-900">In 30 Sekunden zu Ihrer Zahl</div>
      <div className="mt-3 space-y-3">
        {/* Verbrauch */}
        <div className="rounded-xl border border-gray-200 p-3">
          <div className="text-sm font-medium text-gray-900">Verbrauch</div>
          <div className="mt-2 flex items-center gap-2">
            <input type="range" min={persona==='privat'?2000:10000} max={persona==='privat'?12000:150000} step={persona==='privat'?100:1000} value={consumption} onChange={(e)=> setConsumption(parseInt(e.target.value))} className="flex-1" />
            <div className="text-xs sm:text-sm text-gray-700 w-24 text-right">{consumption.toLocaleString('de-DE')} kWh</div>
          </div>
        </div>
        {/* Strompreis */}
        <div className="rounded-xl border border-gray-200 p-3">
          <div className="text-sm font-medium text-gray-900">Strompreis</div>
          <div className="mt-2 flex items-center gap-2">
            <input type="range" min={0.20} max={0.60} step={0.01} value={price} onChange={(e)=> setPrice(parseFloat(e.target.value))} className="flex-1" />
            <div className="text-xs sm:text-sm text-gray-700 w-24 text-right">{price.toFixed(2)} €/kWh</div>
          </div>
        </div>
      </div>
    {/* Sofortergebnis: Kosten/Gewinn-Vergleich */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-gray-200 p-3 text-center">
          <div className="text-sm text-gray-600 inline-flex items-center justify-center gap-1">
            Stromkosten/Jahr ohne PV
            <Info className="w-3.5 h-3.5 text-gray-500" title={`Verbrauch × Strompreis • als Verlust dargestellt`} />
          </div>
          <div className="text-xl font-extrabold text-gray-900">{est.baselineCostNeg.toLocaleString('de-DE')} €</div>
        </div>
        <div className="rounded-lg border border-gray-200 p-3 text-center">
          <div className="text-sm text-gray-600 inline-flex items-center justify-center gap-1">
            Gewinn/Jahr mit Solaranlage
            <Info className="w-3.5 h-3.5 text-gray-500" title={`Verbrauch × Eigenverbrauch (~${Math.round(est.eigen*100)}%) × Strompreis • konservativ`} />
          </div>
          <div className="text-xl font-extrabold text-emerald-700">+{est.savings.toLocaleString('de-DE')} €</div>
        </div>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <Button onClick={()=> navigate(createPageUrl('Calculator') + `?persona=${persona}&kwh=${consumption}&price=${price}`)} className="bg-gray-900 hover:bg-black text-white">Zum detaillierten Rechner</Button>
        <Button variant="outline" className="border-gray-300" onClick={()=> navigate(createPageUrl('Contact') + `?persona=${persona}`)}>Ergebnis besprechen</Button>
      </div>
      <div className="mt-2 text-[11px] text-gray-500">Konservativ gerechnet. Kein Verkauf, nur Orientierung.</div>
    </div>
  );
}

// (ehem. GuideSignup entfernt)

// AnimatedNumber Component
function AnimatedNumber({ value, duration = 900, formatter = (n) => n.toString() }) {
  const [display, setDisplay] = useState(0);
  const start = useRef(0);
  const raf = useRef(0);
  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const begin = performance.now();
    const from = display;
    const to = value;
    if (raf.current) cancelAnimationFrame(raf.current);
    if (reduce) {
      setDisplay(Math.round(to));
      return () => {};
    }
    const step = (now) => {
      const p = Math.min(1, (now - begin) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <>{formatter(display)}</>;
}

// RotatingWords – kleine Headline-Microanimation
function RotatingWords({ words = [], interval = 1800 }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!words.length) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words, interval]);
  return <span aria-live="polite" className="inline-block">{words[i]}</span>;
}

// Pill kommt nun global aus components/ui/pill

// Verfügbarkeits-Label: Liefer-/Montagefenster (psychologisch besser: Knappheit + Planbarkeit)
function getNextInstallSlotLabel() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() + 10); // Earliest realistic window start
  const end = new Date(now);
  end.setDate(now.getDate() + 14); // Window end
  const fmt = (d) => d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  // Leichte “Scarcity”-Formulierung ohne Druck
  return `Liefer-/Montagefenster in ${Math.max(1, Math.round((start - now)/86400000))}–${Math.max(1, Math.round((end - now)/86400000))} Tagen · Täglich 2 freie Slots`;
}

// Testimonials Slider – menschlich & locker, aus Berlin/Brandenburg
function TestimonialsSlider() {
  const items = useMemo(() => ([
    {
      quote: 'Unsere Stromrechnung ist endlich entspannt. Die Jungs haben sauber gearbeitet und nichts beschönigt – genau so wollten wir das.',
      name: 'Familie M., Potsdam (Brandenburg)',
      meta: '9,8 kWp mit Speicher, Inbetriebnahme 05/2025'
    },
    {
      quote: 'Kein Blabla, sondern klare Zahlen. Termin wurde gehalten, Dach war nach zwei Tagen fertig – top organisiert.',
      name: 'Miriam M., Berlin-Pankow',
      meta: '8,2 kWp, ohne Speicher, Inbetriebnahme 04/2025'
    },
    {
      quote: 'Wir hatten Respekt vor dem Aufwand. Am Ende lief’s geräuschlos – inklusive Netzbetreiberkram. Danke!',
      name: 'Jonas M., Teltow (Brandenburg)',
      meta: '11,4 kWp mit Speicher, Inbetriebnahme 06/2025'
    },
    {
      quote: 'Preis stand, Termin stand, am Ende gab’s eine ordentliche Einweisung. So macht man das.',
      name: 'Sven K., Berlin-Köpenick',
      meta: '7,6 kWp, Inbetriebnahme 05/2025'
    },
  ]), []);

  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [items.length, paused]);

  const current = items[i];
  const go = (dir) => setI((v) => (v + (dir === 'next' ? 1 : items.length - 1)) % items.length);
  return (
    <div className="mt-8" role="region" aria-label="Kundenstimmen" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="mx-auto max-w-3xl">
        <div className="relative rounded-2xl border border-amber-200 bg-white/90 backdrop-blur p-6 shadow-sm">
          <Quote className="w-6 h-6 text-amber-600 absolute -top-3 -left-3 bg-amber-50 border border-amber-200 rounded-full p-1"/>
          <p className="text-base text-gray-800">“{current.quote}”</p>
          <div className="mt-3 text-sm font-semibold text-gray-900">{current.name}</div>
          <div className="text-xs sm:text-sm text-gray-600">{current.meta}</div>
          <div className="mt-4 flex items-center gap-1">
            {items.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Testimonial ${idx+1} anzeigen`}
                onClick={() => setI(idx)}
                className={`h-1.5 w-6 rounded-full ${idx===i ? 'bg-amber-600' : 'bg-gray-200'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}
              />
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
            <button aria-label="Vorheriges Testimonial" onClick={() => go('prev')} className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 border border-amber-200 text-amber-800 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">‹</button>
            <button aria-label="Nächstes Testimonial" onClick={() => go('next')} className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 border border-amber-200 text-amber-800 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}



