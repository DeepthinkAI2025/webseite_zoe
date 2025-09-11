/**
 * AI Provider Adapter Beispiel
 * export async function generateMeta({title, description, url}) { ... }
 */
export async function generateMeta({ prompt }) {
  // Platzhalter – hier LLM API call einfügen
  const base = String(prompt || '').slice(0, 60).trim();
  return {
    title: base ? `${base} – ZOE` : 'ZOE – Energie neu denken',
    description: base ? `Hinweis: ${base} …` : 'Photovoltaik, Speicher und mehr – kompakt erklärt.'
  };
}