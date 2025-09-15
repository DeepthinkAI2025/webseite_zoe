import React from 'react';

export function TestimonialCard({ name, quote, rating=5, role, className='' }){
	return (
		<figure className={`rounded-xl border border-neutral-200 bg-white p-6 shadow-soft-sm ${className}`}>
			<div className="flex items-center gap-3 mb-3">
				<div className="h-10 w-10 rounded-full bg-neutral-200" aria-hidden="true" />
				<figcaption className="flex flex-col">
					<span className="font-semibold text-neutral-900">{name||'Kunde/in'}</span>
					{role && <span className="text-xs text-neutral-600">{role}</span>}
				</figcaption>
			</div>
			<blockquote className="text-sm text-neutral-700 leading-relaxed">“{quote||'Exzellenter Service und hohe Energieersparnis – sehr zufrieden!'}”</blockquote>
			<div className="mt-3 flex gap-1" aria-label={`Bewertung ${rating} von 5 Sternen`}>
				{Array.from({length:5}).map((_,i)=> <span key={i} className={`inline-block w-3 h-3 rounded-full ${i<rating?'bg-yellow-400':'bg-neutral-300'}`} />)}
			</div>
		</figure>
	);
}

export default TestimonialCard;
