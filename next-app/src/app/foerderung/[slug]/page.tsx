import fs from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { buildMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/jsonld';

const GENERATED_DIR = path.join(process.cwd(), 'content', 'generated', 'foerderung');

// Simple In-Memory Cache (nur Server Lifetime). Key = slug
interface CacheEntry { content: string; data: Front; ts: number }
const FOERDER_CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 Minuten – anpassbar

function loadFoerderung(slug: string){
  const now = Date.now();
  const cached = FOERDER_CACHE.get(slug);
  if(cached && (now - cached.ts) < CACHE_TTL_MS){
    return cached;
  }
  const file = path.join(GENERATED_DIR, slug + '.mdx');
  if(!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file,'utf8');
  const parsed = matter(raw);
  const entry: CacheEntry = { content: parsed.content, data: parsed.data as Front, ts: now };
  FOERDER_CACHE.set(slug, entry);
  return entry;
}

export async function generateStaticParams(){
  if(!fs.existsSync(GENERATED_DIR)) return [];
  return fs.readdirSync(GENERATED_DIR)
    .filter(f=>f.endsWith('.mdx'))
    .map(f=>({ slug: f.replace(/\.mdx$/, '') }));
}

type Front = { title: string; description?: string; canonical?: string; updated?: string; region?: string };

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const file = path.join(GENERATED_DIR, params.slug + '.mdx');
  if(!fs.existsSync(file)) return {};
  const raw = fs.readFileSync(file, 'utf8');
  const { data } = matter(raw);
  const front = data as Front;
  return buildMetadata({
    title: front.title,
    description: front.description,
    canonicalPath: front.canonical || `/foerderung/${params.slug}`
  });
}

function extractFaq(body: string){
  // Sehr einfache Heuristik: Abschnitte "**Frage**" gefolgt von Antwort (nächster Absatz)
  const regex = /\*\*(.+?)\*\*\n\n([^*\n][^\n]*)/g;
  const out: { q: string; a: string }[] = [];
  let m;
  while((m = regex.exec(body))){
    out.push({ q: m[1].trim(), a: m[2].trim() });
  }
  return out.length ? faqJsonLd(out) : null;
}

export default function FoerderungDynamicPage({ params }: { params: { slug: string } }){
  const loaded = loadFoerderung(params.slug);
  if(!loaded) notFound();
  const { content, data: front } = loaded;
  const faq = extractFaq(content);
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <JsonLd id={`ld-breadcrumb-foerderung-${params.slug}`} data={breadcrumbJsonLd([
        { name: 'Start', url: '/' },
        { name: 'Förderung', url: '/foerderung' },
        { name: front.title, url: `/foerderung/${params.slug}` }
      ])} />
      {faq && <JsonLd id={`ld-faq-foerderung-${params.slug}`} data={faq} />}
      <article className="prose prose-sm md:prose-base max-w-none">
        <h1>{front.title}</h1>
        {front.updated && <p className="text-xs text-neutral-500">Aktualisiert: {front.updated}</p>}
        <MDXRemote source={content} />
      </article>
    </main>
  );
}