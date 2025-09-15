/**
 * Hreflang Utility für internationale SEO
 * Generiert hreflang-Links für DE/EN/FR/ES Sprachen
 */
// Hinweis: In Next.js darf ein React Hook nicht in einer normalen Hilfsfunktion genutzt werden.
// Der frühere Hook-Aufruf wurde entfernt und muss in Komponenten-Ebene verlagert werden.

export function useHreflang() {
  const { i18n } = useTranslation();

  const languages = {
    de: 'de-DE',
    en: 'en-US',
    fr: 'fr-FR',
    es: 'es-ES'
  };

  const getHreflangLinks = (currentPath) => {
    const links = [];

    Object.entries(languages).forEach(([lang, locale]) => {
      // Für die aktuelle Sprache: x-default
      if (lang === i18n.language) {
        links.push({
          rel: 'alternate',
          hreflang: 'x-default',
          href: `${window.location.origin}${currentPath}`
        });
      }

      // Sprachspezifische Links
      links.push({
        rel: 'alternate',
        hreflang: locale,
        href: `${window.location.origin}/${lang}${currentPath}`
      });
    });

    return links;
  };

  return { getHreflangLinks, languages };
}

/**
 * Hreflang Meta Tags für Helmet
 */
export function generateHreflangTags(basePath = '', opts = {}) {
  // Erwartet optional Übergabe: { locales: string[], currentLocale: string }
  const locales = (opts.locales && Array.isArray(opts.locales) ? opts.locales : ['de','en','fr','it']).filter(Boolean);
  const currentLocale = opts.currentLocale || 'de';

  const links = getHreflangLinks(basePath);
  return links.map(link => ({
    rel: link.rel,
    hreflang: link.hreflang,
    href: link.href
  }));
}
