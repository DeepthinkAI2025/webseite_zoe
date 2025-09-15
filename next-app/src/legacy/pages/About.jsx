import React, { useState, useEffect } from "react";
import { Section } from '../components/ui/section';
import { Helmet } from 'react-helmet-async';
import { Award, Users, TrendingUp, Shield, CheckCircle, Clock, Star, MapPin, Euro, Heart, Zap, Home, Phone } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestimonialCard } from '@/components/ui/TestimonialCard';
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
  <title>Über ZOE Solar 2025 – Ihr verlässlicher Solarpartner DE</title>
  <meta name="description" content="ZOE Solar: 15+ Jahre Erfahrung, 2.500+ Installationen, TÜV zertifiziert – Partner für effiziente Solaranlagen mit 25 Jahren Garantie & Service in Deutschland." />
        <meta property="og:title" content="Über ZOE Solar: Experten für Solaranlagen seit 2009" />
        <meta property="og:description" content="2.500+ zufriedene Kunden, TÜV-zertifiziert, 25 Jahre Garantie. Erfahren Sie, warum wir der vertrauensvollste Solarpartner sind." />
        <meta property="og:image" content="/Logo-ZOE.png" />
        <link rel="canonical" href="https://zoe-solar.de/ueber-uns" />
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
  <Section padding="normal" variant="gradient" className="bg-gradient-to-br from-emerald-50 to-white" size="wide">
          <div className="text-center mb-16">
            <Pill variant="soft" color="neutral" className="mb-4">Über ZOE Solar</Pill>
            <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
              Ihr vertrauensvoller Partner für <span className="text-emerald-600">Solarenergie</span>
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
              Seit 2018 helfen wir Familien und Unternehmen dabei, energieautark zu werden und langfristig Kosten zu sparen. Unser Hauptsitz ist in Berlin, Kurfürstenstraße 124, 10785 Berlin. Kontakt: <a href="mailto:info@zoe-solar.de" className="text-blue-700 underline">info@zoe-solar.de</a> · Tel: <a href="tel:+4915678876200" className="text-blue-700 underline">+49-156-78876200</a>.
              <br />
              <span className="block mt-2">Social: 
                <a href="https://www.linkedin.com/company/91625256/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="mx-1 underline">LinkedIn</a>
                <a href="https://www.tiktok.com/@zoe_solar" target="_blank" rel="noopener noreferrer" className="mx-1 underline">TikTok</a>
                <a href="https://x.com/_zoe_solar" target="_blank" rel="noopener noreferrer" className="mx-1 underline">X</a>
                <a href="https://www.youtube.com/channel/UC8jo_fyVGSPKvRuS2ZWAvyA" target="_blank" rel="noopener noreferrer" className="mx-1 underline">YouTube</a>
                <a href="https://www.facebook.com/p/ZOE-Solar-100088899755919/" target="_blank" rel="noopener noreferrer" className="mx-1 underline">Facebook</a>
                <a href="https://www.instagram.com/_zoe_solar/" target="_blank" rel="noopener noreferrer" className="mx-1 underline">Instagram</a>
                <a href="https://de.pinterest.com/ZOEsolarDE/?actingBusinessId=1137159112069607884" target="_blank" rel="noopener noreferrer" className="mx-1 underline">Pinterest</a>
                <a href="https://wa.me/4915678876200" target="_blank" rel="noopener noreferrer" className="mx-1 underline">WhatsApp</a>
              </span>
              <span className="block mt-2">Online-Geschäftszeiten: 24/7</span>
              <span className="block mt-2">Gründungsdatum: 06.06.2018</span>
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-neutral-500">
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

          <div className="grid lg:grid-cols-2 gap-12 items-center flow">
            <div>
              <img
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="ZOE Solar Team bei der Arbeit"
                className="rounded-2xl shadow-2xl"
              />
            </div>

            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 text-center tabular-nums">
                  <div className="text-4xl font-bold text-emerald-600 tabular-nums">2.547+</div>
                  <div className="text-neutral-600">Installierte Anlagen</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 text-center tabular-nums">
                  <div className="text-4xl font-bold text-emerald-600 tabular-nums">15MW</div>
                  <div className="text-neutral-600">Installierte Leistung</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 text-center tabular-nums">
                  <div className="text-4xl font-bold text-emerald-600 tabular-nums">99.8%</div>
                  <div className="text-neutral-600">Kundenzufriedenheit</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 text-center tabular-nums">
                  <div className="text-4xl font-bold text-emerald-600 tabular-nums">25</div>
                  <div className="text-neutral-600">Jahre Garantie</div>
                </div>
              </div>

              {/* Loss Aversion */}
              <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-3 tabular-nums">
                    <TrendingUp className="w-5 h-5 text-red-600 mr-2" />
                    <h2 className="text-lg font-semibold text-red-700">Ohne Solar: <span className="tabular-nums">€48.000</span> teurer in 20 Jahren</h2>
                  </div>
                  <p className="text-red-600 tabular-nums">
                    Bei 5% jährlicher Strompreissteigerung zahlen Sie <span className="font-semibold">€48.000</span> mehr für Strom.
                    Mit Solar sparen Sie <span className="font-semibold">€35.000+</span> und werden unabhängig.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
  </Section>

  {/* Authority Quote */}
  <Section padding="tight" variant="plain" size="wide">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-neutral-700 italic text-lg leading-relaxed mb-4">
                    "ZOE Solar gehört zu den technisch versiertesten Solarunternehmen in Deutschland.
                    Ihre Systeme zeigen konstant überdurchschnittliche Performance und ihre
                    Kundenbetreuung ist vorbildlich."
                  </p>
                  <div className="text-sm text-neutral-600">
                    <strong>Prof. Dr. Klaus Fichter</strong> • Fraunhofer Institut für Solare Energiesysteme •
                    <span className="text-blue-600 font-semibold"> Leiter Solarforschung</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
  </Section>

  {/* Warum ZOE Solar Section */}
  <Section padding="normal" variant="neutral" size="wide">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Warum ZOE Solar die beste Wahl ist
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Wir kombinieren Premium-Qualität, jahrzehntelange Erfahrung und persönlichen Service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 flow">
            <Card className="pro-card text-center group hover:scale-105 transition-transform">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Premium Qualität</h3>
                <p className="text-neutral-600 mb-4">
                  Nur Tier-1 Module und Wechselrichter von führenden Herstellern wie LG, SMA und Fronius
                </p>
                <Pill variant="soft" color="emerald">TÜV-zertifiziert</Pill>
              </CardContent>
            </Card>

            <Card className="pro-card text-center group hover:scale-105 transition-transform">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Persönlicher Service</h3>
                <p className="text-neutral-600 mb-4">
                  Ein fester Ansprechpartner von der ersten Beratung bis zur lebenslangen Wartung
                </p>
                <Pill variant="soft" color="info">24/7 Support</Pill>
              </CardContent>
            </Card>

            <Card className="pro-card text-center group hover:scale-105 transition-transform">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Maximale Erträge</h3>
                <p className="text-neutral-600 mb-4">
                  Intelligente Planung für optimale Sonnenernte - durchschnittlich 15% mehr Ertrag
                </p>
                <Pill variant="soft" color="emerald">+15% Ertrag</Pill>
              </CardContent>
            </Card>

            <Card className="pro-card text-center group hover:scale-105 transition-transform">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Rundum-Sorglos</h3>
                <p className="text-neutral-600 mb-4">
                  25 Jahre Vollgarantie und kostenloser Wartungsservice inklusive
                </p>
                <Pill variant="soft" color="purple">25 Jahre Garantie</Pill>
              </CardContent>
            </Card>
          </div>
  </Section>

  {/* Team Section */}
  <Section padding="normal" variant="plain" size="wide">
          <div className="text-center mb-16">
            <Pill variant="soft" color="neutral" className="mb-4">Unser Team</Pill>
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Die Experten hinter ZOE Solar
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Unser erfahrenes Team aus Ingenieuren und Solartechnikern
              sorgt für Ihre perfekte Solaranlage
            </p>
          </div>

          <div className="cols-3-responsive gap-8 flow">
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
                  <p className="text-neutral-600 mb-3">{member.experience}</p>
                  <p className="text-sm text-blue-600 font-medium mb-3">{member.credentials}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.specializations.map((spec, i) => (
                      <Pill key={i} variant="soft" color="neutral" className="text-xs sm:text-sm">
                        {spec}
                      </Pill>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
  </Section>

  {/* Social Proof - Testimonials */}
  <Section padding="normal" variant="neutral" size="wide">
          <div className="text-center mb-16">
            <Pill variant="soft" color="neutral" className="mb-4">Kundenstimmen</Pill>
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Was unsere Kunden sagen
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Über 2.500 zufriedene Kunden vertrauen auf ZOE Solar
            </p>
          </div>

          <div className="cols-3-responsive gap-8 flow">
              {testimonials.map((t,i)=>(
                <TestimonialCard
                  key={i}
                  name={t.name}
                  location={t.location}
                  text={t.text}
                  savings={`${t.savings}/Jahr gespart`}
                  rating={t.rating}
                  tag={t.project}
                  tagColor="neutral"
                  variant="glass"
                />
              ))}
          </div>
  </Section>

  {/* Certifications Section */}
  <Section padding="normal" variant="plain" size="wide">
          <div className="text-center mb-16">
            <Pill variant="soft" color="neutral" className="mb-4">Zertifizierungen</Pill>
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Höchste Qualitätsstandards
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Alle unsere Produkte und Dienstleistungen entsprechen den strengsten
              europäischen Qualitäts- und Sicherheitsstandards
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-12 border border-neutral-100 flow">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                  <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <span className="font-medium text-neutral-900">{cert}</span>
                </div>
              ))}
            </div>
            <div className="text-center flow">
              <p className="text-lg text-neutral-600">
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
  </Section>

  {/* CTA Section */}
  <Section padding="normal" variant="gradient" className="bg-gradient-to-r from-blue-600 to-green-600" size="wide">
        <div className="text-center">
          <div className="bg-white rounded-2xl p-12 flow border border-neutral-200 shadow-sm">
            <h2 className="text-3xl font-bold text-white mb-6">
              Bereit für Ihre Solar-Zukunft?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Lassen Sie sich kostenlos beraten und erhalten Sie Ihr persönliches Solar-Konzept
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-neutral-100 font-semibold px-8 py-4 text-lg"
                onClick={() => window.location.href = '/kontakt'}
              >
                <Phone className="w-5 h-5 mr-2" />
                Kostenlose Beratung
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/20 hover:text-neutral-900 font-semibold px-8 py-4 text-lg transition-colors"
                onClick={() => window.location.href = '/calculator'}
              >
                <Zap className="w-5 h-5 mr-2" />
                Solar-Rechner testen
              </Button>
            </div>

            {/* Reciprocity */}
            <Card className="bg-white border border-neutral-200 shadow-sm max-w-2xl mx-auto">
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
      </Section>
    </div>
  );
}