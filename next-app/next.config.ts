import type { NextConfig } from "next";

// Hinweis: Das frühere experimentelle Feld `turbopack.root` steht in dieser Version nicht (mehr) im Typ zur Verfügung.
// Workaround-Empfehlung: Monorepo Root vereinheitlichen oder redundante Lockfiles entfernen.
// Alternative wäre eine `package.json` im Repo-Root mit "workspaces" Definition.
const nextConfig: NextConfig = {
	trailingSlash: false,
	// Hinweis: Temporär i18n Block entfernt um App Router Warning zu eliminieren.
	// Für zukünftige Lokalisierung besser Segment basiertes Routing (/en/...) weiter ausbauen.
	eslint: {
		ignoreDuringBuilds: true
	},
	// Entfernt problematischen redirect-Handler (Verdacht: verursacht routesManifest Fehler in aktueller Version)
	// outputFileTracingRoot gesetzt um Monorepo Root Warning zu entschärfen
	outputFileTracingRoot: process.cwd(),
		headers: async () => {
		return [
			{
				source: '/:path*',
				headers: [
					{ key: 'X-Robots-Tag', value: 'all' },
					// Basis Security Headers (Phase 2 optional aktivieren)
					{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
					{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
					{ key: 'X-Content-Type-Options', value: 'nosniff' },
					{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()' },
					{ key: 'X-XSS-Protection', value: '0' },
					// CSP nun enforced via Middleware (siehe middleware.ts) – Report-Only entfernt
					{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
					{ key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
					{ key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
					{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }
				]
			}
		];
	}
};

export default nextConfig;
