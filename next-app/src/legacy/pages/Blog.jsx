import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { breadcrumbLD, buildHreflang } from '@/utils/structuredData';
import { Calendar, ArrowRight } from '@/components/icons';
import { API_BASE } from '../utils/api';
import { Heading } from '@/components/ui/heading';
import { Section } from '@/components/ui/section';
import { useTranslation } from 'react-i18next';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/posts`);
                if (!response.ok) {
                    throw new Error('Fehler beim Laden der Beiträge.');
                }
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <Section size="wide" padding="normal">
                        <Helmet>
                                <title>Solar Ratgeber 2025 – PV Wissen & Insights Kompass DE</title>
                                <meta name="description" content="Solar Ratgeber 2025: PV Trends, Technik, Förderung, Kostenoptimierung & Praxiswissen für Autarkie – kuratiert von der ZOE Solar Redaktion für Ihren Vorteil." />
                                {(() => {
                                    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://zoe-solar.de';
                                    const path = '/blog';
                                    const bc = breadcrumbLD([
                                        { name: 'Start', item: origin + '/' },
                                        { name: 'Blog', item: origin + '/blog' }
                                    ]);
                                                                        const itemList = {
                                        '@context': 'https://schema.org',
                                        '@type': 'ItemList',
                                        itemListElement: posts.slice(0,20).map((p,i)=>({
                                            '@type': 'ListItem',
                                            position: i+1,
                                            url: origin + '/blog/' + p.slug,
                                            name: p.title
                                        }))
                                    };
                                                                        const blogLd = {
                                                                            '@context': 'https://schema.org',
                                                                            '@type': 'Blog',
                                                                            name: 'ZOE Solar Blog',
                                                                            url: origin + '/blog'
                                                                        };
                                                                        const collectionPageLd = {
                                                                            '@context': 'https://schema.org',
                                                                            '@type': 'CollectionPage',
                                                                            name: 'Solar Ratgeber & Blog',
                                                                            about: 'Photovoltaik Trends, Technik, Förderung, Wirtschaftlichkeit und Strategien',
                                                                            mainEntity: itemList.itemListElement.map(e => ({ '@type': 'BlogPosting', '@id': e.url, headline: e.name }))
                                                                        };
                                    const hreflang = buildHreflang({ origin, path, locales:['de','en','fr','es'], strategy:'prefix' });
                                    return <>
                                        {hreflang.map(l => <link key={l.hrefLang} rel={l.rel} hrefLang={l.hrefLang} href={l.href} />)}
                                        <script type="application/ld+json">{JSON.stringify(bc)}</script>
                                        <script type="application/ld+json">{JSON.stringify(itemList)}</script>
                                        <script type="application/ld+json">{JSON.stringify(blogLd)}</script>
                                        <script type="application/ld+json">{JSON.stringify(collectionPageLd)}</script>
                                    </>;
                                })()}
                        </Helmet>
            <div className="text-center flow-lg mb-12">
                <Heading as="h1" size="3xl">{t('blog.title')}</Heading>
                <p className="lead max-w-2xl mx-auto text-neutral-500">{t('blog.subtitle')}</p>
            </div>

            {loading && <p className="text-center">Lade Beiträge...</p>}
            {error && <p className="text-center text-red-500">Fehler: {error} Bitte stellen Sie sicher, dass der Backend-Server läuft.</p>}
            
            {!loading && !error && posts.length === 0 && (
                <div className="text-center bg-neutral-50 p-8 rounded-lg flow-sm">
                    <h3 className="text-xl font-semibold text-neutral-700">Noch keine Beiträge vorhanden</h3>
                    <p className="text-neutral-500">Der automatische Prozess zur Beitragserstellung läuft täglich. Schauen Sie bald wieder vorbei!</p>
                    <p className="text-sm text-neutral-400">(Entwicklung: API via HTTPS-Proxy bereitzustellen empfohlen – setzen Sie ggf. VITE_API_BASE_URL. Vermeiden Sie Mixed Content durch unverschlüsselte http:// Aufrufe.)</p>
                </div>
            )}

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {posts.map((post) => (
                                        <Link to={`/blog/${post.slug}`} key={post.slug} className="block group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                                {post.image && (
                                                    <div className="h-48 overflow-hidden">
                                                        <img src={post.image} alt={post.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                                                    </div>
                                                )}
                                                <div className="p-6">
                            <div className="flex items-center text-sm text-neutral-500 mb-2">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>{new Date(post.date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <Heading as="h2" size="xl" className="mb-2 group-hover:text-blue-600 transition-colors duration-300">{post.title}</Heading>
                            <div className="mt-3 flex items-center font-semibold text-blue-600">
                                Weiterlesen
                                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </Section>
    );
};

export default Blog;
