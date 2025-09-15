import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ensurePsychology } from '@/i18n_new';
import { createPageUrl } from "@/utils";
import { Award, Shield, Zap, Users, CheckCircle, BarChart, Clock, TrendingUp, Star, Quote, Phone, Mail } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function WhyUs() {
  const { t, i18n } = useTranslation(['translation','psychology']);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    ensurePsychology(i18n.language);
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

  const promises = [
  { icon: Award, title: t('psychology:quality_title'), text: t('psychology:quality_desc') },
    { icon: Shield, title: "25 Jahre Rundum-Sorglos-Garantie", text: "Unsere umfassende Garantie deckt alle Komponenten Ihrer Anlage ab – von den Modulen bis zum Wechselrichter. Ihre Investition ist sicher." },
    { icon: Zap, title: "Fachgerechte Installation", text: "Unsere festangestellten, erfahrenen Montageteams sorgen für eine schnelle, saubere und sichere Installation nach höchsten Standards." },
    { icon: Users, title: "Persönlicher Ansprechpartner", text: "Von der ersten Beratung bis weit nach der Inbetriebnahme steht Ihnen ein persönlicher Experte zur Seite. Kein Callcenter, keine Warteschleifen." },
  ];

  const testimonials = [
    {
      name: "Familie Schmidt",
      location: "München",
      rating: 5,
      savings: "€2.100/Jahr",
      text: "Die Beratung war absolut ehrlich und transparent. Keine versteckten Kosten, alles wurde genau erklärt. Unsere Anlage läuft seit 2 Jahren perfekt.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Herr Weber",
      location: "Stuttgart",
      rating: 5,
      savings: "€2.800/Jahr",
      text: "Als Meisterbetrieb haben sie uns sofort überzeugt. Die Installation war professionell und termingerecht. Die Erträge übertreffen sogar die Prognose.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Frau Bauer",
      location: "Hamburg",
      rating: 5,
      savings: "€1.900/Jahr",
      text: "Der persönliche Service ist herausragend. Von der ersten Anfrage bis heute haben wir immer den gleichen Ansprechpartner. Sehr vertrauensvoll.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <div className="bg-white">
      <Helmet>
        <title>Warum ZOE Solar 2025 – Qualität, Sicherheit & Service</title>
      <meta name="description" content="Warum ZOE Solar: Qualität, Sicherheit, Fachinstallation, persönliche Betreuung, Garantie & wirtschaftliche Vorteile – nachhaltige Autarkie sichern heute." />
      <meta property="og:title" content="Warum ZOE Solar 2025 – Qualität, Sicherheit & Service" />
      <meta property="og:description" content="Warum ZOE Solar: Qualität, Sicherheit, Fachinstallation, persönliche Betreuung, Garantie & wirtschaftliche Vorteile – nachhaltige Autarkie sichern heute." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Warum ZOE Solar 2025 – Qualität, Sicherheit & Service" />
      <meta name="twitter:description" content="Warum ZOE Solar: Qualität, Sicherheit, Fachinstallation, persönliche Betreuung, Garantie & wirtschaftliche Vorteile – nachhaltige Autarkie sichern heute." />
      </Helmet>
    <title>Warum ZOE Solar 2025 – Qualität, Sicherheit & Service</title>
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4">
  <div className="pro-container">
          <div className="flex items-center justify-center space-x-4">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">{t('hero.urgency_offer')}</span>
            <div className="flex space-x-2">
              <span className="bg-neutral-50/90 border border-neutral-200 px-2 py-1 rounded text-sm">
                {timeLeft.days}T {timeLeft.hours}H {timeLeft.minutes}M {timeLeft.seconds}S
              </span>
            </div>
            <span className="text-sm">{t('hero.urgency_desc')}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-white py-20">
  <div className="pro-container text-center">
          <Badge className="bg-emerald-100 text-emerald-800 mb-4">Unser Versprechen an Sie</Badge>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-neutral-800 tracking-tight">
            Qualität, Sicherheit und Service, die überzeugen.
          </h1>
          <p className="mt-6 text-xl text-neutral-600 max-w-3xl mx-auto">
            Finden Sie heraus, warum über 2.500 Hausbesitzer auf ZOE Solar als ihren Partner für die Energiewende vertrauen.
          </p>

          {/* Loss Aversion Section */}
          <div className="mt-12 bg-red-50 border border-red-200 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-red-600 mr-2" />
              <h2 className="text-2xl font-bold text-red-800">{t('psychology:rising_costs_title')}</h2>
            </div>
            <p className="text-lg text-red-700 mb-6">{t('psychology:rising_costs_desc')}</p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-red-600">+40%</div>
                <div className="text-sm text-neutral-600">Strompreise seit 2021</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-red-600">+€800</div>
                <div className="text-sm text-neutral-600">Mehrkosten pro Jahr</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-red-600">∞</div>
                <div className="text-sm text-neutral-600">Für immer ohne Solar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promises Section */}
      <section className="py-24">
        <div className="pro-container content-lg">
          <div className="grid md:grid-cols-2 gap-12">
            {promises.map((p, index) => (
              <div key={index} className="flex space-x-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center">
                  <p.icon className="w-8 h-8"/>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-800">{p.title}</h3>
                  <p className="mt-2 text-neutral-600 leading-relaxed">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Quote Section */}
      <section className="bg-neutral-50 py-20">
        <div className="pro-container">
          <div className="max-w-4xl mx-auto text-center">
            <Quote className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
            <blockquote className="text-2xl font-medium text-neutral-800 leading-relaxed mb-6">
              "{t('psychology:expert_quote')}"
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-neutral-800">{t('psychology:expert_name')}</div>
                <div className="text-sm text-neutral-600">{t('psychology:expert_title')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-24">
        <div className="pro-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="content-lg">
              <h2 className="text-4xl font-extrabold text-neutral-800 tracking-tight">Transparenz von Anfang an.</h2>
              <p className="mt-4 text-xl text-neutral-600">
                Wir glauben an ehrliche Beratung und klare Angebote ohne versteckte Kosten. Ihr Vertrauen ist unser höchstes Gut.
              </p>
              <ul className="mt-8 space-y-4 text-base sm:text-lg">
                <li className="flex items-center space-x-3"><CheckCircle className="w-6 h-6 text-emerald-500"/><span>Detaillierte Ertragsprognose für Ihr Dach</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-6 h-6 text-emerald-500"/><span>Amortisationsrechnung auf den Cent genau</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-6 h-6 text-emerald-500"/><span>Festpreisgarantie – keine unerwarteten Nachzahlungen</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-6 h-6 text-emerald-500"/><span>Kompletter Förderservice inklusive</span></li>
              </ul>

              {/* Reciprocity CTA */}
              <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">{t('hero.reciprocity_title')}</h3>
                <p className="text-emerald-700 mb-4">{t('hero.reciprocity_desc')}</p>
                <Link to={createPageUrl("Contact")}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    {t('hero.reciprocity_cta')}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <Card className="shadow-2xl pro-card">
                <CardContent className="p-8">
                  <h3 className="text-lg font-bold text-center mb-4">Beispielrechnung Familie Müller</h3>
                  <div className="w-full h-48 flex items-center justify-center text-emerald-500 border border-dashed rounded-lg">
                    <BarChart className="w-24 h-24"/>
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between"><span className="text-neutral-600">Anschaffungskosten:</span><span className="font-bold">18.500€</span></div>
                    <div className="flex justify-between"><span className="text-neutral-600">Staatl. Förderung:</span><span className="font-bold text-red-600">- 4.200€</span></div>
                    <div className="flex justify-between text-lg border-t pt-2 mt-2"><span className="font-bold text-neutral-800">Effektive Kosten:</span><span className="font-bold text-emerald-700">14.300€</span></div>
                    <div className="flex justify-between"><span className="text-neutral-600">Ersparnis pro Jahr:</span><span className="font-bold">~ 2.200€</span></div>
                    <div className="flex justify-between"><span className="text-neutral-600">Amortisation nach:</span><span className="font-bold">~ 6.5 Jahren</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-neutral-50 py-24">
        <div className="pro-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-neutral-800 tracking-tight">{t('psychology:testimonials_title')}</h2>
            <p className="mt-4 text-xl text-neutral-600">{t('psychology:testimonials_subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow pro-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <div className="font-semibold text-neutral-800">{testimonial.name}</div>
                      <div className="text-sm text-neutral-600">{testimonial.location}</div>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-2 text-sm text-neutral-600">• {testimonial.savings}</span>
                  </div>

                  <p className="text-neutral-700 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
  <section className="py-20 bg-emerald-700 text-white">
        <div className="pro-container">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">2.500+</div>
              <div className="text-white">Zufriedene Kunden</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-white">Durchschnittliche Bewertung</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">€50M+</div>
              <div className="text-white">Gesparte Stromkosten</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-white">Jahre Erfahrung</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="pro-container text-center">
          <h2 className="text-4xl font-extrabold text-neutral-800 tracking-tight mb-6">
            Bereit für Ihre Energiewende?
          </h2>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Sichern Sie sich jetzt Ihren kostenlosen Solar-Check und erfahren Sie, wie viel Sie sparen können.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Calculator")}>
              <Button size="lg" className="font-semibold">
                {t('hero.cta_calc')}
              </Button>
            </Link>
            <Link to={createPageUrl("Contact")}>
              <Button size="lg" variant="outline" className="font-semibold">
                <Phone className="w-4 h-4 mr-2" />
                {t('hero.cta_call')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
