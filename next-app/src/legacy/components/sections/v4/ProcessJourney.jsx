import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
	{ title:'Analyse', desc:'Dach & Verbrauchsanalyse mit Satellitendaten.' },
	{ title:'Konzept', desc:'Individuelles Systemdesign & Wirtschaftlichkeitsberechnung.' },
	{ title:'Installation', desc:'Zertifiziertes Fachteam montiert & nimmt in Betrieb.' },
	{ title:'Monitoring', desc:'Transparente Performance & Proaktiver Service.' }
];

export default function ProcessJourney(){
	return (
		<div className="grid md:grid-cols-4 gap-6">
			{steps.map(s=> (
				<Card key={s.title} className="border-neutral-200">
					<CardContent className="p-5">
						<h3 className="font-semibold text-neutral-900 mb-1">{s.title}</h3>
						<p className="text-neutral-600 text-sm leading-relaxed">{s.desc}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
