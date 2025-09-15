import React, { useEffect } from "react";
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
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Bundles, FinancingTeaser, ProcessJourney, ImpactSection, FinalCTA } from '@/components/sections/v4';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { Section } from '@/components/ui/section';
import { trackVariant, trackCta } from '@/utils/tracking';

export default function Pricing() {
  const { t } = useTranslation();
  useEffect(()=> { trackVariant('pricing_view'); },[]);

  const bundles = [
    { id:'pv-basic', title:'Solar Basic', desc:'Einstieg mit Fokus auf schnelle Amortisation', kpis:['6 kWp Module','5 kW Hybrid WR','Ohne Speicher','25J Garantie'], price:'ab 18.9k €' },
    { id:'pv-storage', title:'Solar Komplett', desc:'Beliebtes Unabhängigkeits-Paket (Speicher)', kpis:['8 kWp Module','10 kWh Speicher','Wallbox ready','25J Garantie'], price:'ab 24.9k €' },
    { id:'pv-premium', title:'Solar Premium', desc:'Maximale Zukunftssicherheit & Monitoring', kpis:['10 kWp Premium','15 kWh Speicher','Wallbox inkl.','Premium Monitoring'], price:'ab 32.9k €' }
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
    <title>Solaranlagen Preise 2025 – Festpreise & Förderung DE</title>
  <meta name="description" content="Solaranlage Preise 2025: Ab 18.900€ inkl. Förderung – Festpreise, 25 Jahre Garantie, TÜV zertifiziert, Pakete & Beratung anfragen – fair vergleichen. Fair." />
        <meta property="og:title" content="Solaranlagen Preise 2025 – Festpreise & Förderung DE" />
        <meta property="og:description" content="Solaranlage Preise 2025: Ab 18.900€ inkl. Förderung – Festpreise, 25 Jahre Garantie, TÜV-zertifiziert." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Warm Neutral Hero */}
      <Section className="hero-shell cinematic relative text-center" padding="normal" variant="default" size="wide">
        <div className="max-w-5xl mx-auto flow">
          <Pill variant="soft" color="neutral" className="mb-5">Preisstruktur 2025</Pill>
          <h1 className="display-1 inline-soft">Transparente Solarpakete mit Festpreis</h1>
          <p className="lead text-neutral-600 max-w-3xl mx-auto inline-emphasis">Keine Überraschungen: konservative Auslegung, 25 Jahre Garantie und modulare Erweiterbarkeit. Wählen Sie den passenden Start – skalieren Sie später.</p>
          <div className="flex flex-wrap gap-5 justify-center">
              <Button onClick={()=>trackCta('pricing','calculator')} variant="primary" size="lg">Ersparnis prüfen</Button>
              <Button onClick={()=>trackCta('pricing','contact')} variant="outline" size="lg">Beratung anfordern</Button>
          </div>
        </div>
      </Section>

      <MetricsBar metrics={[{label:'Ø Amortisation',value:'9–11 J.'},{label:'Termintreue',value:'96%'},{label:'Garantie',value:'25 J.'},{label:'Kunden',value:'2.500+'}]} />

      <Bundles bundles={bundles} onSelect={(b)=> trackVariant('pricing_bundle_select',{bundle_id:b.id})} />

      <FinancingTeaser />
      <ProcessJourney />
      <ImpactSection />

      {/* Authority Section */}
      <Section variant="neutral" padding="normal" size="wide">
        <div className="flow">
          <div className="text-center mb-16">
            <Award className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold text-neutral-800 tracking-tight">Warum Sie uns vertrauen können</h2>
            <p className="mt-4 text-xl text-neutral-600">TÜV-zertifizierte Qualität mit 25 Jahren Garantie</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold text-neutral-800 mb-2">TÜV-zertifiziert</h3>
              <p className="text-sm text-neutral-600">Alle Anlagen nach höchsten Standards geprüft</p>
            </div>
            <div className="text-center">
              <Euro className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold text-neutral-800 mb-2">Festpreisgarantie</h3>
              <p className="text-sm text-neutral-600">Keine Preissteigerungen während der Planung</p>
            </div>
            <div className="text-center">
              <Home className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold text-neutral-800 mb-2">25 Jahre Garantie</h3>
              <p className="text-sm text-neutral-600">Komplettschutz für Ihre Investition</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold text-neutral-800 mb-2">2.500+ Kunden</h3>
              <p className="text-sm text-neutral-600">Zufriedenheit mit 4.9/5 Sternen</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section variant="plain" padding="normal" size="wide">
        <div className="flow">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-neutral-800 tracking-tight">Was unsere Kunden sagen</h2>
            <p className="mt-4 text-xl text-neutral-600">Erfahrungen mit unseren Solarpaketen</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t,i)=>(
              <TestimonialCard
                key={i}
                name={t.name}
                location={t.location}
                text={t.text}
                savings={t.savings}
                rating={t.rating}
                tag={t.package}
                tagColor="emerald"
                variant="glass"
              />
            ))}
          </div>
        </div>
      </Section>

  <FinalCTA onPrimary={()=>trackCta('pricing','calculator_final')} onSecondary={()=>trackCta('pricing','contact_final')} />
    </div>
  );
}
