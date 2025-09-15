import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Heading } from '@/components/ui/heading';
import { Section } from '@/components/ui/section';

export default function Imprint(){
  return (
    <Section size="narrow" padding="normal">
      <Helmet>
    <title>Impressum ZOE Solar – Anbieterkennzeichnung & Rechtliches</title>
    <meta name="description" content="Impressum ZOE Solar GmbH: Anbieterkennzeichnung, Kontakt, Geschäftsführer, Handelsregister, USt-Id & rechtliche Pflichtangaben kompakt zur Transparenz." />
    <meta property="og:title" content="Impressum ZOE Solar – Anbieterkennzeichnung & Rechtliches" />
    <meta property="og:description" content="Impressum ZOE Solar GmbH: Anbieterkennzeichnung, Kontakt, Geschäftsführer, Handelsregister, USt-Id & rechtliche Pflichtangaben kompakt zur Transparenz." />
      </Helmet>
      <div className="flow">
        <Heading as="h1" size="3xl">Impressum</Heading>
        <p>ZOE Solar</p>
        <p>Kurfürstenstraße 124, 10785 Berlin, Deutschland</p>
        <p>Telefon: +49-156-78876200 · E-Mail: info@zoe-solar.de</p>
        <p>Geschäftsführer: Stefan Zimmermann · Gründungsdatum: 06.06.2018</p>
        <p>Handelsregister: HRB 123456 B (Amtsgericht Berlin-Charlottenburg)</p>
        <p>USt-IdNr.: DE123456789</p>
        <p>Website: <a href="https://zoe-solar.de" target="_blank" rel="noopener noreferrer">https://zoe-solar.de</a></p>
        <p>Social Media: 
          <a href="https://www.linkedin.com/company/91625256/admin/dashboard/" target="_blank" rel="noopener noreferrer">LinkedIn</a> · 
          <a href="https://www.tiktok.com/@zoe_solar" target="_blank" rel="noopener noreferrer">TikTok</a> · 
          <a href="https://x.com/_zoe_solar" target="_blank" rel="noopener noreferrer">X</a> · 
          <a href="https://www.youtube.com/channel/UC8jo_fyVGSPKvRuS2ZWAvyA" target="_blank" rel="noopener noreferrer">YouTube</a> · 
          <a href="https://www.facebook.com/p/ZOE-Solar-100088899755919/" target="_blank" rel="noopener noreferrer">Facebook</a> · 
          <a href="https://www.instagram.com/_zoe_solar/" target="_blank" rel="noopener noreferrer">Instagram</a> · 
          <a href="https://de.pinterest.com/ZOEsolarDE/?actingBusinessId=1137159112069607884" target="_blank" rel="noopener noreferrer">Pinterest</a> · 
          <a href="https://wa.me/4915678876200" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </p>
        <p>Online-Geschäftszeiten: 24/7</p>
      </div>
    </Section>
  );
}
