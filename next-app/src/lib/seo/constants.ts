export const SITE_NAME = 'ZOE Solar';
export const SITE_URL = 'https://www.zoe-solar.de'; // finale Domain
export const SITE_TAGLINE = 'Transparente Photovoltaik Komplettlösungen';

// Platzhalter wird erstellt falls nicht vorhanden – für Produktion durch echtes 1200x630 JPG (~<80KB) ersetzen
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

export const ORG = {
  legalName: 'ZOE Solar',
  brand: 'ZOE Solar',
  address: {
    streetAddress: 'Kurfürstenstraße 124',
    postalCode: '10785',
    addressLocality: 'Berlin',
    addressCountry: 'DE'
  },
  phone: '+49', // TODO: echte Durchwahl ergänzen
  email: 'service@zoe-solar.de',
  owner: 'Jeremy Markus Schulze',
  vatId: 'DE325514610',
  installerId: '0080-32174',
  operationId: '134514'
};
