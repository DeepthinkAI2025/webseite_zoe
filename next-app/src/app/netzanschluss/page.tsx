import { Metadata } from 'next';
import React from 'react';
import providers from '@/content/netzbetreiber.json';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Netzanschluss & Anmeldung Photovoltaik, Speicher, Wallbox – Übersicht & Ablauf',
  description: 'Schritt-für-Schritt Leitfaden: Netzanschluss-Anmeldung für PV-Anlagen, Speicher, Wallbox & Zählerwechsel. Typische Bearbeitungszeiten & Netzbetreiber Portale.',
  alternates: { canonical: '/netzanschluss' }
};

function buildHowToJsonLd(){
  return {
    '@context':'https://schema.org',
    '@type':'HowTo',
    name:'Netzanschluss Anmeldung Photovoltaik & Speicher',
    description:'Standardisierter Ablauf zur Anmeldung einer PV Anlage inkl. Speicher / Wallbox beim Netzbetreiber in Deutschland.',
    step: [
      { '@type':'HowToStep', name:'Vorprüfung', text:'Lastprofil / Dach / Verschattung prüfen, technische Auslegung (kWp, WR, Speicher).' },
      { '@type':'HowToStep', name:'Unterlagen sammeln', text:'Datenblätter Module, Wechselrichter, Speicher, Schaltplan / Stringplan, Lageplan.' },
      { '@type':'HowToStep', name:'Portal Anmeldung', text:'Im Netzbetreiber-Portal Projekt anlegen, technische Daten eingeben, Unterlagen hochladen.' },
      { '@type':'HowToStep', name:'Technische Prüfung', text:'Netzbetreiber bewertet Einspeisekapazität, ggf. Rückfragen / Ergänzungen.' },
      { '@type':'HowToStep', name:'Installation & Zählerschrank', text:'Konforme Montage, Messkonzept beachten, Platz für künftige Erweiterungen.' },
      { '@type':'HowToStep', name:'Zählersetzung & Inbetriebnahme', text:'Nach Freigabe Termin koordinieren. Prüfprotokoll & Inbetriebnahmeprotokoll dokumentieren.' }
    ]
  };
}

function buildFaqJsonLd(){
  const faqs = [
    { q:'Wie lange dauert die Netzanschluss-Anmeldung?', a:'Je nach Netzbetreiber 4–12 Wochen. Engpässe bei hoher Auslastung möglich; früh starten.' },
    { q:'Welche Unterlagen sind zwingend?', a:'Wechselrichter- & Modul-Datenblätter, Schema / Stringplan, Lageplan, ggf. Speicher-Datenblatt, Leistungsdaten.' },
    { q:'Benötige ich für eine Wallbox eine zusätzliche Anmeldung?', a:'Je nach Leistung. Meldepflicht meist ab 3,6 kW, Genehmigung bei >11 kW notwendig (regionale Unterschiede).' },
    { q:'Wann sollte der Zählerwechsel eingeplant werden?', a:'Sobald Freigabe vorliegt; Wartezeiten einplanen (1–4 Wochen). Ohne neuen Zähler keine Einspeisevergütung.' },
    { q:'Was verursacht häufig Verzögerungen?', a:'Unvollständige Unterlagen, fehlende Speicher / Wallbox Daten, ungeklärtes Messkonzept, Kapazitätsengpässe.' }
  ];
  return {
    '@context':'https://schema.org',
    '@type':'FAQPage',
    mainEntity: faqs.map(f => ({ '@type':'Question', name:f.q, acceptedAnswer:{ '@type':'Answer', text:f.a }}))
  };
}

export default function NetzanschlussPage(){
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-netzanschluss"
        data={breadcrumbJsonLd([
          { name:'Start', url:'/' }, { name:'Netzanschluss', url:'/netzanschluss' }
        ])}
      />
      <JsonLd id="ld-howto-netzanschluss" data={buildHowToJsonLd()} />
      <JsonLd id="ld-faq-netzanschluss" data={buildFaqJsonLd()} />
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Netzanschluss & Anmeldung Photovoltaik</h1>
        <p className="mt-4 text-neutral-600 max-w-3xl mx-auto">Strukturierter Leitfaden für PV, Speicher, Wallbox & Zählerwechsel – typische Bearbeitungszeiten, Unterlagen & Portal-Links ausgewählter Netzbetreiber.</p>
      </header>
      <section className="prose prose-neutral max-w-none">
        <h2>Ablauf & Prozesssicherheit</h2>
        <p>Eine frühzeitige, vollständige Anmeldung reduziert Verzögerungen bei Inbetriebnahme & Vergütung. Kern ist die technische Vollständigkeit (Auslegung, Messkonzept, Unterlagen) und reibungslose Portal-Einreichung. Diese Seite dient als zentraler Referenzpunkt für interne Qualität & Kundentransparenz.</p>
      </section>
      <section className="mt-12" id="netzbetreiber-portale">
        <h2 className="text-xl font-semibold mb-4">Ausgewählte Netzbetreiber Portale <a href="#netzbetreiber-portale" className="text-blue-500 text-xs align-middle">#</a></h2>
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-700">
              <tr>
                <th className="text-left font-medium px-3 py-2">Region / Netzbetreiber</th>
                <th className="text-left font-medium px-3 py-2">Portal</th>
                <th className="text-left font-medium px-3 py-2">Bearbeitungszeit (Hinweis)</th>
                <th className="text-left font-medium px-3 py-2">Hinweis</th>
              </tr>
            </thead>
            <tbody>
              {providers.map(p => (
                <tr key={p.slug} className="border-t align-top">
                  <td className="px-3 py-2 font-medium">{p.name}<div className="text-xs text-neutral-500">{p.region}</div></td>
                  <td className="px-3 py-2"><a className="text-blue-600 underline" href={p.portalUrl} target="_blank" rel="nofollow noopener">Portal öffnen</a></td>
                  <td className="px-3 py-2 text-neutral-700">{p.bearbeitungszeitHinweis}</td>
                  <td className="px-3 py-2 text-neutral-600 max-w-xs">{p.hinweis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-neutral-500 mt-2">Hinweis: Werte / Zeitspannen sind indikativ und variieren nach Auslastung, Jahreszeit und Anlagengröße.</p>
      </section>
      <section className="mt-12 prose prose-neutral max-w-none">
        <h2>Qualitäts- & Risikofaktoren</h2>
        <ul>
          <li>Unvollständige Unterlagen → Rückfragen → Verzögerung</li>
          <li>Unklares Messkonzept bei Speicher + Wallbox Kombination</li>
          <li>Fehlende frühzeitige String-/Schaltplan Abstimmung</li>
          <li>Unterschätzte Zählersetzungs-Wartezeit</li>
          <li>Späte Anpassungen an Auslegung wegen Komponentenverfügbarkeit</li>
        </ul>
      </section>
      <section className="mt-12 prose prose-neutral max-w-none" id="faq-netzanschluss">
        <h2>FAQ Netzanschluss <a href="#faq-netzanschluss" className="text-blue-500 text-xs align-middle">#</a></h2>
        <dl className="space-y-6 text-sm text-neutral-700">
          <div><dt className="font-medium">Kann ich die Anlage ohne Freigabe installieren?</dt><dd>Mechanisch ja (auf eigenes Risiko), elektrische Inbetriebnahme & Vergütung erst nach Freigabe / Zählersetzung.</dd></div>
          <div><dt className="font-medium">Was ist ein Messkonzept?</dt><dd>Schema wie Erzeugung, Speicher, Verbraucher und Messstellen verschaltet sind (z.B. Kaskade bei Wärmepumpe).</dd></div>
          <div><dt className="font-medium">Beschleunigt ein vollständiger Upload?</dt><dd>Ja – fehlende Datenblätter oder unklare Leistungsangaben verursachen nahezu alle Rückfragen.</dd></div>
          <div><dt className="font-medium">Ab wann lohnt parallele Speicher-/Wallbox-Planung?</dt><dd>Wenn mittelfristig vorgesehen: direkt integrieren – reduziert doppelte Prüfzyklen & spätere Umbauten.</dd></div>
          <div><dt className="font-medium">Sind Portale vereinheitlicht?</dt><dd>Nein – Prozesse & Eingabemasken unterscheiden sich deutlich (Pflichtfelder variieren).</dd></div>
        </dl>
      </section>
      <footer className="mt-16 text-center text-sm text-neutral-500">Letzte Aktualisierung {new Date().toISOString().split('T')[0]}</footer>
    </main>
  );
}
