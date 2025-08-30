import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { createPageUrl } from "@/utils";
import {
  CheckCircle,
  Star,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Battery,
  Calculator,
  Phone,
  Award,
  Users,
  Euro,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";

export default function Pricing() {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2025-09-15T23:59:59');
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const packages = [
    {
      name: "Solar Basic",
      price: "18.900€",
      originalPrice: "22.500€",
      savings: "3.600€",
      description: "Perfekt für den Einstieg in die Energiewende",
      features: [
        "6 kWp Solarmodule (Heckert)",
        "5 kW Hybrid-Wechselrichter (SMA)",
        "Kein Stromspeicher",
        "25 Jahre Komplettgarantie",
        "Montage & Inbetriebnahme",
        "Förderungsabwicklung"
      ],
      popular: false,
      roi: "~7 Jahre",
      yearlySavings: "~1.800€"
    },
    {
      name: "Solar Komplett",
      price: "24.900€",
      originalPrice: "29.500€",
      savings: "4.600€",
      description: "Die beliebteste Wahl für maximale Unabhängigkeit",
      features: [
        "8 kWp Solarmodule (Heckert)",
        "8 kW Hybrid-Wechselrichter (SMA)",
        "10 kWh LiFePO4-Speicher (BYD)",
        "25 Jahre Komplettgarantie",
        "Montage & Inbetriebnahme",
        "Förderungsabwicklung",
        "Wallbox Vorbereitung"
      ],
      popular: true,
      roi: "~6 Jahre",
      yearlySavings: "~2.400€"
    },
    {
      name: "Solar Premium",
      price: "32.900€",
      originalPrice: "38.500€",
      savings: "5.600€",
      description: "Für höchste Ansprüche und Zukunftssicherheit",
      features: [
        "10 kWp Solarmodule (Meyer Burger)",
        "10 kW Hybrid-Wechselrichter (Fronius)",
        "15 kWh LiFePO4-Speicher (LG)",
        "25 Jahre Komplettgarantie",
        "Montage & Inbetriebnahme",
        "Förderungsabwicklung",
        "Wallbox inklusive (11 kW)",
        "Premium-Monitoring"
      ],
      popular: false,
      roi: "~5.5 Jahre",
      yearlySavings: "~3.200€"
    }
  ];

  const testimonials = [
    {
      name: "Familie Weber",
      package: "Solar Komplett",
      rating: 5,
      savings: "€2.100/Jahr",
      text: "Die Investition hat sich bereits nach 5 Jahren amortisiert. Wir sind komplett unabhängig und sparen jeden Monat.",
      location: "Stuttgart"
    },
    {
      name: "Herr Bauer",
      package: "Solar Basic",
      rating: 5,
      savings: "€1.600/Jahr",
      text: "Klares Preis-Leistungs-Verhältnis. Die Beratung war hervorragend und der Service ist erstklassig.",
      location: "Hamburg"
    }
  ];

  return (
    <div className="bg-white">
      <Helmet>
        <title>Solaranlagen Preise 2025 – Festpreise + Förderung | ZOE Solar</title>
        <meta name="description" content="Solaranlage kaufen: Ab 18.900€ inkl. Förderung. Festpreise, 25 Jahre Garantie, TÜV-zertifiziert. Jetzt kostenlose Beratung!" />
        <meta property="og:title" content="Solaranlagen Preise 2025 – Festpreise + Förderung | ZOE Solar" />
        <meta property="og:description" content="Solaranlage kaufen: Ab 18.900€ inkl. Förderung. Festpreise, 25 Jahre Garantie, TÜV-zertifiziert." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Sonderaktion endet in:</span>
            <div className="flex space-x-2">
              <span className="bg-white/20 px-2 py-1 rounded text-sm">
                {timeLeft.days}T {timeLeft.hours}H {timeLeft.minutes}M {timeLeft.seconds}S
              </span>
            </div>
            <span className="text-sm">1.500€ Winterbonus + kostenlose Wallbox</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-white py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Pill variant="light" className="mb-4">Festpreise 2025</Pill>
          <h1 className="heading-1 text-gray-800">Solaranlage kaufen – transparente Preise</h1>
          <p className="lead text-gray-600 max-w-3xl mx-auto mt-6">
            Keine versteckten Kosten, keine Überraschungen. Festpreise inklusive Förderung, Montage und 25 Jahren Garantie.
          </p>

          {/* Loss Aversion Stats */}
          <div className="mt-12 bg-red-50 border border-red-200 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-red-600 mr-2" />
              <h3 className="text-2xl font-bold text-red-800">Ohne Solar zahlen Sie mehr</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-red-600">+€2.400</div>
                <div className="text-sm text-gray-600">Jährliche Mehrkosten</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-red-600">€48.000</div>
                <div className="text-sm text-gray-600">In 20 Jahren ohne Solar</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-emerald-600">€0</div>
                <div className="text-sm text-gray-600">Mit unserer Solaranlage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 content-lg">
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative shadow-lg hover:shadow-2xl transition-shadow pro-card ${pkg.popular ? 'ring-2 ring-emerald-500' : ''}`}>
        {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Pill variant="custom" className="bg-emerald-500 text-white border-emerald-600 px-4 py-2">Am beliebtesten</Pill>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl text-gray-800">{pkg.name}</CardTitle>
                  <p className="text-gray-600 mt-2">{pkg.description}</p>

                  <div className="mt-6">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-4xl font-bold text-gray-800">{pkg.price}</span>
                      <span className="text-lg text-gray-500 line-through">{pkg.originalPrice}</span>
                    </div>
                    <div className="text-emerald-600 font-semibold mt-1">Sie sparen {pkg.savings}</div>
                    <div className="text-sm text-gray-500 mt-2">inkl. 25% Förderung & Montage</div>
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8 text-base sm:text-lg">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* ROI Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Jährliche Ersparnis:</span>
                      <span className="font-semibold text-emerald-600">{pkg.yearlySavings}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-600">Amortisation:</span>
                      <span className="font-semibold text-emerald-600">{pkg.roi}</span>
                    </div>
                  </div>

                  <Link to={createPageUrl("Contact")} className="block">
                    <Button className={`w-full ${pkg.popular ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}>
                      {pkg.popular ? 'Jetzt beliebtestes Paket wählen' : 'Jetzt anfragen'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Authority Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Award className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Warum Sie uns vertrauen können</h2>
            <p className="mt-4 text-xl text-gray-600">TÜV-zertifizierte Qualität mit 25 Jahren Garantie</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">TÜV-zertifiziert</h3>
              <p className="text-sm text-gray-600">Alle Anlagen nach höchsten Standards geprüft</p>
            </div>
            <div className="text-center">
              <Euro className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Festpreisgarantie</h3>
              <p className="text-sm text-gray-600">Keine Preissteigerungen während der Planung</p>
            </div>
            <div className="text-center">
              <Home className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">25 Jahre Garantie</h3>
              <p className="text-sm text-gray-600">Komplettschutz für Ihre Investition</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">2.500+ Kunden</h3>
              <p className="text-sm text-gray-600">Zufriedenheit mit 4.9/5 Sternen</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Was unsere Kunden sagen</h2>
            <p className="mt-4 text-xl text-gray-600">Erfahrungen mit unseren Solarpaketen</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-lg pro-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <Pill variant="light" className="ml-4 bg-emerald-100 text-emerald-800 border-emerald-200">{testimonial.package}</Pill>
                  </div>

                  <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-emerald-600">{testimonial.savings}</div>
                      <div className="text-sm text-gray-600">jährlich</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reciprocity CTA */}
      <section className="bg-emerald-600 py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Calculator className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold mb-4">
            Kostenloses Angebot in 2 Minuten
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Wir analysieren Ihr Dach kostenlos und erstellen Ihnen ein maßgeschneidertes Festpreis-Angebot – ohne Verpflichtung.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Calculator")}>
              <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
                <Calculator className="w-4 h-4 mr-2" />
                Jetzt Ersparnis berechnen
              </Button>
            </Link>
            <Link to={createPageUrl("Contact")}>
              <Button size="lg" className="bg-emerald-700 hover:bg-emerald-800 border border-white">
                <Phone className="w-4 h-4 mr-2" />
                Kostenlose Beratung
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
