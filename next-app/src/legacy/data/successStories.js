// Zentrale Datenbasis für Success Stories (Listing + Detailseiten)
// Jede Story: slug strikt kleingeschrieben, keine Umlaute, bindestrich-getrennt
export const successStories = [
  {
    id: 1,
    slug: 'familie-bauer-muenchen',
    name: 'Familie Bauer',
    location: 'München',
    type: 'Einfamilienhaus',
    systemSize: '9.8 kWp',
    annualSavings: 2400,
    paybackPeriod: '6.2 Jahre',
    autarkyRate: '85%',
    installationDate: '2024-03-12',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
    story: 'Als junge Familie mit zwei kleinen Kindern wollten wir unabhängig werden. Die monatlichen Stromkosten von €280 waren zu hoch. Nach der Installation zahlen wir nur noch €45 Reststrom und haben uns in 6 Jahren amortisiert.',
    benefits: [
      '€235 geringere Stromkosten pro Monat',
      '85% Autarkie – kaum Netzbezug',
      'Wertsteigerung des Hauses um €25.000',
      'Kostenlose Wallbox Aktion genutzt'
    ],
    quote: 'Die Entscheidung für ZOE Solar war die beste Investition unseres Lebens.'
  },
  {
    id: 2,
    slug: 'herr-dr-schmidt-hamburg',
    name: 'Herr Dr. Schmidt',
    location: 'Hamburg',
    type: 'Architektenhaus',
    systemSize: '12.2 kWp',
    annualSavings: 2900,
    paybackPeriod: '5.8 Jahre',
    autarkyRate: '92%',
    installationDate: '2024-01-20',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    story: 'Als Architekt war ich skeptisch. Planung präzise, Ausführung termingerecht: 92% Autarkie nach 8 Monaten Betrieb und signifikante Kostensenkung.',
    benefits: [
      '€242 weniger Stromkosten pro Monat',
      '92% Autarkie – maximale Unabhängigkeit',
      'Intelligentes Energiemanagement',
      'Premium Monitoring-App'
    ],
    quote: 'Die Qualität der Anlage übertrifft alle Erwartungen.'
  },
  {
    id: 3,
    slug: 'frau-wagner-stuttgart',
    name: 'Frau Wagner',
    location: 'Stuttgart',
    type: 'Mehrfamilienhaus',
    systemSize: '15.0 kWp',
    annualSavings: 3500,
    paybackPeriod: '5.2 Jahre',
    autarkyRate: '78%',
    installationDate: '2024-04-05',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    story: 'Vermietete Wohnungen profitieren von gesenkten Nebenkosten. Die 15 kWp Anlage steigert Attraktivität und Rendite des Objekts.',
    benefits: [
      '€292 geringere Stromkosten pro Monat',
      '78% Autarkie bei 4 Parteien',
      'Höhere Mieterzufriedenheit',
      'Steuerliche Vorteile ausgeschöpft'
    ],
    quote: 'ZOE Solar hat nicht nur Kosten gesenkt, sondern meine Mieter glücklich gemacht.'
  },
  {
    id: 4,
    slug: 'familie-mueller-berlin',
    name: 'Familie Müller',
    location: 'Berlin',
    type: 'Doppelhaushälfte',
    systemSize: '8.5 kWp',
    annualSavings: 2100,
    paybackPeriod: '7.1 Jahre',
    autarkyRate: '80%',
    installationDate: '2024-02-10',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
    story: 'Stetig steigende Strompreise führten zur Investition. Heute 80% Autarkie und spürbare Planbarkeit der Haushaltskosten.',
    benefits: [
      '€175 geringere Stromkosten pro Monat',
      '80% Autarkie mit 4 Personen',
      'Nachhaltige Lebensweise',
      'Zukunftssichere Investition'
    ],
    quote: 'Einwandfreier Betrieb und klare Ersparnis – jederzeit wieder.'
  },
  {
    id: 5,
    slug: 'gewerbe-solarkomplex-augsburg',
    name: 'Solarkomplex GmbH',
    location: 'Augsburg',
    type: 'Gewerbehalle (Produktion)',
    systemSize: '48.6 kWp',
    annualSavings: 12400,
    paybackPeriod: '4.9 Jahre',
    autarkyRate: '68%',
    installationDate: '2024-05-28',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1497445702960-c21c56a3d56a?auto=format&fit=crop&w=1200&q=80',
    story: 'Die Produktionshalle verbrauchte tagsüber hohe Lastspitzen. Durch die 48.6 kWp Aufdachanlage wurden Lastspitzen geglättet, Eigenverbrauch optimiert und die CO₂ Bilanz signifikant verbessert. Die kombinierte Nutzung mit einem 30 kWh Speicher verschiebt Überschüsse in die Abendschicht.',
    benefits: [
      'Ø €1.030 geringere Energiekosten pro Monat',
      '68% direkte Eigenverbrauchsquote trotz Lastprofil',
      'CO₂ Einsparung ≈ 26 Tonnen/Jahr',
      'Stabile Produktionskosten durch Peak Shaving'
    ],
    quote: 'Die Investition reduziert unsere Betriebskosten planbar und stärkt unsere Nachhaltigkeitskommunikation.'
  }
];

export function findSuccessStory(slug){
  return successStories.find(s => s.slug === slug);
}
