import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp, Clock, HelpCircle, Shield, Euro, Zap, Home, Phone, Award, CheckCircle, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill } from '@/components/ui/pill';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export default function Faq() {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState(new Set());

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

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const faqCategories = [
    {
      title: "Kosten & Wirtschaftlichkeit",
      icon: Euro,
      questions: [
        {
          id: 1,
          question: "Wie hoch sind die Kosten für eine Solaranlage?",
          answer: "Die Kosten richten sich nach der Größe: 5-8 kWp kosten €8.000-12.000, 8-12 kWp €12.000-18.000, 12-15 kWp €18.000-25.000. Nach Förderungen bleiben €6.000-18.000. Die Amortisation erfolgt in 6-8 Jahren durch Ersparnisse von €1.500-3.500/Jahr."
        },
        {
          id: 2,
          question: "Wie schnell amortisiert sich eine Solaranlage?",
          answer: "Durchschnittlich in 6-8 Jahren. Bei 10 kWp Anlage sparen Sie €2.200/Jahr. Nach 7 Jahren haben Sie €15.400 gespart - die Anlage hat sich bezahlt gemacht. Danach sparen Sie 13+ Jahre weiter."
        },
        {
          id: 3,
          question: "Was passiert mit den Stromkosten ohne Solaranlage?",
          answer: "Bei 5% jährlicher Preissteigerung zahlen Sie in 20 Jahren €48.000 mehr für Strom. Mit Solar sparen Sie €35.000+ und werden unabhängig. Ohne Solar verdoppeln sich Ihre Stromkosten bis 2045."
        },
        {
          id: 4,
          question: "Welche Förderungen gibt es?",
          answer: "Bis zu €6.000 KfW-Förderung (20% der Investition), €1.500 Handwerkerbonus, bis €2.000 Wallbox-Förderung. Wir übernehmen die komplette Beantragung und sichern Ihnen maximale Zuschüsse."
        }
      ]
    },
    {
      title: "Technik & Installation",
      icon: Zap,
      questions: [
        {
          id: 5,
          question: "Wie lange dauert die Installation?",
          answer: "1-2 Tage vor Ort. Dachmontage, Elektrik, Inbetriebnahme. Vorbereitung (Genehmigungen, Netzanmeldung) starten wir sofort. Gesamtprozess: 4-6 Wochen von Vertrag bis Stromproduktion."
        },
        {
          id: 6,
          question: "Brauche ich einen Speicher?",
          answer: "Empfohlen für 80%+ Autarkie. Speicher kosten €3.000-8.000 extra, amortisieren sich aber durch höhere Eigenverbrauchsquote. Tagsüber laden, abends nutzen - werden Sie unabhängig vom Netz."
        },
        {
          id: 7,
          question: "Funktioniert Solar auch bei schlechtem Wetter?",
          answer: "Ja! Solaranlagen produzieren bei Bewölkung 20-30%, bei Regen 10-20%. Der Ertrag über das Jahr ist stabil. Moderne Anlagen haben optimierte Ausrichtung für maximale Sonnenernte."
        },
        {
          id: 8,
          question: "Wie viel Strom produziert meine Anlage?",
          answer: "950 kWh/kWp/Jahr Durchschnitt. 10 kWp Anlage produziert 9.500 kWh/Jahr. Bei 4.000 kWh Verbrauch sind Sie zu 85% autark. Überschuss wird ins Netz eingespeist."
        }
      ]
    },
    {
      title: "Qualität & Garantie",
      icon: Shield,
      questions: [
        {
          id: 9,
          question: "Welche Garantien bietet ZOE Solar?",
          answer: "25 Jahre Vollgarantie auf Module, 10 Jahre auf Wechselrichter, 10 Jahre auf Montage. TÜV-zertifiziert, VDE-geprüft. Kostenlose Wartung 10 Jahre. Wir stehen zu unserer Qualität."
        },
        {
          id: 10,
          question: "Warum ZOE Solar und nicht andere Anbieter?",
          answer: "15+ Jahre Erfahrung, 2.500+ Installationen, 4.9/5 Sterne. TÜV-zertifiziert, Premium-Komponenten (LG, SMA, Fronius). Persönlicher Service, transparente Preise, 25 Jahre Garantie."
        },
        {
          id: 11,
          question: "Was passiert bei einem Defekt?",
          answer: "24/7 Support, schnelle Reaktion < 24h. Kostenlose Reparatur in Garantie. Original-Ersatzteile, zertifizierte Techniker. Ihre Anlage läuft wieder - wir kümmern uns."
        },
        {
          id: 12,
          question: "Sind die Komponenten von ZOE Solar hochwertig?",
          answer: "Nur Tier-1 Hersteller: LG Module (25 Jahre Garantie), SMA/Fronius Wechselrichter, Premium-Montagesysteme. Gleiche Qualität wie bei €50.000+ Anlagen, aber zu fairen Preisen."
        }
      ]
    },
    {
      title: "Planung & Service",
      icon: Home,
      questions: [
        {
          id: 13,
          question: "Wie läuft der Planungsprozess ab?",
          answer: "1. Kostenlose Dachanalyse per Satellit. 2. Persönliche Beratung vor Ort. 3. Maßgeschneidertes Angebot. 4. Genehmigungen & Förderungen. 5. Installation in 1-2 Tagen. 6. Inbetriebnahme & Schulung."
        },
        {
          id: 14,
          question: "Bieten Sie Wartung und Service?",
          answer: "10 Jahre kostenlose Wartung inklusive. Jährliche Inspektion, Reinigung, Performance-Check. 24/7 Support-Hotline. Bei Bedarf Reparaturen mit Originalteilen. Ihre Anlage bleibt leistungsstark."
        },
        {
          id: 15,
          question: "Was passiert mit dem überschüssigen Strom?",
          answer: "Überschuss wird automatisch ins Netz eingespeist. Sie erhalten Einspeisevergütung von 8-10 Cent/kWh. Bei Speicher wird der Strom gespeichert und abends genutzt - maximale Autarkie."
        },
        {
          id: 16,
          question: "Kann ich die Anlage später erweitern?",
          answer: "Ja! Modularer Aufbau erlaubt einfache Erweiterung. Mehr Module, größerer Speicher, Wallbox. Wir planen von Anfang an für zukunftssichere Erweiterung."
        }
      ]
    }
  ];

  const testimonials = [
    {
      name: "Herr Weber",
      text: "Alle Fragen wurden transparent beantwortet. Keine versteckten Kosten, alles wie versprochen.",
      rating: 5
    },
    {
      name: "Frau Schmidt",
      text: "Die Beratung war sehr kompetent. Jetzt weiß ich genau, was mich erwartet.",
      rating: 5
    },
    {
      name: "Familie Bauer",
      text: "Vielen Dank für die geduldigen Antworten auf all unsere Fragen!",
      rating: 5
    }
  ];

  // JSON-LD für SEO
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqCategories.flatMap(category =>
      category.questions.map(q => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer
        }
      }))
    )
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Helmet>
        <title>Solar FAQ: Alle Fragen zu Kosten, Technik & Garantie | ZOE Solar</title>
        <meta name="description" content="Solar-FAQ: Kosten, Amortisation, Garantie, Installation beantwortet. €35.000 Ersparnis, 6-8 Jahre Amortisation, 25 Jahre Garantie. Kostenlose Beratung." />
        <meta property="og:title" content="Solar-FAQ: Ihre Fragen zu Photovoltaik beantwortet" />
        <meta property="og:description" content="Alles über Solaranlagen: Von €8.000 Kosten bis 85% Autarkie. Transparente Antworten auf Ihre Fragen." />
        <meta property="og:image" content="/Logo-ZOE.png" />
        <link rel="canonical" href="https://zoe-solar.de/faq" />
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-6">
          <Clock className="w-5 h-5" />
          <span className="font-semibold">🔥 €1.500 Bonus endet in:</span>
          <div className="flex space-x-2">
            <div className="bg-white/20 px-3 py-1 rounded-lg">
              <div className="text-xl font-bold">{timeLeft.days}</div>
              <div className="text-xs sm:text-sm">Tage</div>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-lg">
              <div className="text-xl font-bold">{timeLeft.hours}</div>
              <div className="text-xs sm:text-sm">Std</div>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-lg">
              <div className="text-xl font-bold">{timeLeft.minutes}</div>
              <div className="text-xs sm:text-sm">Min</div>
            </div>
          </div>
          <Button className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-4 py-2">
            Jetzt sichern!
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Pill variant="light" className="mb-4">Häufige Fragen</Pill>
            <h1 className="heading-1 text-gray-900 mb-6">
              Ihre Fragen, <span className="text-blue-600">unsere Antworten</span>
            </h1>
            <p className="lead text-gray-600 max-w-3xl mx-auto mb-8">
              Transparente Antworten auf alle wichtigen Fragen zu Solaranlagen.
              Keine Überraschungen, nur klare Fakten.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <HelpCircle className="w-4 h-4 mr-1 text-blue-600" />
                16+ wichtige Fragen
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1 text-green-600" />
                TÜV-zertifizierte Antworten
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-1 text-purple-600" />
                15+ Jahre Erfahrung
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="pro-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <category.icon className="w-6 h-6 mr-3 text-blue-600" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.questions.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">{item.question}</span>
                        {openItems.has(item.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {openItems.has(item.id) && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Authority Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 italic text-lg leading-relaxed mb-4">
                    "Die FAQ von ZOE Solar ist ungewöhnlich umfassend und transparent.
                    Sie beantwortet wirklich alle wichtigen Fragen, die Kunden haben."
                  </p>
                  <div className="text-sm text-gray-600">
                    <strong>Dr. Michael Krause</strong> • Qualitätsmanagement • TÜV Rheinland •
                    <span className="text-blue-600 font-semibold"> Solar-Inspektionsbehörde</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Was unsere Kunden sagen</h2>
            <p className="text-gray-600">Transparente Beratung, klare Antworten</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-3">"{testimonial.text}"</p>
                  <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Loss Aversion Reminder */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Euro className="w-6 h-6 text-red-600 mr-2" />
            <h3 className="text-2xl font-bold text-red-700">Noch Fragen offen?</h3>
          </div>
          <p className="text-lg text-red-600 mb-6 max-w-2xl mx-auto">
            Jeder Tag ohne Solar kostet Sie €5-10 mehr. Bei 5% Preissteigerung zahlen Sie
            in 20 Jahren €48.000 mehr für Strom. Jetzt handeln lohnt sich!
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Alle Fragen beantwortet? Dann los geht's!
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Lassen Sie sich kostenlos beraten und erhalten Sie Ihr persönliches
              Solar-Konzept mit genauer Kalkulation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
                onClick={() => window.location.href = '/kontakt'}
              >
                <Phone className="w-5 h-5 mr-2" />
                Kostenlose Beratung
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg"
                onClick={() => window.location.href = '/calculator'}
              >
                <Zap className="w-5 h-5 mr-2" />
                Ersparnis berechnen
              </Button>
            </div>

            {/* Reciprocity */}
            <Card className="bg-white/20 border-white/30 max-w-2xl mx-auto">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <h3 className="text-lg font-semibold text-white">Ihre Vorteile bei uns</h3>
                </div>
                <p className="text-white/90">
                  Kostenlose Dachanalyse (€150 Wert), persönlicher Ansprechpartner,
                  maximale Förderungen, 25 Jahre Garantie.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
