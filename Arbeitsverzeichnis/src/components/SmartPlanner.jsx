import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, Car, Sun, ArrowRight, Battery, Home } from 'lucide-react';

// Klickbasierter 3‑Schritte‑Planer (kein Tippen bis zum Abschluss)
export default function SmartPlanner({ onResult, persona = 'privat' }) {
  const [step, setStep] = useState(1);
  const [roof, setRoof] = useState('sued');
  const [consumption, setConsumption] = useState(4000); // kWh/Jahr (aus Wahlfeldern)
  const [monthlyBill, setMonthlyBill] = useState(null); // Monatliche Stromkosten (€) für Privat
  const [ev, setEv] = useState(false);
  const [battery, setBattery] = useState(true);
  const [autoAdvanced, setAutoAdvanced] = useState(false);
  // Gewerbe-spezifisch
  const [projectType, setProjectType] = useState('dach'); // 'dach' | 'freiflaeche'
  const [ppa, setPpa] = useState(false); // Einspeisung/PPA berücksichtigen
  const [sizeBucket, setSizeBucket] = useState(null); // kWp‑Größenordnung (Gewerbe)

  // simples Tracking (optional dataLayer)
  const track = (event, payload = {}) => {
    try {
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({ event, ...payload });
      } else {
        // eslint-disable-next-line no-console
        console.debug('[planner]', event, payload);
      }
    } catch {}
  };

  const roofOptions = [
    { id: 'sued', label: 'Süd' },
    { id: 'west', label: 'West/Ost' },
    { id: 'flach', label: 'Flachdach' },
    { id: 'unklar', label: 'Weiß ich nicht' },
  ];

  const monthlyBillOptions = [
    { id: 150, label: '100–200 €' },
    { id: 250, label: '200–300 €' },
    { id: 400, label: '300–500 €' },
    { id: 600, label: '500–700 €' },
    { id: 250, label: 'Weiß ich nicht' },
  ];
  const sizeBuckets = [
    { id: 20, label: 'bis 30 kWp' },
    { id: 60, label: '30–100 kWp' },
    { id: 250, label: '100–500 kWp' },
    { id: 600, label: '>500 kWp' },
    { id: 50, label: 'Weiß ich nicht' },
  ];

  const result = useMemo(() => {
    // grobe, konservative Abschätzung
    if (persona === 'privat') {
      // Schätze kWh aus monatlichen Kosten (angenommen 0.30 €/kWh)
      const estimatedConsumption = monthlyBill ? monthlyBill * 12 / 0.30 : 4000;
      const baseKwpFactor = 1.0;
      const kWp = Math.max(4, Math.round((estimatedConsumption / 1000) * baseKwpFactor) + (ev ? 2 : 0));
      const storage = battery ? Math.max(5, Math.round(kWp * 1.2)) : 0;
      const capex = kWp * 1250 + (storage ? storage * 650 : 0);
      const saving = Math.round(estimatedConsumption * 0.32 + (ev ? 450 : 0));
      const payback = Math.max(5, Math.min(14, Math.round(capex / Math.max(1, saving))));
      const monthly = Math.round(Math.max(49, (capex - saving) / 120));
      return { kWp, storage, capex, saving, payback, monthly };
    } else {
      // Gewerbe: einfache und serienstarke Schätzung über Größeneimer (kWp)
      let kWp = sizeBucket || 50; // Default konservativ, wenn 'Weiß ich nicht'
      const storage = battery ? Math.max(10, Math.round(kWp * 0.6)) : 0;
      const capex = kWp * 1100 + (storage ? storage * 550 : 0);
      // Näherung: 80% Eigennutzung, 1000 kWh/kWp, 0,18 €/kWh
      let saving = Math.round(kWp * 1000 * 0.18 * 0.8);
      if (ppa) saving = Math.round(saving * 1.15); // einfacher Zuschlag für Erlöse aus Einspeisung/PPA
      const payback = Math.max(5, Math.min(14, Math.round(capex / Math.max(1, saving))));
      const monthly = Math.round(Math.max(99, (capex - saving) / 120));
      return { kWp, storage, capex, saving, payback, monthly };
    }
  }, [persona, monthlyBill, ev, battery, sizeBucket, ppa]);

  const StepIndicator = () => (
  <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
      <span aria-label="Schritt 1" className={`h-1.5 w-8 rounded ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></span>
      <span aria-label="Schritt 2" className={`h-1.5 w-8 rounded ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></span>
      <span aria-label="Schritt 3" className={`h-1.5 w-8 rounded ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></span>
    </div>
  );

  const OptionButton = ({ active, onClick, children, icon: Icon, rightTag }) => (
    <button type="button" onClick={onClick} className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${active ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white/90 border-gray-200 hover:border-gray-300 text-gray-700'}`}>
      {Icon ? <Icon className="w-4 h-4"/> : null}
      {children}
      {rightTag ? <span className="absolute -top-2 -right-2 text-[10px] bg-amber-100 text-amber-800 border border-amber-200 rounded-full px-2 py-0.5">{rightTag}</span> : null}
    </button>
  );

  return (
    <div className="pro-card p-6 shadow-elevate">
      <div className="flex items-center gap-2 text-gray-900 font-semibold mb-2">
        <Calculator className="w-5 h-5 text-blue-600"/>
        {persona==='privat' ? 'Ihre persönliche Ersparnis-Berechnung' : 'Ihre Projekt-ROI in 30 Sekunden'}
      </div>
      <p className="text-sm text-gray-600 mb-4">{persona==='privat' ? 'Sagen Sie uns Ihre Stromkosten – wir zeigen Ihnen, wie viel Sie sparen können.' : 'Nur 2 Klicks zu Ihrer wirtschaftlichen Einschätzung – unverbindlich & präzise.'}</p>
      <StepIndicator />

      {step === 1 && (
        <div className="mt-4 space-y-4">
          {persona==='privat' ? (
            <>
              <div>
                <div className="mb-1 text-sm font-medium text-gray-700">Dach</div>
                <div className="grid grid-cols-2 gap-2">
                  {roofOptions.map(o => (
                    <OptionButton key={o.id} active={roof === o.id} onClick={() => { setRoof(o.id); track('planner_roof', { roof: o.id }); if (step === 1 && !autoAdvanced) { setStep(2); setAutoAdvanced(true); } }} icon={Sun}>{o.label}</OptionButton>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1 text-sm font-medium text-gray-700">Monatliche Stromkosten</div>
                <div className="grid grid-cols-2 gap-2">
                  {monthlyBillOptions.map(o => (
                    <OptionButton key={o.id} active={monthlyBill === o.id} onClick={() => { setMonthlyBill(o.id); track('planner_bill', { bill: o.id }); if (step === 1 && !autoAdvanced) { setStep(2); setAutoAdvanced(true); } }} icon={Home}>{o.label}</OptionButton>
                  ))}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-gray-500">Schätzen Sie grob – wir berechnen Ihre genaue Ersparnis.</div>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="mb-1 text-sm font-medium text-gray-700">Projektart</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'dach', label: 'Gewerbe‑Dach' },
                    { id: 'freiflaeche', label: 'Freifläche' },
                    { id: 'mieterstrom', label: 'Mieterstrom/MFH' },
                  ].map(o => (
                    <OptionButton key={o.id} active={projectType === o.id} onClick={() => { setProjectType(o.id); track('planner_project_type', { projectType: o.id }); if (step === 1 && !autoAdvanced) { setStep(2); setAutoAdvanced(true); } }}>
                      {o.label}
                    </OptionButton>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1 text-sm font-medium text-gray-700">Größenordnung</div>
                <div className="grid grid-cols-2 gap-2">
                  {sizeBuckets.map(o => (
                    <OptionButton key={o.id} active={sizeBucket === o.id} onClick={() => { setSizeBucket(o.id); track('planner_size', { kWp: o.id }); if (step === 1 && !autoAdvanced) { setStep(2); setAutoAdvanced(true); } }}>
                      {o.label}
                    </OptionButton>
                  ))}
                </div>
              </div>
              <div className="mt-1 text-xs sm:text-sm text-gray-500">Keine Sorge: Statik, Netz & Fläche prüfen wir für Sie.</div>
            </>
          )}
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={() => { setStep(2); track('planner_next', { step: 1 }); }} className="bg-blue-600 hover:bg-blue-700">Jetzt einschätzen</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-4 space-y-4">
          <div>
            <div className="mb-1 text-sm font-medium text-gray-700">Optionen</div>
            {persona==='privat' ? (
              <div className="grid grid-cols-2 gap-2">
                <OptionButton active={ev} onClick={() => { setEv(v => { const nv = !v; track('planner_ev', { ev: nv }); return nv; }); }} icon={Car}>
                  Elektroauto laden (zusätzliche Ersparnis)
                </OptionButton>
                <OptionButton active={battery} onClick={() => { setBattery(v => { const nv = !v; track('planner_battery', { battery: nv }); return nv; }); }} icon={Battery} rightTag="Empfohlen">
                  Batteriespeicher für mehr Unabhängigkeit
                </OptionButton>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <OptionButton active={ppa} onClick={() => { setPpa(v => { const nv = !v; track('planner_ppa', { ppa: nv }); return nv; }); }}>
                    Überschuss ins Netz einspeisen (höhere Rendite)
                  </OptionButton>
                  <OptionButton active={battery} onClick={() => { setBattery(v => { const nv = !v; track('planner_battery', { battery: nv }); return nv; }); }} icon={Battery}>
                    Batteriespeicher für Lastspitzen
                  </OptionButton>
                </div>
                <div className="mt-1 text-xs sm:text-sm text-gray-500">Statik & Netz prüfen wir – Sie müssen nichts vorbereiten.</div>
              </>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 p-4 bg-white/70 backdrop-blur">
              <div className="text-xs sm:text-sm text-gray-500">Empfohlene PV‑Leistung</div>
              <div className="text-2xl font-bold text-gray-900">{result.kWp} kWp</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 bg-white/70 backdrop-blur">
              <div className="text-xs sm:text-sm text-gray-500">Speichergröße</div>
              <div className="text-2xl font-bold text-gray-900">{result.storage ? `${result.storage} kWh` : 'ohne'}</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 bg-white/70 backdrop-blur">
              <div className="text-xs sm:text-sm text-gray-500">Invest (Schätzung)</div>
              <div className="text-2xl font-bold text-gray-900">{result.capex.toLocaleString('de-DE')} €</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 bg-white/70 backdrop-blur">
              <div className="text-xs sm:text-sm text-gray-500">Ersparnis/Jahr</div>
              <div className="text-2xl font-bold text-blue-700">{result.saving.toLocaleString('de-DE')} €</div>
            </div>
            <div className="col-span-2 text-sm text-gray-600">Amortisation ca. <span className="font-semibold text-gray-900">{result.payback} Jahre</span> · ab ca. <span className="font-semibold">{result.monthly.toLocaleString('de-DE')} € / Monat</span></div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <Button variant="outline" onClick={() => setStep(1)}>Zurück</Button>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs sm:text-sm text-gray-500">Keine Verpflichtung</span>
              <Button onClick={() => { setStep(3); track('planner_next', { step: 2 }); }} className="bg-blue-600 hover:bg-blue-700">Ergebnis anzeigen</Button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-gray-200 p-4 bg-white/70 backdrop-blur">
            <div className="font-semibold text-gray-900 mb-1">Ihre Empfehlung</div>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 space-y-1">
        {persona==='privat' ? (
                <>
                  <li>{result.kWp} kWp PV‑Anlage ({roof})</li>
                  <li>{result.storage ? `${result.storage} kWh Speicher` : 'ohne Speicher'}</li>
                  <li>E‑Auto: {ev ? 'berücksichtigt' : 'nicht berücksichtigt'}</li>
                </>
        ) : (
                <>
          <li>{result.kWp} kWp PV‑Anlage ({projectType === 'dach' ? 'Dach' : (projectType==='freiflaeche' ? 'Freifläche' : 'Mieterstrom/MFH')})</li>
                  <li>{result.storage ? `${result.storage} kWh Batterie (optional)` : 'ohne Batterie'}</li>
                  <li>PPA/Einspeisung: {ppa ? 'berücksichtigt' : 'nicht berücksichtigt'}</li>
                </>
              )}
            </ul>
          </div>
          <div className="text-sm text-gray-700">Ersparnis/Jahr ca. <span className="font-semibold text-blue-700">{result.saving.toLocaleString('de-DE')} €</span> · Amortisation ~ <span className="font-semibold">{result.payback} Jahre</span> · ab <span className="font-semibold">{result.monthly.toLocaleString('de-DE')} € / Monat</span>.</div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end items-center">
            <span className="text-xs sm:text-sm text-gray-500">Ihre Daten sind sicher – wir beraten Sie persönlich</span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>Anpassen</Button>
              <Button onClick={() => { track('planner_submit'); onResult?.(result); }} className="bg-blue-600 hover:bg-blue-700">Jetzt kostenlos beraten lassen</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
