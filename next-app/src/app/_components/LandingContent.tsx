import React from 'react';
import { QA } from '@/components/gaio/QA';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Section } from '@/components/ui/Section';
import { LandingDynamicBlocks } from './LandingDynamicBlocks';
import { Reveal } from './Reveal';

// Statische Content-Definitionen (Client nötig wegen useReveal Hook weiter unten)
const VALUE_PROPS = [
  { title: 'Planung mit Datenbasis', text: 'String-Layout, Verschattungs- & Ertragsmodelle + Szenarien für Eigenverbrauch & Autarkie.' },
  { title: 'Dokumentierte Qualität', text: 'Checklisten Montage, Messprotokolle & Netzbetreiber-Unterlagen minimieren Fehlerkosten.' },
  { title: 'Wirtschaftlichkeits-Fokus', text: 'Transparente Amortisationsrechnung, Strompreis-Szenarien & modulare Speicher Skalierung.' },
  { title: 'Monitoring & KPI', text: 'RUM Performance + Produktionsdaten für Früherkennung von Ertragseinbußen.' },
  { title: 'Regulatorik & Förderung', text: 'Nullsteuer, Speicherprogramme, regionale Zuschüsse – strukturierte Prüfung.' },
  { title: 'Skalierbare Plattform', text: 'Architektur für Erweiterung (Standorte, Content Hubs, Automations).' }
];
const PROCESS_STEPS = [
  { t: 'Anlagen-Screening', d: 'Dachdaten, Verbrauch, Zielgrößen & erste Wirtschaftlichkeit.', dur: '1–2 Tage', proof: 'Luftbild + Verbrauch', note: 'Remote' },
  { t: 'Technische Planung', d: 'String Design, WR / Speicher Auswahl, Last- & Ertragsszenarien.', dur: '3–5 Tage', proof: 'Simulationsfiles', note: 'Parallel zu Netz' },
  { t: 'Festpreis Angebot', d: 'Transparente Aufschlüsselung inkl. Komponenten & Montage.', dur: '1 Tag', proof: 'Kostenmatrix', note: 'Validiert' },
  { t: 'Netz & Material', d: 'Netzformulare, Reservierung Kernhardware, Terminierung.', dur: '2–4 Wochen', proof: 'Antrags-ID', note: 'Netzabhängig' },
  { t: 'Montage & Elektrik', d: 'DC/AC Installation mit dokumentierter Abnahme.', dur: '2–4 Tage', proof: 'Fotodoku + Messprotokoll', note: 'Vor-Ort' },
  { t: 'Übergabe & Monitoring', d: 'Portal Aktivierung, KPI Tracking, Optimierung.', dur: '1 Tag', proof: 'Dashboard Live', note: 'Go-Live' }
];
const FAQS = [
  { q: 'Wie schnell kann installiert werden?', a: 'Standardprojekte 6–10 Wochen (Netzbetreiber abhängig).', long: 'Vorprüfung, Festpreisfreigabe & Netzprozess laufen teilweise parallel.' },
  { q: 'Speicher jetzt oder später?', a: 'Bei Abendlast / Wärmepumpe / E-Auto direkt sinnvoll – sonst modular nachrüstbar.', long: 'Szenario-Modellierung ohne/mit Speicher sorgt für belastbare Entscheidung.' },
  { q: 'Welche Förderungen 2025?', a: 'Nullsteuer + regionale Speicherprogramme + evtl. KfW.', long: 'Wir prüfen monetären Nutzen vs. Bürokratieaufwand strukturiert.' },
  { q: 'Qualitätssicherung?', a: 'Checklisten Planung/Montage + Messprotokolle + Monitoring.', long: 'Reduziert Fehler, sichert Erträge und vereinfacht späteres Troubleshooting.' }
];
const EXAMPLES = [
  { size: '3 kWp', yield: '2.700–3.100 kWh/a', autarky: '30–40%', storage: 'ohne Speicher / 5 kWh Option', note: 'Ideal für kleinen Haushalt' },
  { size: '8 kWp', yield: '7.200–8.200 kWh/a', autarky: '45–60%', storage: '7–10 kWh', note: 'Typisches Einfamilienhaus' },
  { size: '15 kWp', yield: '13.500–15.300 kWh/a', autarky: '55–70%', storage: '10–15 kWh', note: 'Größerer Verbrauch / WP + EV' }
];
const DIFFERENTIATION = [
  { h: 'Planungstiefe', us: 'String Simulation, Verschattung, Szenarien', std: 'Grobe kWp Ableitung Dachfläche' },
  { h: 'Qualität & Dokumentation', us: 'Checklisten + Messprotokolle', std: 'Teilweise informell / Fotos' },
  { h: 'Monitoring & KPI', us: 'Produktions- & RUM KPI mit Frühwarnung', std: 'Nur Portal-Anzeige' }
];
const GLOSSAR = [
  { term: 'Wirkungsgrad', def: 'Leistungsabgabe relativ zur Einstrahlung (STC).'},
  { term: 'Autarkie', def: 'Anteil Eigennutzung vs. Netzbezug.'},
  { term: 'LiFePO₄', def: 'Thermisch stabile Speicherchemie mit hoher Zyklenzahl.'}
];
const HUBS = [
  { href: '/technology', label: 'Technologie' },
  { href: '/netzanschluss', label: 'Netzanschluss' },
  { href: '/pricing', label: 'Preise' },
  { href: '/standorte', label: 'Standorte' },
  { href: '/anfrage', label: 'Anfrage' }
];
const TOP_CITIES = ['berlin','hamburg','muenchen','frankfurt','koeln','stuttgart'];

export function LandingContent() {

  return (
    <>
      {/* Hero */}
      <Section bleed spacing="xl" className="relative overflow-hidden px-0 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
        <div className="absolute inset-0 opacity-50 dark:opacity-100" style={{background: 'radial-gradient(circle at 20% 30%, rgba(255, 220, 120, 0.15), transparent 40%), radial-gradient(circle at 80% 70%, rgba(34, 197, 94, 0.1), transparent 40%)'}} aria-hidden="true"></div>
        <Reveal as="div" className="relative pt-24 pb-28 md:pt-32 md:pb-40 zo-container text-center" data-animate>
          <div className="max-w-4xl mx-auto">
            <div className="zo-fade-in"><Badge variant="accent" size="sm" className="shadow-xs">Planung, Montage & Monitoring aus einer Hand</Badge></div>
            <h1 className="mt-4 zo-hero-heading text-4xl md:text-6xl font-bold tracking-tighter text-neutral-900 dark:text-neutral-100 zo-fade-in" style={{animationDelay:'100ms'}}>
              Ihre Solaranlage: In 6 Wochen installiert, für 20 Jahre optimiert.
            </h1>
            <p className="mt-6 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto text-neutral-600 dark:text-neutral-300 zo-fade-in" style={{animationDelay:'200ms'}}>
              Wir verwandeln Ihr Dach in ein Kraftwerk. Mit datengestützter Planung, zertifizierten Komponenten und einem transparenten Festpreis. Fordern Sie jetzt Ihre kostenlose Ertragsanalyse an.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 zo-fade-in" style={{animationDelay:'300ms'}}>
              <Button asChild size="lg" variant="primary">
                <a href="/contact">Kostenlose Analyse anfordern</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="backdrop-blur-sm">
                <a href="#prozess">So funktioniert's</a>
              </Button>
            </div>
            <div className="mt-8 text-xs text-neutral-500 dark:text-neutral-400 zo-fade-in" style={{animationDelay:'400ms'}}>
              TÜV-zertifizierte Partner · Festpreisgarantie · Inkl. Förderberatung
            </div>
          </div>
        </Reveal>
      </Section>
      {/* Social Proof / Trust Strip */}
      <section className="py-12 bg-white dark:bg-neutral-900">
        <div className="zo-container text-center">
          <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">Wir arbeiten mit den führenden Herstellern der Branche</p>
          <div className="mt-6 flex justify-center items-center flex-wrap gap-x-8 gap-y-4">
            {['SMA', 'Fronius', 'SolarEdge', 'LG', 'Q-Cells', 'BYD'].map(logo => (
              <div key={logo} className="text-2xl font-medium text-neutral-400 dark:text-neutral-600 grayscale hover:grayscale-0 transition-all">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Kennzahlen Strip */}
      <Section bleed spacing="sm" className="relative bg-neutral-950 text-white px-0">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_35%_25%,rgba(255,195,38,0.18),rgba(255,195,38,0)_55%),radial-gradient(circle_at_75%_70%,rgba(16,185,129,0.22),rgba(16,185,129,0)_60%)]" aria-hidden />
        <div className="relative zo-container grid gap-6 sm:grid-cols-3">
          {[
            {v:'>21%', l:'Modulwirkungsgrad'},
            {v:'6–10 Wochen', l:'Typ. Projektlaufzeit'},
            {v:'6000+ Zyklen', l:'LiFePO₄ Speicher'}
          ].map(k => (
            <div key={k.l} className="zo-kpi-tile">
              <div className="text-2xl font-semibold tracking-tight">{k.v}</div>
              <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-700 dark:text-neutral-300/80">{k.l}</div>
            </div>
          ))}
        </div>
      </Section>
      {/* Pain -> Solution Mapping */}
      <Section spacing="xl" className="relative">
        <div className="mb-14 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Risiken eliminieren – Rendite sichern</h2>
          <p className="mt-5 text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">Wir identifizieren systematisch die typischen Verlust- & Frustquellen in PV-Projekten – und ersetzen sie durch belastbare Modelle, dokumentierte Qualität & Monitoring ab Tag 1. Ergebnis: Weniger Unsicherheit, planbare Amortisation.</p>
        </div>
  <Reveal as="div" data-animate="stagger" className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {/* Karten identisch zu ursprünglicher Version */}
          {[/* ...Mapping Daten (aus Platzgründen hier gekürzt, Logik unverändert) */
            {
              p:'Unklare Wirtschaftlichkeit',
              pain:'Schön gerechnete Angebote, keine Szenarien, unterschätzter Abendlast-Anteil.',
              sol:'Szenario-Engine (ohne/mit Speicher, Strompreissensitivität, Eigenverbrauchsprofil).',
              outcome:'Realistische Amortisationspfade statt Bauchgefühl.',
              badges:['Messbar','Szenarien','Fundiert']
            },
            {
              p:'Verschattungs-Risiko',
              pain:'String falsch verschaltet, partielle Verschattung drückt Gesamtertrag.',
              sol:'String & Verschattungs-Simulation + Layout-Optimierung + Dokumentation.',
              outcome:'Minimierter Minderertrag & weniger Reklamationen.',
              badges:['Simuliert','Optimiert','Dokumentiert']
            },
            {
              p:'Montage-Qualitätsstreuung',
              pain:'Unterschiedliche Teams, fehlende Nachweisführung.',
              sol:'Checklisten + Fotodoku + Messprotokolle (Strangspannung / Isolationsprüfung).',
              outcome:'Revisionssicher & auditierbar.',
              badges:['Prüfbar','Standardisiert','Nachweis']
            },
            {
              p:'Speicher Fehlentscheidung',
              pain:'Blind investiert oder zu spät nachgerüstet.',
              sol:'Peak-/Abendlast Abgleich + modulare Speicher-Skalierung.',
              outcome:'Investition phasenweise optimierbar.',
              badges:['Optional','Skalierbar','Kostenkontrolle']
            },
            {
              p:'Intransparente Preisstruktur',
              pain:'Unklare Komponenten & Margen.',
              sol:'Komponenten-Offenlegung + strukturierte Kostenmatrix.',
              outcome:'Vergleichbarkeit & Vertrauen.',
              badges:['Offen','Vergleichbar','Fair']
            },
            {
              p:'Kein Frühwarn-Monitoring',
              pain:'Ertragsverluste bleiben lange unbemerkt.',
              sol:'Übergabe mit KPI-Dashboard & Abweichungsindikatoren.',
              outcome:'Frühe Fehlererkennung & stabile Rendite.',
              badges:['Live','Frühwarnung','Kontrolle']
            }
          ].map(card => (
            <div key={card.p} className="group relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/70 backdrop-blur-sm shadow-sm hover:shadow-md transition flex flex-col overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500/70 via-amber-400/60 to-emerald-500/70 opacity-60 group-hover:opacity-90 transition" aria-hidden />
              <div className="p-5 flex flex-col gap-4 flex-1">
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">{card.p}</h3>
                  <p className="mt-1 text-[12px] uppercase tracking-wide font-semibold text-red-500">Risiko</p>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{card.pain}</p>
                </div>
                <div className="mt-2 border-l-2 border-emerald-500 pl-3">
                  <p className="text-[12px] uppercase tracking-wide font-semibold text-emerald-600 dark:text-emerald-400">Absicherung</p>
                  <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{card.sol}</p>
                </div>
                <div className="mt-2 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">{card.outcome}</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {card.badges.map(b => (<Badge key={b} variant="neutral">{b}</Badge>))}
                </div>
              </div>
            </div>
          ))}
  </Reveal>
        <div className="mt-14 flex flex-col sm:flex-row items-center gap-4">
          <Button asChild size="lg" variant="primary">
            <a href="/contact" aria-label="Kostenlose Risiko- & Wirtschaftlichkeitsanalyse anfordern">Analyse starten</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="backdrop-blur-sm">
            <a href="#prozess" aria-label="Projektablauf ansehen">Ablauf ansehen</a>
          </Button>
          <div className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Antwort binnen 48h · Keine Vertriebshotline</div>
        </div>
      </Section>
  {/* Testimonials & Lead Mini Form (Client lazy) */}
  <LandingDynamicBlocks />
      {/* Value Props */}
      <Section spacing="xl">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight">Warum ZOE Solar?</h2>
          <p className="mt-4 text-base zo-prose-muted">Differenzierung durch Planungstiefe, dokumentierte Qualität & datengestützte Optimierung – nicht nur Hardware-Verkauf.</p>
        </div>
  <Reveal as="div" data-animate="stagger" className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {VALUE_PROPS.map(v => (
            <div key={v.title} className="zo-card p-6 flex flex-col">
              <h3 className="font-medium mb-2 text-neutral-900 dark:text-neutral-100 tracking-tight">{v.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 flex-1">{v.text}</p>
              <span className="mt-4 inline-flex items-center text-[11px] font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Verified</span>
            </div>
          ))}
  </Reveal>
      </Section>
      {/* Prozess Timeline */}
      <Section id="prozess" bleed spacing="xl" className="bg-neutral-50 dark:bg-neutral-900/30">
  <Reveal as="div" data-animate className="zo-container py-24">
          <div className="mb-12 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Ihr Pfad zur einsatzbereiten Anlage</h2>
            <p className="mt-4 text-sm md:text-base zo-prose-muted">Transparente Phasen mit realistischen Dauern, Nachweisen & parallelen Abläufen – für eine zügige, risikoarme Inbetriebnahme.</p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-5 py-2 shadow-sm text-xs font-medium tracking-wide text-neutral-600 dark:text-neutral-300">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Ø 6–10 Wochen</span>
              <span className="text-neutral-300 dark:text-neutral-600">•</span>
              <span>abhängig Netz & Materiallogistik</span>
            </div>
          </div>
          {/* Horizontale Timeline >= md */}
          <div className="hidden md:block">
            <ol className="relative flex flex-col md:flex-row md:justify-between md:gap-6 list-none after:content-[''] after:absolute after:top-7 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-neutral-200 after:via-neutral-300 dark:after:from-neutral-800 dark:after:via-neutral-700">
              {PROCESS_STEPS.map((s,i) => (
                <li key={s.t} className="relative md:w-full md:max-w-[15rem] flex flex-col pt-14 md:pt-0" itemProp="step" itemScope itemType="https://schema.org/HowToStep">
                  <meta itemProp="position" content={(i+1).toString()} />
                  <div className="absolute md:static left-0 top-0 flex items-center md:flex-col md:items-start">
                    <span className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 shadow-sm text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {i+1}
                    </span>
                  </div>
                  <div className="mt-4 md:mt-6 flex flex-col gap-3 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100" itemProp="name">{s.t}</h3>
                      <Badge variant="accent">{s.dur}</Badge>
                    </div>
                    <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">{s.d}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="neutral">{s.proof}</Badge>
                      <Badge variant="outline">{s.note}</Badge>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          {/* Vertikale Timeline mobil */}
          <div className="md:hidden">
            <ol className="relative list-none">
              {PROCESS_STEPS.map((s,i) => (
                <li key={s.t} className="relative pl-12 pb-10 last:pb-0" itemProp="step" itemScope itemType="https://schema.org/HowToStep">
                  <meta itemProp="position" content={(i+1).toString()} />
                  <span aria-hidden className="absolute left-4 top-0 w-px h-full bg-gradient-to-b from-neutral-300 via-neutral-200 to-transparent dark:from-neutral-700 dark:via-neutral-800" />
                  <span className="absolute -left-1 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 shadow-sm text-xs font-semibold text-neutral-900 dark:text-neutral-100">{i+1}</span>
                  <div className="mt-1 flex flex-col gap-2 bg-white/80 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold tracking-tight" itemProp="name">{s.t}</h3>
                      <Badge variant="accent">{s.dur}</Badge>
                    </div>
                    <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">{s.d}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="neutral">{s.proof}</Badge>
                      <Badge variant="outline">{s.note}</Badge>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-12 text-[11px] text-neutral-500 dark:text-neutral-400 max-w-3xl leading-relaxed">
            Parallelisierung von Netzbeantragung & Feindesign reduziert Wartezeiten. Realistische Bandbreite basiert auf Erfahrungswerten identischer Projektprofile – keine idealisierten Mindestwerte.
          </div>
  </Reveal>
      </Section>
      {/* Beispiele */}
      <Section spacing="xl">
        <div className="mb-14 max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight">Beispielsysteme & Kennzahlen</h2>
          <p className="mt-4 text-sm zo-prose-muted">Orientierungsgrößen – finale Auslegung basiert auf Dachgeometrie, Verbrauch & Zielprofil.</p>
        </div>
  <Reveal as="div" data-animate="stagger" className="grid gap-10 md:grid-cols-3">
          {EXAMPLES.map(ex => (
            <div key={ex.size} className="zo-accent-border p-px rounded-xl">
              <div className="rounded-[inherit] bg-white dark:bg-neutral-900 p-6 h-full flex flex-col shadow-sm">
                <h3 className="font-medium mb-1 tracking-tight text-neutral-900 dark:text-neutral-100">{ex.size}</h3>
                <p className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-3">{ex.note}</p>
                <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1 font-medium">
                  <li className="flex justify-between"><span className="font-normal text-neutral-500 dark:text-neutral-400">Ertrag</span><span>{ex.yield}</span></li>
                  <li className="flex justify-between"><span className="font-normal text-neutral-500 dark:text-neutral-400">Autarkie</span><span>{ex.autarky}</span></li>
                  <li className="flex justify-between"><span className="font-normal text-neutral-500 dark:text-neutral-400">Speicher</span><span>{ex.storage}</span></li>
                </ul>
                <div className="mt-4 text-[10px] tracking-wide uppercase text-emerald-600 dark:text-emerald-400 font-semibold">Skalierbar</div>
              </div>
            </div>
          ))}
  </Reveal>
      </Section>
      {/* Hubs & Städte */}
      <section className="bg-neutral-50 dark:bg-neutral-900/30 py-16">
        <div className="mx-auto max-w-6xl px-6 grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-6">Themen & Bereiche</h2>
            <div className="flex flex-wrap gap-3">
              {HUBS.map(h => <a key={h.href} href={h.href} className="px-4 py-2 rounded-full border text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">{h.label}</a>)}
            </div>
            <div className="mt-6 text-xs text-neutral-500">Vertiefende Inhalte für Technologie, Netzanschluss, Preisstruktur & regionale Abdeckung.</div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-6">Ausgewählte Städte</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {TOP_CITIES.map(c => <a key={c} href={`/standorte/${c}`} className="rounded-md border p-3 hover:bg-white dark:hover:bg-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 dark:border-neutral-800">{c}</a>)}
            </div>
            <div className="mt-4 text-xs text-neutral-500">Weitere Standorte laufend im Ausbau.</div>
          </div>
        </div>
      </section>
      {/* Differenzierung */}
      <section className="zo-container py-24">
        <div className="mb-14 max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight">Unser Ansatz vs. Standard</h2>
          <p className="mt-4 text-sm zo-prose-muted">Transparenter Mehrwert gegenüber typischer Markt-Praxis.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {DIFFERENTIATION.map(r => (
            <div key={r.h} className="zo-card p-5 flex flex-col">
              <h3 className="font-medium mb-3 text-neutral-900 dark:text-neutral-100 tracking-tight">{r.h}</h3>
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-2">ZOE Solar</div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4 flex-1">{r.us}</p>
              <div className="text-[10px] font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-1">Standard</div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{r.std}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Glossar */}
      <section className="bg-neutral-50 dark:bg-neutral-900/30 py-24">
        <div className="zo-container">
          <div className="mb-12 max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight">Kurz Glossar</h2>
            <p className="mt-4 text-sm zo-prose-muted">Mini-Definitionen für schnelle Einordnung.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {GLOSSAR.map(g => (
              <div key={g.term} className="px-5 py-3 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm text-sm flex items-center gap-2">
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{g.term}</span>
                <span className="hidden sm:inline text-neutral-400">·</span>
                <span className="text-neutral-600 dark:text-neutral-400">{g.def}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ */}
      <Section spacing="xl" aria-label="Häufige Kernfragen zu ZOE Solar" data-gaio-block="qa-group">
        <div className="mb-14 max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight">Häufige Fragen (Kurz)</h2>
          <p className="mt-4 text-sm zo-prose-muted">Fokus auf Zeitrahmen, Speicherstrategie, Förderung & Qualitätssicherung.</p>
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          {FAQS.map(f => (
            <QA key={f.q} headingLevel={3} question={f.q} answer={f.a} longAnswer={<p>{f.long}</p>} />
          ))}
        </div>
      </Section>
      {/* CTA Section (unverändert aus Original übernommen) */}
      <Section bleed className="relative text-white overflow-hidden" spacing="xl" aria-label="Projektstart CTA">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,195,38,0.35),rgba(255,195,38,0)_60%),radial-gradient(circle_at_82%_78%,rgba(16,185,129,0.30),rgba(16,185,129,0)_62%),linear-gradient(135deg,#111618,#1c2226_70%,#111618)]" aria-hidden />
        <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] opacity-[0.85] bg-[repeating-linear-gradient(60deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_12px)]" aria-hidden />
        <div className="relative zo-container grid gap-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] items-start">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-[11px] uppercase tracking-wide font-medium text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
              In 48h belastbare Analyse
            </div>
            <h2 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight leading-tight">Jetzt Fundament für 20 Jahre Ertrag legen.</h2>
            <p className="mt-6 text-neutral-300 text-lg leading-relaxed">Statt Bauchgefühl: Simulierte Ertragsspanne, Speicher-Szenarien & wirtschaftlicher Pfad. Dokumentiert, vergleichbar & ohne Verkaufsdruck.</p>
            <ul className="mt-8 text-sm text-neutral-200 space-y-3">
              {[
                'String & Verschattungs-Simulation (Layout + Minderertragsanalyse)',
                'Eigenverbrauchs- & Speicher-Szenarien (phasenweise skalierbar)',
                'Transparente Kostenmatrix + Komponenten-Offenlegung',
                'Qualitäts-Nachweise: Checklisten + Messprotokolle',
                'Frühwarn-Monitoring Onboarding (KPI Dashboard)'
              ].map(point => (
                <li key={point} className="flex gap-3 items-start">
                  <span className="mt-[3px] inline-flex w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 items-center justify-center text-[10px] font-semibold border border-emerald-400/40">✓</span>
                  <span className="leading-relaxed flex-1">{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3 text-[11px] font-medium">
              {['Festpreisgarantie','Keine Call-Center Akquise','Zertifizierte Partner','Datenschutz DSGVO'].map(b => (
                <span key={b} className="px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm tracking-wide text-neutral-200">{b}</span>
              ))}
            </div>
            <div className="mt-8 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm p-5 text-sm text-neutral-200 leading-relaxed">
              <div className="font-semibold text-white mb-1">Rendite-Güte Versprechen</div>
              Sollte der reale Jahresertrag &gt;8% unter dem Modell (klimabereinigt) liegen, erhalten Sie einen kostenfreien Optimierungs- & Fehlerquellen-Check (String, Verschattung, WR-Parametrisierung).
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-[12px] text-neutral-400">
              <a href="/prozess" className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm">Prozess im Detail ansehen</a>
              <a href="/privacy" className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm">Datenschutz</a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-[1px] rounded-[28px] bg-gradient-to-br from-emerald-400/40 via-emerald-600/20 to-transparent blur opacity-40" aria-hidden />
            <div className="relative bg-white dark:bg-neutral-950 rounded-[26px] p-8 shadow-lg border border-neutral-200/60 dark:border-neutral-800/70">
              <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100 tracking-tight">Kostenlose Erstanalyse</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-5">Unverbindlich anfragen – Sie erhalten eine strukturierte Modellierung, keine generische Werbebroschüre.</p>
              {/* LeadMiniForm wird jetzt innerhalb von LandingDynamicBlocks client-seitig geladen */}
              <div className="mt-4 flex flex-col gap-2">
                <div className="text-[11px] text-neutral-500 dark:text-neutral-500 uppercase tracking-wide font-medium">Antwort binnen 48h</div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-500 leading-snug">Mit Absenden stimmen Sie der Verarbeitung Ihrer Angaben zur Kontaktaufnahme zu. Keine Weitergabe an Dritte. Abmeldung jederzeit.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
