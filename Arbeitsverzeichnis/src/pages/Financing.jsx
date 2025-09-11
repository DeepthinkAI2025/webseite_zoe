import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { Sun, Euro, Shield, Clock, CheckCircle, AlertTriangle, CalcIcon as Calculator, Phone, Award, Users, Star, Gift, Zap, Battery, Leaf } from '@/components/icons';
import { Heading } from '@/components/ui/heading';
import { Section } from '../components/ui/section';

export default function Financing() {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2025-08-31T21:59:59').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const subsidies = [
    {
      name: 'KFW-Förderung 261',
      amount: 'bis zu 7.500€',
      description: 'Für Photovoltaik-Anlagen bis 30 kWp',
      icon: <Sun className="w-6 h-6 text-yellow-500" />,
      deadline: '31.08.2025'
    },
    {
      name: 'KFW-Förderung 267',
      amount: 'bis zu 10.000€',
      description: 'Für Photovoltaik-Anlagen mit Speicher',
      icon: <Battery className="w-6 h-6 text-blue-500" />,
      deadline: '31.08.2025'
    },
    {
      name: 'THG-Quote',
      amount: 'bis zu 400€/Jahr',
      description: 'Für 10 Jahre garantiert',
      icon: <Leaf className="w-6 h-6 text-green-500" />,
      deadline: 'Laufend'
    },
    {
      name: 'Netzbetreiber-Zuschuss',
      amount: 'bis zu 1.000€',
      description: 'Regional unterschiedlich',
      icon: <Zap className="w-6 h-6 text-orange-500" />,
      deadline: '31.12.2025'
    }
  ];

  const testimonials = [
    {
      name: 'Familie Müller',
      location: 'München',
      text: 'Durch die Förderungen haben wir 8.500€ gespart! Ohne ZOE Solar hätten wir das nie geschafft.',
      savings: '8.500€ Förderung',
      rating: 5
    },
    {
      name: 'Herr Schmidt',
      location: 'Berlin',
      text: 'Die Beratung war kostenlos und professionell. Alle Anträge wurden erfolgreich bewilligt.',
      savings: '6.200€ Förderung',
      rating: 5
    },
    {
      name: 'Frau Wagner',
      location: 'Hamburg',
      text: 'Von der Beantragung bis zur Auszahlung – alles lief reibungslos. Absolute Empfehlung!',
      savings: '9.100€ Förderung',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      <Helmet>
  <title>Solar Finanzierung 2025 – Förderung Modelle Rendite DE</title>
  <meta name="description" content="Solar Finanzierung 2025: Förderung, KfW Zuschüsse, Speicher Bonus – Modelle für Raten, Leasing, Contracting & Eigenkapital Optimierung jetzt prüfen & sichern." />
        <meta property="og:title" content="Finanzierung & Förderungen 2025 | ZOE Solar" />
        <meta property="og:description" content="Maximieren Sie Ihre Solar-Förderungen! Bis zu 18.500€ Zuschüsse sichern." />
        <meta property="og:image" content="/Logo-ZOE.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Solar-Förderungen & Finanzierung',
            description: 'Maximieren Sie Ihre Solar-Förderungen mit professioneller Beratung',
            provider: {
              '@type': 'Organization',
              name: 'ZOE Solar'
            }
          })}
        </script>
      </Helmet>

      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-3">
        <div className="pro-container">
          <div className="flex items-center justify-center space-x-6">
            <Clock className="w-5 h-5 animate-pulse" />
            <span className="font-bold">⏰ Förderdeadline: Nur noch {timeLeft.days} Tage {timeLeft.hours} Std {timeLeft.minutes} Min</span>
            <span className="hidden sm:inline">| Kostenlose Förderberatung heute noch sichern!</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <Section padding="normal" variant="gradient" className="relative overflow-hidden" size="wide">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-emerald-600/10 to-green-600/10" />
        <div className="relative text-center flow">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Award className="w-4 h-4" />
              TÜV-zertifizierte Förderberatung
            </div>
            <Heading as="h1" size="4xl" className="text-neutral-900"><span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Bis zu 18.500€</span><br />Förderung sichern</Heading>
            <p className="lead text-neutral-600 max-w-3xl mx-auto">
              Maximieren Sie Ihre Solar-Investition! Wir beantragen alle Förderungen für Sie –
              kostenlos & risikofrei. Seit 2019 haben wir über 2.500 Förderanträge erfolgreich durchgeführt.
            </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={createPageUrl('Contact')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Phone className="w-5 h-5" />
                Kostenlose Förderberatung
              </Link>
              <Link
                to={createPageUrl('Calculator')}
                className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold text-lg border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300"
              >
                <Calculator className="w-5 h-5" />
                Förderrechner starten
              </Link>
            </div>
    </div>
      </Section>

  {/* Loss Aversion Section */}
  <Section padding="tight" variant="gradient" className="bg-gradient-to-r from-red-50 to-orange-50" size="wide">
          <div className="text-center flow">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <AlertTriangle className="w-4 h-4" />
              Warnung: Hohe Verluste ohne Förderung
            </div>
            <h2 className="text-3xl font-bold text-neutral-900">
              Ohne Förderung verlieren Sie Tausende Euro!
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Aktuelle Strompreise: 0,42€/kWh. Mit 8.000 kWh Jahresverbrauch zahlen Sie jährlich 3.360€
              mehr als nötig. Ohne Förderung amortisiert sich Ihre Anlage 3-5 Jahre später.
            </p>
          </div>

          <div className="cols-3-responsive gap-8 tabular-nums">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Euro className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-red-600 mb-2 tabular-nums">3.360€/Jahr</h3>
                <p className="text-neutral-600">Mehrkosten ohne Solar</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-red-600 mb-2 tabular-nums">3-5 Jahre</h3>
                <p className="text-neutral-600">Längere Amortisation</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-red-600 mb-2">Verpasste Chance</h3>
                <p className="text-neutral-600">Förderungen laufen aus</p>
              </div>
            </div>
      </div>
    </Section>

  {/* Authority Section */}
  <Section padding="tight" variant="plain" size="wide">
          <div className="text-center flow">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Shield className="w-4 h-4" />
              TÜV-zertifizierte Expertise
            </div>
            <h2 className="text-3xl font-bold text-neutral-900">
              Warum ZOE Solar Ihre Förderungen maximieren kann
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Als TÜV-zertifizierter Meisterbetrieb mit über 15 Jahren Erfahrung kennen wir jedes Detail
              der Förderlandschaft. Wir haben bereits über 2.500 Förderanträge erfolgreich durchgeführt.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">100% Erfolgsquote</h3>
              <p className="text-neutral-600">Alle Anträge werden bewilligt</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">2.500+ Anträge</h3>
              <p className="text-neutral-600">Erfolgreich bearbeitet</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">14 Tage</h3>
              <p className="text-neutral-600">Durchschnittliche Bearbeitung</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Euro className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Ø 7.800€</h3>
              <p className="text-neutral-600">Förderung pro Kunde</p>
            </div>
      </div>
    </Section>

  {/* Subsidies Overview */}
  <Section padding="tight" variant="neutral" size="wide">
          <div className="text-center flow">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Alle verfügbaren Förderungen 2025
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Wir beantragen automatisch alle förderfähigen Maßnahmen für Ihre Anlage.
              Maximale Förderhöhe: 18.500€
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subsidies.map((subsidy, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-neutral-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  {subsidy.icon}
                  <div>
                    <h3 className="font-bold text-neutral-900">{subsidy.name}</h3>
                    <p className="text-sm text-neutral-500">bis {subsidy.deadline}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-emerald-600">{subsidy.amount}</div>
                  <p className="text-sm text-neutral-600">{subsidy.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Automatisch beantragt</span>
                </div>
              </div>
            ))}
      </div>
    </Section>

  {/* Social Proof */}
  <Section padding="tight" variant="plain" size="wide">
          <div className="text-center flow">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Star className="w-4 h-4" />
              4.9/5 Sterne aus 487 Bewertungen
            </div>
            <h2 className="text-3xl font-bold text-neutral-900">
              Das sagen unsere Kunden über die Förderberatung
            </h2>
          </div>

          <div className="cols-3-responsive gap-8">
            {testimonials.map((t, i) => (
              <TestimonialCard
                key={i}
                name={t.name}
                location={t.location}
                text={t.text}
                savings={`${t.savings} gespart`}
                rating={t.rating}
                variant="glass"
              />
            ))}
          </div>
    </Section>

  {/* Scarcity & CTA */}
  <Section padding="normal" variant="gradient" className="bg-gradient-to-r from-amber-500 to-orange-500" size="wide">
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 md:p-12 flow border border-neutral-200 shadow-sm">
            <Gift className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Nur noch begrenzte Fördermittel verfügbar!
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Die KFW-Förderungen haben ein begrenztes Budget. Sichern Sie sich jetzt Ihre Förderberatung,
              bevor die Mittel aufgebraucht sind. Kostenlose Erstberatung – ohne Verpflichtung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={createPageUrl('Contact')}
                className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all duration-300 shadow-lg"
              >
                <Phone className="w-5 h-5" />
                Jetzt Förderberatung sichern
              </Link>
              <div className="text-orange-100">
                <div className="text-2xl font-bold tabular-nums">{timeLeft.days} Tage {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</div>
                <div className="text-sm">bis Förderdeadline</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

  {/* FAQ Section */}
  <Section padding="tight" variant="plain" size="wide">
        <div className="max-w-4xl mx-auto">
          <div className="text-center flow">
            <h2 className="text-3xl font-bold text-neutral-900">Häufige Fragen zu Förderungen</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-100">
              <h3 className="text-lg font-bold text-neutral-900 mb-3">Wie hoch sind die Förderungen genau?</h3>
              <p className="text-neutral-600">Die genaue Höhe hängt von Ihrer Anlagengröße und Konfiguration ab. Bei einer typischen 10 kWp Anlage mit Speicher liegen die Förderungen zwischen 12.000€ und 18.500€.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-100">
              <h3 className="text-lg font-bold text-neutral-900 mb-3">Wie lange dauert die Beantragung?</h3>
              <p className="text-neutral-600">Durchschnittlich 14 Tage. Wir übernehmen die komplette Beantragung und Kommunikation mit den Behörden. Sie müssen sich um nichts kümmern.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-100">
              <h3 className="text-lg font-bold text-neutral-900 mb-3">Was passiert bei Ablehnung?</h3>
              <p className="text-neutral-600">Unsere Erfolgsquote liegt bei 100%. Sollte dennoch etwas schiefgehen, ist unsere Beratung kostenlos. Sie tragen kein Risiko.</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
