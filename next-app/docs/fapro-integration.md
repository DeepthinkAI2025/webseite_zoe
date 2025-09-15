# FAPRO Integration – Lead & Blog / Analytics Anbindung

## Ziel
Die Webseite kann Leads (Kontaktanfragen) direkt in FAPRO anlegen, Netzbetreiber-Informationen zur Qualifizierung abrufen und (optional) Metriken senden. Später kann Content (Blog) ebenfalls aus / in FAPRO synchronisiert werden.

## Environment Variablen (Next.js)
```
FAPRO_BASE_URL=https://kundenservice.zukunftsorientierte-energie.de/api
FAPRO_API_USER=web-user
FAPRO_API_PASS=***                # Falls Login Fluss benötigt (Optional)
FAPRO_API_TOKEN=***               # Bevorzugt: bereits ausgestellter Service Token
FAPRO_TIMEOUT_MS=8000
```
Empfehlung: Nur **ein** sicherer Token für serverseitige Nutzung (Route Handler). Kein Client-Exposure.

## Kern-Endpunkte (Priorisiert)
| Zweck | Endpoint | Methode | Verwendet in |
|-------|----------|---------|--------------|
| Lead anlegen | (angenommen) `/customer/leads` | POST | `/api/fapro/lead` |
| Netzbetreiber Lookup PLZ | `/network-operator/lookup?plz=XXXXX` | GET | Lead Anreicherungs-Flow |
| Netzbetreiber Lookup City/PLZ | `/network-operator/geo-lookup?city=Berlin&zip=10115` | GET | (Optional) Zusatzdaten |
| Analytics Metriken Batch | `/analytics/metrics` | POST | (Optional) Web Calculator / Interaktion |
| Health Check | `/health` | GET | Monitoring / Readiness |

> Hinweis: Für den Lead-Anlage-Endpunkt wird ein konkreter Pfad in Abstimmung mit FAPRO benötigt – Platzhalter `customer/leads` kann angepasst werden.

## Lead Payload (Vorschlag)
```
{
  "name": "Max Mustermann",
  "email": "max@example.com",
  "message": "Kurzbeschreibung Dachfläche, Ausrichtung, Speicherwunsch",
  "plz": "10115",
  "source": "website",
  "utm": {"source": "google", "medium": "cpc", "campaign": "brand"},
  "meta": {
    "networkOperator": "optional", 
    "page": "/contact",
    "userAgent": "..."
  }
}
```

## Sicherheitsaspekte
- Token nur serverseitig (API Route) einsetzen.
- Rate Limiting (Phase 2) – z.B. Basic Token Bucket je IP.
- Validation & Sanitization (z.B. HTML Strip bei message / Länge begrenzen ~1000 Zeichen).
- Audit Logging (Phase 2): Erfolgreiche / fehlerhafte Lead Requests in JSON Log.

## Fehlerbehandlung (API Route)
| Fehler | HTTP | Antwort |
|--------|------|---------|
| Validation | 400 | `{ error: 'validation_failed', fields: { ... }}` |
| Upstream Timeout | 504 | `{ error: 'upstream_timeout' }` |
| Upstream Auth | 502 | `{ error: 'upstream_auth' }` |
| Unbekannt | 500 | `{ error: 'unknown' }` |

## Blog Content Modell (zukünftige FAPRO Synchronisation)
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| id | string | Interne ID (FAPRO) |
| slug | string | URL Slug |
| title | string | Titel |
| excerpt | string | Kurzbeschreibung / Teaser |
| body | markdown/html | Inhalt (Rich) |
| coverImage | string | URL Cover |
| ogImage | string | Social Sharing Bild |
| category | string | Kategorie (z.B. "technik") |
| tags | string[] | Tags |
| locale | string | `de` / `en` ... |
| publishedAt | ISO | Veröffentlichung |
| updatedAt | ISO | Update Zeit |
| readingTime | number | Minuten (berechnet) |
| status | enum | `draft` / `published` |

## Implementierte Lokale Mock API (Schicht)
- `GET /api/blog` → Liste lokaler Markdown Posts (Mapping auf obiges Modell teils abgeleitet)
- `GET /api/blog/[slug]` → Einzelpost (Markdown Inhalt + Metadaten)

## Nächste Ausbauschritte
1. Lead Erstellung live testen (Dummy Token + Logging) –> anschließend echte Token Rotation.
2. Optionales Caching Netzbetreiber Lookup (LRU in Memory).
3. Blog Synchronisation (Pull/Push) aus FAPRO.
4. A/B Test Metriken (POST /analytics/metrics) für Formular Variationen.
5. Webhook Endpoint für Statusänderungen (Lead qualifiziert / zurückgerufen).

## Beispiel Verwendung im Code
```ts
import { faproClient } from '@/lib/fapro/client';
await faproClient.createLead({ name, email, message, plz });
```

Stand: 2025-09-13
