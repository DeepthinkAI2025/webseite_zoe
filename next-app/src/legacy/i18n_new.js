import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Basis-Initialisierung ohne große inline Ressourcen.
// Wir laden die Standard-Lokalisierung (de) synchron per static import (wichtig für erste Paint ohne FOUC)
import de from './locales/de.json'; // Basis

const loaded = { de: { translation: de } };

async function loadNamespace(lng, ns){
  if(loaded[lng] && loaded[lng][ns]) return;
  try {
    const mod = await import(`./locales/ns/${ns}.${lng}.json`);
    if(!loaded[lng]) loaded[lng] = { translation: {} };
    loaded[lng][ns] = mod.default;
    i18n.addResourceBundle(lng, ns, mod.default, true, true);
  } catch { void 0; /* silently ignore if namespace missing */ }
}

async function loadLocaleData(lng){
  if (loaded[lng]) return loaded[lng];
  try {
    const mod = await import(/* @vite-ignore */ `./locales/${lng}.json`);
    loaded[lng] = { translation: mod.default };
    // Ressourcen dynamisch injizieren (separate namespaceless Struktur)
    i18n.addResources(lng, 'translation', mod.default);
    return loaded[lng];
  } catch (e) {
    // Fallback bei fehlender Datei -> de
    return loaded.de;
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: loaded,
    fallbackLng: 'de',
    interpolation: { escapeValue: false },
    detection: { order: ['querystring','localStorage','navigator'], caches: ['localStorage'] }
  });

// Hook für Sprachwechsel: lädt JSON falls nötig
i18n.on('languageChanged', (lng) => {
  loadLocaleData(lng);
  // psychology Namespace wird nicht mehr global vorgeladen – jede Seite ruft ensurePsychology selbst bei Bedarf.
});

export default i18n;

export function preloadLocale(lng){ return loadLocaleData(lng); }
export function ensurePsychology(lng){ return loadNamespace(lng,'psychology'); }

