import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import WhyUs from './pages/WhyUs';
import Technology from './pages/Technology';
import Projects from './pages/Projects';
import Pricing from './pages/Pricing';
import Financing from './pages/Financing';
import Service from './pages/Service';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Guide from './pages/Guide';
import Calculator from './pages/Calculator';
import Deals from './pages/Deals';
import Imprint from './pages/Imprint';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import Faq from './pages/Faq';
import SuccessStories from './pages/SuccessStories';

export default function App() {
  return (
    <Layout>
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
    </Layout>
  );
}
