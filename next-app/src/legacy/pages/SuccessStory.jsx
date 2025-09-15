import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { findSuccessStory } from '@/data/successStories';
import { breadcrumbLD, articleLD } from '@/utils/structuredData';
import { computeWordCountFromNode } from '@/utils/wordCount';
import { ArrowLeft, Star, CheckCircle } from '@/components/icons';

export default function SuccessStory(){
  const { slug } = useParams();
  const story = findSuccessStory(slug);
  if(!story){
    return <div className="pro-container py-16"><p className="text-sm text-neutral-500">Nicht gefunden. <Link className="underline" to="/erfolgsgeschichten">Zur Übersicht</Link></p></div>;
  }
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://zoe-solar.de';
  const path = `/erfolgsgeschichten/${story.slug}`;
  const breadcrumb = breadcrumbLD([
    { name: 'Start', item: origin + '/' },
    { name: 'Erfolgsgeschichten', item: origin + '/erfolgsgeschichten' },
    { name: story.name, item: origin + path }
  ]);
  // Dynamische Wortanzahl via DOM messen
  const articleRef = useRef(null);
  const [wordCount, setWordCount] = useState(0);
  useEffect(()=>{
    if(articleRef.current){
      const wc = computeWordCountFromNode(articleRef.current);
      if(wc) setWordCount(wc);
    }
  },[]);

  const article = articleLD({
    title: `${story.name} – ${story.location}`,
    description: story.story.slice(0,155),
    author: 'ZOE Redaktion',
    datePublished: story.installationDate + 'T00:00:00.000Z',
    dateModified: story.installationDate + 'T00:00:00.000Z',
    slug: path,
    origin,
    wordCount: wordCount || (story.story.split(/\s+/).length + story.benefits.join(' ').split(/\s+/).length)
  });

  // Meta Title/Description Länge anpassen Policy 52–59 / 151–160
  let title = `${story.name} – ${story.autarkyRate} Autarkie & Ersparnis`;
  if(title.length < 52) title = `${story.name} – ${story.autarkyRate} PV Autarkie & Ersparnis 2025`;
  if(title.length > 59) title = title.slice(0,59);
  const fallbackDesc = 'ZOE Solar Erfolgsgeschichte 2025: Unabhängigkeit, Amortisation, reale Einsparungen & Autarkieentwicklung – Inspiration & Kennzahlen für Ihre Planung.';
  let desc = `${story.name}: ${story.story}`.replace(/\s+/g,' ').trim();
  if(desc.length < 151) desc = (desc + ' ' + fallbackDesc).slice(0,160);
  if(desc.length > 160) desc = desc.slice(0,160);

  return (
    <div className="bg-white">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={origin + path} />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script id="ld-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      </Helmet>
      <article className="pro-container py-12" id="main-content" ref={articleRef}>
        <Link to="/erfolgsgeschichten" className="inline-flex items-center text-blue-600 hover:underline focus-visible:focus-ring mb-6 text-sm"><ArrowLeft className="w-4 h-4 mr-1" />Zurück</Link>
        <header className="max-w-3xl mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-800 tracking-tight">{story.name}: {story.autarkyRate} Autarkie in {story.location}</h1>
          <p className="mt-4 text-neutral-600">Installiert am {new Date(story.installationDate).toLocaleDateString('de-DE')} – {story.systemSize} System, amortisiert in {story.paybackPeriod}, geschätzte jährliche Ersparnis €{story.annualSavings.toLocaleString('de-DE')}.</p>
        </header>
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div>
            <img src={story.image} alt={`${story.name} Anlage`} className="rounded-lg w-full object-cover aspect-video mb-6" loading="lazy" />
            <div className="flex items-center gap-2 mb-6">
              {[...Array(story.rating)].map((_,i)=>(<Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />))}
              <span className="text-sm text-neutral-600">Bewertung {story.rating}/5</span>
            </div>
            <h2 className="text-xl font-semibold mb-3">Vorteile & Kennzahlen</h2>
            <ul className="space-y-2 mb-8">
              {story.benefits.map((b,i)=>(
                <li key={i} className="flex items-start gap-2 text-neutral-700"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />{b}</li>
              ))}
            </ul>
          </div>
          <div className="prose prose-neutral max-w-none">
            <h2>Hintergrund</h2>
            <p>{story.story}</p>
            <h2>Ergebnis</h2>
            <p>Mit {story.systemSize} erreicht der Haushalt eine Autarkie von {story.autarkyRate}. Die jährliche Nettoersparnis von rund €{story.annualSavings.toLocaleString('de-DE')} führt zu einer amortisierten Investition in {story.paybackPeriod}. Ergänzende Optimierungen (Lastverschiebung, Speicheransteuerung) können weitere Prozentpunkte freisetzen.</p>
            <h2>Learnings</h2>
            <p>Transparente Dimensionierung, qualitativ belastbare Komponenten und Monitoring in den ersten Betriebsmonaten beschleunigen Payback und stabilisieren Renditepfad.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
