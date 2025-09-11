import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function FinancingTeaser(){
	return (
		<Card className="bg-neutral-50 border-neutral-200">
			<CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
				<div>
					<h3 className="text-xl font-semibold text-neutral-900 mb-2">Flexible Finanzierung</h3>
					<p className="text-neutral-600 text-sm max-w-md">0% Anzahlung möglich • Fördermittel Beratung • Laufzeiten bis 20 Jahre – sichern Sie sich niedrige Monatsraten.</p>
				</div>
				<Button className="bg-blue-600 hover:bg-blue-700 text-white">Finanzierungsoptionen prüfen</Button>
			</CardContent>
		</Card>
	);
}
