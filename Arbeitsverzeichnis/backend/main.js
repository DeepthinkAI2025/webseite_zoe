import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";
import cron from 'node-cron';
import fs from 'fs/promises';
import path from 'path';
import express from 'express';
import cors from 'cors';

// 1. Initialize Gemini AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();
app.use(express.json());
const PORT = 3001;

const POSTS_DIR = path.join(process.cwd(), 'posts');
const LEADS_DIR = path.join(process.cwd(), 'leads');

/**
 * 2. Function to search for news
 * This is a simplified simulation. In a real-world scenario, you'd use a news API
 * or a web scraping service to get real-time data.
 */
async function searchForNews() {
    console.log("Searching for news about solar subsidies and legal updates...");

    const prompt = `
    Finde die neuesten Nachrichten und Updates aus Deutschland zu den folgenden Themen:
    1.  Staatliche Förderungen für Photovoltaikanlagen und Energiespeicher.
    2.  Neue Gesetze oder rechtliche Änderungen, die Besitzer von Solaranlagen betreffen.
    3.  Wichtige technologische Fortschritte oder Ankündigungen in der Solarbranche.

    Fasse die wichtigsten 1-2 Nachrichten der letzten 24-48 Stunden zusammen.
    Gib für jede Nachricht die Quelle und das Datum an.
    Die Ausgabe sollte eine kurze, prägnante Zusammenfassung der Nachrichten sein.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Found news summary:", text);
        return text;
    } catch (error) {
        console.error("Error searching for news:", error);
        return null;
    }
}

/**
 * 3. Function to generate a blog post
 * @param {string} newsSummary - The summary of news to write about.
 */
async function generateBlogPost(newsSummary) {
    console.log("Generating blog post from news summary...");

    const prompt = `
    Du bist ein Experte für Solarenergie und Content Creator für ZOE Solar, einen TÜV-zertifizierten Meisterbetrieb.
    Basierend auf der folgenden Nachrichtenzusammenfassung, schreibe einen informativen und ansprechenden Blogbeitrag für die Webseite.

    **Struktur des Blogbeitrags:**
    -   **Titel:** Ein kurzer, prägnanter und SEO-freundlicher Titel (z.B. "Wichtige Updates für Solar-Besitzer: Neue Förderungen und Gesetze im [Monat] [Jahr]").
    -   **Einleitung:** Eine kurze Einführung, die das Interesse der Leser weckt.
    -   **Hauptteil:** Gehe detaillierter auf die Nachrichten ein. Erkläre die Änderungen und was sie für Hausbesitzer und Interessenten bedeuten. Verwende einfache und klare Sprache.
    -   **Fazit:** Fasse die wichtigsten Punkte zusammen und gib einen Ausblick.
    -   **Call-to-Action:** Ermutige die Leser, sich bei ZOE Solar für eine kostenlose Beratung zu melden.

    **Wichtige Hinweise:**
    -   Der Tonfall sollte professionell, aber zugänglich sein.
    -   Der Beitrag sollte gut strukturiert sein (verwende Absätze und ggf. Aufzählungszeichen).
    -   Der Beitrag sollte als Markdown formatiert sein.
    -   Der Titel sollte mit einem '#' beginnen.

    **Hier ist die Nachrichtenzusammenfassung:**
    ---
    ${newsSummary}
    ---
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Generated blog post.");
        return text;
    } catch (error) {
        console.error("Error generating blog post:", error);
        return null;
    }
}

/**
 * 4. Function to save the blog post
 * @param {string} blogContent - The full markdown content of the blog post.
 */
async function saveBlogPost(blogContent) {
    try {
        await fs.mkdir(POSTS_DIR, { recursive: true });

        const titleLine = blogContent.split('\n')[0];
        // Remove '#' and create a URL-friendly slug
        const slug = titleLine.replace(/^#\s*/, '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const baseName = `${date}-${slug}`;
        let fileName = `${baseName}.md`;
        let filePath = path.join(POSTS_DIR, fileName);

        // Deduplizierung: gleiche Inhalte nicht mehrfach speichern; bei mehreren Posts/Tag Suffixe verwenden
        try {
            const existing = await fs.readFile(filePath, 'utf-8');
            if (existing.trim() === blogContent.trim()) {
                console.log(`Blog post already exists for today: ${fileName} (skipped)`);
                return;
            }
            let idx = 1;
            while (true) {
                const altName = `${baseName}-${idx}.md`;
                const altPath = path.join(POSTS_DIR, altName);
                try {
                    const existingAlt = await fs.readFile(altPath, 'utf-8');
                    if (existingAlt.trim() === blogContent.trim()) {
                        console.log(`Identical blog post already exists: ${altName} (skipped)`);
                        return;
                    }
                    idx++;
                } catch (e) {
                    // nicht vorhanden -> hier speichern
                    fileName = altName;
                    filePath = altPath;
                    break;
                }
            }
        } catch (e) {
            // Basis-Datei existiert noch nicht -> nutzen
        }

        await fs.writeFile(filePath, blogContent);
        console.log(`Blog post saved successfully: ${fileName}`);
    } catch (error) {
        console.error("Error saving blog post:", error);
    }
}

/**
 * Main function to run the entire process
 */
async function runAutomation() {
    console.log("Starting daily blog post automation...");
    const news = await searchForNews();
    if (news) {
        const blogPost = await generateBlogPost(news);
        if (blogPost) {
            await saveBlogPost(blogPost);
        }
    }
    console.log("Automation process finished.");
}

// 5. Schedule the cron job
// Runs every day at 8:00 AM
cron.schedule('0 8 * * *', () => {
    console.log('Running scheduled job: Creating daily blog post.');
    runAutomation();
}, {
    scheduled: true,
    timezone: "Europe/Berlin"
});

console.log("Cron job scheduled. The script will run every day at 8:00 AM (Berlin time).");
console.log("To test the process immediately, call runAutomation() directly.");

// Serve markdown files directly
app.use('/posts', express.static(POSTS_DIR));

// CORS (ENV CORS_ORIGIN optional). Ohne ENV: alle Origins erlaubt (Dev)
const corsOrigin = process.env.CORS_ORIGIN;
app.use(cors(corsOrigin ? { origin: corsOrigin } : {}));

// Root index to avoid "Cannot GET /" and document available endpoints
app.get('/', (req, res) => {
        const wantsHtml = (req.headers['accept'] || '').includes('text/html');
        if (wantsHtml) {
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.end(`<!doctype html>
<html lang="de">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ZOE Solar Backend</title>
    <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;max-width:760px;margin:40px auto;padding:0 16px;color:#111} code,a{color:#0a66c2} ul{line-height:1.8}</style>
    </head>
<body>
    <h1>ZOE Solar Backend</h1>
    <p>Status: <strong>ok</strong></p>
    <p>Verfügbare Endpunkte:</p>
    <ul>
        <li><a href="/api/health">/api/health</a></li>
        <li><a href="/api/posts">/api/posts</a></li>
        <li><code>/api/posts/:slug</code></li>
        <li><a href="/api/generate">/api/generate</a> (POST)</li>
        <li><a href="/api/lead">/api/lead</a> (POST)</li>
        <li><a href="/posts/">/posts</a></li>
    </ul>
    <p><a href="/">JSON-Ansicht per Accept-Header (application/json)</a></p>
</body>
</html>`);
                return;
        }
        res.json({
                service: 'ZOE Solar Backend',
                status: 'ok',
                time: new Date().toISOString(),
                endpoints: {
                        health: '/api/health',
                        listPosts: '/api/posts',
                        getPost: '/api/posts/:slug',
                        generate: '/api/generate',
                        lead: '/api/lead',
                        staticPosts: '/posts'
                }
        });
});

// Healthcheck
app.get('/api/health', async (req, res) => {
    try {
        await fs.mkdir(POSTS_DIR, { recursive: true });
        const files = await fs.readdir(POSTS_DIR);
        const count = files.filter(f => f.endsWith('.md')).length;
    // count leads too
    await fs.mkdir(LEADS_DIR, { recursive: true });
    const leadsFiles = await fs.readdir(LEADS_DIR);
    res.json({ status: 'ok', posts: count, leads: leadsFiles.length });
    } catch (e) {
        res.status(500).json({ status: 'error' });
    }
});

// API endpoint to get list of posts
app.get('/api/posts', async (req, res) => {
    try {
        await fs.mkdir(POSTS_DIR, { recursive: true });
        const files = await fs.readdir(POSTS_DIR);
        
        const posts = await Promise.all(files
            .filter(file => file.endsWith('.md'))
            .map(async (file) => {
                const filePath = path.join(POSTS_DIR, file);
                const content = await fs.readFile(filePath, 'utf-8');
                const title = content.split('\n')[0].replace(/^#\s*/, '');
                const date = file.substring(0, 10);
                const slug = file.replace('.md', '');
                
                return {
                    slug,
                    title,
                    date,
                };
            }));

        // Sort posts by date, newest first
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(posts);
    } catch (error) {
        console.error("Error reading posts:", error);
        res.status(500).json({ error: 'Failed to retrieve posts' });
    }
});

// API endpoint to get a single post
app.get('/api/posts/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const filePath = path.join(POSTS_DIR, `${slug}.md`);
        const content = await fs.readFile(filePath, 'utf-8');
        res.send(content);
    } catch (error) {
        res.status(404).json({ error: 'Post not found' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// For initial testing, you can uncomment the line below:
// runAutomation();

// Manual trigger of generation (optional token via ENV GENERATE_TOKEN)
app.post('/api/generate', async (req, res) => {
    try {
        const token = req.headers['x-token'] || req.query.token;
        const expected = process.env.GENERATE_TOKEN;
        if (expected && token !== expected) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        await runAutomation();
        res.json({ status: 'ok' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to generate' });
    }
});

// Simple Lead Capture Endpoint
app.post('/api/lead', async (req, res) => {
    try {
        const { name, email, phone, persona, message, source, utm } = req.body || {};
        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        await fs.mkdir(LEADS_DIR, { recursive: true });
        const ts = new Date().toISOString();
        const id = `${ts.replace(/[:.]/g,'-')}-${Math.random().toString(36).slice(2,8)}`;
        const record = { id, ts, name, email, phone, persona: persona || 'unknown', message: message || '', source: source || 'website', utm: utm || {}, ua: req.headers['user-agent'] };
        const file = path.join(LEADS_DIR, `${id}.json`);
        await fs.writeFile(file, JSON.stringify(record, null, 2), 'utf-8');
        console.log('Lead stored:', record);
        res.json({ status: 'ok', id });
    } catch (e) {
        console.error('Lead store error:', e);
        res.status(500).json({ error: 'Failed to store lead' });
    }
});
