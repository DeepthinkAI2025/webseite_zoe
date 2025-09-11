import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export function SiteFooter(){
	const year = new Date().getFullYear();
	return (
		<footer className="mt-24 border-t border-neutral-200 py-12 text-sm text-neutral-600">
			<div className="pro-container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
				<div className="font-semibold text-neutral-700">ZOE Energy © {year}</div>
				<nav aria-label="Footer Navigation" className="flex flex-wrap gap-4">
					<Link to={createPageUrl('Imprint')} className="hover:text-blue-600">Impressum</Link>
					<Link to={createPageUrl('Privacy')} className="hover:text-blue-600">Datenschutz</Link>
					<Link to={createPageUrl('Projects')} className="hover:text-blue-600">Projekte</Link>
					<Link to={createPageUrl('Contact')} className="hover:text-blue-600">Kontakt</Link>
				</nav>
			</div>
		</footer>
	);
}

export default SiteFooter;
