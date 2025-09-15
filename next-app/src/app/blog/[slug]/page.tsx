import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllPosts, getPostBySlug } from '../../../lib/blog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { estimateReadingTime } from '@/lib/blog/model';
import { buildAuthorSchema } from '@/lib/seo/author-schema';
import { SITE_URL } from '@/lib/seo/constants';
import { JsonLd } from '@/components/seo/JsonLd';
import cities from '@/content/geo/cities.json';

// Dynamic Metadata
export async function generateMetadata({ params }: { params: { slug: string }}): Promise<Metadata>{
  const post = getPostBySlug(params.slug);
  if(!post) return { title: 'Not Found | ZOE Solar'};
  return {
    title: `${post.meta.title} | ZOE Solar`,
    description: post.meta.description
  };
}

export async function generateStaticParams(){
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string }} ){
  const post = getPostBySlug(params.slug);
  if(!post) notFound();
  const { meta, content } = post;
  const readingMinutes = estimateReadingTime(content);
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title,
    name: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    author: {
      '@type': 'Person',
      name: meta.author || 'ZOE Solar'
    },
    publisher: {
      '@type': 'Organization',
      name: 'ZOE Solar'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${meta.slug}`
    },
    url: `${SITE_URL}/blog/${meta.slug}`,
    inLanguage: 'de',
    wordCount: content.split(/\s+/).filter(Boolean).length,
    timeRequired: `PT${readingMinutes}M`
  };
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 prose dark:prose-invert">
  <JsonLd id="ld-article" data={articleJsonLd} />
	<JsonLd id="ld-author" data={buildAuthorSchema({ name: meta.author || 'ZOE Solar', url: `${SITE_URL}/team` })} />
      <a href="/blog" className="no-underline text-sm text-muted-foreground">← Zurück</a>
      <h1>{meta.title}</h1>
      <p className="mt-0 text-sm text-muted-foreground">{new Date(meta.date).toLocaleDateString('de-DE')} · {meta.author} · {readingMinutes} Min Lesezeit</p>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      <hr />
      <section className="not-prose mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-neutral-600 mb-3">Regionale Services</h2>
        <ul className="flex flex-wrap gap-3 text-xs">
          {cities.map(c => (
            <li key={c.slug}>
              <a className="inline-block px-2 py-1 rounded border hover:bg-neutral-50" href={`/standorte/${c.slug}`}>{c.name}</a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
