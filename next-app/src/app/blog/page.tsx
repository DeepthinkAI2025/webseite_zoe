import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '../../lib/blog';
import { estimateReadingTime } from '@/lib/blog/model';

export const metadata: Metadata = {
  title: 'Blog | ZOE Solar',
  description: 'Aktuelle Beiträge rund um Solar, Performance & GAIO.'
};

export default function BlogIndexPage(){
  const posts = getAllPosts();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
      <p className="mt-2 text-muted-foreground">Einblicke in Technologie, Performance-Optimierung & AI Overview Strategien.</p>
      <div className="mt-8 space-y-10">
        {posts.map(p => {
          // Schätzen basierend auf nicht geladenem Body -> später erweiterbar wenn Content vorliegt
          const est = p.description ? estimateReadingTime(p.description) : undefined;
          return (
          <article key={p.slug} className="group">
            <h2 className="text-xl font-medium">
              <Link href={`/blog/${p.slug}`} className="hover:underline">
                {p.title}
              </Link>
            </h2>
            <div className="mt-1 text-xs text-muted-foreground flex gap-2 flex-wrap items-center">
              <time dateTime={p.date}>{new Date(p.date).toLocaleDateString('de-DE')}</time>
              {est && <span>• {est} Min</span>}
              {p.tags && p.tags.length > 0 && <span>• {p.tags.slice(0,3).join(', ')}</span>}
            </div>
            {p.description && <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{p.description}</p>}
          </article>
        );})}
      </div>
    </main>
  );
}
