import React, { useState } from "react";
import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { createPageUrl } from "@/utils";
import { Cpu, BatteryCharging, PanelTop, CheckCircle, TrendingUp, Award, Zap, Shield, BarChart, Clock, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Button } from "@/components/ui/button";

export default function Technology() {
  const { t } = useTranslation();

  const components = [
    {
      icon: PanelTop,
      name: "Hochleistungs-Solarmodule",
      description: "Wir setzen auf bifaziale Glas-Glas-Module der neuesten Generation. Diese nutzen Sonnenlicht von beiden Seiten für bis zu 25% mehr Ertrag und sind extrem langlebig.",
      brands: ["Heckert", "Meyer Burger", "Winaico"],
      feature: "Über 23% Wirkungsgrad",
      specs: ["25 Jahre Produktgarantie", "30 Jahre Leistungsgarantie", "Bifazial +25% Ertrag", "PID-resistent"]
    },
    {
      icon: Cpu,
      name: "Intelligente Wechselrichter",
      description: "Das Herz Ihrer Anlage. Unsere Hybrid-Wechselrichter von Marktführern wie SMA oder Fronius managen Energieflüsse optimal und sind bereits für zukünftige Erweiterungen gerüstet.",
      brands: ["SMA", "Fronius", "SolarEdge"],
      feature: "Notstromfähig",
      specs: ["10 Jahre Garantie", "Notstromfunktion", "Monitoring-App", "Erweiterbar"]
    },
    {
      icon: BatteryCharging,
      name: "Langlebige Stromspeicher",
      description: "Mit einem Lithium-Eisenphosphat-Speicher (LiFePO4) nutzen Sie Ihren Solarstrom auch nachts. Maximale Sicherheit und über 6.000 Ladezyklen garantieren jahrzehntelange Nutzung.",
      brands: ["BYD", "LG Energy Solution", "Varta"],
      feature: "Bis zu 100% Autarkie",
      specs: ["10 Jahre Garantie", "6.000+ Ladezyklen", "Brandschutz zertifiziert", "Made in Germany"]
    },
  ];

  const comparisons = [
    {
      category: "Solarmodule",
      cheap: { name: "Billige Module", efficiency: "18%", warranty: "10 Jahre", risk: "Hohe Ausfallrate" },
      premium: { name: "Premium Module", efficiency: "23%", warranty: "30 Jahre", risk: "Minimale Ausfälle" }
    },
    {
      category: "Wechselrichter",
      cheap: { name: "Standard WR", efficiency: "95%", warranty: "5 Jahre", risk: "Keine Notstromfunktion" },
      premium: { name: "Hybrid WR", efficiency: "98%", warranty: "10 Jahre", risk: "Notstrom + Monitoring" }
    },
    {
      category: "Speicher",
      cheap: { name: "Lithium-Ionen", efficiency: "90%", warranty: "5 Jahre", risk: "Brandgefahr höher" },
      premium: { name: "LiFePO4", efficiency: "95%", warranty: "10 Jahre", risk: "Maximale Sicherheit" }
    }
  ];

  const techStats = [
    { value: "23%", label: "Modul-Wirkungsgrad", icon: TrendingUp },
    { value: "98%", label: "Wechselrichter-Effizienz", icon: Zap },
    { value: "95%", label: "Speicher-Effizienz", icon: BatteryCharging },
    { value: "30", label: "Jahre Garantie", icon: Shield }
  ];

  return (
    <div className="bg-white">
      <Helmet>
        <title>Solaranlagen-Technologie – Premium-Komponenten | ZOE Solar</title>
        <meta name="description" content="Bifaziale Glas-Glas-Module, Hybrid-Wechselrichter, sichere LiFePO4-Speicher – für maximale Erträge & Autarkie." />
        <meta property="og:title" content="Solaranlagen-Technologie – Premium-Komponenten | ZOE Solar" />
        <meta property="og:description" content="Bifaziale Glas-Glas-Module, Hybrid-Wechselrichter, sichere LiFePO4-Speicher – für maximale Erträge & Autarkie." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Pill variant="light" className="mb-4">Premium-Komponenten</Pill>
          <h1 className="heading-1 text-gray-800">
            Technologie, die für Sie arbeitet.
          </h1>
          <p className="lead text-gray-600 max-w-3xl mx-auto mt-6">
            Eine Solaranlage ist nur so gut wie ihre schwächste Komponente. Deshalb setzen wir kompromisslos auf die besten Produkte am Markt.
          </p>

          {/* Tech Stats */}
          <div className="mt-12 grid md:grid-cols-4 gap-6">
            {techStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg pro-card">
                <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Components Section */}
      <section className="py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-2 text-gray-800">Premium-Komponenten für maximale Leistung</h2>
            <p className="lead text-gray-600 mt-4">Jede Komponente wurde sorgfältig ausgewählt für optimale Performance und Langlebigkeit</p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {components.map((c, index) => (
              <Card key={index} className="shadow-lg hover:shadow-2xl transition-shadow duration-300 pro-card">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center">
                      <c.icon className="w-8 h-8"/>
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-800">{c.name}</CardTitle>
                      <Pill variant="light" className="mt-2">{c.feature}</Pill>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">{c.description}</p>

                  {/* Technical Specs */}
                  <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Technische Vorteile:</h4>
        <ul className="space-y-2 text-base sm:text-lg">
                      {c.specs.map((spec, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span className="text-gray-600">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-sm font-semibold text-gray-500 mb-2">Wir verbauen u.a.:</p>
                  <div className="flex flex-wrap gap-2">
                    {c.brands.map(b => <Pill key={b} variant="light" className="bg-gray-100 border-gray-200">{b}</Pill>)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Warum Premium-Komponenten sich lohnen</h2>
            <p className="mt-4 text-xl text-gray-600">Der Vergleich zeigt: Günstig kann teuer werden</p>
          </div>

          <div className="space-y-8">
            {comparisons.map((comp, index) => (
              <Card key={index} className="shadow-lg pro-card">
                <CardHeader>
                  <CardTitle className="text-center text-xl">{comp.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="font-semibold text-red-800 mb-3">{comp.cheap.name}</h4>
                      <ul className="space-y-2 text-base sm:text-lg">
                        <li className="flex justify-between"><span>Wirkungsgrad:</span><span className="font-medium">{comp.cheap.efficiency}</span></li>
                        <li className="flex justify-between"><span>Garantie:</span><span className="font-medium">{comp.cheap.warranty}</span></li>
                        <li className="flex justify-between"><span>Risiko:</span><span className="font-medium text-red-600">{comp.cheap.risk}</span></li>
                      </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-semibold text-green-800 mb-3">{comp.premium.name}</h4>
                      <ul className="space-y-2 text-base sm:text-lg">
                        <li className="flex justify-between"><span>Wirkungsgrad:</span><span className="font-medium">{comp.premium.efficiency}</span></li>
                        <li className="flex justify-between"><span>Garantie:</span><span className="font-medium">{comp.premium.warranty}</span></li>
                        <li className="flex justify-between"><span>Vorteil:</span><span className="font-medium text-green-600">{comp.premium.risk}</span></li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Authority Section */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white text-center">
            <Award className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h2 className="text-3xl font-extrabold mb-4">TÜV-zertifizierte Qualität</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Als zertifizierter Meisterbetrieb garantieren wir höchste Standards. Unsere Anlagen übertreffen alle Normen und halten, was wir versprechen.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 rounded-lg p-6">
                <Shield className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Sicherheit</h3>
                <p className="text-sm text-blue-100">Alle Komponenten TÜV-geprüft und VDE-zertifiziert</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <BarChart className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Performance</h3>
                <p className="text-sm text-blue-100">Über 23% Wirkungsgrad für maximale Erträge</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <Clock className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Langlebigkeit</h3>
                <p className="text-sm text-blue-100">30+ Jahre Garantie auf Leistung und Qualität</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Calculator className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
              Berechnen Sie Ihre Ersparnis
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Erfahren Sie genau, wie viel Sie mit unserer Premium-Technologie sparen können.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Calculator")}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Jetzt Ersparnis berechnen
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button size="lg" variant="outline">
                  Technische Beratung
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
