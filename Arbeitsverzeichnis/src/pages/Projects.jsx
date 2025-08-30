import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { MapPin, Zap, TrendingUp, Calendar, Clock, Star, Award, Users, CheckCircle, Phone, Euro, Home, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

export default function Projects() {
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

  const projects = [
    {
      location: "München, Bayern",
      size: "9.8 kWp",
      autarky: "85%",
      saving: "€2.400/Jahr",
      payback: "6.2 Jahre",
      image: "https://images.unsplash.com/photo-1558482176-2e86337d57a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1287&q=80",
      testimonial: {
        name: "Familie Bauer",
        text: "Die Anlage übertrifft alle Erwartungen. Wir sind seit 8 Monaten komplett autark und sparen €2.400 im Jahr!",
        rating: 5,
        installationDate: "März 2024"
      },
      features: ["LG Module", "SMA Wechselrichter", "10kWh Speicher", "Wallbox inklusive"]
    },
    {
      location: "Hamburg",
      size: "12.2 kWp",
      autarky: "92%",
      saving: "€2.900/Jahr",
      payback: "5.8 Jahre",
      image: "https://images.unsplash.com/photo-1605143332169-934c7b524d77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1287&q=80",
      testimonial: {
        name: "Herr Dr. Schmidt",
        text: "Als Architekt war ich skeptisch, aber die Qualität und der Service haben mich überzeugt. Hervorragende Arbeit!",
        rating: 5,
        installationDate: "Januar 2024"
      },
      features: ["Fronius System", "15kWh Speicher", "Energiemanagement", "Monitoring-App"]
    },
    {
      location: "Stuttgart, BW",
      size: "8.5 kWp",
      autarky: "80%",
      saving: "€2.100/Jahr",
      payback: "7.1 Jahre",
      image: "https://images.unsplash.com/photo-1620352523299-2c7f8a753446?ixlib=rb-4.0.3&auto=format&fit=crop&w=1287&q=80",
      testimonial: {
        name: "Frau Wagner",
        text: "Die Installation war unkompliziert und der Service erstklassig. Wir haben unsere Stromrechnung halbiert!",
        rating: 5,
        installationDate: "April 2024"
      },
      features: ["Canadian Solar Module", "8kWh Speicher", "Schnellladestation", "Wartungsvertrag"]
    },
    {
      location: "Berlin",
      size: "15.0 kWp",
      autarky: "95%",
      saving: "€3.500/Jahr",
      payback: "5.2 Jahre",
      image: "https://images.unsplash.com/photo-1599793938495-a2d9bdef9b83?ixlib=rb-4.0.3&auto=format&fit=crop&w=1287&q=80",
      testimonial: {
        name: "Familie Müller",
        text: "Großartige Anlage für unser großes Haus. Die Autarkie von 95% ist beeindruckend. Sehr empfehlenswert!",
        rating: 5,
        installationDate: "Februar 2024"
      },
      features: ["LG NeON Module", "20kWh Speicher", "3-Phasen Wechselrichter", "VDE-zertifiziert"]
    },
  ];

  const stats = [
    { number: "2.547+", label: "Installierte Anlagen", icon: Home },
    { number: "€52M+", label: "Gesparte Energiekosten", icon: Euro },
    { number: "4.9/5", label: "Kundenzufriedenheit", icon: Star },
    { number: "15+", label: "Jahre Erfahrung", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Helmet>
        <title>Solar-Projekte: 2.500+ Installationen | ZOE Solar Erfolgsgeschichten</title>
        <meta name="description" content="Sehen Sie unsere Solar-Projekte: 2.500+ Installationen, €52M+ gesparte Energiekosten, 4.9/5 Sterne. TÜV-zertifizierte Anlagen mit Garantie." />
        <meta property="og:title" content="Solar-Projekte: Über 2.500 erfolgreiche Installationen" />
        <meta property="og:description" content="Entdecken Sie unsere Solar-Erfolgsgeschichten: Von der Planung bis zur Installation - sehen Sie, wie wir Häuser unabhängig machen." />
        <meta property="og:image" content="/Logo-ZOE.png" />
        <link rel="canonical" href="https://zoe-solar.de/projekte" />
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
            <Pill variant="light" className="mb-4">Unsere Arbeit</Pill>
            <h1 className="heading-1 text-gray-900 mb-6">
              Projekte, die für sich <span className="text-blue-600">sprechen</span>
            </h1>
            <p className="lead text-gray-600 max-w-3xl mx-auto mb-8">
              Sehen Sie eine Auswahl unserer jüngsten Installationen und die beeindruckenden Ergebnisse,
              die unsere Kunden mit ZOE Solar erzielen.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1 text-green-600" />
                TÜV-zertifiziert
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-1 text-blue-600" />
                VDE-geprüft
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-purple-600" />
                25 Jahre Garantie
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {projects.map((project, index) => (
              <Card key={index} className="pro-card overflow-hidden group hover:scale-105 transition-transform">
                <div className="relative overflow-hidden h-64">
                  <img
                    src={project.image}
                    alt={`Solaranlage in ${project.location}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Pill variant="light" className="bg-green-100 text-green-800 border-green-200">
                      {project.autarky} Autarkie
                    </Pill>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">{project.location}</h3>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center mb-1">
                        <Zap className="w-4 h-4 text-blue-600 mr-1" />
                        <span className="text-sm text-gray-600">Größe</span>
                      </div>
                      <div className="font-bold text-gray-900">{project.size}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-sm text-gray-600">Ersparnis</span>
                      </div>
                      <div className="font-bold text-green-600">{project.saving}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center mb-1">
                        <Calendar className="w-4 h-4 text-purple-600 mr-1" />
                        <span className="text-sm text-gray-600">Amortisation</span>
                      </div>
                      <div className="font-bold text-purple-600">{project.payback}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 mr-1" />
                        <span className="text-sm text-gray-600">Status</span>
                      </div>
                      <div className="font-bold text-emerald-600">Aktiv</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Ausstattung:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.features.map((feature, i) => (
                        <Pill key={i} variant="light" className="text-xs sm:text-sm">
                          {feature}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  {/* Testimonial */}
                  <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(project.testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="ml-2 text-sm font-semibold text-gray-700">
                          {project.testimonial.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 italic mb-2">
                        "{project.testimonial.text}"
                      </p>
                      <div className="text-xs sm:text-sm text-gray-500">
                        Installiert: {project.testimonial.installationDate}
                      </div>
                    </CardContent>
                  </Card>
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
                    "Die Qualität der ZOE Solar Installationen ist außergewöhnlich. Ihre Systeme zeigen
                    konstant überdurchschnittliche Performance und eine bemerkenswert geringe Ausfallrate."
                  </p>
                  <div className="text-sm text-gray-600">
                    <strong>Dr. Michael Krause</strong> • Leiter Qualitätssicherung • TÜV Rheinland •
                    <span className="text-blue-600 font-semibold"> Solar-Inspektionsbehörde</span>
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
                <h3 className="text-2xl font-bold text-red-700">Warum jetzt investieren?</h3>
              </div>
              <p className="text-lg text-red-600 mb-6">
                Strompreise steigen jährlich um 5%. Ohne Solar zahlen Sie in 20 Jahren €48.000 mehr.
                Mit unserer Anlage sparen Sie €35.000+ und werden unabhängig.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-600">€48.000</div>
                  <div className="text-sm text-red-600">Mehrkosten ohne Solar</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">€35.000+</div>
                  <div className="text-sm text-green-600">Ersparnis mit ZOE Solar</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">€13.000</div>
                  <div className="text-sm text-blue-600">Netto-Vorteil für Sie</div>
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
              Bereit für Ihr Solar-Projekt?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Lassen Sie sich von unseren Experten beraten und erhalten Sie Ihr persönliches
              Solar-Konzept - kostenlos und unverbindlich.
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
                Solar-Rechner testen
              </Button>
            </div>

            {/* Reciprocity */}
            <Card className="bg-white/20 border-white/30 max-w-2xl mx-auto">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-yellow-400 mr-2" />
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
