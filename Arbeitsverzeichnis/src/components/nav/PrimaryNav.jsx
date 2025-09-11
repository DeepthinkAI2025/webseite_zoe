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
			{enhanced && (
				<Suspense fallback={null}>
					{/* Placeholder: MegaMenu könnte hier echtes Dropdown ersetzen – aktuell minimal belassen */}
				</Suspense>
			)}
		</nav>
	);
}

export default PrimaryNav;
