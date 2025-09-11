#!/usr/bin/env node
/**
 * Minimaler statischer HTTP Server für den `dist` Ordner mit SPA Fallback.
 * Nutzt Port aus ENV PORT oder 4173.
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const port = process.env.PORT ? Number(process.env.PORT) : 4173;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif'
};

const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

const server = http.createServer((req, res) => {
  const urlPath = decodeURI(req.url.split('?')[0]);
  let filePath = path.join(distDir, urlPath);
  if (urlPath.endsWith('/')) filePath = path.join(distDir, urlPath, 'index.html');
  const ext = path.extname(filePath);
  if (!ext || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // SPA Fallback
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(indexHtml);
    return;
  }
  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  } catch (e) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

server.listen(port, () => {
  console.log(`[static-serve] Running on http://localhost:${port}`);
});

// Sauber herunterfahren bei SIGINT/SIGTERM
['SIGINT','SIGTERM'].forEach(sig => process.on(sig, () => { server.close(()=>process.exit(0)); }));
