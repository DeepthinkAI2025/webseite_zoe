// Author / Person Schema (E-E-A-T Vorbereitung)
// Nutzung: Später in Seiten einbinden oder im Root Layout erweitern.
// Beispiel Einbindung:
// <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(buildAuthorSchema())}} />

export interface AuthorSchemaOptions {
  name: string;
  url: string;
  sameAs?: string[];
  jobTitle?: string;
  worksForName?: string;
  expertise?: string[]; // Domain Expertise Stichworte
}

export function buildAuthorSchema(opts: AuthorSchemaOptions){
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: opts.name,
    url: opts.url,
    jobTitle: opts.jobTitle,
    affiliation: opts.worksForName ? { '@type':'Organization', name: opts.worksForName } : undefined,
    knowsAbout: opts.expertise,
    sameAs: opts.sameAs
  };
}

// Beispiel Default Export (kann angepasst werden)
export const defaultAuthor = buildAuthorSchema({
  name: 'ZOE Solar Redaktion',
  url: 'https://example.com/team',
  jobTitle: 'Fachredaktion Photovoltaik',
  worksForName: 'ZOE Solar',
  expertise: ['Photovoltaik', 'Energiespeicher', 'Hybrid Wechselrichter', 'Energieeffizienz'],
  sameAs: []
});
