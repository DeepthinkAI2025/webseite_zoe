import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Projects',
  description: 'Selected ZOE Solar reference projects and solution snippets.',
  canonicalPath: '/en/projects'
});

export default function ProjectsEn(){
  const items = Array.from({ length: 6 }).map((_,i)=>({ id:i+1, title:`Reference #${i+1}`, kwp: (5+i) }));
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd id="ld-breadcrumb-en-projects" data={breadcrumbJsonLd([{ name: 'Home', url: '/en' }, { name: 'Projects', url: '/en/projects' }])} />
      <h1 className="text-3xl font-bold tracking-tight mb-6">Projects</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {items.map(p=> (
          <div key={p.id} className="rounded border p-4 bg-white/50 dark:bg-neutral-900/40">
            <h2 className="font-medium">{p.title}</h2>
            <p className="text-xs text-muted-foreground">Approx. {p.kwp} kWp Roof System</p>
          </div>
        ))}
      </div>
    </main>
  );
}
