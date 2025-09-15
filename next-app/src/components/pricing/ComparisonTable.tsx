import React from 'react';

export interface BundleForComparison {
  id: string;
  title: string;
  price: string;
  minPrice?: string;
  maxPrice?: string;
  capacityKwp?: number;
  paybackYears?: number;
  warrantyYears?: number;
  efficiencyClass?: string;
  category?: string;
  description?: string;
}

interface ComparisonTableProps {
  bundles: BundleForComparison[];
  className?: string;
}

// Hilfsfunktion Preis Range Darstellung
function formatPriceRange(b: BundleForComparison){
  if(b.minPrice && b.maxPrice && b.minPrice !== b.maxPrice) return `${b.minPrice} – ${b.maxPrice}`;
  return b.price || b.minPrice || b.maxPrice || '–';
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ bundles, className }) => {
  const featureRows: { key: string; label: string; render: (b: BundleForComparison) => React.ReactNode }[] = [
    { key: 'price', label: 'Preis / Range', render: formatPriceRange },
    { key: 'capacityKwp', label: 'Leistung (kWp)', render: b => b.capacityKwp ? `${b.capacityKwp}` : '–' },
    { key: 'paybackYears', label: 'Ø Amortisation (J)', render: b => b.paybackYears ? b.paybackYears : '–' },
    { key: 'efficiencyClass', label: 'Effizienzklasse', render: b => b.efficiencyClass || '–' },
    { key: 'warrantyYears', label: 'Garantie (Jahre)', render: b => b.warrantyYears ? b.warrantyYears : '–' },
    { key: 'category', label: 'Kategorie', render: b => b.category || '–' }
  ];

  return (
    <div className={className} data-pricing-comparison>
      <div className="overflow-x-auto rounded-lg border border-neutral-200">
        <table className="min-w-full text-sm text-left align-top">
          <caption className="text-left p-4 font-semibold text-neutral-800">Vergleich der Solarpakete – Kernparameter für Entscheidung & Wirtschaftlichkeit</caption>
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th scope="col" className="px-4 py-3 text-neutral-700 font-medium w-48">Merkmal</th>
              {bundles.map(b => (
                <th scope="col" key={b.id} className="px-4 py-3 text-neutral-800 font-semibold">{b.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featureRows.map(row => (
              <tr key={row.key} className="even:bg-neutral-50/40">
                <th scope="row" className="px-4 py-3 font-medium text-neutral-700">{row.label}</th>
                {bundles.map(b => (
                  <td key={b.id} className="px-4 py-3 text-neutral-800 whitespace-nowrap">{row.render(b)}</td>
                ))}
              </tr>
            ))}
            <tr className="bg-emerald-50/60">
              <th scope="row" className="px-4 py-3 font-medium text-neutral-700">Kurzbeschreibung</th>
              {bundles.map(b => (
                <td key={b.id} className="px-4 py-3 text-neutral-700 leading-snug max-w-xs">{b.description || '–'}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-neutral-500">Hinweis: Preise verstehen sich als indikative Festpreise für Standarddächer (inkl. Montage). Exakte Angebote nach technischer Prüfung.</p>
    </div>
  );
};

export default ComparisonTable;
