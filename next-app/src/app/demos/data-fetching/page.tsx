import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';

export const revalidate = 3600; // ISR Beispiel – Seite wird max. 1x pro Stunde neu gerendert

export const metadata: Metadata = buildMetadata({
  title: 'Data Fetching Demo – ISR & Streaming',
  description: 'Beispiel einer Server Component die externe Daten cached (ISR) und in Next.js App Router rendert.',
  canonicalPath: '/demos/data-fetching'
});

async function fetchPosts(){
  // Placeholder API – könnte durch internes Backend ersetzt werden
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5', { next: { revalidate: 3600 } });
  if(!res.ok) throw new Error('Failed to load');
  return res.json() as Promise<Array<{ id:number; title:string; body:string }>>;
}

export default async function DataFetchingDemo(){
  const posts = await fetchPosts();
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Data Fetching (ISR) Demo</h1>
      <p className="text-neutral-700 leading-relaxed mb-8">Diese Seite nutzt eine Server Component mit <code>revalidate</code>. Die externe API wird höchstens einmal pro Stunde erneut abgefragt. Ideal für semi-statische Inhalte (Preise, Feature-Listen, Blog Aggregate). Fehlerhafte Fetches sollten abgefangen & geloggt werden (Observability).</p>
      <ul className="space-y-4">
        {posts.map(p => (
          <li key={p.id} className="border rounded-md p-4 bg-white shadow-sm">
            <h2 className="font-semibold mb-1 text-neutral-900">{p.title}</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">{p.body}</p>
          </li>
        ))}
      </ul>
      <div className="mt-10 text-xs text-neutral-500">Refresh Window: 3600s – Force Revalidate via On-Demand Revalidation Hook moeglich.</div>
    </div>
  );
}
