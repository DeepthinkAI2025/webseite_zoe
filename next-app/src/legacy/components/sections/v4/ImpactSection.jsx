import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const impacts = [
	{ label:'CO₂ Einsparung / Jahr', value:'1.2t', color:'text-green-600' },
	{ label:'Ø Autarkie Grad', value:'87%', color:'text-blue-600' },
	{ label:'Ø Amortisation', value:'6.3 J.', color:'text-emerald-600' },
];

export default function ImpactSection(){
	return (
		<div className="grid md:grid-cols-3 gap-6">
			{impacts.map(i=> (
				<Card key={i.label} className="border-neutral-200">
					<CardContent className="p-5 text-center">
						<div className={`text-3xl font-bold mb-2 ${i.color}`}>{i.value}</div>
						<p className="text-neutral-600 text-sm leading-snug">{i.label}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
