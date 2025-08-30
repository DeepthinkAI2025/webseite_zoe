import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  de: {
    translation: {
      nav: {
        start: 'Start', why: 'Warum ZOE?', info: 'Informationen', exp: 'Erfahrungen', calc: 'Rechner', deals: 'Angebote', consult: 'Kostenlose Beratung'
      },
      seo: {
        home: {
          title: 'Solaranlage kaufen – Bis zu 50% Stromkosten sparen | ZOE Solar',
          desc: 'Werden Sie in 2 Minuten energieunabhängig: kostenlose Potenzialanalyse, Festpreis‑Angebot, 25 Jahre Garantie. Jetzt Ersparnis berechnen!'
        }
      },
      hero: {
        kicker: 'Strompreise steigen? Nicht für Sie!',
        h1: 'Halbieren Sie Ihre Stromrechnung – garantiert planbar.',
        sub: 'In 2 Minuten wissen Sie, wie viel Sie sparen. Premium‑Technik, Festpreis‑Angebot, 25 Jahre Garantie und Förderung inklusive.',
        cta_calc: 'Jetzt Ersparnis berechnen',
        cta_call: '15‑Min Erstgespräch sichern',
        urgency_offer: 'Begrenztes Angebot – Sichern Sie sich jetzt!',
        urgency_desc: '1.500€ Winterbonus + kostenlose Wallbox bis 15.09.2025',
        loss_aversion_title: 'Stromkosten steigen weiter – sparen Sie jetzt!',
        loss_aversion_desc: 'Durchschnittliche Strompreise sind seit 2021 um 40% gestiegen. Sichern Sie sich Ihre Unabhängigkeit, bevor es zu spät ist.',
        reciprocity_title: 'Kostenloser Solar-Check für Sie',
        reciprocity_desc: 'Wir analysieren Ihr Dach kostenlos und zeigen Ihnen das genaue Einsparpotenzial – ohne Verpflichtung.',
        reciprocity_cta: 'Jetzt kostenlosen Check anfordern'
      },
      psychology: {
        why_now_title: 'Warum jetzt die beste Zeit für Solar ist',
        why_now_subtitle: 'Die Fakten sprechen für sich – verpassen Sie nicht die Chance auf finanzielle Freiheit.',
        rising_costs_title: 'Stromkosten explodieren',
        rising_costs_desc: 'Seit 2021 sind die Strompreise um durchschnittlich 40% gestiegen. Ohne Solar zahlen Sie jährlich tausende Euro mehr – für immer.',
        quality_title: 'TÜV-zertifizierte Qualität',
        quality_desc: 'Als zertifizierter Meisterbetrieb garantieren wir höchste Standards. Unsere Anlagen übertreffen alle Normen und halten, was wir versprechen.',
        roi_title: 'Schnelle Amortisation',
        roi_desc: 'Bei aktuellen Strompreisen rechnet sich Ihre Anlage in durchschnittlich 8 Jahren. Danach sparen Sie Jahr für Jahr – lebenslang.',
        expert_quote: 'Die aktuelle Energiekrise zeigt: Solar ist nicht nur ökologisch sinnvoll, sondern auch die klügste finanzielle Entscheidung. Wer jetzt investiert, sichert sich langfristige Unabhängigkeit zu besten Konditionen.',
        expert_name: 'Dr. Stefan Müller',
        expert_title: 'Leiter Energiewirtschaft, TU München',
        testimonials_title: 'Was Kundinnen und Kunden berichten',
        testimonials_subtitle: 'Über 2.500 zufriedene Kunden haben sich bereits für ihre Zukunft entschieden',
        partners_title: 'Wir verbauen Premium-Komponenten von Marktführern:'
      }
    }
  },
  en: {
    translation: {
      nav: {
        start: 'Home', why: 'Why ZOE?', info: 'Information', exp: 'Experiences', calc: 'Calculator', deals: 'Deals', consult: 'Free consultation'
      },
      seo: {
        home: {
          title: 'Buy a solar system – Save up to 50% on electricity | ZOE Solar',
          desc: 'Become energy independent in 2 minutes: free potential analysis, fixed‑price offer, 25‑year warranty. Calculate your savings now!'
        }
      },
      hero: {
        kicker: 'Electricity prices rising? Not for you!',
        h1: 'Cut your power bill in half — predictably.',
        sub: 'In 2 minutes you\'ll know your savings. Premium tech, fixed-price quote, 25-year warranty and subsidies included.',
        cta_calc: 'Calculate savings',
        cta_call: 'Book a 15‑min intro call',
        urgency_offer: 'Limited offer – Secure it now!',
        urgency_desc: '€1,500 winter bonus + free wallbox until 09/15/2025',
        loss_aversion_title: 'Electricity costs rising – save now!',
        loss_aversion_desc: 'Average electricity prices have risen 40% since 2021. Secure your independence before it\'s too late.',
        reciprocity_title: 'Free solar check for you',
        reciprocity_desc: 'We analyze your roof for free and show you the exact savings potential – no obligation.',
        reciprocity_cta: 'Request free check now'
      },
      psychology: {
        why_now_title: 'Why now is the best time for solar',
        why_now_subtitle: 'The facts speak for themselves – don\'t miss the chance for financial freedom.',
        rising_costs_title: 'Electricity costs exploding',
        rising_costs_desc: 'Since 2021, electricity prices have risen by an average of 40%. Without solar, you\'ll pay thousands more annually – forever.',
        quality_title: 'TÜV-certified quality',
        quality_desc: 'As a certified master company, we guarantee the highest standards. Our systems exceed all norms and deliver what we promise.',
        roi_title: 'Fast amortization',
        roi_desc: 'At current electricity prices, your system pays for itself in an average of 8 years. After that, you save year after year – for life.',
        expert_quote: 'The current energy crisis shows: Solar is not only ecologically sensible, but also the smartest financial decision. Those who invest now secure long-term independence at the best conditions.',
        expert_name: 'Dr. Stefan Müller',
        expert_title: 'Head of Energy Economics, TU Munich',
        testimonials_title: 'What customers say',
        testimonials_subtitle: 'Over 2,500 satisfied customers have already chosen their future',
        partners_title: 'We install premium components from market leaders:'
      }
    }
  },
  fr: {
    translation: {
      nav: {
        start: 'Accueil', why: 'Pourquoi ZOE ?', info: 'Infos', exp: 'Expériences', calc: 'Calculateur', deals: 'Offres', consult: 'Conseil gratuit'
      },
      seo: {
        home: {
          title: 'Acheter une installation solaire – Économisez jusqu\'à 50% | ZOE Solar',
          desc: 'Devenez indépendant en 2 minutes : analyse gratuite, prix fixe, garantie 25 ans. Calculez vos économies maintenant !'
        }
      },
      hero: {
        kicker: 'Les prix de l\'électricité montent ? Pas pour vous !',
        h1: 'Divisez votre facture par deux — en toute sérénité.',
        sub: 'En 2 minutes, estimez vos économies. Technologie premium, prix fixe, garantie 25 ans et subventions incluses.',
        cta_calc: 'Calculer mes économies',
        cta_call: 'Appel d\'intro 15 min',
        urgency_offer: 'Offre limitée – Réservez maintenant !',
        urgency_desc: '1 500€ bonus hiver + borne gratuite jusqu\'au 15/09/2025',
        loss_aversion_title: 'Les coûts d\'électricité augmentent – économisez maintenant !',
        loss_aversion_desc: 'Les prix moyens de l\'électricité ont augmenté de 40% depuis 2021. Assurez votre indépendance avant qu\'il ne soit trop tard.',
        reciprocity_title: 'Contrôle solaire gratuit pour vous',
        reciprocity_desc: 'Nous analysons votre toit gratuitement et vous montrons le potentiel d\'économies exact – sans engagement.',
        reciprocity_cta: 'Demander le contrôle gratuit maintenant'
      },
      psychology: {
        why_now_title: 'Pourquoi maintenant est le meilleur moment pour le solaire',
        why_now_subtitle: 'Les faits parlent d\'eux-mêmes – ne manquez pas la chance de la liberté financière.',
        rising_costs_title: 'Les coûts d\'électricité explosent',
        rising_costs_desc: 'Depuis 2021, les prix de l\'électricité ont augmenté en moyenne de 40%. Sans solaire, vous paierez des milliers de plus par an – pour toujours.',
        quality_title: 'Qualité certifiée TÜV',
        quality_desc: 'En tant qu\'entreprise maître certifiée, nous garantissons les plus hauts standards. Nos installations dépassent toutes les normes et tiennent nos promesses.',
        roi_title: 'Amortissement rapide',
        roi_desc: 'Aux prix actuels de l\'électricité, votre installation se rentabilise en moyenne en 8 ans. Après, vous économisez année après année – à vie.',
        expert_quote: 'La crise énergétique actuelle montre : Le solaire n\'est pas seulement écologiquement sensé, mais aussi la décision financière la plus intelligente. Ceux qui investissent maintenant assurent une indépendance à long terme aux meilleures conditions.',
        expert_name: 'Dr. Stefan Müller',
        expert_title: 'Directeur Économie de l\'énergie, TU Munich',
        testimonials_title: 'Ce que disent nos clients',
        testimonials_subtitle: 'Plus de 2 500 clients satisfaits ont déjà choisi leur avenir',
        partners_title: 'Nous installons des composants premium de leaders du marché :'
      }
    }
  },
  es: {
    translation: {
      nav: {
        start: 'Inicio', why: '¿Por qué ZOE?', info: 'Información', exp: 'Experiencias', calc: 'Calculadora', deals: 'Ofertas', consult: 'Asesoría gratuita'
      },
      seo: {
        home: {
          title: 'Compra una instalación solar – Ahorra hasta 50% | ZOE Solar',
          desc: 'Sé independiente en 2 minutos: análisis gratuito, precio fijo, garantía de 25 años. ¡Calcula tu ahorro ahora!'
        }
      },
      hero: {
        kicker: '¿Sube la luz? No para ti.',
        h1: 'Reduce tu factura a la mitad — con previsión.',
        sub: 'En 2 minutos sabrás cuánto ahorras. Tecnología premium, precio fijo, 25 años de garantía y subvenciones.',
        cta_calc: 'Calcular ahorro',
        cta_call: 'Reserva llamada de 15 min',
        urgency_offer: 'Oferta limitada – Asegúrala ahora!',
        urgency_desc: '1.500€ bono invierno + cargador gratuito hasta 15/09/2025',
        loss_aversion_title: 'Los costos de electricidad suben – ahorra ahora!',
        loss_aversion_desc: 'Los precios promedio de electricidad han subido 40% desde 2021. Asegura tu independencia antes de que sea demasiado tarde.',
        reciprocity_title: 'Chequeo solar gratuito para ti',
        reciprocity_desc: 'Analizamos tu techo gratis y te mostramos el potencial exacto de ahorro – sin compromiso.',
        reciprocity_cta: 'Solicitar chequeo gratuito ahora'
      },
      psychology: {
        why_now_title: 'Por qué ahora es el mejor momento para solar',
        why_now_subtitle: 'Los hechos hablan por sí solos – no pierdas la oportunidad de libertad financiera.',
        rising_costs_title: 'Los costos de electricidad explotan',
        rising_costs_desc: 'Desde 2021, los precios de electricidad han subido un promedio del 40%. Sin solar, pagarás miles más anualmente – para siempre.',
        quality_title: 'Calidad certificada TÜV',
        quality_desc: 'Como empresa maestra certificada, garantizamos los más altos estándares. Nuestros sistemas superan todas las normas y cumplen lo que prometemos.',
        roi_title: 'Amortización rápida',
        roi_desc: 'A los precios actuales de electricidad, tu sistema se paga solo en un promedio de 8 años. Después, ahorras año tras año – de por vida.',
        expert_quote: 'La crisis energética actual muestra: La solar no es solo ecológicamente sensata, sino también la decisión financiera más inteligente. Quienes invierten ahora aseguran independencia a largo plazo en las mejores condiciones.',
        expert_name: 'Dr. Stefan Müller',
        expert_title: 'Director Economía de la Energía, TU Munich',
        testimonials_title: 'Qué dicen nuestros clientes',
        testimonials_subtitle: 'Más de 2.500 clientes satisfechos ya han elegido su futuro',
        partners_title: 'Instalamos componentes premium de líderes del mercado:'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'de',
    interpolation: { escapeValue: false },
    detection: { order: ['querystring','localStorage','navigator'], caches: ['localStorage'] }
  });

export default i18n;
