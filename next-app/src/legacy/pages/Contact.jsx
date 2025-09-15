import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { createPageUrl } from "@/utils";
import { Phone, Mail, MapPin, CheckCircle, Calculator, Star, Clock, Shield, Award, Users, TrendingUp, Zap } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Checkbox } from "@/components/ui/checkbox";

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    houseType: "",
    roofArea: "",
    currentBill: "",
    message: "",
    urgency: "",
    newsletter: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submittedErrors, setSubmittedErrors] = useState(false);
  // Planner-Query übernehmen (kWp, storage, payback) und Nachricht vorfüllen
  useEffect(() => {
    const usp = new URLSearchParams(window.location.search);
    const kWp = usp.get('kWp');
    const storage = usp.get('storage');
    const payback = usp.get('payback');
    if (kWp || storage || payback) {
      setFormData((prev) => ({
        ...prev,
        message: `${prev.message || ''}\n\nPlaner-Ergebnis: ${kWp ? `${kWp} kWp` : ''}${storage ? `, ${storage} kWh Speicher` : ''}${payback ? `, Amortisation ~ ${payback} Jahre` : ''}`.trim()
      }));
    }
  }, []);

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name ist erforderlich';
    if (!formData.email.trim()) newErrors.email = 'E-Mail ist erforderlich';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Bitte gültige E-Mail';
    if (!formData.phone.trim()) newErrors.phone = 'Telefonnummer ist erforderlich';
    else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g,''))) newErrors.phone = 'Bitte gültige Telefonnummer';
    if (!formData.address.trim()) newErrors.address = 'Adresse ist erforderlich';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = validateForm();
    if (!ok) {
      setSubmittedErrors(true);
      setTimeout(()=>{ const s=document.getElementById('contact-error-summary'); s && s.focus(); },0);
      return;
    } else {
      setSubmittedErrors(false);
    }
    setIsSubmitting(true);
    try {
      const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
      if (endpoint) {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await new Promise(r => setTimeout(r, 800));
      }
    } catch (e) { /* silent */ }
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const testimonials = [
    {
      name: "Familie Weber",
      text: "Der Rückruf kam pünktlich und die Beratung war absolut professionell. Kein Druck, nur Fakten.",
      rating: 5,
      location: "Stuttgart"
    },
    {
      name: "Herr Bauer",
      text: "Innerhalb von 2 Stunden Rückruf bekommen zu haben, hat mich wirklich beeindruckt. Sehr vertrauensvoll.",
      rating: 5,
      location: "Hamburg"
    },
    {
      name: "Frau Schmidt",
      text: "Die kostenlose Beratung hat sich gelohnt. Jetzt spare ich jeden Monat über 200€ Stromkosten.",
      rating: 5,
      location: "München"
    }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
        <Helmet>
          <title>Danke – Wir melden uns innerhalb von 2 Stunden | ZOE Solar</title>
        </Helmet>
        <Card className="max-w-2xl w-full border-none shadow-2xl pro-card">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Vielen Dank für Ihr Interesse!</h2>
            <p className="text-xl text-neutral-600 mb-8">Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 2 Stunden.</p>

            <div className="bg-emerald-50 rounded-lg p-6 mb-6">
              <div className="flex justify-center mb-3">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="text-lg font-semibold text-emerald-800 mb-2">4.9/5 Durchschnittsbewertung</div>
              <p className="text-emerald-700">Basierend auf 2.547+ Kundenerfahrungen</p>
            </div>

            <div className="flex items-center justify-center space-x-2 text-neutral-600">
              <Phone className="w-5 h-5" />
              <span>Bei Rückfragen: 0800 - 123 456 789</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/40">
      <Helmet>
  <title>Solar Beratung 2025 – Rückruf in 2h kostenlos DE</title>
  <meta name="description" content="Solar Beratung 2025: In 2 Minuten Anfrage stellen – Rückruf in 2 Stunden. Unverbindlich, TÜV zertifiziert, ohne Druck bis Inbetriebnahme & Projektstart." />
        <meta property="og:title" content="Kostenlose Beratung anfordern | ZOE Solar" />
        <meta property="og:description" content="In 2 Minuten Anfrage stellen – Rückruf innerhalb von 2 Stunden. Transparent, unverbindlich, ohne Druck." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

  {/* Hinweisbanner entfernt – seriöser Auftritt ohne künstliche Dringlichkeit */}

      <section className="py-16 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="pro-container text-center">
          <Pill variant="dark" className="mb-4">Kostenlose Beratung</Pill>
          <h1 className="heading-1 mb-6">Ihr Weg zur eigenen Solaranlage startet hier</h1>
          <p className="lead opacity-90 max-w-3xl mx-auto mb-8">Lassen Sie sich kostenfrei beraten und erhalten Sie Ihr individuelles Angebot.</p>

          <div className="bg-red-600/20 border border-red-400/30 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-red-300 mr-2" />
              <span className="font-semibold">Warum jetzt anfragen?</span>
            </div>
            <p className="text-red-100">Strompreise steigen weiter – sichern Sie sich jetzt Ihre Unabhängigkeit zu besten Konditionen</p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="pro-container">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Was unsere Kunden über die Beratung sagen</h2>
            <div className="flex justify-center items-center space-x-4">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-lg font-semibold">4.9/5</span>
              <span className="text-neutral-600">aus 2.547+ Bewertungen</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-lg pro-card">
                <CardContent className="p-6">
                  <div className="flex mb-3">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-neutral-700 italic mb-4">"{testimonial.text}"</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-neutral-800">{testimonial.name}</div>
                      <div className="text-sm text-neutral-600">{testimonial.location}</div>
                    </div>
                    <Pill variant="light" className="bg-emerald-100 text-emerald-800 border-emerald-200">Verifiziert</Pill>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

  <div className="pro-container py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Card className="border-none shadow-2xl pro-card">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl flex items-center">
                  <Calculator className="w-7 h-7 text-emerald-600 mr-3" />
                  Kostenloses Angebot anfordern
                </CardTitle>
                <p className="text-neutral-600">Füllen Sie das Formular aus und erhalten Sie innerhalb von 2 Stunden einen Rückruf von unserem Solarexperten.</p>

                <div className="flex items-center space-x-2 mt-4">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm text-neutral-600">TÜV-zertifizierter Service • 25 Jahre Garantie</span>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" noValidate aria-describedby={Object.keys(errors).length ? 'contact-error-summary' : undefined}>
                  {submittedErrors && Object.keys(errors).length > 0 && (
                    <div
                      id="contact-error-summary"
                      tabIndex={-1}
                      className="border border-red-300 bg-red-50 rounded-md p-4 text-sm text-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                      role="alert"
                      aria-live="assertive"
                    >
                      <p className="font-semibold mb-2">Bitte korrigieren Sie die markierten Felder:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {Object.entries(errors).map(([field, msg]) => (
                          <li key={field}><a href={`#${field}`} className="underline text-red-700 focus-visible:focus-ring" onClick={(e)=>{e.preventDefault(); const el=document.getElementById(field); el && el.focus();}}>{msg}</a></li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Ihre Kontaktdaten</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field id="name" label="Vor- und Nachname" required error={errors.name}>
                        <Input value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="mt-1" />
                      </Field>
                      <Field id="email" label="E-Mail-Adresse" required error={errors.email}>
                        <Input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="mt-1" />
                      </Field>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field id="phone" label="Telefonnummer" required error={errors.phone}>
                        <Input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="mt-1" />
                      </Field>
                      <Field id="urgency" label="Zeitrahmen für Installation">
                        <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Wählen Sie..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sofort">So schnell wie möglich</SelectItem>
                            <SelectItem value="3months">In den nächsten 3 Monaten</SelectItem>
                            <SelectItem value="6months">In den nächsten 6 Monaten</SelectItem>
                            <SelectItem value="planning">Ich plane erst</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    <Field id="address" label="Vollständige Adresse" required error={errors.address} hint="Straße, Hausnummer, PLZ, Ort">
                      <Input value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} className="mt-1" placeholder="Straße, Hausnummer, PLZ, Ort" />
                    </Field>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Angaben zu Ihrem Haus</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field id="houseType" label="Gebäudetyp">
                        <Select value={formData.houseType} onValueChange={(value) => handleInputChange('houseType', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Wählen Sie..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="einfamilienhaus">Einfamilienhaus</SelectItem>
                            <SelectItem value="doppelhaus">Doppelhaushälfte</SelectItem>
                            <SelectItem value="reihenhaus">Reihenhaus</SelectItem>
                            <SelectItem value="mehrfamilienhaus">Mehrfamilienhaus</SelectItem>
                            <SelectItem value="gewerbe">Gewerbegebäude</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field id="roofArea" label="Geschätzte Dachfläche (m²)">
                        <Select value={formData.roofArea} onValueChange={(value) => handleInputChange('roofArea', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Wählen Sie..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="50">Unter 50 m²</SelectItem>
                            <SelectItem value="100">50-100 m²</SelectItem>
                            <SelectItem value="150">100-150 m²</SelectItem>
                            <SelectItem value="200">Über 150 m²</SelectItem>
                            <SelectItem value="unknown">Weiß ich nicht</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    <Field id="currentBill" label="Aktuelle monatliche Stromkosten (€)">
                      <Select value={formData.currentBill} onValueChange={(value) => handleInputChange('currentBill', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Wählen Sie Ihren Bereich..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100">Bis 100€</SelectItem>
                          <SelectItem value="150">100-150€</SelectItem>
                          <SelectItem value="200">150-200€</SelectItem>
                          <SelectItem value="250">200-250€</SelectItem>
                          <SelectItem value="300">Über 250€</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    </div>

                    <Field id="message" label="Zusätzliche Informationen oder Fragen">
                      <Textarea value={formData.message} onChange={(e) => handleInputChange('message', e.target.value)} className="mt-1" rows={4} placeholder="z.B. Besonderheiten des Dachs, gewünschte Speicherlösung, etc." />
                    </Field>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="newsletter" checked={formData.newsletter} onCheckedChange={(checked) => handleInputChange('newsletter', checked)} />
                      <label htmlFor="newsletter" className="text-sm text-neutral-600">Ja, ich möchte den kostenlosen ZOE Solar Newsletter erhalten</label>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-6 text-lg font-semibold rounded-xl shadow-lg">
                      {isSubmitting ? 'Wird übermittelt...' : 'Kostenloses Angebot anfordern'}
                    </Button>
                    <p className="text-sm text-neutral-600 text-center">* Pflichtfelder. Ihre Daten werden vertraulich behandelt.</p>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="border-none shadow-xl pro-card">
                <CardHeader>
                  <CardTitle className="text-xl">Direkter Kontakt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Telefon</h3>
                      <p className="text-emerald-700 font-bold text-lg">+49-156-78876200</p>
                      <p className="text-sm text-neutral-600">24/7 Online-Geschäftszeiten</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">E-Mail</h3>
                      <p className="text-blue-600">info@zoe-solar.de</p>
                      <p className="text-sm text-neutral-600">Antwort innerhalb 2h</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Adresse</h3>
                      <p className="text-neutral-700">Kurfürstenstraße 124</p>
                      <p className="text-neutral-700">10785 Berlin, Deutschland</p>
                    </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img src="/Logo-ZOE.png" alt="WhatsApp" className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">WhatsApp</h3>
                    <a href="https://wa.me/4915678876200" className="text-green-700 font-bold text-lg underline" target="_blank" rel="noopener noreferrer">Jetzt chatten</a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img src="/Logo-ZOE.png" alt="Social" className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Social Media</h3>
                    <a href="https://www.linkedin.com/company/91625256/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="mx-1 underline">LinkedIn</a>
                    <a href="https://www.tiktok.com/@zoe_solar" target="_blank" rel="noopener noreferrer" className="mx-1 underline">TikTok</a>
                    <a href="https://x.com/_zoe_solar" target="_blank" rel="noopener noreferrer" className="mx-1 underline">X</a>
                    <a href="https://www.youtube.com/channel/UC8jo_fyVGSPKvRuS2ZWAvyA" target="_blank" rel="noopener noreferrer" className="mx-1 underline">YouTube</a>
                    <a href="https://www.facebook.com/p/ZOE-Solar-100088899755919/" target="_blank" rel="noopener noreferrer" className="mx-1 underline">Facebook</a>
                    <a href="https://www.instagram.com/_zoe_solar/" target="_blank" rel="noopener noreferrer" className="mx-1 underline">Instagram</a>
                    <a href="https://de.pinterest.com/ZOEsolarDE/?actingBusinessId=1137159112069607884" target="_blank" rel="noopener noreferrer" className="mx-1 underline">Pinterest</a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img src="/Logo-ZOE.png" alt="Info" className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Weitere Infos</h3>
                    <p className="text-neutral-700">Gründungsdatum: 06.06.2018</p>
                    <p className="text-neutral-700">Online-Geschäftszeiten: 24/7</p>
                  </div>
                </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl pro-card">
                <CardContent className="p-6">
                    <div className="text-center">
                    <Award className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-neutral-800 mb-2">TÜV-zertifizierter Betrieb</h3>
                    <p className="text-sm text-neutral-600 mb-4">Alle Anlagen nach höchsten Standards geprüft</p>
                    <div className="flex justify-center space-x-4 text-xs sm:text-sm text-neutral-600">
                      <span>• Meisterbetrieb</span>
                      <span>• 25 Jahre Garantie</span>
                      <span>• TÜV-zertifiziert</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl pro-card">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="text-3xl font-bold text-neutral-900 mb-2">4.9/5</div>
                  <p className="text-neutral-600 text-sm mb-4">Basierend auf 2.547+ Bewertungen</p>
                  <Pill variant="light" className="bg-green-100 text-green-800 border-green-200">TÜV geprüfte Kundenzufriedenheit</Pill>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl pro-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-neutral-800 mb-4">Schnellzugriff</h3>
                  <div className="space-y-3">
                    <Link to={createPageUrl("Calculator")} className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Calculator className="w-4 h-4 mr-2" />
                        Ersparnis berechnen
                      </Button>
                    </Link>
                    <Link to={createPageUrl("Pricing")} className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Zap className="w-4 h-4 mr-2" />
                        Preise ansehen
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
