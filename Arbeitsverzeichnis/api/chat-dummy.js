// Minimaler Dummy-Chat-Endpunkt für lokale Tests
// Start: node api/chat-dummy.js (port 8787)
import http from 'http';

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, allowHeaders());
    res.end();
    return;
  }
  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', () => {
      try {
        const { messages = [] } = JSON.parse(body || '{}');
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          // Fallback: Echo-Antwort ohne externen Aufruf
          const last = messages[messages.length - 1]?.content || '';
          const reply = `Verstanden: "${last.slice(0, 120)}". (Demo) Ich kann Ihre Fragen beantworten oder Sie mit unserer KI‑Telefonie verbinden.`;
          res.writeHead(200, { 'Content-Type': 'application/json', ...allowHeaders() });
          res.end(JSON.stringify({ reply }));
          return;
        }

        forwardToGemini(apiKey, messages)
          .then((reply) => {
            res.writeHead(200, { 'Content-Type': 'application/json', ...allowHeaders() });
            res.end(JSON.stringify({ reply }));
          })
          .catch((e) => {
            const last = messages[messages.length - 1]?.content || '';
            const reply = `Danke! (Fallback) Ihre Nachricht: "${last.slice(0, 120)}". Bei Bedarf rufen Sie uns an.`;
            res.writeHead(200, { 'Content-Type': 'application/json', ...allowHeaders() });
            res.end(JSON.stringify({ reply }));
          });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json', ...allowHeaders() });
        res.end(JSON.stringify({ error: 'Bad request' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json', ...allowHeaders() });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

function allowHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

const PORT = 8787;
server.listen(PORT, () => {
  console.log(`Dummy chat server listening on http://localhost:${PORT}`);
});

async function forwardToGemini(apiKey, messages) {
  // Nimm wenige letzte Nachrichten, mappe Rollen
  const recent = messages.slice(-8).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(m.content || '') }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${encodeURIComponent(apiKey)}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: recent.length ? recent : [{ role: 'user', parts: [{ text: 'Hallo' }] }],
      generationConfig: { temperature: 0.4, topP: 0.9, maxOutputTokens: 512 },
    }),
  });
  if (!resp.ok) throw new Error(`Gemini error ${resp.status}`);
  const data = await resp.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    'Gern! Was möchten Sie über Photovoltaik, Einsparungen oder unsere Installation wissen?';
  return reply;
}
