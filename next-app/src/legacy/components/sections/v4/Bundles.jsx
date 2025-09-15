import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Bundles(){
	const bundles = [
		{ name:'Eco Start', kwp:'5 kWp', price:'€8.900', payback:'7,2 J.', highlight:false },
		{ name:'Family Plus', kwp:'9 kWp', price:'€13.400', payback:'6,1 J.', highlight:true },
		{ name:'Independence Pro', kwp:'15 kWp', price:'€21.900', payback:'5,4 J.', highlight:false }
	];
	return (
		<div className="grid md:grid-cols-3 gap-8">
			{bundles.map(b=> (
				<Card key={b.name} className={b.highlight? 'border-blue-400 shadow-soft-md relative' : ''}>
					{b.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-soft-sm">Beliebt</div>}
					<CardContent className="p-6 flex flex-col gap-4">
						<h3 className="text-lg font-semibold text-neutral-900">{b.name}</h3>
						<div className="text-sm text-neutral-600">{b.kwp} • Amortisation {b.payback}</div>
						<div className="text-2xl font-bold text-neutral-900 tabular-nums">{b.price}</div>
						<Button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">Angebot sichern</Button>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
