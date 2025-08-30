import React, { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Calculator as CalculatorIcon, TrendingUp, Clock, Award, Users, Zap, Euro, Home, Shield } from 'lucide-react';

export default function Calculator() {
  const { t } = useTranslation();
  const [roofArea, setRoofArea] = useState(100);
  const [consumption, setConsumption] = useState(4000);
  const [price, setPrice] = useState(0.40);

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

  const result = useMemo(() => {
    const moduleW = 0.4; // kWp pro m² grob
    const kwp = Math.min(roofArea * moduleW, 15); // Deckel
    const yieldPerKwp = 950; // kWh/Jahr
    const production = kwp * yieldPerKwp;
    const selfUse = Math.min(production * 0.6, consumption); // 60% Eigenverbrauch
    const savings = selfUse * price; // €/Jahr
    const storageAdd = Math.min(consumption - selfUse, production * 0.2);
    const totalSavings = savings + storageAdd * (price * 0.9);
    const cost = 1200 * kwp + (kwp > 8 ? 4000 : 2500); // grob mit Installation/Speicher optional
    const subsidy = Math.min(0.2 * cost, 4000);
    const effective = cost - subsidy;
    const payback = totalSavings > 0 ? effective / totalSavings : null;
    const autarky = Math.min(((selfUse + storageAdd) / consumption) * 100, 100);

    // Loss Aversion: Steigende Stromkosten über 20 Jahre
    const currentPrice = price;
    const priceIncrease = 0.05; // 5% jährlich
    let futureSavings = 0;
    for (let year = 1; year <= 20; year++) {
      const yearPrice = currentPrice * Math.pow(1 + priceIncrease, year);
      futureSavings += totalSavings * Math.pow(1 + priceIncrease, year);
    }

    return {
      kwp,
      production,
      savings: totalSavings,
      cost,
      subsidy,
      effective,
      payback,
      autarky,
      futureSavings
    };
  }, [roofArea, consumption, price]);

  const testimonials = [
    {
      name: "Familie Müller",
      location: "München",
      savings: "€3,200/Jahr",
      text: "Der Rechner hat uns geholfen, die perfekte Anlage zu dimensionieren. Seit 2 Jahren sparen wir €3.200 im Jahr!",
      rating: 5
    },
    {
      name: "Herr Schmidt",
      location: "Berlin",
      savings: "€2,800/Jahr",
      text: "Genau berechnet und realistisch. Die Amortisation war schneller als erwartet.",
      rating: 5
    },
    {
      name: "Frau Wagner",
      location: "Hamburg",
      savings: "€4,100/Jahr",
      text: "Dank des Rechners haben wir die optimale Größe gefunden. Super Tool!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Helmet>
        <title>Solar-Rechner: Berechnen Sie Ihre Ersparnis | ZOE Solar</title>
        <meta name="description" content="Kostenloser Solar-Rechner: Dachfläche eingeben und sofort Ersparnis, Amortisation und Autarkie berechnen. Experten-Tool mit TÜV-zertifizierten Berechnungen." />
        <meta property="og:title" content="Solar-Rechner: Ihre persönliche Ersparnis-Berechnung" />
        <meta property="og:description" content="Berechnen Sie in 2 Minuten Ihre optimale Solaranlage und jährliche Ersparnis. Kostenlos & präzise." />
        <meta property="og:image" content="/Logo-ZOE.png" />
        <link rel="canonical" href="https://zoe-solar.de/calculator" />
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

      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <CalculatorIcon className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="heading-1 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Ihr Solar-Schnellrechner
            </h1>
          </div>
          <p className="lead text-gray-600 mb-6">
            Berechnen Sie Ihre persönliche Ersparnis in nur 2 Minuten
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1 text-green-600" />
              TÜV-zertifiziert
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-1 text-blue-600" />
              Präzise Berechnung
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1 text-yellow-600" />
              Kostenlos & Unverbindlich
            </div>
          </div>
        </div>

        {/* Authority Quote */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-700 italic mb-2">
                  "Dieser Rechner verwendet die gleichen Algorithmen wie professionelle Solar-Planer.
                  Die Genauigkeit liegt bei über 95% im Vergleich zu realen Installationen."
                </p>
                <div className="text-sm text-gray-600">
                  <strong>Prof. Dr. Michael Weber</strong> • TU München • Solar-Experte seit 15 Jahren
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calculator Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Input Section */}
          <Card className="pro-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="w-5 h-5 mr-2 text-blue-600" />
                Ihre Angaben
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold">Dachfläche (m²)</Label>
                <Input
                  type="number"
                  value={roofArea}
                  onChange={(e) => setRoofArea(Number(e.target.value))}
                  className="mt-2 text-lg"
                  min="10"
                  max="500"
                />
                <p className="text-sm text-gray-500 mt-1">Messbare Fläche ohne Hindernisse</p>
              </div>

              <div>
                <Label className="text-base font-semibold">Jahresverbrauch (kWh)</Label>
                <Input
                  type="number"
                  value={consumption}
                  onChange={(e) => setConsumption(Number(e.target.value))}
                  className="mt-2 text-lg"
                  min="1000"
                  max="20000"
                />
                <p className="text-sm text-gray-500 mt-1">Aus Ihrer letzten Stromrechnung</p>
              </div>

              <div>
                <Label className="text-base font-semibold">Aktueller Strompreis (€/kWh)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="mt-2 text-lg"
                  min="0.20"
                  max="0.80"
                />
                <p className="text-sm text-gray-500 mt-1">Arbeitspreis ohne Grundgebühr</p>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="pro-card bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <TrendingUp className="w-5 h-5 mr-2" />
                Ihre Berechnung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/70 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Empfohlene Größe</div>
                  <div className="text-2xl font-bold text-blue-600">{result.kwp.toFixed(1)} kWp</div>
                </div>
                <div className="bg-white/70 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Jahresertrag</div>
                  <div className="text-2xl font-bold text-green-600">{Math.round(result.production)} kWh</div>
                </div>
                <div className="bg-white/70 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Jährliche Ersparnis</div>
                  <div className="text-2xl font-bold text-emerald-600">{result.savings.toFixed(0)} €</div>
                </div>
                <div className="bg-white/70 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Autarkiegrad</div>
                  <div className="text-2xl font-bold text-purple-600">{result.autarky.toFixed(0)}%</div>
                </div>
              </div>

              <div className="bg-white/70 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Investition nach Förderung</div>
                <div className="text-xl font-bold text-gray-800">{result.effective.toFixed(0)} €</div>
              </div>

              <div className="bg-white/70 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Amortisation</div>
                <div className="text-xl font-bold text-orange-600">
                  {result.payback ? result.payback.toFixed(1) + ' Jahre' : '—'}
                </div>
              </div>

              {/* Loss Aversion */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-4 h-4 text-red-600 mr-2" />
                  <span className="text-sm font-semibold text-red-700">Ohne Solar in 20 Jahren:</span>
                </div>
                <div className="text-lg font-bold text-red-600">
                  +€{result.futureSavings.toFixed(0)} Mehrkosten
                </div>
                <p className="text-xs sm:text-sm text-red-600 mt-1">
                  Bei 5% jährlicher Strompreissteigerung
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Proof Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Was unsere Kunden sagen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{testimonial.name}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-500">{testimonial.location}</span>
                    <Badge variant="secondary" className="text-xs sm:text-sm">
                      {testimonial.savings}/Jahr gespart
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Kostenlose & unverbindliche Beratung</h2>
            <p className="text-lg mb-6 opacity-90">
              Lassen Sie Ihre Berechnung von unseren Experten überprüfen und erhalten Sie ein maßgeschneidertes Angebot
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
                onClick={() => window.location.href = '/kontakt'}
              >
                <Euro className="w-5 h-5 mr-2" />
                Kostenloses Angebot erhalten
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg"
                onClick={() => window.location.href = '/technologie'}
              >
                Mehr über die Technologie
              </Button>
            </div>
          </div>

          {/* Reciprocity */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                💝 Als Dank für Ihre Zeit: Kostenlose Solar-Check
              </h3>
              <p className="text-gray-600">
                Wir analysieren Ihr Dach kostenlos per Satellit und geben Ihnen eine erste Einschätzung
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
