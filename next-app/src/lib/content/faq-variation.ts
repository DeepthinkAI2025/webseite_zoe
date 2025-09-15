// FAQ Variation Engine
// Ziel: Duplikatsreduktion über viele Standortseiten durch leichte semantische Variation & Tiefenschichten.

export interface FaqItem { q: string; a: string }

// Basis Templates (Platzhalter {{city}} oder {{region}})
const templates: FaqItem[] = [
  { q: 'Wie hoch ist der spezifische PV-Ertrag in {{city}}?', a: 'In {{city}} liegen realistische spezifische Jahreserträge typischer Süddach-Anlagen bei {{ertragRange}} kWh je kWp – abhängig von Verschattung und Anlagenauslegung.' },
  { q: 'Welche Speichergröße ist für einen Haushalt in {{city}} sinnvoll?', a: 'Für einen Jahresstromverbrauch von {{verbrauchBeispiel}} empfiehlt sich in {{city}} häufig eine nutzbare Speicherkapazität von {{speicherRange}} kWh. Exakte Dimensionierung folgt dem Lastgangprofil.' },
  { q: 'Wie lange dauert die PV-Montage in {{city}}?', a: 'Standard-Einfamilienhaus: Montage 1–2 Tage + Netzbetreiber Freigabe (oft zusätzliche {{netzFreigabeWochen}} Wochen). Komplexe Dächer oder Speicher-Nachrüstungen verlängern den Prozess.' },
  { q: 'Welche Dachneigung ist in {{city}} optimal?', a: 'Zwischen 25° und 40° werden in {{city}} sehr gute Ergebnisse erzielt. Flachere Ost/West-Aufständerungen sorgen für gleichmäßigeren Tagesverlauf und erhöhen Eigenverbrauchsquoten.' },
  { q: 'Wie verkürzt man die Amortisationszeit einer Anlage in {{city}}?', a: 'Hoher Eigenverbrauch (Lastverschiebung), effizienter Wechselrichter, passende Speichergröße und Optimierung von Standby-Verbräuchen senken die Amortisationszeit. Förderprogramme können zusätzlich {{foerderImpact}} Monate einsparen.' }
];

export interface VariationContext {
  city: string;
  region?: string;
  ertragRange?: string;          // z.B. "950–1080"
  speicherRange?: string;        // z.B. "5–10"
  verbrauchBeispiel?: string;    // z.B. "4.500 kWh/Jahr"
  netzFreigabeWochen?: string;   // z.B. "4–7"
  foerderImpact?: string;        // z.B. "6–12"
}

function applyTemplate(str: string, ctx: VariationContext){
  return str
    .replace(/{{city}}/g, ctx.city)
    .replace(/{{region}}/g, ctx.region || ctx.city)
    .replace(/{{ertragRange}}/g, ctx.ertragRange || '900–1100')
    .replace(/{{speicherRange}}/g, ctx.speicherRange || '5–8')
    .replace(/{{verbrauchBeispiel}}/g, ctx.verbrauchBeispiel || '4.000 kWh/Jahr')
    .replace(/{{netzFreigabeWochen}}/g, ctx.netzFreigabeWochen || '4–6')
    .replace(/{{foerderImpact}}/g, ctx.foerderImpact || '6–10');
}

export function buildFaqVariation(ctx: VariationContext, limit = 4): FaqItem[] {
  // Shuffle leichte Variation
  const shuffled = [...templates].sort(()=> Math.random() - 0.5).slice(0, limit);
  return shuffled.map(t => ({ q: applyTemplate(t.q, ctx), a: applyTemplate(t.a, ctx) }));
}

// Hash Utility zur optionalen Duplicate Detection extern
export function hashFaqItem(item: FaqItem){
  // sehr einfache Normalisierung
  const base = (item.q + '|' + item.a).toLowerCase().replace(/\s+/g,' ');
  let h = 0; for(let i=0;i<base.length;i++){ h = (h * 31 + base.charCodeAt(i)) >>> 0; }
  return h.toString(16);
}
