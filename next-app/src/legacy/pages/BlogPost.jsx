import React, { useState, useEffect, useRef } from 'react';
import { API_BASE } from '../utils/api';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
// remark-gfm wird erst nach Bedarf geladen (reduziert initialen BlogPost Chunk)
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from '@/components/icons';
import { articleLD, breadcrumbLD, buildHreflang } from '@/utils/structuredData';
import { computeWordCountFromNode } from '@/utils/wordCount';

const BlogPost = () => {
    const { slug } = useParams();
        const [post, setPost] = useState({ content: '', title: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [markdownPlugins, setMarkdownPlugins] = useState(null); // wird per dynamic import gefüllt
    const [meta, setMeta] = useState({ description: '', wordCount: 0, dates: { published: '', modified: '' } });
    const articleRef = useRef(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // In a real app, you'd fetch from your backend API
                                const response = await fetch(`${API_BASE}/api/posts/${slug}`);
                if (!response.ok) {
                    throw new Error('Beitrag nicht gefunden');
                }
                const markdown = await response.text();
                const title = markdown.split('\n')[0].replace(/^#\s*/, '');
                                // Beschreibung: erste nicht-leere Textzeile, die nicht die Hauptüberschrift ist
                                const lines = markdown.split('\n').slice(1).map(l => l.trim()).filter(l => l && !l.startsWith('#'));
                                const rawDesc = lines[0] || title;
                                const plainDesc = rawDesc
                                    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // Bilder
                                    .replace(/\[[^\]]*\]\([^)]*\)/g, '') // Links
                                    .replace(/`{1,3}[^`]*`{1,3}/g, '') // Inline Code
                                    .replace(/[*_>#~-]/g, ' ') // Markdown Sonderzeichen
                                    .replace(/\s+/g, ' ') // Mehrfache Spaces
                                    .trim();
                                const maxLen = 155;
                                let description = plainDesc.substring(0, maxLen);
                                if (description.length === maxLen && plainDesc.length > maxLen) {
                                    // Clean cut at last space for nicer snippet
                                    const cut = description.lastIndexOf(' ');
                                    if (cut > 60) description = description.substring(0, cut) + '…';
                                }
                                const wordCount = markdown.replace(/```[\s\S]*?```/g, '') // Codeblöcke entfernen
                                    .replace(/[^A-Za-zÄÖÜäöüß0-9\s]/g, ' ') // Sonderzeichen raus
                                    .split(/\s+/)
                                    .filter(Boolean).length;
                                const nowISO = new Date().toISOString();
                                const lastMod = response.headers.get('last-modified');
                                const published = lastMod ? new Date(lastMod).toISOString() : nowISO;
                                setPost({ content: markdown, title });
                                setMeta({ description, wordCount, dates: { published, modified: published } });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    // Nach dem Rendern des Markdown-Inhalts die tatsächliche Wortanzahl aus dem DOM messen
    useEffect(() => {
        if (!loading && !error && articleRef.current) {
            const wc = computeWordCountFromNode(articleRef.current);
            if (wc && Math.abs(wc - (meta.wordCount || 0)) > 10) {
                setMeta(prev => ({ ...prev, wordCount: wc }));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, error, post.content, markdownPlugins]);

    // remark-gfm nur laden wenn Beitrag selbst fertig geladen wurde
    useEffect(() => {
        if (!loading && !error && post.content && !markdownPlugins) {
            let active = true;
            import('remark-gfm')
                .then(m => {
                    if (active) setMarkdownPlugins([m.default || m]);
                })
                .catch(() => {
                    // falls Plugin nicht lädt, render ohne GFM
                    if (active) setMarkdownPlugins([]);
                });
            return () => { active = false; };
        }
    }, [loading, error, post.content, markdownPlugins]);

        if (loading) return <div className="text-center p-10">Lade Beitrag...</div>;
        if (error) return <div className="text-center p-10 text-red-500">Fehler: {error}</div>;

        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://example.com';
        const pagePath = `/blog/${slug}`;
        const breadcrumb = breadcrumbLD([
            { name: 'Start', item: origin + '/' },
            { name: 'Blog', item: origin + '/blog' },
            { name: post.title || 'Beitrag', item: origin + pagePath }
        ]);
                const article = articleLD({
                        title: post.title,
                        description: meta.description,
                        author: 'ZOE Redaktion',
                        datePublished: meta.dates.published,
                        dateModified: meta.dates.modified,
                        slug: pagePath,
                        origin,
                        wordCount: meta.wordCount,
                        extras: {
                            headline: post.title,
                            author: {
                                '@type': 'Person',
                                name: 'ZOE Redaktion'
                            },
                            publisher: {
                                '@type': 'Organization',
                                name: 'ZOE Solar',
                                logo: {
                                    '@type': 'ImageObject',
                                    url: origin + '/Logo-ZOE.png'
                                }
                            },
                            image: post.image ? [post.image] : undefined
                        }
                });

    return (
        <div className="pro-container py-6 lg:py-8">
                        <Helmet>
                            {(() => {
                                // Title clamping 52–59 chars
                                const baseSuffix = ' – PV Strategien & Insights 2025';
                                let computedTitle = `${post.title}${baseSuffix}`;
                                if (computedTitle.length < 52) {
                                    computedTitle = `${post.title} – PV Strategien & Insights 2025 DE`;
                                }
                                if (computedTitle.length > 59) {
                                    computedTitle = computedTitle.slice(0,59);
                                }
                                // Description fallback + enforcement 151–160
                                const fallback = 'ZOE Solar Blog 2025: Photovoltaik Analysen Autarkie Förderung Wirtschaftlichkeit Technik Trends Rendite Strategien für fundierte Entscheidungen & Planung.';
                                let desc = meta.description || '';
                                if (desc.length < 151) {
                                    // Extend with fallback ensuring semantic continuity
                                    desc = (desc + ' ' + fallback).replace(/\s+/g,' ').trim();
                                }
                                if (desc.length > 160) desc = desc.slice(0,160);
                                return <><title>{computedTitle}</title><meta name="description" content={desc} /></>;
                            })()}
                                <meta property="og:title" content={`${post.title} – ZOE Solar Blog`} />
                                <meta property="og:description" content={meta.description} />
                                <meta property="og:type" content="article" />
                                                                <link rel="canonical" href={origin + pagePath} />
                                                                {buildHreflang({ origin, path: pagePath, locales:['de','en','fr','es'], strategy:'prefix' }).map(tag => (
                                                                    <link key={tag.hrefLang} rel={tag.rel} hrefLang={tag.hrefLang} href={tag.href} />
                                                                ))}
                                <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
                                <script id="ld-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
            </Helmet>

            <div className="mb-8">
                <Link to="/blog" className="flex items-center text-blue-600 hover:underline focus-visible:focus-ring">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Zurück zur Blog-Übersicht
                </Link>
            </div>

            <article ref={articleRef} className="prose lg:prose-xl max-w-none bg-white p-8 rounded-lg shadow-md" itemScope itemType="https://schema.org/Article">
                {markdownPlugins === null ? (
                    <div className="text-neutral-500">Lade Formatierung...</div>
                                ) : (
                                        <ReactMarkdown remarkPlugins={markdownPlugins}
                                            components={{
                                                img: (props) => <img alt="Bild"  loading="lazy" {...props} />
                                            }}
                                        >
                                                {post.content}
                                        </ReactMarkdown>
                                )}
            </article>
        </div>
    );
};

export default BlogPost;
