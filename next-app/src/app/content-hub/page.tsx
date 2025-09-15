import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Content Hub',
  description: 'Topic clusters for fundamentals, economics, performance, GAIO & implementation.',
  canonicalPath: '/content-hub'
});

interface TopicLink { type: 'page' | 'blog'; label: string; url: string; }
interface TopicCluster { id: string; title: string; description: string; links: TopicLink[]; }

function loadTopics(): TopicCluster[] {
  const file = path.join(process.cwd(), 'content', 'hub', 'topics.json');
  if(!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file,'utf-8')) as TopicCluster[];
}

export default function ContentHubPage(){
  const topics = loadTopics();
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-content-hub"
        data={breadcrumbJsonLd([
          { name: 'Start', url: '/' },
          { name: 'Content Hub', url: '/content-hub' }
        ])}
      />
      <h1 className="text-3xl font-bold tracking-tight mb-4">Content Hub</h1>
      <p className="text-muted-foreground mb-10 max-w-2xl">Kuratiertes Themen-Portal: schnell zu relevanten Informationen über Technologie, Wirtschaftlichkeit, Performance, GAIO & Implementierung navigieren.</p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {topics.map(t => (
          <div key={t.id} className="rounded border p-5 bg-white/50 dark:bg-neutral-900/40 flex flex-col">
            <h2 className="font-semibold tracking-tight text-lg mb-2">{t.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.description}</p>
            <ul className="space-y-2 text-sm">
              {t.links.map(l => (
                <li key={l.url}>
                  <a href={l.url} className="text-blue-700 hover:underline" data-type={l.type}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
