import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout';

// Code-Splitting: wichtigste Landing (Home) direkt, rest lazy
const Home = lazy(()=> import('./pages/Home'));
const About = lazy(()=> import('./pages/About'));
const Contact = lazy(()=> import('./pages/Contact'));
const WhyUs = lazy(()=> import('./pages/WhyUs'));
const Technology = lazy(()=> import('./pages/Technology'));
const Projects = lazy(()=> import('./pages/Projects'));
const Pricing = lazy(()=> import('./pages/Pricing'));
const Financing = lazy(()=> import('./pages/Financing'));
const Service = lazy(()=> import('./pages/Service'));
const Blog = lazy(()=> import('./pages/Blog'));
const BlogPost = lazy(()=> import('./pages/BlogPost'));
const Guide = lazy(()=> import('./pages/Guide'));
const Calculator = lazy(()=> import('./pages/Calculator'));
const Deals = lazy(()=> import('./pages/Deals'));
const Imprint = lazy(()=> import('./pages/Imprint'));
const Privacy = lazy(()=> import('./pages/Privacy'));
const NotFound = lazy(()=> import('./pages/NotFound'));
const Faq = lazy(()=> import('./pages/Faq'));
const SuccessStories = lazy(()=> import('./pages/SuccessStories'));
const SuccessStory = lazy(()=> import('./pages/SuccessStory'));
const PhotovoltaikKosten = lazy(()=> import('./pages/PhotovoltaikKosten'));
const Stromspeicher = lazy(()=> import('./pages/Stromspeicher'));

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<div className="p-10 text-center text-sm text-neutral-500">Lädt…</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/warum-zoe" element={<WhyUs />} />
        <Route path="/technologie" element={<Technology />} />
        <Route path="/projekte" element={<Projects />} />
        <Route path="/ueber-uns" element={<About />} />
        <Route path="/preise-kosten" element={<Pricing />} />
        <Route path="/finanzierung-foerderung" element={<Financing />} />
        <Route path="/service" element={<Service />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/erfolgsgeschichten" element={<SuccessStories />} />
  <Route path="/erfolgsgeschichten/:slug" element={<SuccessStory />} />
  <Route path="/photovoltaik-kosten" element={<PhotovoltaikKosten />} />
  <Route path="/stromspeicher" element={<Stromspeicher />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/rechner" element={<Calculator />} />
        <Route path="/angebote" element={<Deals />} />
        <Route path="/kontakt" element={<Contact />} />
        <Route path="/impressum" element={<Imprint />} />
        <Route path="/datenschutz" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </Layout>
  );
}
