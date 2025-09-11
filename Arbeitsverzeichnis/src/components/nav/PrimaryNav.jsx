import React, { useEffect, useState, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// MegaMenu lazy nach Idle geladen (reduziert initial JS)
const MegaMenu = React.lazy(()=> import('./MegaMenu'));

export function PrimaryNav(){
	const location = useLocation();
	// Minimal Navigation Placeholder – echte Items können rehydrated werden.
	const items = [
		{ to: 'HomeV4', label: 'Home' },
		{ to: 'Projects', label: 'Projekte' },
		{ to: 'Pricing', label: 'Preise' },
		{ to: 'Technology', label: 'Technologie' },
		{ to: 'Contact', label: 'Kontakt' }
	];

	// Lokale Navigation für deutsche Städte und Regionen
	const localItems = [
		{ to: '/solaranlagen-berlin.html', label: 'Berlin', external: true },
		{ to: '/solaranlagen-hamburg.html', label: 'Hamburg', external: true },
		{ to: '/solaranlagen-münchen.html', label: 'München', external: true },
		{ to: '/solaranlagen-köln.html', label: 'Köln', external: true },
		{ to: '/solaranlagen-frankfurt-am-main.html', label: 'Frankfurt', external: true },
		{ to: '/solaranlagen-stuttgart.html', label: 'Stuttgart', external: true },
		{ to: '/solaranlagen-düsseldorf.html', label: 'Düsseldorf', external: true },
		{ to: '/solaranlagen-dortmund.html', label: 'Dortmund', external: true },
		{ to: '/solaranlagen-essen.html', label: 'Essen', external: true },
		{ to: '/solaranlagen-leipzig.html', label: 'Leipzig', external: true },
		{ to: '/solaranlagen-bremen.html', label: 'Bremen', external: true },
		{ to: '/solaranlagen-dresden.html', label: 'Dresden', external: true },
		{ to: '/solaranlagen-hannover.html', label: 'Hannover', external: true },
		{ to: '/solaranlagen-nürnberg.html', label: 'Nürnberg', external: true },
		{ to: '/solaranlagen-duisburg.html', label: 'Duisburg', external: true }
	];

	const [enhanced, setEnhanced] = useState(false);
	useEffect(()=>{
		let cancelled = false;
		const enable = ()=> !cancelled && setEnhanced(true);
		if ('requestIdleCallback' in window) {
			requestIdleCallback(enable, { timeout: 2500 });
		} else {
			setTimeout(enable, 1500);
		}
		return ()=> { cancelled = true; };
	},[]);
	return (
		<nav aria-label="Primäre Navigation" className="flex gap-6 text-sm">
			{items.map(it=> {
				const href = createPageUrl(it.to);
				const active = location.pathname === href.replace(/\?.*/, '');
				return (
					<Link key={it.to} to={href} aria-current={active ? 'page' : undefined} className={`transition-colors ${active ? 'text-blue-700 font-semibold underline underline-offset-4' : 'hover:text-blue-600 text-neutral-700'}`}>{it.label}</Link>
				);
			})}

			{/* Lokale Navigation Dropdown */}
			<div className="relative group">
				<button className="flex items-center gap-1 transition-colors hover:text-blue-600 text-neutral-700">
					<span>Standorte</span>
					<svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				</button>
				<div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
					<div className="p-4">
						<h3 className="font-semibold text-gray-900 mb-3">Solaranlagen in Ihrer Region</h3>
						<div className="grid grid-cols-2 gap-2">
							{localItems.map(item => (
								<a
									key={item.to}
									href={item.to}
									className="text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
									target={item.external ? "_blank" : undefined}
									rel={item.external ? "noopener noreferrer" : undefined}
								>
									{item.label}
								</a>
							))}
						</div>
						<div className="mt-3 pt-3 border-t border-gray-200">
							<a href="/solaranlagen-deutschland.html" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
								Alle Standorte anzeigen →
							</a>
						</div>
					</div>
				</div>
			</div>

			{enhanced && (
				<Suspense fallback={null}>
					{/* Placeholder: MegaMenu könnte hier echtes Dropdown ersetzen – aktuell minimal belassen */}
				</Suspense>
			)}
		</nav>
	);
}

export default PrimaryNav;
