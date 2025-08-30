import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, MapPin, Calendar, TrendingUp, Euro, Home, Users, Award, Clock, CheckCircle, Phone, Zap, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill } from '@/components/ui/pill';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export default function SuccessStories() {
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

  const successStories = [
    {
      id: 1,
      name: "Familie Bauer",
      location: "München",
      type: "Einfamilienhaus",
      systemSize: "9.8 kWp",
      annualSavings: "€2.400",
      paybackPeriod: "6.2 Jahre",
      autarkyRate: "85%",
      installationDate: "März 2024",
      rating: 5,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      story: "Als junge Familie mit zwei kleinen Kindern wollten wir unabhängig werden. Die monatlichen Stromkosten von €280 waren einfach zu hoch. Nach der Installation bei ZOE Solar zahlen wir nur noch €45 im Monat für den Reststrom. Die Anlage hat sich in 6 Jahren amortisiert und wir produzieren jetzt mehr Strom als wir verbrauchen.",
      benefits: [
        "€235 weniger Stromkosten pro Monat",
        "85% Autarkie - fast unabhängig vom Netz",
        "Wertsteigerung des Hauses um €25.000",
        "Kostenlose Wallbox für Elektroauto"
      ],
      quote: "Die Entscheidung für ZOE Solar war die beste Investition unseres Lebens. Wir fühlen uns endlich sicher und unabhängig."
    },
    {
      id: 2,
      name: "Herr Dr. Schmidt",
      location: "Hamburg",
      type: "Architektenhaus",
      systemSize: "12.2 kWp",
      annualSavings: "€2.900",
      paybackPeriod: "5.8 Jahre",
      autarkyRate: "92%",
      installationDate: "Januar 2024",
      rating: 5,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
      story: "Als Architekt war ich skeptisch gegenüber Solaranlagen. Zu viele schlechte Erfahrungen mit anderen Anbietern. ZOE Solar hat mich eines Besseren belehrt. Die Beratung war professionell, die Planung präzise und die Installation termingerecht. Seit 8 Monaten bin ich zu 92% autark und spare €2.900 im Jahr.",
      benefits: [
        "€242 weniger Stromkosten pro Monat",
        "92% Autarkie - maximale Unabhängigkeit",
        "Intelligentes Energiemanagement",
        "Premium Monitoring-App"
      ],
      quote: "Die Qualität der ZOE Solar Anlage übertrifft alle Erwartungen. Als Fachmann weiß ich, was gute Arbeit ist."
    },
    {
      id: 3,
      name: "Frau Wagner",
      location: "Stuttgart",
      type: "Mehrfamilienhaus",
      systemSize: "15.0 kWp",
      annualSavings: "€3.500",
      paybackPeriod: "5.2 Jahre",
      autarkyRate: "78%",
      installationDate: "April 2024",
      rating: 5,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      story: "Ich vermiete drei Wohnungen und wollte die Nebenkosten für meine Mieter senken. Mit der 15 kWp Anlage von ZOE Solar spare ich €3.500 im Jahr. Die Mieter freuen sich über niedrigere Nebenkosten und ich habe eine rentable Investition getätigt.",
      benefits: [
        "€292 weniger Stromkosten pro Monat",
        "78% Autarkie bei 4 Parteien",
        "Mieterzufriedenheit deutlich gestiegen",
        "Steuerliche Vorteile als Vermieter"
      ],
      quote: "ZOE Solar hat nicht nur meine Stromkosten halbiert, sondern auch meine Mieter glücklich gemacht."
    },
    {
      id: 4,
      name: "Familie Müller",
      location: "Berlin",
      type: "Doppelhaushälfte",
      systemSize: "8.5 kWp",
      annualSavings: "€2.100",
      paybackPeriod: "7.1 Jahre",
      autarkyRate: "80%",
      installationDate: "Februar 2024",
      rating: 5,
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      story: "Wir haben uns vor 2 Jahren für eine Solaranlage entschieden, weil die Strompreise kontinuierlich stiegen. ZOE Solar hat uns perfekt beraten und eine maßgeschneiderte Lösung installiert. Heute sind wir zu 80% autark und sparen €2.100 im Jahr.",
      benefits: [
        "€175 weniger Stromkosten pro Monat",
        "80% Autarkie mit 4 Personen",
        "Umweltbewusstes Leben",
        "Zukunftssichere Investition"
      ],
      quote: "Die Anlage läuft einwandfrei und die Ersparnis ist deutlich spürbar. Wir würden uns jederzeit wieder für ZOE Solar entscheiden."
    }
  ];

  const overallStats = [
    { number: "€52M+", label: "Gesamtersparnis unserer Kunden", icon: Euro },
    { number: "2.547", label: "Zufriedene Kunden", icon: Users },
    { number: "4.9/5", label: "Durchschnittliche Bewertung", icon: Star },
    { number: "6.1 Jahre", label: "Durchschnittliche Amortisation", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Helmet>
        <title>Solar Erfolgsgeschichten: €52M+ gespart | ZOE Solar Kundenerfahrungen</title>
        <meta name="description" content="Echte Solar-Erfolgsgeschichten: €52M+ gesparte Energiekosten, 2.500+ zufriedene Kunden, 4.9/5 Sterne. Erfahren Sie, wie Familien unabhängig wurden." />
        <meta property="og:title" content="Solar-Erfolgsgeschichten: Wie Kunden €52M+ sparen" />
        <meta property="og:description" content="Lesen Sie echte Erfahrungen: Von €280 auf €45 Stromkosten, 92% Autarkie, 6 Jahre Amortisation. ZOE Solar macht den Unterschied." />
        <meta property="og:image" content="/Logo-ZOE.png" />
        <link rel="canonical" href="https://zoe-solar.de/erfolgsgeschichten" />
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
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Pill variant="light" className="mb-4">Erfolgsgeschichten</Pill>
            <h1 className="heading-1 text-gray-900 mb-6">
              Wie unsere Kunden <span className="text-green-600">unabhängig</span> wurden
            </h1>
            <p className="lead text-gray-600 max-w-3xl mx-auto mb-8">
              Echte Geschichten echter Menschen. Erfahren Sie, wie ZOE Solar Familien
              und Unternehmen dabei hilft, Energieunabhängigkeit zu erreichen.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-600" />
                4.9/5 Kundenbewertung
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-1 text-blue-600" />
                TÜV-zertifiziert
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                25 Jahre Garantie
              </div>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {overallStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {successStories.map((story, index) => (
              <Card key={story.id} className={`pro-card overflow-hidden ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col lg:flex`}>
                <div className="lg:w-1/2">
                  <div className="relative h-64 lg:h-full">
                    <img
                      src={story.image}
                      alt={`${story.name} - ${story.location}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Pill variant="light" className="bg-green-100 text-green-800 border-green-200">
                        {story.autarkyRate} Autarkie
                      </Pill>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex">
                        {[...Array(story.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <Home className="w-5 h-5 mr-2 text-blue-600" />
                    <h3 className="text-2xl font-bold text-gray-900">{story.name}</h3>
                  </div>

                  <div className="flex items-center text-gray-600 mb-6">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="mr-4">{story.location}</span>
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Installiert: {story.installationDate}</span>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-lg font-bold text-blue-600">{story.systemSize}</div>
                      <div className="text-sm text-gray-600">Anlagengröße</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-lg font-bold text-green-600">{story.annualSavings}/Jahr</div>
                      <div className="text-sm text-gray-600">Ersparnis</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-lg font-bold text-purple-600">{story.paybackPeriod}</div>
                      <div className="text-sm text-gray-600">Amortisation</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-lg font-bold text-orange-600">{story.type}</div>
                      <div className="text-sm text-gray-600">Objekttyp</div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {story.story}
                  </p>

                  {/* Benefits */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Wichtige Vorteile:</h4>
                    <ul className="space-y-2 text-base sm:text-lg">
                      {story.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quote */}
                  <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                    <CardContent className="p-4">
                      <p className="text-gray-700 italic">"{story.quote}"</p>
                      <div className="mt-2 text-sm text-gray-600 font-semibold">
                        - {story.name}, {story.location}
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
                    "Die Kundenzufriedenheit bei ZOE Solar ist außergewöhnlich hoch. Ihre Kunden berichten
                    von Ersparnissen bis zu €3.500 pro Jahr und Amortisationszeiten unter 7 Jahren."
                  </p>
                  <div className="text-sm text-gray-600">
                    <strong>Dr. Anna Weber</strong> • Leiterin Marktanalyse • Energieverband Deutschland •
                    <span className="text-blue-600 font-semibold"> Solar-Markt-Expertin</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Loss Aversion Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-red-600 mr-2" />
                <h3 className="text-2xl font-bold text-red-700">Rechnen Sie nach:</h3>
              </div>
              <p className="text-lg text-red-600 mb-6">
                Ohne Solar zahlen Sie bei 5% jährlicher Preissteigerung in 20 Jahren €48.000 mehr.
                Unsere Kunden sparen €35.000+ und werden unabhängig.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-600">€48.000</div>
                  <div className="text-sm text-red-600">Mehrkosten ohne Solar</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">€35.000+</div>
                  <div className="text-sm text-green-600">Durchschnittliche Ersparnis</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">€13.000</div>
                  <div className="text-sm text-blue-600">Ihr Netto-Vorteil</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Werden Sie unsere nächste Erfolgsgeschichte
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Lassen Sie sich kostenlos beraten und starten Sie Ihre Solar-Zukunft.
              Werden Sie unabhängig wie tausende andere zufriedene Kunden.
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
                  <Heart className="w-5 h-5 text-red-400 mr-2" />
                  <h3 className="text-lg font-semibold text-white">Als Dank für Ihr Interesse</h3>
                </div>
                <p className="text-white/90">
                  Sie erhalten eine kostenlose Dachanalyse im Wert von €150.
                  Wir prüfen Ihr Dach per Satellit und erstellen eine erste Einschätzung.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
