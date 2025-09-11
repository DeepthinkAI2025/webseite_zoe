import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Wrench, Shield, Clock, CheckCircle, Phone, Award, Users, Star, Zap, HomeIcon as Home, AlertTriangle, Calendar } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { Pill } from '@/components/ui/pill';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Section } from '../components/ui/section';

export default function Service() {
  const { t } = useTranslation();

  // Countdown Timer für Urgency
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2025-09-15T23:59:59').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const servicePackages = [
    {
      name: "Basis-Service",
      price: "€99/Jahr",
      popular: false,
      features: [
        "Jährliche Inspektion",
        "Visuelle Überprüfung",
        "Leistungsmessung",
        "Reinigung der Module",
        "Basis-Dokumentation",
        "E-Mail Support"
      ],
      description: "Für optimale Grundversorgung Ihrer Anlage"
    },
    {
      name: "Premium-Service",
      price: "€199/Jahr",
      popular: true,
      features: [
        "Alle Basis-Leistungen",
        "Thermografie-Scan",
        "Elektrische Messungen",
        "Wechselrichter-Diagnose",
        "Vorfahrt-Service",
        "24/7 Telefon-Support",
        "Sofort-Reparatur bei Defekt"
      ],
      description: "Maximale Sicherheit und Performance"
    },
    {
      name: "All-Inclusive",
      price: "€299/Jahr",
      popular: false,
      features: [
        "Alle Premium-Leistungen",
        "Monatliche Fernüberwachung",
        "Sofort-Reparatur < 24h",
        "Ersatzteil-Lagerung",
        "Performance-Optimierung",
        "Persönlicher Service-Manager",
        "Kostenlose Erweiterungsberatung"
      ],
      description: "Rundum-Sorglos für höchste Ansprüche"
    }
  ];

  const serviceStats = [
    { number: "2.547", label: "Anlagen in Wartung", icon: Home },
    { number: "< 24h", label: "Reaktionszeit", icon: Clock },
    { number: "99.8%", label: "Verfügbarkeit", icon: Zap },
    { number: "4.9/5", label: "Service-Bewertung", icon: Star }
  ];

  const emergencyServices = [
    {
      title: "Notfall-Reparatur",
      description: "Bei Defekten oder Ausfällen reagieren wir innerhalb von 24 Stunden",
      icon: AlertTriangle,
      response: "< 24h"
    },
    {
      title: "Sturmschaden-Service",
      description: "Schnelle Hilfe bei Sturmschäden und unvorhergesehenen Ereignissen",
      icon: Wrench,
      response: "< 12h"
    },
    {
      title: "Leistungsverlust",
      description: "Bei unerwartetem Ertragsrückgang analysieren wir sofort die Ursache",
      icon: Zap,
      response: "< 48h"
    }
  ];

  const testimonials = [
    {
      name: "Herr Müller",
      location: "Berlin",
      service: "Premium-Service",
      text: "Seit 3 Jahren im Premium-Service. Bei einem kleinen Defekt war der Techniker innerhalb von 4 Stunden da. Absolut zuverlässig!",
      rating: 5
    },
    {
      name: "Frau Wagner",
      location: "München",
      service: "All-Inclusive",
      text: "Der All-Inclusive Service gibt mir totale Sicherheit. Monatliche Berichte, sofortige Reaktionen - einfach perfekt.",
      rating: 5
    },
    {
      name: "Familie Bauer",
      location: "Hamburg",
      service: "Basis-Service",
      text: "Der Basis-Service ist genau richtig für uns. Jährliche Inspektion, saubere Anlage - alles super.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Helmet>
        <title>Solar Service & Wartung 2025 – 24/7 Support TÜV geprüft DE</title>
        <meta name="description" content="Solar Service & Wartung 2025: 24/7 Support, TÜV-zertifiziert, Reaktionszeit unter 24h, Monitoring, Performance Optimierung – passendes Servicepaket wählen." />
        <meta property="og:title" content="Solar-Service: Professionelle Wartung & Support" />
        <meta property="og:description" content="24/7 Solar-Service: Von jährlicher Inspektion bis Notfall-Reparatur. Maximale Anlagen-Verfügbarkeit garantiert." />
        <meta property="og:image" content="/Logo-ZOE.png" />
        <link rel="canonical" href="https://zoe-solar.de/service" />
      </Helmet>

      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4">
        <div className="pro-container flex items-center justify-center space-x-6">
          <Clock className="w-5 h-5" />
          <span className="font-semibold">🔥 €1.500 Bonus endet in:</span>
          <div className="flex space-x-2">
            <div className="bg-neutral-50/90 border border-neutral-200 px-3 py-1 rounded-lg">
              <div className="text-xl font-bold">{timeLeft.days}</div>
              <div className="text-xs sm:text-sm">Tage</div>
            </div>
            <div className="bg-neutral-50/90 border border-neutral-200 px-3 py-1 rounded-lg">
              <div className="text-xl font-bold">{timeLeft.hours}</div>
              <div className="text-xs sm:text-sm">Std</div>
            </div>
            <div className="bg-neutral-50/90 border border-neutral-200 px-3 py-1 rounded-lg">
              <div className="text-xl font-bold">{timeLeft.minutes}</div>
              <div className="text-xs sm:text-sm">Min</div>
            </div>
          </div>
          <Button className="bg-white text-red-600 hover:bg-neutral-100 font-semibold px-4 py-2">
            Jetzt sichern!
          </Button>
        </div>
      </div>

  {/* Hero Section */}
  <Section padding="normal" variant="gradient" className="bg-gradient-to-br from-blue-50 to-indigo-50" size="wide">
          <div className="text-center mb-16">
            <Pill variant="soft" color="neutral" className="mb-4">Service & Wartung</Pill>
            <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
              Rundum-Service für <span className="text-blue-600">maximale Sicherheit</span>
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
              Professionelle Wartung und 24/7 Support für Ihre Solaranlage.
              Maximale Leistung, minimale Sorgen.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-neutral-500">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-green-600" />
                24h Reaktionszeit
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1 text-blue-600" />
                TÜV-zertifiziert
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-1 text-purple-600" />
                15+ Jahre Erfahrung
              </div>
            </div>
          </div>

          {/* Service Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 tabular-nums">
            {serviceStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-neutral-900 mb-2 tabular-nums">{stat.number}</div>
                <div className="text-neutral-600">{stat.label}</div>
              </div>
            ))}
          </div>
  </Section>

  {/* Service Packages */}
  <Section padding="normal" variant="plain" size="wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Unsere Service-Pakete</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Wählen Sie das passende Service-Paket für Ihre Anlage
            </p>
          </div>

          <div className="cols-3-responsive gap-8 flow">
            {servicePackages.map((pkg, index) => (
              <Card key={index} className={`pro-card relative ${pkg.popular ? 'ring-2 ring-blue-500' : ''}`}>
        {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Pill variant="invert" color="info" className="px-4 py-1">Beliebt</Pill>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600 mt-2">{pkg.price}</div>
                  <p className="text-neutral-600 mt-2">{pkg.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6 text-base sm:text-lg">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={pkg.popular ? "default" : "outline"}
                    onClick={() => window.location.href = '/kontakt'}
                  >
                    {pkg.popular ? 'Jetzt wählen' : 'Anfragen'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
  </Section>

  {/* Emergency Services */}
  <Section padding="normal" variant="neutral" size="wide">
          <div className="text-center mb-16">
            <Pill variant="soft" color="danger" className="mb-4">Notfall-Service</Pill>
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Schnelle Hilfe im Notfall</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Bei Problemen sind wir sofort für Sie da
            </p>
          </div>

          <div className="cols-3-responsive gap-8 flow">
            {emergencyServices.map((service, index) => (
              <Card key={index} className="pro-card text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <p className="text-neutral-600 mb-4">{service.description}</p>
                  <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full">
                    <Clock className="w-4 h-4 mr-2" />
                    Reaktion: {service.response}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
  </Section>

  {/* Authority Section */}
  <Section padding="tight" variant="plain" size="wide">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-neutral-700 italic text-lg leading-relaxed mb-4">
                    "Der Service von ZOE Solar ist vorbildlich. Die Reaktionszeiten sind
                    außergewöhnlich schnell und die Qualität der Wartung erstklassig."
                  </p>
                  <div className="text-sm text-neutral-600">
                    <strong>Dr. Thomas Weber</strong> • Service-Management • TÜV Rheinland •
                    <span className="text-blue-600 font-semibold"> Qualitätskontrolleure</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
  </Section>

  {/* Loss Aversion */}
  <Section padding="tight" variant="gradient" className="bg-gradient-to-r from-red-50 to-orange-50" size="wide">
          <Card className="bg-white border border-red-200 shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                <h3 className="text-2xl font-bold text-red-700">Ohne Wartung: Teure Risiken</h3>
              </div>
              <p className="text-lg text-red-600 mb-6">
                Ohne regelmäßige Wartung sinkt der Ertrag um 10-20% pro Jahr.
                Schmutz, Defekte, Verschleiß kosten Sie €500-1.000/Jahr extra.
                Mit unserem Service sparen Sie €800+ jährlich!
              </p>
              <div className="cols-3-responsive gap-6 text-center tabular-nums">
                <div>
                  <div className="text-2xl font-bold text-red-600 tabular-nums">-20%</div>
                  <div className="text-sm text-red-600">Ertragsverlust ohne Wartung</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600 tabular-nums">€1.000+</div>
                  <div className="text-sm text-red-600">Jährliche Mehrkosten</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 tabular-nums">€800+</div>
                  <div className="text-sm text-green-600">Ersparnis mit Service</div>
                </div>
              </div>
            </CardContent>
          </Card>
  </Section>

  {/* Testimonials */}
  <Section padding="tight" variant="neutral" size="wide">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Service-Kundenstimmen</h2>
            <p className="text-neutral-600">Zuverlässigkeit, die überzeugt</p>
          </div>
          <div className="cols-3-responsive gap-6 flow">
            {testimonials.map((t,i)=>(
              <TestimonialCard
                key={i}
                name={t.name}
                location={t.location}
                text={t.text}
                rating={t.rating}
                tag={t.service}
                tagColor="neutral"
                variant="glass"
              />
            ))}
          </div>
  </Section>

  {/* CTA Section */}
  <Section padding="normal" variant="gradient" className="bg-gradient-to-r from-blue-600 to-green-600" size="wide">
        <div className="text-center">
          <div className="bg-white rounded-2xl p-12 flow border border-neutral-200 shadow-sm">
            <h2 className="text-3xl font-bold text-white mb-6">
              Sorgenfrei in die Zukunft
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Sichern Sie sich professionellen Service und maximale Anlagen-Leistung.
              Jetzt kostenlose Erstberatung anfordern.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-neutral-100 font-semibold px-8 py-4 text-lg"
                onClick={() => window.location.href = '/kontakt'}
              >
                <Phone className="w-5 h-5 mr-2" />
                Service anfordern
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/20 hover:text-neutral-900 font-semibold px-8 py-4 text-lg transition-colors"
                onClick={() => window.location.href = '/calculator'}
              >
                <Zap className="w-5 h-5 mr-2" />
                Ersparnis berechnen
              </Button>
            </div>

            {/* Reciprocity */}
            <Card className="bg-white border border-neutral-200 shadow-sm max-w-2xl mx-auto">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-green-400 mr-2" />
                  <h3 className="text-lg font-semibold text-white">Ihre Sicherheit geht vor</h3>
                </div>
                <p className="text-white/90">
                  Kostenlose Service-Inspektion (€120 Wert), 24/7 Notfall-Hotline,
                  Original-Ersatzteile, zertifizierte Techniker.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}
