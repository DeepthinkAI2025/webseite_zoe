import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string; // ISO
  description?: string;
  author?: string;
  tags?: string[];
  cover?: string;
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(file => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
      const { data } = matter(raw);
      return {
        slug: data.slug || file.replace(/\.mdx$/, ''),
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString(),
        description: data.description || '',
        author: data.author || 'ZOE',
        tags: data.tags || [],
        cover: data.cover || undefined
      } as BlogPostMeta;
    })
    .sort((a,b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string){
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if(!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file,'utf-8');
  const { data, content } = matter(raw);
  const meta: BlogPostMeta = {
    slug: data.slug || slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString(),
    description: data.description || '',
    author: data.author || 'ZOE',
    tags: data.tags || [],
    cover: data.cover || undefined
  };
  return { meta, content };
}
