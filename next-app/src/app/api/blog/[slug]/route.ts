import { NextResponse, type NextRequest } from 'next/server';
import { getPostBySlug } from '@/lib/blog';
import { mapLocalMarkdown } from '@/lib/blog/model';

// Next 15 kann context.params ein Promise sein; defensive Entpackung
interface BlogSlugParams { slug: string }
interface BlogRouteContext { params: Promise<BlogSlugParams> | BlogSlugParams }

export async function GET(_req: NextRequest, context: BlogRouteContext){
  const raw = await context.params;
  const { slug } = raw;
  const post = getPostBySlug(slug);
  if(!post) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json(
    mapLocalMarkdown(post.meta, post.content),
    { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' }}
  );
}
