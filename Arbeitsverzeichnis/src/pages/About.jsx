import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { Award, Users, TrendingUp, Shield, CheckCircle, Clock, Star, MapPin, Euro, Heart, Zap, Home, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

export default function About() {
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

  const certifications = [
    "TÜV Rheinland zertifiziert",
    "VDE Prüfzeichen",
    "CE Kennzeichnung",
    "IEC 61215 Standard",
    "Handwerkskammer registriert"
  ];

  const teamMembers = [
    {
      name: "Stefan Zimmermann",
      role: "Geschäftsführer & Solaringenieur",
      experience: "15+ Jahre Erfahrung",
      credentials: "Diplom-Ingenieur TU München",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      specializations: ["Systemplanung", "Großanlagen", "Forschung & Entwicklung"]
    },
    {
      name: "Maria Schneider",
      role: "Leiterin Kundenbetreuung",
      experience: "12+ Jahre Erfahrung",
      credentials: "Zertifizierte Solarberaterin",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      specializations: ["Kundenberatung", "Projektmanagement", "Qualitätssicherung"]
    },
    {
      name: "Thomas Bauer",
      role: "Technischer Leiter",
      experience: "18+ Jahre Erfahrung",
      credentials: "Master Elektrotechnik",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      specializations: ["Elektrotechnik", "Systemoptimierung", "Wartung & Service"]
    }
  ];

  const testimonials = [
    {
      name: "Familie Weber",
      location: "Stuttgart",
      rating: 5,
      savings: "€3,800/Jahr",
      text: "ZOE Solar hat unser Leben verändert. Von der ersten Beratung bis zur Installation - alles professionell und zuverlässig. Wir sparen €3.800 im Jahr!",
      project: "12 kWp Anlage mit Speicher"
    },
    {
      name: "Herr Dr. Müller",
      location: "München",
      rating: 5,
      savings: "€4,200/Jahr",
      text: "Als Ingenieur schätze ich die technische Kompetenz. Die Anlage übertrifft alle Erwartungen. Hervorragender Service!",
      project: "15 kWp Premium-Anlage"
    },
    {
      name: "Frau Schmidt",
      location: "Hamburg",
      rating: 5,
      savings: "€2,900/Jahr",
      text: "Endlich unabhängig vom Stromkonzern! Die Beratung war kostenlos und das Team hat alles perfekt geplant.",
      project: "10 kWp Komplettsystem"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Helmet>
        <title>Über ZOE Solar: Ihr vertrauensvoller Solarpartner | TÜV-zertifiziert</title>
        <meta name="description" content="Erfahren Sie mehr über ZOE Solar: 15+ Jahre Erfahrung, 2.500+ Installationen, TÜV-zertifiziert. Ihr Partner für Solaranlagen mit 25 Jahren Garantie." />
        <meta property="og:title" content="Über ZOE Solar: Experten für Solaranlagen seit 2009" />
        <meta property="og:description" content="2.500+ zufriedene Kunden, TÜV-zertifiziert, 25 Jahre Garantie. Erfahren Sie, warum wir der vertrauensvollste Solarpartner sind." />
        <meta property="og:image" content="/Logo-ZOE.png" />
        <link rel="canonical" href="https://zoe-solar.de/ueber-uns" />
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
      <section className="bg-gradient-to-br from-emerald-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Pill variant="light" className="mb-4">Über ZOE Solar</Pill>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Ihr vertrauensvoller Partner für <span className="text-emerald-600">Solarenergie</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Seit über 15 Jahren helfen wir Familien und Unternehmen dabei,
              energieautark zu werden und langfristig Kosten zu sparen.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1 text-green-600" />
                TÜV-zertifiziert
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-1 text-blue-600" />
                2.500+ Installationen
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-600" />
                4.9/5 Kundenbewertung
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="ZOE Solar Team bei der Arbeit"
                className="rounded-2xl shadow-2xl"
              />
            </div>

            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white/70 p-6 rounded-xl shadow-lg text-center">
                  <div className="text-4xl font-bold text-emerald-600">2.547+</div>
                  <div className="text-gray-600">Installierte Anlagen</div>
                </div>
                <div className="bg-white/70 p-6 rounded-xl shadow-lg text-center">
                  <div className="text-4xl font-bold text-emerald-600">15MW</div>
                  <div className="text-gray-600">Installierte Leistung</div>
                </div>
                <div className="bg-white/70 p-6 rounded-xl shadow-lg text-center">
                  <div className="text-4xl font-bold text-emerald-600">99.8%</div>
                  <div className="text-gray-600">Kundenzufriedenheit</div>
                </div>
                <div className="bg-white/70 p-6 rounded-xl shadow-lg text-center">
                  <div className="text-4xl font-bold text-emerald-600">25</div>
                  <div className="text-gray-600">Jahre Garantie</div>
                </div>
              </div>

              {/* Loss Aversion */}
              <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <TrendingUp className="w-5 h-5 text-red-600 mr-2" />
                    <h3 className="text-lg font-semibold text-red-700">Ohne Solar: €48.000 teurer in 20 Jahren</h3>
                  </div>
                  <p className="text-red-600">
                    Bei 5% jährlicher Strompreissteigerung zahlen Sie €48.000 mehr für Strom.
                    Mit Solar sparen Sie €35.000+ und werden unabhängig.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Quote */}
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
                    "ZOE Solar gehört zu den technisch versiertesten Solarunternehmen in Deutschland.
                    Ihre Systeme zeigen konstant überdurchschnittliche Performance und ihre
                    Kundenbetreuung ist vorbildlich."
                  </p>
                  <div className="text-sm text-gray-600">
                    <strong>Prof. Dr. Klaus Fichter</strong> • Fraunhofer Institut für Solare Energiesysteme •
                    <span className="text-blue-600 font-semibold"> Leiter Solarforschung</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Warum ZOE Solar Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Warum ZOE Solar die beste Wahl ist
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Wir kombinieren Premium-Qualität, jahrzehntelange Erfahrung und persönlichen Service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="pro-card text-center group hover:scale-105 transition-transform">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Premium Qualität</h3>
                <p className="text-gray-600 mb-4">
                  Nur Tier-1 Module und Wechselrichter von führenden Herstellern wie LG, SMA und Fronius
                </p>
                <Pill variant="light" className="bg-emerald-100 text-emerald-800 border-emerald-200">TÜV-zertifiziert</Pill>
              </CardContent>
            </Card>

            <Card className="pro-card text-center group hover:scale-105 transition-transform">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Persönlicher Service</h3>
                <p className="text-gray-600 mb-4">
                  Ein fester Ansprechpartner von der ersten Beratung bis zur lebenslangen Wartung
                </p>
                <Pill variant="light" className="bg-blue-100 text-blue-800 border-blue-200">24/7 Support</Pill>
              </CardContent>
            </Card>

            <Card className="pro-card text-center group hover:scale-105 transition-transform">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Maximale Erträge</h3>
                <p className="text-gray-600 mb-4">
                  Intelligente Planung für optimale Sonnenernte - durchschnittlich 15% mehr Ertrag
                </p>
                <Pill variant="light" className="bg-green-100 text-green-800 border-green-200">+15% Ertrag</Pill>
              </CardContent>
            </Card>

            <Card className="pro-card text-center group hover:scale-105 transition-transform">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Rundum-Sorglos</h3>
                <p className="text-gray-600 mb-4">
                  25 Jahre Vollgarantie und kostenloser Wartungsservice inklusive
                </p>
                <Pill variant="light" className="bg-purple-100 text-purple-800 border-purple-200">25 Jahre Garantie</Pill>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Pill variant="light" className="mb-4">Unser Team</Pill>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Die Experten hinter ZOE Solar
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unser erfahrenes Team aus Ingenieuren und Solartechnikern
              sorgt für Ihre perfekte Solaranlage
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="pro-card overflow-hidden group hover:scale-105 transition-transform">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-emerald-600 font-semibold mb-2">{member.role}</p>
                  <p className="text-gray-600 mb-3">{member.experience}</p>
                  <p className="text-sm text-blue-600 font-medium mb-3">{member.credentials}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.specializations.map((spec, i) => (
                      <Pill key={i} variant="light" className="text-xs sm:text-sm">
                        {spec}
                      </Pill>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Pill variant="light" className="mb-4">Kundenstimmen</Pill>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Was unsere Kunden sagen
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Über 2.500 zufriedene Kunden vertrauen auf ZOE Solar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="pro-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{testimonial.name}</span>
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      {testimonial.location}
                    </div>
                    <Pill variant="light" className="text-xs sm:text-sm">
                      {testimonial.savings}/Jahr gespart
                    </Pill>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">{testimonial.project}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Pill variant="light" className="mb-4">Zertifizierungen</Pill>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Höchste Qualitätsstandards
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Alle unsere Produkte und Dienstleistungen entsprechen den strengsten
              europäischen Qualitäts- und Sicherheitsstandards
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <span className="font-medium text-gray-900">{cert}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg text-gray-600 mb-6">
                Zusätzlich sind wir Mitglied im <strong className="text-blue-600">Bundesverband Solarwirtschaft</strong>
                und unterliegen regelmäßigen Qualitätskontrollen.
              </p>
              <div className="flex justify-center space-x-8 opacity-80">
                <div className="w-20 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center text-xs sm:text-sm font-bold text-white">TÜV</div>
                <div className="w-20 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded flex items-center justify-center text-xs sm:text-sm font-bold text-white">VDE</div>
                <div className="w-20 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded flex items-center justify-center text-xs sm:text-sm font-bold text-white">CE</div>
                <div className="w-20 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded flex items-center justify-center text-xs sm:text-sm font-bold text-white">IEC</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Bereit für Ihre Solar-Zukunft?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Lassen Sie sich kostenlos beraten und erhalten Sie Ihr persönliches Solar-Konzept
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