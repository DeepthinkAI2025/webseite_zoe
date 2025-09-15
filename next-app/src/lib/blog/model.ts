// Blog Content Model (erweiterte Struktur für zukünftige FAPRO Synchronisation)
export interface BlogArticleRecord {
  id?: string;              // FAPRO interne ID
  slug: string;             // URL Slug
  title: string;            // Titel
  excerpt: string;          // Kurzbeschreibung
  body: string;             // Markdown / HTML Content
  coverImage?: string;      // Cover URL
  ogImage?: string;         // Social Sharing Bild
  category?: string;        // Kategorie (z.B. "technik")
  tags?: string[];          // Stichworte
  locale: string;           // de | en | ...
  publishedAt: string;      // ISO Timestamp
  updatedAt?: string;       // ISO Timestamp
  readingTimeMinutes?: number; // Berechnet (Heuristik)
  status: 'draft' | 'published';
}

export function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200)); // ~200 wpm
}

// Adapter für existierende lokale Markdown Meta → BlogArticleRecord
export function mapLocalMarkdown(meta: any, content: string): BlogArticleRecord {
  return {
    id: meta.id,
    slug: meta.slug,
    title: meta.title,
    excerpt: meta.description || meta.excerpt || '',
    body: content,
    coverImage: meta.cover,
    ogImage: meta.ogImage || meta.cover,
    category: meta.category,
    tags: meta.tags || [],
    locale: meta.locale || 'de',
    publishedAt: meta.date || new Date().toISOString(),
    updatedAt: meta.updatedAt,
    readingTimeMinutes: estimateReadingTime(content),
    status: meta.status || 'published'
  };
}