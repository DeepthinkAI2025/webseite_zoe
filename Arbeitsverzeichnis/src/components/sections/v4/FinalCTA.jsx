import React from 'react';
import { Button } from '@/components/ui/button';

export default function FinalCTA(){
	return (
		<div className="rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 p-10 text-center text-white shadow-soft-md">
			<h2 className="text-3xl font-bold mb-4">Jetzt unabhängiger werden</h2>
			<p className="text-white/90 mb-6 max-w-2xl mx-auto">Fordern Sie Ihr persönliches Solar-Dachkonzept an und sichern Sie sich Fördermittel & Finanzierungsvorteile bevor Kontingente erschöpft sind.</p>
			<div className="flex flex-col sm:flex-row gap-4 justify-center">
				<Button className="bg-white text-blue-700 hover:bg-neutral-100">Beratung anfragen</Button>
				<Button variant="outline" className="border-white text-white hover:bg-white/20 hover:text-neutral-900 bg-transparent transition-colors">Rechner starten</Button>
			</div>
		</div>
	);
}
