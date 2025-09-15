import { NextResponse } from 'next/server';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { mapLocalMarkdown } from '@/lib/blog/model';

export async function GET(){
  const posts = getAllPosts().map(meta => {
    const post = getPostBySlug(meta.slug);
    if(!post) return null;
    return mapLocalMarkdown(post.meta, post.content);
  }).filter(Boolean);
  return NextResponse.json(posts, { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' }});
}
